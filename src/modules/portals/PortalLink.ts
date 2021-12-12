import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { ComponentFactory } from "@root/modules/core/ecs/ComponentFactory";
import { WorldEntity } from "@root/modules/core/ecs/WorldEntity";
import Component from "@root/modules/core/ecs/Component";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";
import { ThreeLib } from "@root/modules/three/ThreeLib";
import * as THREE from "three";
import { FrameLoop } from "@root/modules/FrameLoop";
import { PortalsService } from "@root/modules/portals/PortalsService";
import { CodeLoaderComponent } from "@root/modules/core/loader/CodeLoaderComponent";

//https://barthaweb.com/2020/09/webgl-portal/
//https://github.com/stemkoski/AR-Examples/blob/master/portal-view.html
//https://stemkoski.github.io/AR-Examples/portal-view.html
//https://discourse.threejs.org/t/multiple-scenes-vs-layers/12503/10


export class Factory implements WebpackLazyModule, ComponentFactory<PortalLink> {
    async create(world: WorldEntity, config: {url:string}): Promise<PortalLink> {
        let services = world.getFirstComponentByType<ServiceEntity>(ServiceEntity.name);
        let codeLoader = await services.getService<CodeLoaderComponent>("@root/modules/core/loader/CodeLoaderService");
        let three = await services.getService<ThreeLib>("@root/modules/three/ThreeLib");
        let frameLoop = await services.getService<FrameLoop>("@root/modules/FrameLoop");
        let service = await services.getService<PortalsService>("@root/modules/portals/PortalsService");
        let portalLink = new PortalLink(service,three,frameLoop,{
            position:new THREE.Vector3(1,2,3)
        },{
            position:new THREE.Vector3(1,2,3)
        });
        codeLoader.awaitInitialLoading().then(async value => {
            let world = await service.loadNewUrl(config.url);
            portalLink.setTargetWorld(world);
        });
        return portalLink;
    }
}

export class PortalLink implements Component{
    private otherCamera: THREE.PerspectiveCamera;
    private portalA: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
    private portalB: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;
    private targetWorld: WorldEntity | null = null;
    private targetThreeLib: ThreeLib | null = null;

    async setTargetWorld(world: WorldEntity) {
        this.targetWorld = world;
        let targetWorldService = await this.targetWorld.getFirstComponentByType<ServiceEntity>(ServiceEntity.name);
        this.targetThreeLib = await targetWorldService.getService<ThreeLib>("@root/modules/three/ThreeLib");
        this.three.preRenderPass.push(() => {
            this.renderPortal();
        })
    }

    constructor(portals:PortalsService,private three: ThreeLib, private frameLoop: FrameLoop,
                a:{position:THREE.Vector3,rotation?:THREE.Euler},
                b:{position:THREE.Vector3,rotation?:THREE.Euler}
                ) {

        this.otherCamera = new THREE.PerspectiveCamera( three.camera.fov, window.innerWidth / window.innerHeight, 0.1, 1000 );
        three.scene.add(this.otherCamera);

        // Portal A (Portal View) ================================
        let defaultMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            side: THREE.DoubleSide,
            transparent: true
        });

        this.portalA = new THREE.Mesh(
            new THREE.CircleGeometry(1, 64),
            //new THREE.BoxGeometry( 1, 1, 1 ),
            defaultMaterial.clone()
        );
        this.portalA.material.opacity = 0;
        this.portalA.position.copy(a.position);
        if(a.rotation) {
            this.portalA.setRotationFromEuler(a.rotation);
        }
        three.scene.add(this.portalA);


        // Portal B (Point of View position and rotation) ================================
        // material for portals and blockers
        let defaultMaterial2 = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            transparent: true
        });

        this.portalB = new THREE.Mesh(
            new THREE.CircleGeometry(1, 64),
            defaultMaterial2.clone()
        );
        this.portalB.material.opacity = 0.5;
        this.portalB.position.copy(b.position);
        if(b.rotation) {
            this.portalB.setRotationFromEuler(b.rotation);
        }
        this.portalB.layers.set(31);//set mesh invisible
        three.scene.add(this.portalB);

    }

    renderPortal()
    {
        if(!this.targetThreeLib){
            return;
        }
        // relatively align other camera with main camera

        let relativePosition = this.portalA.worldToLocal( this.three.camera.position.clone() );
        this.otherCamera.position.copy( this.portalB.localToWorld( relativePosition ) );

        let relativeRotation = this.three.camera.quaternion.clone().multiply( this.portalA.quaternion.clone().invert() );
        this.otherCamera.quaternion.copy( relativeRotation.multiply(this.portalB.quaternion) );

        // keep camera tilt in sync
        this.otherCamera.rotation.x = this.three.camera.rotation.x;

        let gl = this.three.renderer.getContext();
        //skyMesh2.layers.set(0)
        this.portalA.layers.set(1);//Portal to render to layer 1


        // clear buffers now: color, depth, stencil
        this.three.renderer.clear(true,true,true);
        // do not clear buffers before each render pass
        this.three.renderer.autoClear = false;


        // FIRST PASS
        // goal: using the stencil buffer, place 1's in position of first portal

        // enable the stencil buffer
        gl.enable(gl.STENCIL_TEST);

        // layer 1 contains only the first portal
        this.three.camera.layers.set(1);

        gl.stencilFunc(gl.ALWAYS, 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.stencilMask(0xff);

        // only write to stencil buffer (not color or depth)
        gl.colorMask(false,false,false,false);
        gl.depthMask(false);

        this.three.renderer.render( this.three.scene, this.three.camera );
        //this.three.renderer.render( this.targetThreeLib.scene, this.targetThreeLib.camera );

        // SECOND PASS
        // goal: draw from the portal camera perspective (which is aligned relative to the second portal)
        //   in the first portal region (set by the stencil in the previous pass)

        // set up a clipping plane, so that portal camera does not see anything between
        //   the portal camera and the second portal

        // default normal of a plane is 0,0,1. apply mesh rotation to it.


        // determine which side of the plane camera is on, for clipping plane orientation.
        let portalToCamera = new THREE.Vector3().subVectors( this.three.camera.position.clone(), this.portalA.position.clone() ); //  applyQuaternion( mainMover.quaternion );
        let normalPortal = new THREE.Vector3(0,0,1).applyQuaternion( this.portalA.quaternion );
        let clipSide = -Math.sign( portalToCamera.dot(normalPortal) );

        let clipNormal = new THREE.Vector3(0, 0, clipSide).applyQuaternion( this.portalB.quaternion );
        let clipPoint = this.portalB.position;
        let clipPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(clipNormal, clipPoint);
        this.three.renderer.clippingPlanes = [clipPlane];

        gl.colorMask(true,true,true,true);
        gl.depthMask(true);

        gl.stencilFunc(gl.EQUAL, 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        this.otherCamera.layers.set(0);
        //this.three.renderer.render( this.three.scene, this.otherCamera );//TODO maybe here scene 2
        this.three.renderer.render( this.targetThreeLib.scene, this.otherCamera );

        // disable clipping planes
        this.three.renderer.clippingPlanes = [];

        // THIRD PASS
        // goal: set the depth buffer data for the first portal,
        //   so that it can be occluded by other objects

        // finished with stencil
        gl.disable(gl.STENCIL_TEST);

        gl.colorMask(false,false,false,false);
        gl.depthMask(true);
        // need to clear the depth buffer, in case of occlusion
        this.three.renderer.clear(false, true, false);
        this.three.renderer.render( this.three.scene, this.three.camera );


        //skyMesh2.layers.set(30)
        gl.colorMask(true,true,true,true);
        gl.depthMask(true);
        this.three.camera.layers.set(0); // layer 0 contains everything but portals

    }

    getType(): string {
        return PortalLink.name;
    }

}

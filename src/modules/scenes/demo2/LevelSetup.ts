import Component from '@root/modules/core/ECS/Component'
import {Ammo, createConvexHullShape} from "@root/modules/core/ammo/AmmoLib"
import { ammoPhysics } from "@root/modules/core/ammo/AmmoPhysics";
import { threeLoader } from "@root/modules/core/Three/ThreeLoader";
import { loadAssets } from "@root/modules/core/assetsLoader/AssetsLoader";

export default class LevelSetup extends Component{
    private scene: any;
    private physicsWorld: any;
    private mesh: any;
    constructor(){
        super();
    }

    async loadScene(){

        this.scene = threeLoader.scene;
        await ammoPhysics.setupPhysics();
        this.physicsWorld = ammoPhysics.physicsWorld;
        this.mesh = await loadAssets("assets/static/demo2/level.glb");
        this.mesh = this.mesh.scene;

        this.mesh.traverse( ( node ) => {
            if ( node.isMesh || node.isLight ) { node.castShadow = true; }
            if(node.isMesh){
                node.receiveShadow = true;
                //node.material.wireframe = true;
                this.setStaticCollider(node);
            }

            if(node.isLight){
                node.intensity = 3;
                const shadow = node.shadow;
                const lightCam = shadow.camera;

                shadow.mapSize.width = 1024 * 3;
                shadow.mapSize.height = 1024 * 3;
                shadow.bias = -0.00007;

                const dH = 35, dV = 35;
                lightCam.left = -dH;
                lightCam.right = dH;
                lightCam.top = dV;
                lightCam.bottom = -dV;

                //const cameraHelper = new THREE.CameraHelper(lightCam);
                //this.scene.add(cameraHelper);
            }
        });

        this.scene.add( this.mesh );
    }


    setStaticCollider(mesh){
        const shape = createConvexHullShape(mesh);
        const mass = 0;
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0,0,0);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const object = new Ammo.btRigidBody(rbInfo);
        object.mesh = mesh;

        this.physicsWorld.addRigidBody(object);
    }

}

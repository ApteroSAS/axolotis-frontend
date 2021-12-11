import * as THREE from 'three'
import Component from "@root/modules/core/ecs/Component";
import { FrameLoop } from "@root/modules/FrameLoop";
import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";

export class ThreeLib implements Component{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    constructor(frameLoop:FrameLoop) {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);


        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild( this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
        this.camera.position.z = 2;


        const render = () =>{
            this.renderer.render( this.scene,  this.camera)
        };

        const onWindowResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            render()
        };
        window.addEventListener('resize', onWindowResize, false);
        frameLoop.addCallback(render);
    }

    //TODO rename to getType
    getType(): string {
        return ThreeLib.name;
    }
}

export class ServiceFactory implements WebpackLazyModule, Service<ThreeLib>{
    constructor() {}

    async create(services:LazyServices): Promise<ThreeLib> {
        let frameLoop = await services.getService<FrameLoop>("@root/modules/core/FrameLoop");
        return new ThreeLib(frameLoop);
    }
}


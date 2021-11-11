import * as THREE from 'three'
import Component from "@root/modules/core/ecs/Component";
import { WebpackAsyncModuleFactory, loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";
import { FrameLoop } from "@root/modules/core/FrameLoop";
import { Input } from "@root/modules/controller/Input";

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
    getName(): string {
        return ThreeLib.name;
    }
}

export class ThreeLibFactory extends WebpackAsyncModuleFactory<ThreeLib>{
    async create(config): Promise<ThreeLib> {
        let frameLoop = await loadComponent<FrameLoop>("@root/modules/core/FrameLoop");
        return new ThreeLib(frameLoop);
    }
}


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { frameLoop } from "@root/modules/core/FrameLoop";

export class ThreeLoader {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild( this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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
}

export const threeLoader:ThreeLoader = new ThreeLoader();


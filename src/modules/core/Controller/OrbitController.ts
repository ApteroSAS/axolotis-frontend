import { frameLoop } from "@root/modules/core/FrameLoop";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { threeLoader } from "@root/modules/core/Three/ThreeLoader";

export class OrbitController {
    constructor() {
        const controls = new OrbitControls( threeLoader.camera,  threeLoader.renderer.domElement);
        frameLoop.addCallback(()=>{
            controls.update();
        })

    }
}

export const orbitController = new OrbitController();

import { FactoryAbstractInterface, loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";
import { ThreeLib } from "@root/modules/core/three/ThreeLib";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FrameLoop } from "@root/modules/core/FrameLoop";
import Component from "@root/modules/core/ecs/Component";

export class Factory extends FactoryAbstractInterface<OrbitController>{
    async create(config): Promise<OrbitController> {
        let frameLoop = await loadComponent<FrameLoop>("FrameLoop");
        let three = await loadComponent<ThreeLib>("ThreeLib");
        let module = new OrbitController(three,frameLoop);
        return module;
    }
}

export class OrbitController implements Component{
    constructor(three:ThreeLib,frameLoop:FrameLoop) {
        const controls = new OrbitControls( three.camera,  three.renderer.domElement);
        frameLoop.addCallback(()=>{
            controls.update();
        })

    }

    getName(): string {
        return OrbitController.name;
    }
}

import { ThreeLib } from "@root/modules/core/three/ThreeLib";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FrameLoop } from "@root/modules/core/FrameLoop";
import Component from "@root/modules/core/ecs/Component";
import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";

export class ServiceFactory implements WebpackLazyModule, Service<OrbitController>{
    async create(services:LazyServices): Promise<OrbitController> {
        let frameLoop = await services.getService<FrameLoop>("@root/modules/core/FrameLoop");
        let three = await services.getService<ThreeLib>("@root/modules/core/three/ThreeLib");
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

    getType(): string {
        return OrbitController.name;
    }
}

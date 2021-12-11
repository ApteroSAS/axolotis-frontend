import Component from "@root/modules/core/ecs/Component";

import { CodeLoaderComponent } from "@root/modules/core/loader/CodeLoaderComponent";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import { world } from "@root/modules/core/ecs/WorldEntity";
import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";

export class Factory implements WebpackLazyModule, Service<FrameLoop>{
    async create(services:LazyServices): Promise<FrameLoop> {
        let codeLoader = world.getFirstComponentByType<CodeLoaderComponent>(CodeLoaderComponent.name);
        let module = new FrameLoop();
        codeLoader.awaitInitialLoading().then(()=>{
            module.startLoop();
        })
        return module;
    }
}

export class FrameLoop implements Component {
    //TODO frame loop
    // setInterval Frameloop
    // animationFrame
    // Physic update
    // low workload adaptative loop? Like when FPS is green we execute code once evry Frame when it is not we execute once every seconde.
    // worker loop?
    // stats for all those loop (stats.js)
    // API to add task consumer?
    callbacks:((delta:number)=>void)[] = [];
    private prevTime: number = 0;
    constructor() {
    }

    startLoop(){
        const animate = (t) => {
            const delta = ( t - this.prevTime );
            this.prevTime = t;
            requestAnimationFrame(animate);
            for (const callback of this.callbacks) {
                callback(delta);
            }
        };
        requestAnimationFrame(animate);
    }

    addCallback(callback:(delta:number)=>void){
        this.callbacks.push(callback);
    }

    getType(): string {
        return FrameLoop.name;
    }
}

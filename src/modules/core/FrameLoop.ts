import Component from "@root/modules/core/ecs/Component";
import { FactoryAbstractInterface } from "@root/modules/core/assetsLoader/WebpackECSLoader";

export class Factory extends FactoryAbstractInterface<FrameLoop>{
    async create(config): Promise<FrameLoop> {
        let module = new FrameLoop();
        return module;
    }
}


export class FrameLoop implements Component{
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

    getName(): string {
        return FrameLoop.name;
    }
}

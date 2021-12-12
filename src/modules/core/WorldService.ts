import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import Component from "@root/modules/core/ecs/Component";
import { WorldEntity } from "@root/modules/core/ecs/WorldEntity";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";

export class Factory implements WebpackLazyModule, Service<WorldService>{
    constructor() {}

    async create(services:LazyServices): Promise<WorldService> {
        return new WorldService(services);
    }
}

//(await axolotis.worlds[1].components[0].service["@root/modules/core/WorldService:Factory"]).setActiveWorld(1)

declare let window:any;

let activeWorld=-1;
let worlds:WorldEntity[] = [];
let callbacks:(()=>void)[] = [];//do not use events emitter here to avoid surcharing dependencies in the code modules

export function registerNewWorld(worldEntity:WorldEntity){
    worlds.push(worldEntity);
    if(activeWorld<0){
        activeWorld = 0;
        window.axolotis.world = worlds[activeWorld];
        window.axolotis.activeWorld = activeWorld;
    }
}


if(window) {
    if(!window.axolotis){
        window.axolotis={};
    }
    window.axolotis.worlds = worlds;
    window.axolotis.activeWorld = activeWorld;
}



export class WorldService implements Component{
    private world: WorldEntity;

    constructor(services:LazyServices) {
        console.log("info");
        let worldtmp:any = null;
        for(const world of this.getWorlds()){
            let serviceEntity = world.getFirstComponentByType<ServiceEntity>(ServiceEntity.name);
            if(serviceEntity == services){
                worldtmp = world;
            }
        }
        if(!worldtmp){
            throw new Error();
        }
        this.world = worldtmp;

        if(activeWorld>=0){
            this.setActiveWorld(activeWorld);
        }
    }

    getType(): string {
        return WorldService.name;
    }

    getWorlds(){
        return worlds;
    }

    getActiveWorld(){
        return worlds[activeWorld];
    }

    isActiveWorld(){
        return this.world == this.getActiveWorld();
    }

    addOnWorldChangeCallback(callback:()=>void,init:boolean = false){
        callbacks.push(callback);
        if(init){
            callback();
        }
    }

    setActiveWorld(number){
        if(activeWorld!=number) {
            activeWorld = number;
            if (window && window.axolotis) {
                window.axolotis.activeWorld = activeWorld;
                window.axolotis.world = worlds[activeWorld];
            }
            for (const callback of callbacks){
                callback();
            }
        }
    }

}

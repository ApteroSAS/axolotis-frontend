import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import Component from "@root/modules/core/ecs/Component";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";
import { WorldEntity } from "@root/modules/core/ecs/WorldEntity";
import { CodeLoaderComponent } from "@root/modules/core/loader/CodeLoaderComponent";
import { WorldService } from "@root/modules/core/WorldService";

export class Factory implements WebpackLazyModule, Service<PortalsService>{
    constructor() {}

    async create(services:LazyServices): Promise<PortalsService> {
        let worldService = await services.getService<WorldService>("@root/modules/core/WorldService");
        let actualWorldService = await worldService.getActiveWorld().getFirstComponentByType<ServiceEntity>(ServiceEntity.name);
        let codeLoader = await actualWorldService.getService<CodeLoaderComponent>("@root/modules/core/loader/CodeLoaderService");
        return new PortalsService(worldService,codeLoader.roomUrl);
    }
}

let worlds = {};

export class PortalsService implements Component{

    constructor(private services: WorldService, roomUrl: string) {
        this.notifyInitialWorld(roomUrl,services.getActiveWorld());
    }

    getType(): string {
        return PortalsService.name;
    }

    notifyInitialWorld(url:string,world:WorldEntity){
        if(!worlds[url]){
            worlds[url] = world;
        }
    }

    async loadNewUrl(url:string):Promise<WorldEntity> {//"assets/static/demo3/room2.json"
        let codeLoaderComponent = new CodeLoaderComponent();
        url = codeLoaderComponent.cleanUpRoomUrl(url);
        if(worlds[url]){
            return worlds[url]
        }
        let world = new WorldEntity();
        worlds[url] = world;//wait url cleaning

        let serviceEntity = new ServiceEntity();
        world.addComponent(serviceEntity);
        serviceEntity.setService("@root/modules/core/loader/CodeLoaderService", codeLoaderComponent);
        let json = await codeLoaderComponent.loadRoomDefinitionFile(url);
        return await new Promise((resolve, reject) => {
            codeLoaderComponent.startLoading(world, json.room, (progress, total) => {
                console.log("["+url+"] : [" + progress + "/" + total + "]");
            }).then(() => {
                console.log("["+url+"] : ok");
                resolve(world);
            }).catch(reject);
        });
    }

}

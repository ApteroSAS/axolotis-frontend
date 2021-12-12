import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import Component from "@root/modules/core/ecs/Component";

export class Factory implements WebpackLazyModule, Service<PortalsService>{
    constructor() {}

    async create(services:LazyServices): Promise<PortalsService> {
        return new PortalsService();
    }
}

export class PortalsService implements Component{
    getType(): string {
        return PortalsService.name;
    }

}

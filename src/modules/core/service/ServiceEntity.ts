import Component from "@root/modules/core/ecs/Component";
import { LazyServices } from "@root/modules/core/service/LazyServices";

export class ServiceEntity extends LazyServices implements Component{
    getType(): string {
        return ServiceEntity.name;
    }

}
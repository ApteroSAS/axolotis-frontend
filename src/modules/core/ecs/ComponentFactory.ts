import Component from "@root/modules/core/ecs/Component";
import { WorldEntity } from "@root/modules/core/ecs/WorldEntity";

export interface ComponentFactory<T extends Component>{
    create(world:WorldEntity, params:any);
}
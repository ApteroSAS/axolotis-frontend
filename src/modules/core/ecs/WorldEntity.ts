import Entity from "@root/modules/core/ecs/Entity";
import { registerNewWorld } from "@root/modules/core/WorldService";


export class WorldEntity extends Entity{
    constructor() {
        super("world");
        registerNewWorld(this);
    }
}


import Entity from "@root/modules/core/ecs/Entity";

export class WorldEntity extends Entity{
    constructor() {
        super("world");
    }
}

export const world = new WorldEntity();//global presence
if(window){
    // @ts-ignore
    window.world = world;
}

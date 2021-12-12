import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import Component from "@root/modules/core/ecs/Component";
import * as EventEmitter from "eventemitter3";
import * as THREE from "three";

export class Factory implements WebpackLazyModule, Service<PlayerService>{
    async create(services:LazyServices): Promise<PlayerService> {
        return new PlayerService();
    }
}

export const EVT_NAVMESH = "navmesh";
export const EVT_TELEPORT = "teleport";
export const EVT_FLY = "flymode";

export class PlayerService implements Component {
    events = new EventEmitter();

    getEvents(){
        return this.events;
    }

    getType(): string {
        return PlayerService.name;
    }

    teleportToLocation(x:number,y:number,z:number){
        this.events.emit(EVT_TELEPORT,new THREE.Vector3(x,y,z));
    }

    declareNavMesh(navMesh: THREE.Mesh){
        this.events.emit(EVT_NAVMESH,navMesh);
    }

    askFlyMode(){
        this.events.emit(EVT_FLY,true);
    }
}

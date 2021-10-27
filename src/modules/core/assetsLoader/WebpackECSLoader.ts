import { world } from "@root/modules/core/ecs/WorldEntity";
import Component from "@root/modules/core/ecs/Component";
import Entity from "@root/modules/core/ecs/Entity";
import { loadModuleAsync } from "@root/modules/core/assetsLoader/WebpackLoader";

export interface FactoryInterface <T extends Component>{
    webpackEcsIdField(): number;
    create(config:any):Promise<T>;
}

export abstract class FactoryAbstractInterface<T extends Component> implements FactoryInterface<T>{
    webpackEcsIdField(): number{
        return 42;
    }
    constructor(public world:Entity){

    }
    abstract create(config): Promise<T>;
}

let moduleLoadInProgress = {};

export async function createComponent<T>(name,option):Promise<T>{
    const module = await loadModuleAsync(name);
    for(const key in module){
        const sub = module[key];
        if(sub.prototype && sub.prototype.webpackEcsIdField){//identifiying factory
            const compPromise = new sub(world).create(option);
            return compPromise;
        }
    }
    throw new Error("invalid factory");
}


export async function loadComponent<T extends Component>(name,option:any={}):Promise<T>{
    if(moduleLoadInProgress[name]){
        return moduleLoadInProgress[name];
    }
    if(!world.getFirstComponentByName<T>(name)){
        let modulePromise = createComponent<T>(name,option);
        moduleLoadInProgress[name] = modulePromise;
        await world.addComponent<T>(await modulePromise);
        delete moduleLoadInProgress[name];
    }
    return Promise.resolve(world.getFirstComponentByName<T>(name));
}

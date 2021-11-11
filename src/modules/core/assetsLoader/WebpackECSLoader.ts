import { world } from "@root/modules/core/ecs/WorldEntity";
import Component from "@root/modules/core/ecs/Component";
import Entity from "@root/modules/core/ecs/Entity";
import { loadModuleAsync } from "@root/generated/webpack/module/WebpackLoader";

export interface WebpackModuleFactoryInterface <T extends Component>{
    webpackEcsIdField(): number;
    create(config:any):Promise<T>;
}

export abstract class WebpackAsyncModuleFactory<T extends Component> implements WebpackModuleFactoryInterface<T>{
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
        const module = await moduleLoadInProgress[name];
        if(!module){
            throw new Error("error");
        }
        return module;
    }
    if(!world.getFirstComponentByName<T>(name)){
        let modulePromise = createComponent<T>(name,option);
        moduleLoadInProgress[name] = modulePromise;
        const module = await modulePromise;
        world.addComponent<T>(module);
        delete moduleLoadInProgress[name];
    }
    const module = world.getFirstComponentByName<T>(name)
    if(!module){
        throw new Error("error");
        //TODO separate the concept of of webpack module and world component (see WebpackLoader)
        //Add the concept of service that can layzy load - usin evrywhere with the same name and no parameters
        // eg three and ammo are singleton service
        // using tuple package + class name like webpack module
        // idea add a system entity in the world that list all the services and maintains unicity?
        // using or not the world API - World entity have a type but the name is set in the class - a little dirty since i do not want to hardcode the package in the class as a name.
        //lazy load entity would be cool tho
    }
    return module;
}

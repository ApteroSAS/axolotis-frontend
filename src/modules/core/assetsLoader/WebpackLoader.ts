import { loadModuleAsync } from "@root/generated/webpack/module/WebpackLoader";

export interface WebpackModuleFactoryInterface{
    webpackEcsIdField(): number;
}

export abstract class WebpackAsyncModuleFactory implements WebpackModuleFactoryInterface{
    webpackEcsIdField(): number{
        return 42;
    }
    constructor(){}
}

export async function instanciateWebpackAsyncModule<T>(importPath:string,classname:string):Promise<T>{
    const module = await loadModuleAsync(importPath);
    for(const key in module){
        const sub = module[key];
        if(sub.prototype && sub.prototype.webpackEcsIdField && sub.prototype.constructor.name===classname){//identifiying factory
            return new sub();
        }
    }
    throw new Error("invalid factory");
}

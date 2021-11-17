import { instanciateWebpackAsyncModule } from "@root/modules/core/loader/WebpackLoader";
import { ServiceFactory } from "@root/modules/core/FrameLoop";

export interface Service<T>{
    create(services:LazyServices):Promise<T>;
}

export class LazyServices {
    service = {}

    toId(path,classname){
        return path+":"+classname;
    }

    async getService<T>(path:string, classname:string = "ServiceFactory"):Promise<T>{
        if(this.service[this.toId(path, classname)]){
            const module = await this.service[this.toId(path, classname)];
            if(!module){
                throw new Error("error");
            }
            return module;
        }
        if(!this.service[this.toId(path, classname)]){
            let modulePromise = instanciateWebpackAsyncModule<Service<T>>(path,classname);
            this.service[this.toId(path, classname)] = new Promise(async (resolve) => {
                let t = await (await modulePromise).create(this);
                resolve(t);
            });

        }
        return await this.service[this.toId(path, classname)];
    }

}
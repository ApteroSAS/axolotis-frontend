import Component from "@root/modules/core/ecs/Component";
import { load } from "@root/modules/core/loader/CodeLoader";
import { loadAssets } from "@root/modules/core/loader/AssetsLoader";
import { instanciateWebpackAsyncModule } from "@root/modules/core/loader/WebpackLoader";
import { ComponentFactory } from "@root/modules/core/ecs/ComponentFactory";
import { world } from "@root/modules/core/ecs/WorldEntity";

export class CodeLoaderComponent implements Component {

    private initialLoading: Promise<any>;
    private initialLoadingResolver: ((value: any) => void) | undefined;


    constructor() {
        this.initialLoading = new Promise<any>((resolve) => {
            this.initialLoadingResolver = resolve;
        });
    }

    getType(): string {
        return CodeLoaderComponent.name;
    }

    async awaitInitialLoading() {
        await this.initialLoading;
    }

    async startLoading(list:any[],loadedCallBack: (progress: number, total: number) => void) {
        let promises: (() => Promise<any>)[] = [];
        for (const key in list) {
            const entry = list[key];
            if (entry.type === "ecs-component-loader" && entry.module) {
                promises.push( () => new Promise(async (resolve, reject) => {
                    let module = await instanciateWebpackAsyncModule<ComponentFactory<Component>>(entry.module,entry.name || "Factory");
                    module.create(world, entry.config || {});
                    resolve(module);
                }));
            }
            if (entry.type === "assets-loader" && entry.url) {
                promises.push(() => loadAssets(entry.url));
            }
        }

        let promise = load(promises, loadedCallBack);
        promise.then(value => {
            if (this.initialLoadingResolver !== undefined) {
                this.initialLoadingResolver(value);
            }
        });
        promise.catch(reason => {
            console.error(reason);
        })
        return promise;
    }

}
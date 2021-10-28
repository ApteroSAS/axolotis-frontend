import Component from "@root/modules/core/ecs/Component";
import { loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";
import { load } from "@root/modules/core/codeLoader/CodeLoader";
import { loadAssets } from "@root/modules/core/assetsLoader/AssetsLoader";

export class CodeLoaderComponent implements Component {

    private initialLoading: Promise<any>;
    private initialLoadingResolver: ((value: any) => void) | undefined;


    constructor() {
        this.initialLoading = new Promise<any>((resolve) => {
            this.initialLoadingResolver = resolve;
        });
    }

    getName(): string {
        return CodeLoaderComponent.name;
    }

    async awaitInitialLoading() {
        await this.initialLoading;
    }

    async startLoading(list:any[],loadedCallBack: (progress: number, total: number) => void) {
        let promises: (() => Promise<any>)[] = [];
        for (const key in list) {
            const entry = list[key];
            if (entry.type === "webpack-ecs-loader" && entry.module) {
                promises.push(() => loadComponent(entry.module));
            }
            if (entry.type === "assets-loader" && entry.url) {
                promises.push(() => loadAssets(entry.url));
            }
        }

        [
            //() => import("@root/modules/scenes/demo1/GLTFScene"),
            //() => import("@root/modules/core/controller/FpsController"),
            //() => loadAssets("assets/static/demo2/level.glb"),
            //() => loadAssets("assets/static/demo2/sky.jpg")
            /*() => {
                return new Promise(resolve => {
                    setTimeout(resolve,1000);
                })
            }*/
        ];

        let promise = load(promises, loadedCallBack);
        promise.then(value => {
            if (this.initialLoadingResolver !== undefined) {
                this.initialLoadingResolver(value);
            }
        });
        return promise;
    }

}
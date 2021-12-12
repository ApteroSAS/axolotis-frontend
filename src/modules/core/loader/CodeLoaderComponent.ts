import Component from "@root/modules/core/ecs/Component";
import { load } from "@root/modules/core/loader/CodeLoader";
import { loadAssets } from "@root/modules/core/loader/AssetsLoader";
import { instanciateWebpackAsyncModule } from "@root/modules/core/loader/WebpackLoader";
import { ComponentFactory } from "@root/modules/core/ecs/ComponentFactory";
import { WorldEntity } from "@root/modules/core/ecs/WorldEntity";

export class CodeLoaderComponent implements Component {

    private initialLoading: Promise<any>;
    private initialLoadingResolver: ((value: any) => void) | undefined;


    constructor() {
        this.initialLoading = new Promise<any>((resolve) => {
            this.initialLoadingResolver = resolve;
        });
    }

    async loadRoomDefinitionFile(roomUrl){
        roomUrl.replace("./","");
        if(!roomUrl.startsWith("http")){
            roomUrl = window.location.origin+ "/" + roomUrl;
        }
        let response = await fetch(roomUrl);
        return await response.json();
    }

    async searchRoomDefinitionFile(){
        //how to find a room
        //1 - search in window.axolotis.room
        //2 - search in meta tag
        if((window as any).axolotis && (window as any).axolotis.room){
            return (window as any).axolotis.room;
        }
        for(const tag of window.document.head.children){
            if(tag.tagName === "META" && (tag as any).name==="axolotis:room"){
                let roomUrl =  (tag as any).content;
                return this.loadRoomDefinitionFile(roomUrl);
            }
        }
        throw new Error("No room definition found in meta axolotis:room");
    }

    getType(): string {
        return CodeLoaderComponent.name;
    }

    async awaitInitialLoading() {
        await this.initialLoading;
    }

    async startLoading(world: WorldEntity,list:any[],loadedCallBack: (progress: number, total: number) => void) {
        let promises: (() => Promise<any>)[] = [];
        for (const key in list) {
            const entry = list[key];
            if (entry.type === "ecs-component-loader" && entry.module) {
                promises.push( () => new Promise(async (resolve, reject) => {
                    entry.name = entry.name || "Factory";
                    let module = await instanciateWebpackAsyncModule<ComponentFactory<Component>>(entry.module,entry.name);
                    let component = await module.create(world, entry.config || {});
                    if(!component.getType){
                        throw new Error("Not a component : "+entry.module+ " "+component.constructor.name)
                    }
                    world.addComponent(component);
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

import { world } from "@root/modules/core/ecs/WorldEntity";
import { CodeLoaderComponent } from "@root/modules/core/loader/CodeLoaderComponent";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";

export const BUILD_VERSION = require('../../../../package.json').version;
console.log(BUILD_VERSION);

export function init() {
    let serviceEntity = new ServiceEntity();
    world.addComponent(serviceEntity);
    let codeLoaderComponent = new CodeLoaderComponent();
    serviceEntity.setService("@root/modules/core/loader/CodeLoaderService",codeLoaderComponent);
    codeLoaderComponent.searchRoomDefinitionFile().then((json)=>{
        codeLoaderComponent.startLoading(json.room,(progress, total) => {
            console.log("["+progress + "/" + total + "]");
            const progressbar:any = document.getElementById('progress');
            progressbar.style.width = `${((progress/total)*100)}%`;
        }).then(()=>{
            console.log("loading complete");
            (document.getElementById("progresscontainer") as any).className += "load";
        });
    });
}

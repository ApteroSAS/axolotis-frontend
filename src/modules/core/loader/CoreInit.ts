import { world } from "@root/modules/core/ecs/WorldEntity";
import { CodeLoaderComponent } from "@root/modules/core/loader/CodeLoaderComponent";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";

export const BUILD_VERSION = require('../../../../package.json').version;
console.log(BUILD_VERSION);

export function init() {
    world.addComponent(new ServiceEntity());

    const codeLoaderComponent = new CodeLoaderComponent();
    world.addComponent(codeLoaderComponent);

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

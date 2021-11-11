import { world } from "@root/modules/core/ecs/WorldEntity";
import { CodeLoaderComponent } from "@root/modules/core/codeLoader/CodeLoaderComponent";
import PlayerControls from "@root/modules/controller/physicPlayerControl/PlayerControls";

export const BUILD_VERSION = require('../package.json').version;
console.log(BUILD_VERSION);
//level file.json list the entity of the system

const list = [
    /*{
        type: "webpack-ecs-loader",
        module: "LevelSetup",
        config: {}
    },*/
    {
        type: "webpack-ecs-loader",
        module: "@root/modules/scenes/demo2/Sky2",
        config: {}
    },
    {
        type: "webpack-ecs-loader",
        module: "@root/modules/controller/physicPlayerControl/PlayerControls",
        config: {
            position:{
                x:0,y:5,z:0
            }
        }
    },
    {
        type: "webpack-ecs-loader",
        module: "@root/modules/SpokeRoomLoader",
        config: {}
    },
    {
        type: "assets-loader",
        url: "assets/static/demo2/level.glb"
    }
];

const codeLoaderComponent = new CodeLoaderComponent();
world.addComponent(codeLoaderComponent);

codeLoaderComponent.startLoading(list,(progress, total) => {
    console.log("["+progress + "/" + total + "]");
    const progressbar:any = document.getElementById('progress');
    progressbar.style.width = `${((progress/total)*100)}%`;
}).then(()=>{
    console.log("loading complete");
    (document.getElementById("progresscontainer") as any).className += "load";
});


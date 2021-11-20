import { world } from "@root/modules/core/ecs/WorldEntity";
import { CodeLoaderComponent } from "@root/modules/core/loader/CodeLoaderComponent";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";
import { PhysicsSystem } from "@root/modules/core/ammo/worker/physicsSystem";

export const BUILD_VERSION = require('../package.json').version;
console.log(BUILD_VERSION);
//level file.json list the entity of the system

world.addComponent(new ServiceEntity());

const list = [
    {
        type: "ecs-component-loader",
        module: "@root/modules/scenes/demo2/Sky2",
    },
    /*{
        type: "ecs-component-loader",
        module: "@root/modules/scenes/demo2/LevelSetup",
    },*/
    {
        type: "ecs-component-loader",
        module: "@root/modules/scenes/demo3/SpokeRoomLoader",
        config:{
            room:"yUXD7A2"
        }
    },
    {
        type: "ecs-component-loader",
        module: "@root/modules/controller/pathFindingPlayer/NavMeshPlayer",
        config: {
            position:{
                x:0,y:1,z:0,
                //:x:2.14, y:1.48, z:-1.36
            }
        }
    },
    /*{
        type: "ecs-component-loader",
        module: "@root/modules/SpokeRoomLoader",
    },*/
    /*{
        type: "assets-loader",
        url: "assets/static/demo2/level.glb"
    }*/
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

//let physicsSystem = new PhysicsSystem();//TODO here bug


import { load } from "@root/modules/_moduleLoader/CodeLoader";
export const BUILD_VERSION = require('../package.json').version;
console.log(BUILD_VERSION);
import { loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";

//level file.json list the entity of the system
const list = {
    scene:{
        type:"webpack-ecs-loader",
        module : "LevelSetup",
        config :{}
    },
    sky:{
        type:"webpack-ecs-loader",
        module : "Sky2",
        config :{}
    },
    player:{
        type:"webpack-ecs-loader",
        module : "PlayerControls",
        config :{}
    },
    pluginExample1:{
        type:"scriptjs-loader",
        url : "@root/modules/scenes/demo1/GLTFScene"
    }
}

let promises:(()=>Promise<any>)[] = [];
for(const key in list) {
    const entry = list[key];
    if(entry.type === "webpack-ecs-loader") {
        promises.push(()=>loadComponent(entry.module));
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
]

load(promises,(progress, total) => {
    console.log("["+progress + "/" + total + "]");
    const progressbar:any = document.getElementById('progress');
    progressbar.style.width = `${((progress/total)*100)}%`;
}).then(()=>{
    console.log("loading complete");
    (document.getElementById("progresscontainer") as any).className += "load";
});

//console.log(threeLoader);
//const module = "/modules/core/three/ThreeLoader.js";
//world.addComponentAsync<ThreeLoader>(()=>{return import(`${module}`) as any});
//world.addComponentAsync<ThreeLoader>(()=>{return import(/* webpackIgnore: true */ module) as any});
/*
async function init()
{
    Input.ClearEventListners();
    let level = new LevelSetup();
    await level.loadScene();
    let sky = new Sky2();
    await sky.initialize();

    let position = new THREE.Vector3(2.14, 1.48, -1.36);
    let rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI * 0.5);
    let playerPhysics = new PlayerPhysics();
    playerPhysics.Initialize(position.x, position.y, position.z);
    let playerControls = new PlayerControls(playerPhysics,position,rotation);
    playerControls.Initialize();
    frameLoop.addCallback((delta)=>{
        ammoPhysics.step( delta*0.001);
        playerControls.Update(delta);
        playerPhysics.PhysicsUpdate();
    })
}

init();*/

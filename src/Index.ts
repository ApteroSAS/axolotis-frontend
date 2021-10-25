
import { load } from "@root/modules/_moduleLoader/CodeLoader";
import { loadAssets } from "@root/modules/core/assetsLoader/AssetsLoader";
import LevelSetup from "@root/modules/scenes/demo2/LevelSetup";
import Sky2 from "@root/modules/scenes/demo2/Sky2";
import PlayerControls from "@root/modules/core/Controller/PhysicPlayerControl/PlayerControls";
import PlayerPhysics from "@root/modules/core/Controller/PhysicPlayerControl/PlayerPhysics";
export const BUILD_VERSION = require('../package.json').version;
console.log(BUILD_VERSION);
import Input from '@root/modules/core/Controller/PhysicPlayerControl/Input'
import * as THREE from "three";
import { frameLoop } from "@root/modules/core/FrameLoop";
import { ammoPhysics } from "@root/modules/core/ammo/AmmoPhysics";


load([
    //() => import("@root/modules/scenes/demo1/GLTFScene"),
    //() => import("@root/modules/core/Controller/FpsController"),
    () => loadAssets("assets/static/demo2/level.glb"),
    () => loadAssets("assets/static/demo2/sky.jpg")
    /*() => {
        return new Promise(resolve => {
            setTimeout(resolve,1000);
        })
    }*/
],(progress, total) => {
    console.log("["+progress + "/" + total + "]");
    const progressbar:any = document.getElementById('progress');
    progressbar.style.width = `${((progress/total)*100)}%`;
}).then(()=>{
    console.log("loading complete");
    (document.getElementById("progresscontainer") as any).className += "load";
});

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

init();

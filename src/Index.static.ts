import { world } from "@root/modules/core/ecs/WorldEntity";
import { CodeLoaderComponent } from "@root/modules/core/codeLoader/CodeLoaderComponent";
import LevelSetup from "@root/modules/scenes/demo2/LevelSetup";
import { ThreeLib } from "@root/modules/core/three/ThreeLib";
import { FrameLoop } from "@root/modules/core/FrameLoop";
import { AmmoPhysics } from "@root/modules/core/ammo/AmmoPhysics";
import Sky from "@root/modules/scenes/demo2/Sky2";
import PlayerControls from "@root/modules/controller/physicPlayerControl/PlayerControls";
import * as THREE from "three";
import PlayerPhysics from "@root/modules/controller/physicPlayerControl/PlayerPhysics";
import { Input } from "@root/modules/controller/Input";

export const BUILD_VERSION = require('../package.json').version;
console.log(BUILD_VERSION);
//level file.json list the entity of the system

const list = [
    {
        type: "webpack-ecs-loader",
        module: "LevelSetup",
        config: {}
    },
    {
        type: "webpack-ecs-loader",
        module: "Sky2",
        config: {}
    },
    {
        type: "webpack-ecs-loader",
        module: "PlayerControls",
        config: {}
    },
    {
        type: "assets-loader",
        url: "assets/static/demo2/level.glb"
    }
];
/*
const codeLoaderComponent = new CodeLoaderComponent();
world.addComponent(codeLoaderComponent);

codeLoaderComponent.startLoading(list,(progress, total) => {
    console.log("["+progress + "/" + total + "]");
    const progressbar:any = document.getElementById('progress');
    progressbar.style.width = `${((progress/total)*100)}%`;
}).then(()=>{
    console.log("loading complete");
    (document.getElementById("progresscontainer") as any).className += "load";
});*/

async function staticInit() {
    let frameLoop = new FrameLoop();
    let threeLib = new ThreeLib(frameLoop);
    let ammoPhysics = new AmmoPhysics();

    await ammoPhysics.setupPhysics();
    frameLoop.addCallback((delta) => {
        ammoPhysics.step(delta * 0.001);
    });
    let levelSetup = new LevelSetup();
    await levelSetup.loadScene(ammoPhysics, threeLib);
    let sky = new Sky();
    await sky.initialize(threeLib);

    let position = new THREE.Vector3(2.14, 1.48, -1.36);
    let rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI * 0.5);
    let playerPhysics = new PlayerPhysics(ammoPhysics);
    playerPhysics.Initialize(position.x, position.y, position.z);
    let input = new Input();
    let playerControls = new PlayerControls(playerPhysics, position, rotation, threeLib, input);
    playerControls.Initialize();
    frameLoop.addCallback((delta) => {
        playerControls.Update(delta);
        playerPhysics.PhysicsUpdate();
    })

    frameLoop.startLoop();

    console.log("loading complete");
    (document.getElementById("progresscontainer") as any).className += "load";
}
staticInit();
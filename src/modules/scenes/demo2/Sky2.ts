import * as THREE from 'three';
import Component from '@root/modules/core/ecs/Component'
import { loadAssets } from "@root/modules/core/assetsLoader/AssetsLoader";
import { WebpackAsyncModuleFactory, loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";
import { ThreeLib } from "@root/modules/core/three/ThreeLib";

export class Factory extends WebpackAsyncModuleFactory<Sky>{
    async create(config): Promise<Sky> {
        let three = await loadComponent<ThreeLib>("@root/modules/core/three/ThreeLib");
        let sky = new Sky();
        await sky.initialize(three);
        return sky;
    }
}

export default class Sky implements Component{
    private scene: any;
    private texture: any;
    constructor(){
    }

    getName(): string {
        return "Sky";
    }

    async initialize(three:ThreeLib){
        this.scene = three.scene;
        this.texture = await loadAssets("assets/static/demo2/sky.jpg");
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 1);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.scene.add(hemiLight);

        const skyGeo = new THREE.SphereGeometry(1000, 25, 25);
        const skyMat = new THREE.MeshBasicMaterial({
             map: this.texture,
             side: THREE.BackSide,
             depthWrite: false,
             toneMapped: false
            });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        sky.rotateY(THREE.MathUtils.degToRad(-60));
        this.scene.add(sky);
    }
}

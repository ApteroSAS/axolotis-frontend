import * as THREE from 'three';
import Component from '@root/modules/core/ecs/Component'
import { loadAssets } from "@root/modules/core/loader/AssetsLoader";
import { ThreeLib } from "@root/modules/core/three/ThreeLib";
import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { ComponentFactory } from "@root/modules/core/ecs/ComponentFactory";
import { WorldEntity } from "@root/modules/core/ecs/WorldEntity";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";

export class Factory implements WebpackLazyModule, ComponentFactory<Sky>{
    async create(world:WorldEntity, config:any): Promise<Sky> {
        let services = world.getFirstComponentByType<ServiceEntity>(ServiceEntity.name);
        let three = await services.getService<ThreeLib>("@root/modules/core/three/ThreeLib");
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

    getType(): string {
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

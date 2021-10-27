import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoughnessMipmapper } from "three/examples/jsm/utils/RoughnessMipmapper.js";
import { FactoryAbstractInterface, loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";
import { ThreeLib } from "@root/modules/core/three/ThreeLib";
import Component from "@root/modules/core/ecs/Component";

export class Factory extends FactoryAbstractInterface<GLTFScene>{
    async create(config): Promise<GLTFScene> {
        let three = await loadComponent<ThreeLib>("ThreeLib");
        let module = new GLTFScene(three);
        return module;
    }
}

export class GLTFScene implements Component{

    constructor(three:ThreeLib) {
        new RGBELoader()
            .setPath("assets/static/demo/")
            .load("royal_esplanade_1k.hdr", function(texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                three.scene.background = texture;
                three.scene.environment = texture;
                // model
                // use of RoughnessMipmapper is optional
                const roughnessMipmapper = new RoughnessMipmapper(three.renderer);
                const loader = new GLTFLoader().setPath("assets/static/demo/");
                loader.load("DamagedHelmet.gltf", function(gltf) {
                    gltf.scene.traverse(function(child: any) {
                        if (child.isMesh) {
                            roughnessMipmapper.generateMipmaps(child.material);
                        }
                    });
                    three.scene.add(gltf.scene);
                    roughnessMipmapper.dispose();
                });
            });

    }

    getName(): string {
        return GLTFScene.name;
    }

}

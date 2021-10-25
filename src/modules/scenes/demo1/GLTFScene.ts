import * as THREE from "three";
import { threeLoader } from "@root/modules/core/Three/ThreeLoader";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoughnessMipmapper } from "three/examples/jsm/utils/RoughnessMipmapper.js";

export class GLTFScene {

    constructor() {
        new RGBELoader()
            .setPath("assets/static/demo/")
            .load("royal_esplanade_1k.hdr", function(texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                threeLoader.scene.background = texture;
                threeLoader.scene.environment = texture;
                // model
                // use of RoughnessMipmapper is optional
                const roughnessMipmapper = new RoughnessMipmapper(threeLoader.renderer);
                const loader = new GLTFLoader().setPath("assets/static/demo/");
                loader.load("DamagedHelmet.gltf", function(gltf) {
                    gltf.scene.traverse(function(child: any) {
                        if (child.isMesh) {
                            roughnessMipmapper.generateMipmaps(child.material);
                        }
                    });
                    threeLoader.scene.add(gltf.scene);
                    roughnessMipmapper.dispose();
                });
            });

    }

}

export const gltfScene: GLTFScene = new GLTFScene();

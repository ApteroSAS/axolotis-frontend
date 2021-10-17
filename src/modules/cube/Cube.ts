import * as THREE from 'three'
import { threeLoader } from "@root/modules/core/ThreeLoader";

export class Cube{

    constructor() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });

        const cube = new THREE.Mesh(geometry, material);
        threeLoader.scene.add(cube);
    }

}

export const cube:Cube = new Cube();

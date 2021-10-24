import * as THREE from "three";
import { threeLoader } from "@root/modules/core/ThreeLoader";

export class Cube {

    constructor() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });

        const cube = new THREE.Mesh(geometry, material);
        threeLoader.scene.add(cube);

        const colorsFloor = [];
        let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
        floorGeometry.rotateX( - Math.PI / 2 );
        const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
        floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );
        const floor = new THREE.Mesh( floorGeometry, floorMaterial );
        threeLoader.scene.add(floor);
        const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75);
        threeLoader.scene.add(light);
    }

}

export const cube: Cube = new Cube();

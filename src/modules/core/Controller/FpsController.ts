import { threeLoader } from "@root/modules/core/Three/ThreeLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { frameLoop } from "@root/modules/core/FrameLoop";
import * as THREE from "three";

export class FpsController {
    constructor() {

        /*const controls = new OrbitControls( this.camera,  this.renderer.domElement);
        frameLoop.addCallback(()=>{
            controls.update();
        })*/
        const controls = new PointerLockControls(threeLoader.camera, threeLoader.renderer.domElement);
        threeLoader.scene.add(controls.getObject());
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();
        let moveBackward,moveForward,moveLeft,moveRight,canJump;

        document.addEventListener( 'click',  () => {
            console.log("click")
            controls.lock();
        },false );

        const onKeyDown = (event) => {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = true;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight = true;
                    break;
            }
        };
        const onKeyUp = function(event) {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = false;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    moveLeft = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    moveBackward = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    moveRight = false;
                    break;
            }

        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        frameLoop.addCallback((delta) => {
            if (controls.isLocked) {
                velocity.x -= velocity.x * 10.0 * delta;
                velocity.y -= velocity.z * 10.0 * delta;
                direction.x = Number(moveRight) - Number(moveLeft);
                direction.y = Number(moveForward) - Number(moveBackward);
                direction.normalize(); // this ensures consistent movements in all directions
                if (moveForward || moveBackward) velocity.z -= direction.z * delta;
                if (moveLeft || moveRight) velocity.x -= direction.x * delta;
                controls.moveRight(-velocity.x * delta);
                controls.moveForward(-velocity.z * delta);
            }
        })
    }
}

export const fpsController = new FpsController();

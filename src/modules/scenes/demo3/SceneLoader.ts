import { Ammo, createConvexHullShape } from "@root/modules/core/ammo/AmmoLib";
import { AmmoPhysics } from "@root/modules/core/ammo/AmmoPhysics";
import { loadAssets } from "@root/modules/core/loader/AssetsLoader";
import { ThreeLib } from "@root/modules/core/three/ThreeLib";

export default class SceneLoader {
    private scene: any;
    private physicsWorld: any;
    private mesh: any;

    constructor() {
    }

    async loadScene(sceneUrl: string, ammoPhysics: AmmoPhysics, threeLib: ThreeLib) {

        this.scene = threeLib.scene;
        this.physicsWorld = ammoPhysics.physicsWorld;
        this.mesh = await loadAssets(sceneUrl);
        this.mesh = this.mesh.scene;

        this.mesh.traverse((node) => {
            if (node.isMesh) {
                if (node.name.startsWith("navMesh")
                ) {
                    this.setStaticCollider(node);
                }
            }
        });

        this.scene.add(this.mesh);
    }


    setStaticCollider(mesh) {
        const shape = createConvexHullShape(mesh);
        const mass = 0;
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const object = new Ammo.btRigidBody(rbInfo);
        object.mesh = mesh;

        this.physicsWorld.addRigidBody(object);
    }

}

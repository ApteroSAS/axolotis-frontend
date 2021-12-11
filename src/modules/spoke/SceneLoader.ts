import { loadAssets } from "@root/modules/core/loader/AssetsLoader";
import { ThreeLib } from "@root/modules/three/ThreeLib";

export default class SceneLoader {
    private scene: any;
    private mesh: any;
    public navMesh:any;

    constructor() {
    }

    async loadScene(sceneUrl: string, threeLib: ThreeLib) {

        this.scene = threeLib.scene;
        this.mesh = await loadAssets(sceneUrl);
        this.mesh = this.mesh.scene;

        this.mesh.traverse((node) => {
            if (node.isMesh) {
                if (node.name === "navMesh") {
                    this.navMesh = node;
                }
            }
        });

        this.scene.add(this.mesh);
    }

}

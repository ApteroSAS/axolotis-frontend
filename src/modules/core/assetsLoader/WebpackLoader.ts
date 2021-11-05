export async function loadModuleAsync(name):Promise<any> {
    //TODO autogenerate with webpack codegen
    /* Webpack use module name for loading cand computin code bundle and split chunk so we cannot introduce variable in the import thus redirecting name to import*/
    switch (name) {
        case "ThreeLib": return import("@root/modules/core/three/ThreeLib");
        case "AmmoPhysics": return import("@root/modules/core/ammo/AmmoPhysics");
        case "Input": return import("@root/modules/controller/Input");
        case "LevelSetup": return import("@root/modules/scenes/demo2/LevelSetup");
        //tmp
        case "Sky2": return import("@root/modules/scenes/demo2/Sky2");
        case "FrameLoop": return import("@root/modules/core/FrameLoop");
        case "PlayerControls": return import("@root/modules/controller/physicPlayerControl/PlayerControls");
        case "SpokeLoader": return import("@root/modules/SpokeRoomLoader")
        default: throw new Error(name+" not found in module list");
    }
}

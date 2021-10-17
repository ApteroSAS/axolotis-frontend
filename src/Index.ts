
import { load } from "@root/modules/_moduleLoader/CodeLoader";
export const BUILD_VERSION = require('../package.json').version;
console.log(BUILD_VERSION);

load([import("@root/modules/cube/Cube")],(progress, total) => console.log("["+progress + "/" + total + "]")).then(()=>{
    console.log("loading complete");
});

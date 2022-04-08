import { initHtml } from "@aptero/axolotis-player";
import {load} from "@aptero/axolotis-core-plugins";//import axolotis core plugins
load();

initHtml({
    onProgress: (progress, total) => {
        console.log("[" + progress + "/" + total + "]");
        const progressbar: any = document.getElementById("progress");
        progressbar.style.width = `${(progress / total) * 100}%`;
    },
    onLoaded: () => {
        console.log("loading complete");
        (document.getElementById("progresscontainer") as any).className += "load";
    }
});
console.log("hello");
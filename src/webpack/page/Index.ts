import { initHtml } from "@aptero/axolotis-player";
import "@aptero/axolotis-core-plugins";//import axolotis core plugins

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

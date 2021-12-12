import html from './StatsPanel.html';
import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import Component from "@root/modules/core/ecs/Component";
import { ThreeLib } from "@root/modules/three/ThreeLib";
import Stats from "three/examples/jsm/libs/stats.module";
import { FrameLoop } from "@root/modules/FrameLoop";
const rStats = require("./rStats/rStats");
const rStatsExtra = require("./rStats/rStats.extras");

declare const window:any;

export class Factory implements WebpackLazyModule, Service<PerformanceStats>{
    async create(services:LazyServices): Promise<PerformanceStats> {
        let threeLib = await services.getService<ThreeLib>("@root/modules/three/ThreeLib");
        let frameLoop = await services.getService<FrameLoop>("@root/modules/FrameLoop");
        return new PerformanceStats(threeLib,frameLoop);
    }
}

export class PerformanceStats implements Component {
    constructor(private threeLib: ThreeLib, frameLoop: FrameLoop) {
        console.warn("MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info) to have precise perf info")
        const stats = Stats();
        stats.showPanel(2);
        document.body.appendChild(stats.dom);

        //https://spite.github.io/rstats/
        const threeStats = new window.threeStats(this.threeLib.renderer);
        const plugins = [threeStats];
        var rS = new rStats({
            css: [], // Our stylesheet is injected from AFrame.
            values: {
                fps: { caption: "fps", below: 30 },
            },
            groups: [
                { caption: "Framerate", values: ["fps", "raf", "physics"] },
            ],
            plugins: plugins
        });
        window.document.body.insertAdjacentHTML("beforeend", html);

        frameLoop.addCallback(delta => {
            rS( 'frame(ms)' ).end();
            stats.update();
            rS().update();
            rS( 'frame(ms)' ).start();
        });
    }

    getType(): string {
        return PerformanceStats.name;
    }
}

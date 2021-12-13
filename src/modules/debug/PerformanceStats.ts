import html from "./StatsPanel.html";
import { WebpackLazyModule } from "@root/modules/core/loader/WebpackLoader";
import { LazyServices, Service } from "@root/modules/core/service/LazyServices";
import Component from "@root/modules/core/ecs/Component";
import { ThreeLib } from "@root/modules/three/ThreeLib";
import Stats from "three/examples/jsm/libs/stats.module";
import { FrameLoop } from "@root/modules/FrameLoop";
import NavMeshPlayer from "@root/modules/controller/pathFindingPlayer/NavMeshPlayer";
import { DebugBtn } from "@root/modules/debug/DebugBtn";
import { WorldService } from "@root/modules/core/WorldService";
import { ServiceEntity } from "@root/modules/core/service/ServiceEntity";
import { PortalLink } from "@root/modules/portals/PortalLink";

const rStats = require("./rStats/rStats");
const rStatsExtra = require("./rStats/rStats.extras");

declare const window: any;

export class Factory implements WebpackLazyModule, Service<PerformanceStats> {
    async create(services: LazyServices): Promise<PerformanceStats> {
        let threeLib = await services.getService<ThreeLib>("@root/modules/three/ThreeLib");
        let frameLoop = await services.getService<FrameLoop>("@root/modules/FrameLoop");
        let worldService = await services.getService<WorldService>("@root/modules/core/WorldService");
        return new PerformanceStats(threeLib, frameLoop,worldService);
    }
}

export class PerformanceStats implements Component {
    private rS: any;
    constructor(private threeLib: ThreeLib, frameLoop: FrameLoop,private worldService: WorldService) {
        console.warn("MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info) to have precise perf info");
        const stats = Stats();
        stats.showPanel(2);
        document.body.appendChild(stats.dom);
        this.updateRstats();
        window.document.body.insertAdjacentHTML("beforeend", html);
        if(worldService.isActiveWorld()) {
            const animate = (t) => {
                //Avoir using frameloop for this so it does not appear on perf
                requestAnimationFrame(animate);
                stats.update();
                this.rS().update();
                this.rS("framerate").end();
                this.rS("framerate").start();
            };
            requestAnimationFrame(animate);
        }


        worldService.addOnWorldAdded(() => {
            this.updateWorldCallback();
        },true);
    }

    updateRstats(){
        let elementsByClassName = document.body.getElementsByClassName("rs-base");
        if(elementsByClassName.length!=0){
            elementsByClassName[0].remove();
        }
        //https://spite.github.io/rstats/
        const threeStats = new window.threeStats(this.threeLib.renderer);
        //const glS = new window.glStats(); // init at any point
        const plugins = [threeStats];
        let config:any = {
            css: [], // Our stylesheet is injected from AFrame.
            values: {
                framerate: { caption: "Frame (ms)", over: 19 } //17 ms = 60fps
            },
            groups: [
            ],
            plugins: plugins
        };
        for (let i = 0; i < this.worldService.getWorlds().length; i++) {
            config.values[FrameLoop.name.toLowerCase()+"-"+i] = { caption: FrameLoop.name + " (ms)", over: 10 };
            config.values[ThreeLib.name.toLowerCase()+"-"+i] = { caption: ThreeLib.name + " (ms)" };
            config.values[NavMeshPlayer.name.toLowerCase()+"-"+i] = { caption: NavMeshPlayer.name + " (ms)" };
            config.values[DebugBtn.name.toLowerCase()+"-"+i] = { caption: DebugBtn.name + " (ms)" };
            config.values[PerformanceStats.name.toLowerCase()+"-"+i] = { caption: PerformanceStats.name + " (ms)" };
            config.values[PortalLink.name.toLowerCase()+"-"+i] = { caption: PortalLink.name + " (ms)" };
            config.groups.push(
                {
                    caption: "World - "+i, values: [
                        FrameLoop.name.toLowerCase()+"-"+i,
                        ThreeLib.name.toLowerCase()+"-"+i,
                        NavMeshPlayer.name.toLowerCase()+"-"+i,
                        PortalLink.name.toLowerCase()+"-"+i]
                })
        }
        this.rS = new rStats(config);
    }

    updateWorldCallback(){
        console.log("new world :",this.worldService.getWorlds());
        this.updateRstats();
        this.worldService.getWorlds().forEach(async (world,index) => {
            let services = world.getFirstComponentByType<ServiceEntity>(ServiceEntity.name);
            let frameLoop =  await services.getService<FrameLoop>("@root/modules/FrameLoop");
            frameLoop.setMonitoringCallback(name => {
                this.rS(name.toLowerCase()+"-"+index).start();
            }, name => {
                this.rS(name.toLowerCase()+"-"+index).end();
            });
        });
    }

    getType(): string {
        return PerformanceStats.name;
    }
}

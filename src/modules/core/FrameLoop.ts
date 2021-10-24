
export class FrameLoop {
    callbacks:((delta:number)=>void)[] = [];
    private prevTime: number = 0;
    constructor() {
        const animate = () => {
            const time = performance.now();
            const delta = ( time - this.prevTime );
            this.prevTime = time;
            requestAnimationFrame(animate);
            for (const callback of this.callbacks) {
                callback(delta);
            }
        }
        animate();
    }

    addCallback(callback:(delta:number)=>void){
        this.callbacks.push(callback);
    }
}

export const frameLoop = new FrameLoop();
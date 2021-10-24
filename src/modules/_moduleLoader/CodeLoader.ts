
export function load(modules:Promise<any>[],loadedCallBack:(progress:number,total:number)=>void){
    let ret:any[] = [];
    let nbLoaded = 0;
    for (const promise of modules){
        ret.push(promise);
        promise.then(()=>{
            nbLoaded++;
            loadedCallBack(nbLoaded,modules.length);
        });
    }
    return Promise.all(ret);
}

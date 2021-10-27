import {DestroyableComponent} from "./DestroyableComponent";
import {Component} from "./Component";

export class Entity implements Component {
    private components: Component[] = [];

    constructor(private name: string) {
    }

    public addComponent<T extends Component>(component: T):T {
        this.components.push(component);
        return component;
    }

    public removeAllComponents() {
        this.components.forEach( (comp)=>{
            this.removeComponent(comp);
        })
    }

    public removeComponent<T extends Component>(component: T):T {
        if("destroy" in component){
            (component as any as DestroyableComponent).destroy();
        }
        this.components = this.components.filter( (comp) => {
            return comp != component;
        });
        return component;
    }


    public addComponents(components: Component[]) {
        components.forEach(comp => {
            this.addComponent(comp);
        });
    }

    public getComponents():Component[]{
        return this.components;
    }

    public getComponentByName(n:string):Component[]{
        let ret:Component[] = [];
        this.components.forEach(comp => {
            if( comp.getName() === n ){
                ret.push(comp);
            }
        });
        return ret;
    }

    public getComponentByNameStartsWith(n:string):Component[]{
        let ret:Component[] = [];
        this.components.forEach(comp => {
            if( comp.getName().startsWith(n) ){
                ret.push(comp);
            }
        });
        return ret;
    }

    public getFirstComponentByNameStartsWith<T extends Component>(n:string):T{
        return this.getComponentByNameStartsWith(n)[0] as T;
    }

    public getFirstComponentByName<T extends Component>(n:string):T{
        return this.getComponentByName(n)[0] as T;
    }



     public getName(): string {
        return this.name;
    }

}

export default Entity;

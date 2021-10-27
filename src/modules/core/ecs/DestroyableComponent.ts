import { Component } from "@root/modules/core/ecs/Component";

export interface DestroyableComponent extends Component{
    destroy():void;
}

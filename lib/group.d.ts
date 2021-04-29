import * as PIXI from 'pixi.js-legacy';
import Selection from "./selection";
import Component from "./component";
interface IGroup {
    needLockProportion: boolean;
    components: Component[];
}
declare class Group extends PIXI.Container {
    selection: Selection;
    components: any;
    needLockProportion: boolean;
    typeName: string;
    uuid: string;
    constructor(params: IGroup);
    update(points?: {
        x: any;
        y: any;
    }[]): void;
    get proportion(): number;
    get points(): {
        x: any;
        y: any;
    }[];
    select(): void;
}
export default Group;

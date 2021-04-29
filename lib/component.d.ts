import * as PIXI from 'pixi.js-legacy';
import Selection from './selection';
interface IComponent {
    x: number;
    y: number;
    angle: number;
    zIndex: number;
    width: number;
    height: number;
    needLockProportion?: boolean;
    url: string;
    uuid?: string;
    pid?: string;
}
declare class Component extends PIXI.Sprite {
    typeName: string;
    url: string;
    needLockProportion: boolean;
    uuid: string;
    pid: string;
    selection: Selection;
    constructor(params: IComponent);
    draw(params: any): void;
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
export default Component;

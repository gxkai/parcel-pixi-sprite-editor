import * as PIXI from 'pixi.js-legacy'
import Border from "./border";
class Selection extends PIXI.Container{
    constructor(objects: PIXI.DisplayObject[]) {
        super();
        this.name = 'selection'
        objects.forEach(_ => {
            this.addChild(_);
        })
    }
    public get dots() {
        const dots = this.children.find(q => q.name === 'dots') as Border;
        return dots
    }
    public get border() {
        const border = this.children.find(q => q.name === 'border') as Border;
        return border;
    }
}
export default Selection;

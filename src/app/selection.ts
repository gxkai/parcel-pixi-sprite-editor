import * as PIXI from 'pixi.js-legacy'
class Selection extends PIXI.Container{
    constructor(objects: PIXI.DisplayObject[]) {
        super();
        this.name = 'selection'
        objects.forEach(_ => {
            this.addChild(_);
        })
    }
}
export default Selection;

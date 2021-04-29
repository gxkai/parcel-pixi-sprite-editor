import * as PIXI from 'pixi.js-legacy';
class Selection extends PIXI.Container {
    constructor(objects) {
        super();
        this.name = 'selection';
        objects.forEach(_ => {
            this.addChild(_);
        });
    }
    update(points) {
        const [newLTPoint, newRTPoint, newLBPoint, newRBPoint, newTPoint, newBPoint, newLPoint, newRPoint, newUBPoint] = points;
        this.dots.update([newLTPoint,
            newRTPoint,
            newLBPoint,
            newRBPoint,
            newTPoint,
            newBPoint,
            newLPoint,
            newRPoint,
            newUBPoint]);
        this.border.update([
            newLTPoint,
            newRTPoint,
            newRBPoint,
            newLBPoint,
        ]);
    }
    get dots() {
        const dots = this.children.find(q => q.name === 'dots');
        return dots;
    }
    get border() {
        const border = this.children.find(q => q.name === 'border');
        return border;
    }
}
export default Selection;

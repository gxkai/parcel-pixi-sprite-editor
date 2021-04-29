import * as PIXI from 'pixi.js-legacy';
import { calculateSurroundPoints } from "./calculateComponentPositionAndSize";
import { v4 } from 'uuid';
class Group extends PIXI.Container {
    constructor(params) {
        super();
        const { needLockProportion, components } = params;
        this.uuid = v4();
        this.components = components;
        components.forEach((_, i) => {
            _.interactive = false;
            this.addChild(_);
        });
        const pointList = components.map(_ => {
            const vertexData = _.vertexData;
            return [{
                    x: vertexData[0],
                    y: vertexData[1],
                }, {
                    x: vertexData[2],
                    y: vertexData[3],
                }, {
                    x: vertexData[4],
                    y: vertexData[5],
                }, {
                    x: vertexData[6],
                    y: vertexData[7],
                }];
        }).reduce((previousValue, currentValue) => {
            return previousValue.concat(currentValue);
        }, []);
        const pointXList = pointList.map(p => p.x);
        const pointYList = pointList.map(p => p.y);
        const xMin = Math.min(...pointXList);
        const xMax = Math.max(...pointXList);
        const yMin = Math.min(...pointYList);
        const yMax = Math.max(...pointYList);
        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new PIXI.Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        this.pivot.x = (xMin + xMax) / 2;
        this.pivot.y = (yMin + yMax) / 2;
        this.position.set(this.pivot.x, this.pivot.y);
        this.angle = 0;
        this.zIndex = 9999;
        this.typeName = 'group';
        this.needLockProportion = !!needLockProportion;
    }
    update(points = this.points) {
        this.selection.update(points);
    }
    get proportion() {
        return this.width / this.height;
    }
    get points() {
        const { left, right, top, bottom } = this.getBounds();
        return calculateSurroundPoints({
            x: (left + right) / 2,
            y: (top + bottom) / 2
        }, this);
    }
    select() {
        this.selection.visible = true;
        this.selection.border.visible = true;
        this.selection.dots.visible = true;
        this.selection.dots.dots.forEach((_, i, array) => {
            _.visible = i === array.length - 1;
        });
    }
}
export default Group;

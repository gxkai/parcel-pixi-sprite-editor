import * as PIXI from 'pixi.js-legacy';
import calculateComponentPositionAndSize, {calculateSurroundPoints} from "./calculateComponentPositionAndSize";
import {calculateRotatedAngle, calculateRotatedPointCoordinate, mod360} from './translate';
import Dot from "./dot";
import Component from "./component";
import Border from "./border";
import Mask from "./mask";
import Background from "./background";
import Dots from "./dots";
import Selection from "./selection";
(window as any).PIXI = PIXI;

let app: PIXI.Application;
//矩形框
let selections = [];
//
const data = {
    pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'], // 八个方向
    initialAngle: { // 每个点对应的初始角度
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315,
    },
    angleToCursor: [ // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' },
    ],
    cursors: {},
    curComponent: new PIXI.Container()
}
// 获取光标样式
function getCursor() {
    const { angleToCursor, initialAngle, pointList, curComponent } = data
    const rotate = mod360(curComponent.angle) // 取余 360
    const result = {}
    let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

    pointList.forEach(point => {
        const angle = mod360(initialAngle[point] + rotate)
        const len = angleToCursor.length
        while (true) {
            lastMatchIndex = (lastMatchIndex + 1) % len
            const angleLimit = angleToCursor[lastMatchIndex]
            if (angle < 23 || angle >= 338) {
                result[point] = 'nw-resize'

                return
            }

            if (angleLimit.start <= angle && angle < angleLimit.end) {
                result[point] = angleLimit.cursor + '-resize'

                return
            }
        }
    })

    return result
}
// 获取两个数之间的随机数
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// 清除选中
function clearSelections() {
    selections.forEach(_ => {
        _.visible = false;
    })
}
function setup(params){
    const {x, y, angle} = params
    const object = new Component(params);

    app.stage.addChild(object);

    const container = object;

    const [
        newLTPoint,
        newRTPoint,
        newLBPoint,
        newRBPoint,
        newTPoint,
        newBPoint,
        newLPoint,
        newRPoint
    ] = [
        calculateRotatedPointCoordinate({x, y}
            , {x: x + object.width/2, y: y + object.height/2}, angle
        ),
        calculateRotatedPointCoordinate({
            x: x + object.width,
            y: y,
        }, {x: x + object.width/2, y: y + object.height/2}, angle),
        calculateRotatedPointCoordinate({
            x: x,
            y: y + object.height,
        }, {x: x + object.width/2, y: y + object.height/2}, angle),
        calculateRotatedPointCoordinate({
            x: x + object.width,
            y: y + object.height,
        }, {x: x + object.width/2, y: y + object.height/2}, angle),

        calculateRotatedPointCoordinate({
            x: x + object.width/2,
            y: y
        }, {x: x + object.width/2, y: y + object.height/2}, angle),

        calculateRotatedPointCoordinate({
            x: x + object.width/2,
            y: y + object.height
        }, {x: x + object.width/2, y: y + object.height/2}, angle),
        calculateRotatedPointCoordinate({
            x: x,
            y: y + object.height/2
        }, {x: x + object.width/2, y: y + object.height/2}, angle),
        calculateRotatedPointCoordinate({
            x: x + object.width,
            y: y + object.height/2
        }, {x: x + object.width/2, y: y + object.height/2}, angle)
    ]
    const border = new Border([newLTPoint, newRTPoint, newRBPoint, newLBPoint, newLTPoint])
    const rotation = new Dot(calculateRotatedPointCoordinate({
        x: x + object.width/2,
        y: y + object.height + 50
    }, {x: x + object.width/2, y: y + object.height/2}, angle), 'rotation')
    rotation.on('pointerdown', function (event) {
        let dragging = true;
        const oldPoint = {
            x: event.data.global.x,
            y: event.data.global.y
        }
        const oldAngle = container.angle;
        function onDragEnd() {
            dragging = false;
        }
        this.on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd )
            .on('pointermove', function(event)  {
                if (dragging) {
                    const newPoint = {
                        x: event.data.global.x,
                        y: event.data.global.y
                    }

                    container.angle = oldAngle + calculateRotatedAngle(oldPoint, newPoint, {
                        x: container.x,
                        y: container.y
                    });

                    const result = calculateSurroundPoints({
                        x: container.x,
                        y: container.y
                    }, container);
                    if (
                        !result
                    ) return
                    const {
                        newLTPoint,
                        newRTPoint,
                        newLBPoint,
                        newRBPoint,
                        newTPoint,
                        newBPoint,
                        newLPoint,
                        newRPoint,
                        newUBPoint
                    } = result


                    lt.update(newLTPoint)
                    rt.update(newRTPoint)
                    lb.update(newLBPoint)
                    rb.update(newRBPoint)
                    t.update(newTPoint)
                    b.update(newBPoint)
                    l.update(newLPoint)
                    r.update(newRPoint)
                    border.update([newLTPoint, newRTPoint, newRBPoint, newLBPoint, newLTPoint])
                    rotation.update(newUBPoint)
                }
            })
    })
    const lt = new Dot(newLTPoint, 'lt');
    const rt = new Dot(newRTPoint, 'rt');
    const lb = new Dot(newLBPoint, 'lb');
    const rb = new Dot(newRBPoint, 'rb');
    const t = new Dot(newTPoint, 't');

    const b = new Dot(newBPoint, 'b');
    const l = new Dot(newLPoint, 'l');
    const r = new Dot(newRPoint, 'r');

    [lt, rt, lb, rb, t, b, l, r].forEach(_ => {
        _.on('pointerover', function (event) {
            data.curComponent = container;
            data.cursors = getCursor();
            this.cursor = data.cursors[_.name]
        }).on('pointerdown', function(event) {
            event.stopPropagation();
            let dragging = true;
            // 组件宽高比
            const proportion = container.proportion;

            // 是否需要等比例缩放
            const needLockProportion = container.needLockProportion;
            // 组件中心点
            const  center = {
                x: container.x,
                y: container.y
            }
            // 当前点击坐标
            const curPoint = {
                x: event.data.global.x,
                y: event.data.global.y
            }
            // 获取对称点的坐标
            const symmetricPoint = {
                x: center.x - (curPoint.x - center.x),
                y: center.y - (curPoint.y - center.y),
            }
            function onDragEnd() {
                dragging = false;
                this.cursor = 'auto'
            }
            this.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', function(event)  {
                    if (dragging) {
                        const curPosition = {
                            x: event.data.global.x,
                            y: event.data.global.y,
                        }
                        const result  = calculateComponentPositionAndSize(_.name, container, curPosition,proportion, needLockProportion, {
                            center: center,
                            curPoint: curPoint,
                            symmetricPoint: symmetricPoint,
                        })
                        if (
                            !result
                        ) return
                        const {
                            newLTPoint,
                            newRTPoint,
                            newLBPoint,
                            newRBPoint,
                            newTPoint,
                            newBPoint,
                            newLPoint,
                            newRPoint,
                            newUBPoint
                        } = result
                        lt.update(newLTPoint)
                        rt.update(newRTPoint)
                        lb.update(newLBPoint)
                        rb.update(newRBPoint)
                        t.update(newTPoint)
                        b.update(newBPoint)
                        l.update(newLPoint)
                        r.update(newRPoint)
                        border.update([newLTPoint, newRTPoint, newRBPoint, newLBPoint, newLTPoint])
                        rotation.update(newUBPoint)
                    }
                })
        })
    })

    const dots = new Dots([lt, rt, lb, rb, t, b, l, r, rotation]);
    const selection = new Selection([border, dots]);
    selections.push(selection);

    app.stage.addChild(
        selection
    )

    container
        .on('pointerdown', function (event) {
            const diff = { x: event.data.global.x - this.x, y: event.data.global.y - this.y }
            const data = event.data;
            let dragging = true;
            selection.visible = true;
            function onDragEnd() {
                dragging = false;
            }
            this.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', function (event) {
                    if (dragging) {
                        const newPosition = data.getLocalPosition(container.parent);
                        const newCenterPoint = {x:newPosition.x - diff.x, y: newPosition.y - diff.y}
                        const result = calculateSurroundPoints(newCenterPoint, container);
                        if (
                            !result
                        ) return
                        const {
                            newLTPoint,
                            newRTPoint,
                            newLBPoint,
                            newRBPoint,
                            newTPoint,
                            newBPoint,
                            newLPoint,
                            newRPoint,
                            newUBPoint
                        } = result
                        lt.update(newLTPoint)
                        rt.update(newRTPoint)
                        lb.update(newLBPoint)
                        rb.update(newRBPoint)
                        t.update(newTPoint)
                        b.update(newBPoint)
                        l.update(newLPoint)
                        r.update(newRPoint)
                        border.update([newLTPoint, newRTPoint, newRBPoint, newLBPoint, newLTPoint])
                        rotation.update(newUBPoint)
                    }
                })
        })

}
export default function App(parent: HTMLElement, WORLD_WIDTH: number, WORLD_HEIGHT: number) {
    app = new PIXI.Application({backgroundColor: 0x000000, antialias:true,forceCanvas: false, resolution: 2});
    app.renderer.autoDensity = true;
    app.renderer.resize(WORLD_WIDTH, WORLD_HEIGHT)
    parent.replaceChild(app.view, parent.lastElementChild); // Hack for parcel HMR
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    let bg = new Background({
        width: app.screen.width,
        height: app.screen.height
    })
    const mask = new Mask([])
    bg.on('pointerdown', function(event){
        let dragging = true;
        const startPoint = {
            x: event.data.global.x,
            y: event.data.global.y
        }
        clearSelections();
        function onDragEnd() {
            dragging = false;
            mask.update([])
        }
        this.on('pointermove', function (event) {
            if (dragging) {
                const endPoint = {
                    x: event.data.global.x,
                    y: event.data.global.y
                }
                mask.update([startPoint, {x: endPoint.x, y: startPoint.y}, endPoint, {x: startPoint.x, y: endPoint.y}, startPoint])
            }
        }).on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
    });
    app.stage.addChild(bg);
    app.stage.addChild(mask);
    // object
    const params = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 100,
        y: 100,
        angle: 0,
        zIndex: 20,
    }
    const params1 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 400,
        y: 100,
        angle: 0,
        zIndex: 20,
    }
    const params2 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 0,
        y: 0,
        angle: 0,
        zIndex: 20,
    }
    const params3 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 600,
        y: 100,
        angle: 60,
        zIndex: 20,
        needLockProportion: true
    }
    const params4 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 100,
        y: 400,
        angle: 90,
        zIndex: 20,
    }
    const params5 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 400,
        y: 400,
        angle: 135,
        zIndex: 20,
    }
    const params6 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 600,
        y: 400,
        angle: 225,
        zIndex: 20,
    }
    const params7 = {
        url: "assets/mask.png",
        w: 200,
        h: 200,
        x: 200,
        y: 600,
        angle: 315,
        zIndex: 20,
    }
    setup(params);
    // setup(params1);
    // setup(params2);
    setup(params3);
    // setup(params4);
    // setup(params5);
    // setup(params6);
    // setup(params7);
}

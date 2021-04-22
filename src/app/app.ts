import * as PIXI from 'pixi.js-legacy';
import calculateComponentPositionAndSize, {calculateSurroundPoints} from "./calculateComponentPositionAndSize";
import {calculateRotatedAngle, calculateRotatedPointCoordinate,
    judeRectanglesCollision, mod360} from './translate';
import Dot from "./dot";
import Component from "./component";
import Border from "./border";
import Mask from "./mask";
import Background from "./background";
import Dots from "./dots";
import Selection from "./selection";
(window as any).PIXI = PIXI;

let app: PIXI.Application;
//选中元素
let selectedComponents: Component[] = [];
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
    selectedComponents.forEach(_ => {
        _.selection.visible = false;
    })
}
function setup(params){
    const object = new Component(params);
    selectedComponents.push(object);

    app.stage.addChild(object);

    const [
        newLTPoint,
        newRTPoint,
        newLBPoint,
        newRBPoint,
        newTPoint,
        newBPoint,
        newLPoint,
        newRPoint,
        newUBPoint
    ]= object.points
    const border = new Border([newLTPoint, newRTPoint, newRBPoint, newLBPoint])
    const rotation = new Dot(newUBPoint, 'rotation')
    rotation.on('pointerdown', function (event) {
        let dragging = true;
        const oldPoint = {
            x: event.data.global.x,
            y: event.data.global.y
        }
        const oldAngle = object.angle;
        let groupComponents: Component[] = [];
        if (object.typeName === 'group') {
            groupComponents = selectedComponents.filter(_ => _.pid === object.uuid);
        }

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
                    const newCenter = {
                        x: object.x,
                        y: object.y
                    }
                    const diffAngle = calculateRotatedAngle(oldPoint, newPoint, newCenter);
                    object.angle = oldAngle + diffAngle;
                    object.update();
                    // if (object.typeName === 'group') {
                    //     groupComponents.forEach(_ => {
                    //         // _.update(_.points.map(_ => calculateRotatedPointCoordinate(_, newCenter, diffAngle)))
                    //     })
                    // }
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
            data.curComponent = object;
            data.cursors = getCursor();
            this.cursor = data.cursors[_.name]
        }).on('pointerdown', function(event) {
            event.stopPropagation();
            let dragging = true;
            // 组件宽高比
            const proportion = object.proportion;

            // 是否需要等比例缩放
            const needLockProportion = object.needLockProportion;
            // 组件中心点
            const  center = {
                x: object.x,
                y: object.y
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
                       calculateComponentPositionAndSize(_.name, object, curPosition,proportion, needLockProportion, {
                            center: center,
                            curPoint: curPoint,
                            symmetricPoint: symmetricPoint,
                        })
                        object.update()
                    }
                })
        })
    })

    const dots = new Dots([lt, rt, lb, rb, t, b, l, r, rotation]);
    const selection = new Selection([border, dots]);
    object.selection = selection;
    object
        .on('pointerdown', function (event) {
            app.stage.addChild(selection);
            const startPoint = {
                x: event.data.global.x,
                y: event.data.global.y
            }
            const oldPoint = {
                x: object.x,
                y: object.y
            }
            let dragging = true;
            selection.visible = true;
            selection.border.visible = true;
            selection.dots.visible = true;
            let positionList: PIXI.IPointData[] = []
            let groupComponents: Component[] = [];
            if (object.typeName === 'group') {
                groupComponents = selectedComponents.filter(_ => _.pid === object.uuid)
                positionList = groupComponents.map(_ =>
                    {
                        return {
                            x: _.x,
                            y: _.y
                        }
                    }
                )
            }
            function onDragEnd() {
                dragging = false;
            }
            this.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', function (event) {
                    if (dragging) {
                        const endPoint = {
                            x: event.data.global.x,
                            y: event.data.global.y
                        }
                        const diff = {
                            x: endPoint.x - startPoint.x,
                            y: endPoint.y - startPoint.y
                        }
                        object.x = oldPoint.x + diff.x;
                        object.y = oldPoint.y + diff.y;
                        object.update();
                        if (object.typeName === 'group') {
                            groupComponents.forEach((_, i) => {
                                _.x = positionList[i].x + diff.x
                                _.y = positionList[i].y + diff.y
                                _.update();
                            })
                        }
                    }
                })
        })
        return {object, selection};
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
    const {object: group, selection: groupSelection} = setup({
        x: 0, y: 0, angle: 0, zIndex: 20, w: 0, h: 0, typeName: 'group', needLockProportion: false
    })
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
                // 顺时针取点
                let xMin, xMax, yMin, yMax;
                if (startPoint.x > endPoint.x) {
                    xMin = endPoint.x;
                    xMax = startPoint.x;
                } else {
                    xMin = startPoint.x;
                    xMax = endPoint.x;
                }
                if (startPoint.y > endPoint.y) {
                    yMin = endPoint.y;
                    yMax = startPoint.y;
                } else {
                    yMin = startPoint.y;
                    yMax = endPoint.y;
                }
                const maskPoints: PIXI.IPointData[] = [{x: xMin, y: yMin}, {x: xMax, y: yMin}, {x: xMax, y: yMax}, {x: xMin, y: yMax}]
                mask.update(maskPoints);
                const newSelectedComponents= selectedComponents.filter(_ => _.typeName !=='group').filter(({selection}) => {
                    const isCollision = judeRectanglesCollision(maskPoints, selection.border.points);
                    selection.border.visible = false;
                    selection.dots.visible = false;
                    return isCollision;
                })
                group.selection.visible = false;
                if (newSelectedComponents.length === 0) {
                    return;
                } else if (newSelectedComponents.length === 1) {
                    const selection = newSelectedComponents[0].selection;
                    selection.visible = true;
                    selection.border.visible = true;
                    selection.dots.visible = true;
                    app.stage.addChild(selection)
                } else {
                    // group.visible = true;
                    newSelectedComponents.forEach(_ => {
                        _.pid = group.uuid;
                        const {selection} = _;
                        selection.visible = true;
                        selection.border.visible = true;
                        selection.dots.visible = false;
                        app.stage.addChild(selection)
                    })
                    const pointList = newSelectedComponents.map(({selection}) => selection.border.points).reduce((previousValue, currentValue) => {
                       return previousValue.concat(currentValue)
                    },[]);
                    const pointXList = pointList.map(p => p.x)
                    const pointYList = pointList.map(p => p.y)
                    const xMin =  Math.min(...pointXList);
                    const xMax =  Math.max(...pointXList);
                    const yMin =  Math.min(...pointYList);
                    const yMax =  Math.max(...pointYList);
                    group.draw({
                        x: xMin, y: yMin, angle: 0, zIndex: 20, w: xMax - xMin, h: yMax - yMin, typeName: 'group', needLockProportion: false
                    })
                    group.update();
                    group.selection.visible = true;
                    group.selection.dots.visible = true;
                    app.stage.addChild(group);
                    app.stage.addChild(groupSelection);
                }
                app.stage.addChild(mask);
            }
        }).on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
    });
    app.stage.addChild(bg);
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

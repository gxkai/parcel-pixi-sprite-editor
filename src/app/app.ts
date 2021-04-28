import * as PIXI from 'pixi.js-legacy';
import calculateComponentPositionAndSize, {calculateSurroundPoints, getParams} from "./calculateComponentPositionAndSize";
import {
    angleToRadian, calculateLength, calculateRotatedAngle, calculateRotatedPointCoordinate,
    judeRectanglesCollision, mod360, mod90
} from './translate';
import Dot from "./dot";
import Component from "./component";
import Border from "./border";
import Mask from "./mask";
import Background from "./background";
import Dots from "./dots";
import Selection from "./selection";
import keyboardjs from "keyboardjs";
import Group from "./group";
(window as any).PIXI = PIXI;
// todo compose decompose
let app: PIXI.Application;
//选中元素
let selectedComponents: (Component | Group) [] = [];
//连续选中标记
let CAN_COMBINED = false;
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
// 清除选中
function clearSelections() {
    selectedComponents.forEach(_ => {
        _.selection.visible = false;
    });
    selectedComponents = [];
}
function createComponent(object: Component | Group){
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
            if (!CAN_COMBINED) {
                clearSelections();
            }
            !selectedComponents.some(_ => _.uuid === object.uuid) && selectedComponents.push(object);
            app.stage.addChild(selection);
            object.update();
            const startPoint = {
                x: event.data.global.x,
                y: event.data.global.y
            }
            const oldPoint = {
                x: object.x,
                y: object.y
            }
            let dragging = true;
            object.select();
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
                    }
                })
        })
        return object;
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
    bg.on('pointerdown', function(event){
        clearSelections();
    })
    app.stage.addChild(bg);
    // object
    const params = {
        url: "assets/mask.png",
        width: 200,
        height: 200,
        x: 100,
        y: 500,
        angle: 0,
        zIndex: 20,
    }
    const params3 = {
        url: "assets/mask.png",
        width: 200,
        height: 200,
        x: 100,
        y: 200,
        angle: 0,
        zIndex: 20,
    }
    const comp2 = createComponent(new Component(params3));
    const comp1 = createComponent(new Component(params));
    app.stage.addChild(comp2)
    app.stage.addChild(comp1)
    keyboardjs.bind(
        "shift",
        e => {
            CAN_COMBINED = true;
        },
        e => {
            CAN_COMBINED = false;
        }
    );
    keyboardjs.bind(
        "ctrl",
        e => {
            CAN_COMBINED = true;
        },
        e => {
            CAN_COMBINED = false;
        }
    );
    keyboardjs.bind("del", e => {

    });
    keyboardjs.bind("ctrl + z", e => {

    });
    keyboardjs.bind("ctrl + y", e => {

    });
    [
        "left",
        "right",
        "up",
        "down",
        "alt + left",
        "alt + right"
    ].forEach(e => {
        keyboardjs.bind(e, () => {

        });
    });
    keyboardjs.bind("alt + g", e => {

    });
    let compose;
    // compose
    keyboardjs.bind("ctrl + g", e => {
        if (selectedComponents.length > 1) {
            const components = []
            selectedComponents.forEach(sc => {
                if (sc.typeName === 'component') {
                    sc.selection.destroy({children: true});
                    app.stage.removeChild(sc.selection);
                    components.push(sc);
                }
                // 先对已经compose的decompose
                if (sc.typeName === 'group') {
                    sc.children.forEach((_: Component) => {
                        components.push(new Component(getParams(_, sc)))
                    })
                    compose.selection.destroy()
                    compose.destroy();
                    app.stage.removeChild(compose.selection)
                    app.stage.removeChild(compose)
                }
            })
            selectedComponents = [];
            compose = createComponent(new Group({
                components,
                needLockProportion: components.some(_ => _.needLockProportion)
            }))
            compose.update();
            compose.select();
            app.stage.addChild(compose)
            app.stage.addChild(compose.selection)
        }
    });
    // decompose fix 反复compose decompose  bug
    keyboardjs.bind("ctrl + shift + g", e => {
        selectedComponents = [];
        compose.children.forEach(_ => {
            app.stage.addChild(createComponent(
                new Component(getParams(_, compose))
            ));
        })
        compose.selection.destroy()
        compose.destroy();
        app.stage.removeChild(compose.selection)
        app.stage.removeChild(compose)
    })
}




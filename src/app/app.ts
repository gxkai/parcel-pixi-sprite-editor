import * as PIXI from 'pixi.js-legacy';
import calculateComponentPositionAndSize from "./calculateComponentPositionAndSize";
import {calculateRotatedPointCoordinate, mod360} from './translate';
import Dot from "./dot";
(window as any).PIXI = PIXI;

let app: PIXI.Application;
//矩形框
let rects = [];
//当前操作小物件容器
let activeContainer = null;
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
// 旋转角度
function angle(x0, y0, x1, y1) {
    const diff_x = Math.abs(x1 - x0),
        diff_y = Math.abs(y1 - y0);
    let cita;
    if (x1 > x0) {
        if (y1 > y0) {
            cita = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
        } else {
            if (y1 < y0) {
                cita = -360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
            } else {
                cita = 0;
            }
        }
    } else {
        if (x1 < x0) {
            if (y1 > y0) {
                cita = 180 - 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
            } else {
                if (y1 < y0) {
                    cita = 180 + 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
                } else {
                    cita = 180;
                }
            }
        } else {
            if (y1 > y0) {
                cita = 90;
            } else {
                if (y1 < y0) {
                    cita = -90;
                } else {
                    cita = 0;
                }
            }
        }
    }
    return cita;
}
// 绘制虚线
function drawDash(x0, y0, x1, y1, linewidth) {
    const dashed = new PIXI.Graphics();
    dashed.lineStyle(1, 0x59e3e8, 1); // linewidth,color,alpha
    dashed.moveTo(0, 0);
    dashed.lineTo(linewidth, 0);
    dashed.moveTo(linewidth * 1.5, 0);
    dashed.lineTo(linewidth * 2.5, 0);
    const dashedtexture = dashed.generateCanvasTexture(1, 1);
    const linelength = Math.pow(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2), 0.5);
    const tilingSprite = new PIXI.TilingSprite(dashedtexture, linelength, linewidth);
    tilingSprite.x = x0;
    tilingSprite.y = y0;
    tilingSprite.rotation = angle(x0, y0, x1, y1) * Math.PI / 180;
    tilingSprite.pivot.set(linewidth / 2, linewidth / 2);
    return tilingSprite;
}
// 绘制虚线矩形
function drawRect(x,y,width,height,linewidth){
    const rect = new PIXI.Container();

    const top = drawDash(x, y, x + width, y, linewidth); //top border
    const bottom = drawDash(x, y + height, x + width, y + height, linewidth);//bottom border
    const left = drawDash(x, y, x, y + height, linewidth); //left border
    const right = drawDash(x + width, y, x + width, y + height, linewidth); //right border
    rect.addChild(top);
    rect.addChild(bottom);
    rect.addChild(left);
    rect.addChild(right);

    return rect;
}
// 绘制dot
function drawDot(x, y) {
    const dot = new PIXI.Graphics();
    dot.beginFill(0xffffff)
    dot.drawCircle(x, y, 10);
    dot.endFill()
    return dot;
}
// 绘制dots
function drawDots(container: PIXI.Container, x, y, width, height) {
    const dots = new PIXI.Container();
    const lt = drawDot(x, y);
    const rt = drawDot(x+ width, y);
    const lb = drawDot(x, y + height);
    const rb = drawDot(x+width, y + height);
    dots.addChild(lt)
    dots.addChild(rt)
    dots.addChild(lb)
    dots.addChild(rb)

    lt.interactive = true;
    lt.on('pointerover', function (event) {
        data.curComponent = container;
        data.cursors = getCursor();
        this.cursor = data.cursors['lt']
    }).on('pointerdown', function(event) {
        event.stopPropagation();
        // this.oldPosition = event.data.getLocalPosition(this.parent);
        // this.containerW = container.width
        // this.containerH = container.height
        // this.containerX = container.x
        // this.containerY = container.y
        this.dragging = true;

        // 组件中心点
        this.center = {
            x: container.x,
            y: container.y
        }
        // 当前点击坐标
        this.curPoint = {
            x: this.getGlobalPosition().x,
            y: this.getGlobalPosition().y
        }
        // 获取对称点的坐标
        this.symmetricPoint = {
            x: this.center.x - (this.curPoint.x - this.center.x),
            y: this.center.y - (this.curPoint.y - this.center.y),
        }

    }).on('pointerup', function(event)  {
        this.dragging = false;
    })
        .on('pointerupoutside', function(event)  {
            this.dragging = false;
        } )
        .on('pointermove', function(event)  {
            if (this.dragging) {
                // const newPosition = event.data.getLocalPosition(this.parent);
                // const diffX = newPosition.x - this.oldPosition.x;
                // const diffY = newPosition.y - this.oldPosition.y;
                // container.width = this.containerW - diffX;
                // container.height = this.containerH - diffY;
                // container.x = this.containerX + diffX/2;
                // container.y = this.containerY + diffY/2;
                const curPosition = {
                    x: event.data.global.x,
                    y: event.data.global.y,
                }
                calculateComponentPositionAndSize('lt', container, curPosition,{
                    center: this.center,
                    curPoint: this.curPoint,
                    symmetricPoint: this.symmetricPoint,
                })
            }
        })

    // rt.cursor = "ne-resize"
    // rt.interactive = true;
    // rt.on('pointerdown', function(event) {
    //     event.stopPropagation();
    //     this.oldPosition = event.data.getLocalPosition(this.parent);
    //     this.containerW = container.width
    //     this.containerH = container.height
    //     this.containerX = container.x
    //     this.containerY = container.y
    //     this.dragging = true;
    // }).on('pointerup', function(event)  {
    //     this.dragging = false;
    // })
    //     .on('pointerupoutside', function(event)  {
    //         this.dragging = false;
    //     } )
    //     .on('pointermove', function(event)  {
    //         if (this.dragging) {
    //             const newPosition = event.data.getLocalPosition(this.parent);
    //             const diffX = newPosition.x - this.oldPosition.x;
    //             const diffY = newPosition.y - this.oldPosition.y;
    //             container.width = this.containerW + diffX;
    //             container.height = this.containerH - diffY;
    //             container.x = this.containerX + diffX/2;
    //             container.y = this.containerY + diffY/2;
    //         }
    //     })
    //
    //
    // lb.cursor = "sw-resize"
    // lb.interactive = true;
    // lb.on('pointerdown', function(event) {
    //     event.stopPropagation();
    //     this.oldPosition = event.data.getLocalPosition(this.parent);
    //     this.containerW = container.width
    //     this.containerH = container.height
    //     this.containerX = container.x
    //     this.containerY = container.y
    //     this.dragging = true;
    // }).on('pointerup', function(event)  {
    //     this.dragging = false;
    // })
    //     .on('pointerupoutside', function(event)  {
    //         this.dragging = false;
    //     } )
    //     .on('pointermove', function(event)  {
    //         if (this.dragging) {
    //             const newPosition = event.data.getLocalPosition(this.parent);
    //             const diffX = newPosition.x - this.oldPosition.x;
    //             const diffY = newPosition.y - this.oldPosition.y;
    //             container.width = this.containerW - diffX;
    //             container.height = this.containerH + diffY;
    //             container.x = this.containerX + diffX/2;
    //             container.y = this.containerY + diffY/2;
    //         }
    //     })
    //
    // rb.cursor = "se-resize"
    // rb.interactive = true;
    // rb.on('pointerdown', function(event) {
    //     event.stopPropagation();
    //     this.oldPosition = event.data.getLocalPosition(this.parent);
    //     this.containerW = container.width
    //     this.containerH = container.height
    //     this.containerX = container.x
    //     this.containerY = container.y
    //     this.dragging = true;
    // }).on('pointerup', function(event)  {
    //     this.dragging = false;
    // })
    //     .on('pointerupoutside', function(event)  {
    //         this.dragging = false;
    //     } )
    //     .on('pointermove', function(event)  {
    //         if (this.dragging) {
    //             const newPosition = event.data.getLocalPosition(this.parent);
    //             const diffX = newPosition.x - this.oldPosition.x;
    //             const diffY = newPosition.y - this.oldPosition.y;
    //             container.width = this.containerW + diffX;
    //             container.height = this.containerH + diffY;
    //             container.x = this.containerX + diffX/2;
    //             container.y = this.containerY + diffY/2;
    //         }
    //     })

    return dots;
}

//清除矩形框
function clearRects(){
    rects.forEach(function(item,index){
        item.visible = false
    });
}
function onObjectDragStart(event){
    this.diff = { x: event.data.global.x - this.x, y: event.data.global.y - this.y }
    this.data = event.data;
    this.dragging = true;
    //显示虚线矩形框
    this.children[0].visible = true
    activeContainer = this;
}
function onDragEnd() {
    this.dragging = false;
    this.data = null;
}
function onObjectDragMove(){
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - this.diff.x;
        this.y = newPosition.y - this.diff.y;
    }
}
function setup(params){
    const {x, y, angle, zIndex, url, w, h} = params
    const object = PIXI.Sprite.from(url);
    object.width = w;
    object.height = h;
    //=============
    // object.x = x + object.width / 2;
    // object.y = y + object.height / 2;
    object.x = x  + object.width / 2;
    object.y = y + object.height / 2;
    object.anchor.set(0.5)

    // object.pivot.x = object.width / 2;
    // object.pivot.y = object.height / 2;
    object.interactive = true;
    object.buttonMode = true;
    object.zIndex = zIndex;
    object.angle = angle;
    app.stage.addChild(object);

    const container = object;
    //=============


    // const container = new PIXI.Container();
    // container.interactive = true;
    // container.buttonMode = true;
    // container.zIndex = zIndex;
    const rect = drawRect(object.getGlobalPosition().x, object.getGlobalPosition().y, object.width , object.height, 1);
    rect.interactive = true;
    rect.buttonMode = true;
    rect.visible = true;

    rects.push(rect);

    // const dots = drawDots(container ,object.getGlobalPosition().x, object.getGlobalPosition().y , object.width , object.height);


    // container.addChild(rect);
    // container.addChild(object);
    // container.addChild(dots)
    //
    // container.x = x + container.width / 2;
    // container.y = y + container.height / 2;
    //
    // container.pivot.x = container.width / 2;
    // container.pivot.y = container.height / 2;
    // container.angle = angle;
    // app.stage.addChild(container);

    // container
    //     .on('pointerdown', onObjectDragStart)
    //     .on('pointerup', onDragEnd)
    //     .on('pointerupoutside', onDragEnd)
    //     .on('pointermove', onObjectDragMove)

    const dots = new PIXI.Container();
    const lt = new Dot(calculateRotatedPointCoordinate({x, y}
    , {x: x + object.width/2, y: y + object.height/2}, angle
    ));
    const rt = new Dot(calculateRotatedPointCoordinate({
        x: x + object.width,
        y: y,
    }, {x: x + object.width/2, y: y + object.height/2}, angle));
    const lb = new Dot(calculateRotatedPointCoordinate({
        x: x,
        y: y + object.height,
    }, {x: x + object.width/2, y: y + object.height/2}, angle));
    const rb = new Dot(calculateRotatedPointCoordinate({
        x: x + object.width,
        y: y + object.height,
    }, {x: x + object.width/2, y: y + object.height/2}, angle));
    lt.interactive = true;
    lt.on('pointerover', function (event) {
        data.curComponent = container;
        data.cursors = getCursor();
        this.cursor = data.cursors['lt']
    }).on('pointerdown', function(event) {
        event.stopPropagation();
        // this.oldPosition = event.data.getLocalPosition(this.parent);
        // this.containerW = container.width
        // this.containerH = container.height
        // this.containerX = container.x
        // this.containerY = container.y
        this.dragging = true;
        // 组件中心点
        this.center = {
            x: container.x,
            y: container.y
        }
        // 当前点击坐标
        this.curPoint = {
            x: event.data.global.x,
            y: event.data.global.y
        }
        // 获取对称点的坐标
        this.symmetricPoint = {
            x: this.center.x - (this.curPoint.x - this.center.x),
            y: this.center.y - (this.curPoint.y - this.center.y),
        }
    }).on('pointerup', function(event)  {
        this.dragging = false;
    })
        .on('pointerupoutside', function(event)  {
            this.dragging = false;
        } )
        .on('pointermove', function(event)  {
            if (this.dragging) {
                const curPosition = {
                    x: event.data.global.x,
                    y: event.data.global.y,
                }
                const {
                    newTopLeftPoint,
                    newTopRightPoint,
                    newBottomLeftPoint,
                    newBottomRightPoint,
                }  = calculateComponentPositionAndSize('lt', container, curPosition,{
                    center: this.center,
                    curPoint: this.curPoint,
                    symmetricPoint: this.symmetricPoint,
                })
                lt.update(newTopLeftPoint)
                rt.update(newTopRightPoint)
                lb.update(newBottomLeftPoint)
                rb.update(newBottomRightPoint)
            }
        })
    dots.addChild(lt)

    dots.addChild(rt)

    dots.addChild(lb)

    dots.addChild(rb)

    app.stage.addChild(
        dots
    )

}
export default function App(parent: HTMLElement, WORLD_WIDTH: number, WORLD_HEIGHT: number) {
    app = new PIXI.Application({backgroundColor: 0x000000, antialias:true,forceCanvas: true, resolution: 2});
    app.renderer.autoDensity = true;
    app.renderer.resize(WORLD_WIDTH, WORLD_HEIGHT)
    parent.replaceChild(app.view, parent.lastElementChild); // Hack for parcel HMR
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
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
    // setup(params);
    // setup(params1);
    setup(params2);
    setup(params3);
    // setup(params4);
    // setup(params5);
    // setup(params6);
    // setup(params7);
}

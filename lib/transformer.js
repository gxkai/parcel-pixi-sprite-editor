"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("./component");
var group_1 = require("./group");
var border_1 = require("./border");
var dot_1 = require("./dot");
var translate_1 = require("./translate");
var calculateComponentPositionAndSize_1 = require("./calculateComponentPositionAndSize");
var dots_1 = require("./dots");
var selection_1 = require("./selection");
var PIXI = require("pixi.js-legacy");
var keyboardjs = require("keyboardjs");
var background_1 = require("./background");
//选中元素
var selectedComponents = [];
//连续选中标记
var CAN_COMBINED = false;
//
var data = {
    pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'],
    initialAngle: {
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315,
    },
    angleToCursor: [
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
};
// 获取光标样式
function getCursor() {
    var angleToCursor = data.angleToCursor, initialAngle = data.initialAngle, pointList = data.pointList, curComponent = data.curComponent;
    var rotate = translate_1.mod360(curComponent.angle); // 取余 360
    var result = {};
    var lastMatchIndex = -1; // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度
    pointList.forEach(function (point) {
        var angle = translate_1.mod360(initialAngle[point] + rotate);
        var len = angleToCursor.length;
        while (true) {
            lastMatchIndex = (lastMatchIndex + 1) % len;
            var angleLimit = angleToCursor[lastMatchIndex];
            if (angle < 23 || angle >= 338) {
                result[point] = 'nw-resize';
                return;
            }
            if (angleLimit.start <= angle && angle < angleLimit.end) {
                result[point] = angleLimit.cursor + '-resize';
                return;
            }
        }
    });
    return result;
}
var Transformer = /** @class */ (function () {
    function Transformer(object, app) {
        var bg = new background_1.default({
            width: app.screen.width,
            height: app.screen.height
        });
        bg.on('pointerdown', function (event) {
            Transformer.clearSelections();
        });
        app.stage.addChild(bg);
        this.object = object;
        this.app = app;
        var _a = __read(object.points, 9), newLTPoint = _a[0], newRTPoint = _a[1], newLBPoint = _a[2], newRBPoint = _a[3], newTPoint = _a[4], newBPoint = _a[5], newLPoint = _a[6], newRPoint = _a[7], newUBPoint = _a[8];
        var border = new border_1.default([newLTPoint, newRTPoint, newRBPoint, newLBPoint]);
        var rotation = new dot_1.default(newUBPoint, 'rotation');
        rotation.on('pointerdown', function (event) {
            var dragging = true;
            var oldPoint = {
                x: event.data.global.x,
                y: event.data.global.y
            };
            var oldAngle = object.angle;
            function onDragEnd() {
                dragging = false;
            }
            this.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', function (event) {
                if (dragging) {
                    var newPoint = {
                        x: event.data.global.x,
                        y: event.data.global.y
                    };
                    var newCenter = {
                        x: object.x,
                        y: object.y
                    };
                    var diffAngle = translate_1.calculateRotatedAngle(oldPoint, newPoint, newCenter);
                    object.angle = oldAngle + diffAngle;
                    object.update();
                }
            });
        });
        var lt = new dot_1.default(newLTPoint, 'lt');
        var rt = new dot_1.default(newRTPoint, 'rt');
        var lb = new dot_1.default(newLBPoint, 'lb');
        var rb = new dot_1.default(newRBPoint, 'rb');
        var t = new dot_1.default(newTPoint, 't');
        var b = new dot_1.default(newBPoint, 'b');
        var l = new dot_1.default(newLPoint, 'l');
        var r = new dot_1.default(newRPoint, 'r');
        [lt, rt, lb, rb, t, b, l, r].forEach(function (_) {
            _.on('pointerover', function (event) {
                data.curComponent = object;
                data.cursors = getCursor();
                this.cursor = data.cursors[_.name];
            }).on('pointerdown', function (event) {
                event.stopPropagation();
                var dragging = true;
                // 组件宽高比
                var proportion = object.proportion;
                // 是否需要等比例缩放
                var needLockProportion = object.needLockProportion;
                // 组件中心点
                var center = {
                    x: object.x,
                    y: object.y
                };
                // 当前点击坐标
                var curPoint = {
                    x: event.data.global.x,
                    y: event.data.global.y
                };
                // 获取对称点的坐标
                var symmetricPoint = {
                    x: center.x - (curPoint.x - center.x),
                    y: center.y - (curPoint.y - center.y),
                };
                function onDragEnd() {
                    dragging = false;
                    this.cursor = 'auto';
                }
                this.on('pointerup', onDragEnd)
                    .on('pointerupoutside', onDragEnd)
                    .on('pointermove', function (event) {
                    if (dragging) {
                        var curPosition = {
                            x: event.data.global.x,
                            y: event.data.global.y,
                        };
                        calculateComponentPositionAndSize_1.default(_.name, object, curPosition, proportion, needLockProportion, {
                            center: center,
                            curPoint: curPoint,
                            symmetricPoint: symmetricPoint,
                        });
                        object.update();
                    }
                });
            });
        });
        var dots = new dots_1.default([lt, rt, lb, rb, t, b, l, r, rotation]);
        var selection = new selection_1.default([border, dots]);
        object.selection = selection;
        selection.visible = false;
        app.stage.addChild(selection);
        object
            .on('pointerdown', function (event) {
            if (!CAN_COMBINED) {
                Transformer.clearSelections();
            }
            !selectedComponents.some(function (_) { return _.uuid === object.uuid; }) && selectedComponents.push(object);
            app.stage.addChild(selection);
            object.update();
            var startPoint = {
                x: event.data.global.x,
                y: event.data.global.y
            };
            var oldPoint = {
                x: object.x,
                y: object.y
            };
            var dragging = true;
            object.select();
            function onDragEnd() {
                dragging = false;
            }
            this.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', function (event) {
                if (dragging) {
                    var endPoint = {
                        x: event.data.global.x,
                        y: event.data.global.y
                    };
                    var diff = {
                        x: endPoint.x - startPoint.x,
                        y: endPoint.y - startPoint.y
                    };
                    object.x = oldPoint.x + diff.x;
                    object.y = oldPoint.y + diff.y;
                    object.update();
                }
            });
        });
        this.bindShotcuts();
    }
    Transformer.prototype.bindShotcuts = function () {
        var app = this.app;
        keyboardjs.bind("shift", function (e) {
            CAN_COMBINED = true;
        }, function (e) {
            CAN_COMBINED = false;
        });
        keyboardjs.bind("ctrl", function (e) {
            CAN_COMBINED = true;
        }, function (e) {
            CAN_COMBINED = false;
        });
        keyboardjs.bind("del", function (e) {
        });
        keyboardjs.bind("ctrl + z", function (e) {
        });
        keyboardjs.bind("ctrl + y", function (e) {
        });
        [
            "left",
            "right",
            "up",
            "down",
            "alt + left",
            "alt + right"
        ].forEach(function (e) {
            keyboardjs.bind(e, function () {
            });
        });
        keyboardjs.bind("alt + g", function (e) {
        });
        var compose;
        // compose
        keyboardjs.bind("ctrl + g", function (e) {
            var selectedComponents = Transformer.selectedComponents;
            if (selectedComponents.length > 1) {
                var components_1 = [];
                selectedComponents.forEach(function (sc) {
                    if (sc.typeName === 'component') {
                        sc.selection.destroy({ children: true });
                        app.stage.removeChild(sc.selection);
                        components_1.push(sc);
                    }
                    // 先对已经compose的decompose
                    if (sc.typeName === 'group') {
                        sc.children.forEach(function (_) {
                            components_1.push(new component_1.default(calculateComponentPositionAndSize_1.getParams(_, sc)));
                        });
                        compose.selection.destroy();
                        compose.destroy();
                        app.stage.removeChild(compose.selection);
                        app.stage.removeChild(compose);
                    }
                });
                Transformer.clearSelections();
                compose = new Transformer(new group_1.default({
                    components: components_1,
                    needLockProportion: components_1.some(function (_) { return _.needLockProportion; })
                }), app).object;
                compose.update();
                compose.select();
                app.stage.addChild(compose);
                app.stage.addChild(compose.selection);
            }
        });
        // decompose fix 反复compose decompose  bug
        keyboardjs.bind("ctrl + shift + g", function (e) {
            Transformer.clearSelections();
            compose.children.forEach(function (_) {
                app.stage.addChild(new Transformer(new component_1.default(calculateComponentPositionAndSize_1.getParams(_, compose)), app).object);
            });
            compose.selection.destroy();
            compose.destroy();
            app.stage.removeChild(compose.selection);
            app.stage.removeChild(compose);
        });
    };
    Transformer.clearSelections = function () {
        selectedComponents.forEach(function (_) {
            _.selection.visible = false;
        });
        selectedComponents = [];
    };
    Object.defineProperty(Transformer, "selectedComponents", {
        get: function () {
            return selectedComponents;
        },
        enumerable: false,
        configurable: true
    });
    return Transformer;
}());
exports.default = Transformer;

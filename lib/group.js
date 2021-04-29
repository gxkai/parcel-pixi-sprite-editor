"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js-legacy");
var calculateComponentPositionAndSize_1 = require("./calculateComponentPositionAndSize");
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(params) {
        var _this = _super.call(this) || this;
        var needLockProportion = params.needLockProportion, components = params.components;
        _this.components = components;
        components.forEach(function (_, i) {
            _.interactive = false;
            _this.addChild(_);
        });
        var pointList = components.map(function (_) {
            var vertexData = _.vertexData;
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
        }).reduce(function (previousValue, currentValue) {
            return previousValue.concat(currentValue);
        }, []);
        var pointXList = pointList.map(function (p) { return p.x; });
        var pointYList = pointList.map(function (p) { return p.y; });
        var xMin = Math.min.apply(Math, __spread(pointXList));
        var xMax = Math.max.apply(Math, __spread(pointXList));
        var yMin = Math.min.apply(Math, __spread(pointYList));
        var yMax = Math.max.apply(Math, __spread(pointYList));
        _this.interactive = true;
        _this.buttonMode = true;
        _this.hitArea = new PIXI.Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
        _this.pivot.x = (xMin + xMax) / 2;
        _this.pivot.y = (yMin + yMax) / 2;
        _this.position.set(_this.pivot.x, _this.pivot.y);
        _this.angle = 0;
        _this.zIndex = 9999;
        _this.typeName = 'group';
        _this.needLockProportion = !!needLockProportion;
        return _this;
    }
    Group.prototype.update = function (points) {
        if (points === void 0) { points = this.points; }
        this.selection.update(points);
    };
    Object.defineProperty(Group.prototype, "proportion", {
        get: function () {
            return this.width / this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "points", {
        get: function () {
            var _a = this.getBounds(), left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
            return calculateComponentPositionAndSize_1.calculateSurroundPoints({
                x: (left + right) / 2,
                y: (top + bottom) / 2
            }, this);
        },
        enumerable: false,
        configurable: true
    });
    Group.prototype.select = function () {
        this.selection.visible = true;
        this.selection.border.visible = true;
        this.selection.dots.visible = true;
        this.selection.dots.dots.forEach(function (_, i, array) {
            _.visible = i === array.length - 1;
        });
    };
    return Group;
}(PIXI.Container));
exports.default = Group;

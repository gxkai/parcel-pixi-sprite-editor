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
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js-legacy");
var uuid_1 = require("uuid");
var calculateComponentPositionAndSize_1 = require("./calculateComponentPositionAndSize");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(params) {
        var _this = _super.call(this, PIXI.Texture.from(params.url)) || this;
        _this.name = 'component';
        _this.uuid = params.uuid || uuid_1.v4();
        _this.url = params.url;
        _this.pid = params.pid;
        _this.draw(params);
        return _this;
    }
    Component.prototype.draw = function (params) {
        var x = params.x, y = params.y, angle = params.angle, zIndex = params.zIndex, width = params.width, height = params.height, needLockProportion = params.needLockProportion;
        this.width = width;
        this.height = height;
        this.x = x + this.width / 2;
        this.y = y + this.height / 2;
        this.anchor.set(0.5);
        this.interactive = true;
        this.buttonMode = true;
        this.zIndex = zIndex;
        this.angle = angle;
        this.typeName = 'component';
        this.needLockProportion = !!needLockProportion;
        this.tint = 0x00ffff;
    };
    Component.prototype.update = function (points) {
        if (points === void 0) { points = this.points; }
        this.selection.update(points);
    };
    Object.defineProperty(Component.prototype, "proportion", {
        get: function () {
            return this.width / this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "points", {
        get: function () {
            return calculateComponentPositionAndSize_1.calculateSurroundPoints({
                x: this.x,
                y: this.y
            }, this);
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.select = function () {
        this.selection.visible = true;
        this.selection.border.visible = true;
        this.selection.dots.visible = true;
    };
    return Component;
}(PIXI.Sprite));
exports.default = Component;

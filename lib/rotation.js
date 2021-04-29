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
var Rotation = /** @class */ (function (_super) {
    __extends(Rotation, _super);
    function Rotation(point, container) {
        var _this = _super.call(this) || this;
        _this.update(point, container);
        return _this;
    }
    Rotation.prototype.update = function (point, container) {
        var x = point.x, y = point.y;
        this.clear();
        this.interactive = true;
        this.buttonMode = true;
        this.lineStyle(10, 0x66CCFF, 1);
        var radian = container.angle * Math.PI / 180;
        this.arc(x, y - 10, 84, Math.PI / 3 + radian, Math.PI * 2 / 3 + radian, false);
    };
    return Rotation;
}(PIXI.Graphics));
exports.default = Rotation;

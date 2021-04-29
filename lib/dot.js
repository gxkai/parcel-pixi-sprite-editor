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
var Dot = /** @class */ (function (_super) {
    __extends(Dot, _super);
    function Dot(point, name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.update(point);
        return _this;
    }
    Dot.prototype.update = function (point) {
        this.clear();
        this.interactive = true;
        this.beginFill(0xffffff);
        this.drawCircle(point.x, point.y, 10);
        this.endFill();
    };
    return Dot;
}(PIXI.Graphics));
exports.default = Dot;

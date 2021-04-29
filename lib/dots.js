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
var Dots = /** @class */ (function (_super) {
    __extends(Dots, _super);
    function Dots(dots) {
        var _this = _super.call(this) || this;
        _this.name = 'dots';
        dots.forEach(function (_) {
            _this.addChild(_);
        });
        _this.dots = dots;
        return _this;
    }
    Dots.prototype.update = function (points) {
        this.dots.forEach(function (_, i) {
            _.update(points[i]);
        });
    };
    return Dots;
}(PIXI.Container));
exports.default = Dots;

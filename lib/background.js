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
var Background = /** @class */ (function (_super) {
    __extends(Background, _super);
    function Background(params) {
        var _this = _super.call(this, PIXI.Texture.WHITE) || this;
        _this.name = 'background';
        _this.draw(params);
        return _this;
    }
    Background.prototype.draw = function (params) {
        this.width = params.width;
        this.height = params.height;
        this.tint = 0x000000;
        this.interactive = true;
    };
    return Background;
}(PIXI.Sprite));
exports.default = Background;

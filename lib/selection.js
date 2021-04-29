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
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js-legacy");
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    function Selection(objects) {
        var _this = _super.call(this) || this;
        _this.name = 'selection';
        objects.forEach(function (_) {
            _this.addChild(_);
        });
        return _this;
    }
    Selection.prototype.update = function (points) {
        var _a = __read(points, 9), newLTPoint = _a[0], newRTPoint = _a[1], newLBPoint = _a[2], newRBPoint = _a[3], newTPoint = _a[4], newBPoint = _a[5], newLPoint = _a[6], newRPoint = _a[7], newUBPoint = _a[8];
        this.dots.update([newLTPoint,
            newRTPoint,
            newLBPoint,
            newRBPoint,
            newTPoint,
            newBPoint,
            newLPoint,
            newRPoint,
            newUBPoint]);
        this.border.update([
            newLTPoint,
            newRTPoint,
            newRBPoint,
            newLBPoint,
        ]);
    };
    Object.defineProperty(Selection.prototype, "dots", {
        get: function () {
            var dots = this.children.find(function (q) { return q.name === 'dots'; });
            return dots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "border", {
        get: function () {
            var border = this.children.find(function (q) { return q.name === 'border'; });
            return border;
        },
        enumerable: false,
        configurable: true
    });
    return Selection;
}(PIXI.Container));
exports.default = Selection;

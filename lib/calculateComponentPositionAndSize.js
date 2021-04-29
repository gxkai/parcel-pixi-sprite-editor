"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSurroundPoints = exports.getParams = void 0;
var translate_1 = require("./translate");
var funcs = {
    lt: calculateLeftTop,
    t: calculateTop,
    rt: calculateRightTop,
    r: calculateRight,
    rb: calculateRightBottom,
    b: calculateBottom,
    lb: calculateLeftBottom,
    l: calculateLeft,
};
// 获取两个数之间的随机数
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// 获取组件参数
function getParams(_, compose) {
    var angle = translate_1.mod360(_.angle + compose.angle);
    var vertexData = _.vertexData;
    var p1 = {
        x: vertexData[0],
        y: vertexData[1],
    };
    var p2 = {
        x: vertexData[2],
        y: vertexData[3]
    };
    var p3 = {
        x: vertexData[4],
        y: vertexData[5]
    };
    var newCenter = {
        x: (p1.x + p3.x) / 2,
        y: (p1.y + p3.y) / 2
    };
    var newP1 = translate_1.calculateRotatedPointCoordinate(p1, newCenter, -angle);
    var newW = translate_1.calculateLength([p1, p2]);
    var newH = translate_1.calculateLength([p2, p3]);
    return {
        x: newP1.x,
        y: newP1.y,
        width: newW,
        height: newH,
        angle: angle,
        zIndex: _.zIndex,
        needLockProportion: _.needLockProportion,
        url: _.url
    };
}
exports.getParams = getParams;
// 计算周围点位置
function calculateSurroundPoints(newCenterPoint, container) {
    var LTPoint = {
        x: newCenterPoint.x - container.width / 2,
        y: newCenterPoint.y - container.height / 2,
    };
    var RTPoint = {
        x: newCenterPoint.x + container.width / 2,
        y: newCenterPoint.y - container.height / 2
    };
    var RBPoint = {
        x: newCenterPoint.x + container.width / 2,
        y: newCenterPoint.y + container.height / 2
    };
    var LBPoint = {
        x: newCenterPoint.x - container.width / 2,
        y: newCenterPoint.y + container.height / 2
    };
    var TPoint = {
        x: (LTPoint.x + RTPoint.x) / 2,
        y: (LTPoint.y + RTPoint.y) / 2
    };
    var BPoint = {
        x: (LBPoint.x + RBPoint.x) / 2,
        y: (LBPoint.y + RBPoint.y) / 2
    };
    var LPoint = {
        x: (LTPoint.x + LBPoint.x) / 2,
        y: (LTPoint.y + LBPoint.y) / 2
    };
    var RPoint = {
        x: (RTPoint.x + RBPoint.x) / 2,
        y: (RTPoint.y + RBPoint.y) / 2
    };
    var newLTPoint = translate_1.calculateRotatedPointCoordinate(LTPoint, newCenterPoint, container.angle);
    var newRTPoint = translate_1.calculateRotatedPointCoordinate(RTPoint, newCenterPoint, container.angle);
    var newLBPoint = translate_1.calculateRotatedPointCoordinate(LBPoint, newCenterPoint, container.angle);
    var newRBPoint = translate_1.calculateRotatedPointCoordinate(RBPoint, newCenterPoint, container.angle);
    var newTPoint = translate_1.calculateRotatedPointCoordinate(TPoint, newCenterPoint, container.angle);
    var newBPoint = translate_1.calculateRotatedPointCoordinate(BPoint, newCenterPoint, container.angle);
    var newLPoint = translate_1.calculateRotatedPointCoordinate(LPoint, newCenterPoint, container.angle);
    var newRPoint = translate_1.calculateRotatedPointCoordinate(RPoint, newCenterPoint, container.angle);
    var newUBPoint = translate_1.calculateRotatedPointCoordinate({
        x: BPoint.x,
        y: BPoint.y + 50
    }, newCenterPoint, container.angle);
    return [newLTPoint, newRTPoint, newLBPoint, newRBPoint, newTPoint, newBPoint, newLPoint, newRPoint, newUBPoint];
}
exports.calculateSurroundPoints = calculateSurroundPoints;
function calculateLeftTop(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint;
    var newCenterPoint = translate_1.getCenterPoint(curPosition, symmetricPoint);
    var newLTPoint = translate_1.calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle);
    var newRBPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
    var newWidth = newRBPoint.x - newLTPoint.x;
    var newHeight = newRBPoint.y - newLTPoint.y;
    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newLTPoint.x += Math.abs(newWidth - newHeight * proportion);
            newWidth = newHeight * proportion;
        }
        else {
            newLTPoint.y += Math.abs(newHeight - newWidth / proportion);
            newHeight = newWidth / proportion;
        }
        // 由于现在求的未旋转前的坐标是以没按比例缩减宽高前的坐标来计算的
        // 所以缩减宽高后，需要按照原来的中心点旋转回去，获得缩减宽高并旋转后对应的坐标
        // 然后以这个坐标和对称点获得新的中心点，并重新计算未旋转前的坐标
        var rotatedLTPoint = translate_1.calculateRotatedPointCoordinate(newLTPoint, newCenterPoint, container.angle);
        newCenterPoint = translate_1.getCenterPoint(rotatedLTPoint, symmetricPoint);
        newLTPoint = translate_1.calculateRotatedPointCoordinate(rotatedLTPoint, newCenterPoint, -container.angle);
        newRBPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
        newWidth = newRBPoint.x - newLTPoint.x;
        newHeight = newRBPoint.y - newLTPoint.y;
    }
    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth;
        container.height = newHeight;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}
function calculateRightTop(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint;
    var newCenterPoint = translate_1.getCenterPoint(curPosition, symmetricPoint);
    var newRTPoint = translate_1.calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle);
    var newLBPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
    var newWidth = newRTPoint.x - newLBPoint.x;
    var newHeight = newLBPoint.y - newRTPoint.y;
    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newRTPoint.x -= Math.abs(newWidth - newHeight * proportion);
            newWidth = newHeight * proportion;
        }
        else {
            newRTPoint.y += Math.abs(newHeight - newWidth / proportion);
            newHeight = newWidth / proportion;
        }
        var rotatedTopRightPoint = translate_1.calculateRotatedPointCoordinate(newRTPoint, newCenterPoint, container.angle);
        newCenterPoint = translate_1.getCenterPoint(rotatedTopRightPoint, symmetricPoint);
        newRTPoint = translate_1.calculateRotatedPointCoordinate(rotatedTopRightPoint, newCenterPoint, -container.angle);
        newLBPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
        newWidth = newRTPoint.x - newLBPoint.x;
        newHeight = newLBPoint.y - newRTPoint.y;
    }
    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth;
        container.height = newHeight;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}
//
function calculateRightBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint;
    var newCenterPoint = translate_1.getCenterPoint(curPosition, symmetricPoint);
    var newLTPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
    var newRBPoint = translate_1.calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle);
    var newWidth = newRBPoint.x - newLTPoint.x;
    var newHeight = newRBPoint.y - newLTPoint.y;
    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newRBPoint.x -= Math.abs(newWidth - newHeight * proportion);
            newWidth = newHeight * proportion;
        }
        else {
            newRBPoint.y -= Math.abs(newHeight - newWidth / proportion);
            newHeight = newWidth / proportion;
        }
        var rotatedBottomRightPoint = translate_1.calculateRotatedPointCoordinate(newRBPoint, newCenterPoint, container.angle);
        newCenterPoint = translate_1.getCenterPoint(rotatedBottomRightPoint, symmetricPoint);
        newLTPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
        newRBPoint = translate_1.calculateRotatedPointCoordinate(rotatedBottomRightPoint, newCenterPoint, -container.angle);
        newWidth = newRBPoint.x - newLTPoint.x;
        newHeight = newRBPoint.y - newLTPoint.y;
    }
    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth;
        container.height = newHeight;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}
//
function calculateLeftBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint;
    var newCenterPoint = translate_1.getCenterPoint(curPosition, symmetricPoint);
    var newRTPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
    var newLBPoint = translate_1.calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle);
    var newWidth = newRTPoint.x - newLBPoint.x;
    var newHeight = newLBPoint.y - newRTPoint.y;
    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newLBPoint.x += Math.abs(newWidth - newHeight * proportion);
            newWidth = newHeight * proportion;
        }
        else {
            newLBPoint.y -= Math.abs(newHeight - newWidth / proportion);
            newHeight = newWidth / proportion;
        }
        var rotatedBottomLeftPoint = translate_1.calculateRotatedPointCoordinate(newLBPoint, newCenterPoint, container.angle);
        newCenterPoint = translate_1.getCenterPoint(rotatedBottomLeftPoint, symmetricPoint);
        newRTPoint = translate_1.calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle);
        newLBPoint = translate_1.calculateRotatedPointCoordinate(rotatedBottomLeftPoint, newCenterPoint, -container.angle);
        newWidth = newRTPoint.x - newLBPoint.x;
        newHeight = newLBPoint.y - newRTPoint.y;
    }
    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth;
        container.height = newHeight;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}
//
function calculateTop(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint, curPoint = pointInfo.curPoint;
    var rotatedCurPosition = translate_1.calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle);
    var rotatedTopMiddlePoint = translate_1.calculateRotatedPointCoordinate({
        x: curPoint.x,
        y: rotatedCurPosition.y,
    }, curPoint, container.angle);
    // 勾股定理
    var newHeight = Math.sqrt(Math.pow((rotatedTopMiddlePoint.x - symmetricPoint.x), 2) + Math.pow((rotatedTopMiddlePoint.y - symmetricPoint.y), 2));
    if (newHeight > 0) {
        var newCenterPoint = {
            x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
        };
        var width = container.width;
        // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
        if (needLockProportion) {
            width = newHeight * proportion;
        }
        container.width = width;
        container.height = newHeight;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
//
function calculateRight(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint, curPoint = pointInfo.curPoint;
    var rotatedCurPosition = translate_1.calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle);
    var rotatedRightMiddlePoint = translate_1.calculateRotatedPointCoordinate({
        x: rotatedCurPosition.x,
        y: curPoint.y,
    }, curPoint, container.angle);
    var newWidth = Math.sqrt(Math.pow((rotatedRightMiddlePoint.x - symmetricPoint.x), 2) + Math.pow((rotatedRightMiddlePoint.y - symmetricPoint.y), 2));
    if (newWidth > 0) {
        var newCenterPoint = {
            x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
        };
        var height = container.height;
        // 因为调整的是宽度 所以只需根据锁定的比例调整高度即可
        if (needLockProportion) {
            height = newWidth / proportion;
        }
        container.height = height;
        container.width = newWidth;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
//
function calculateBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint, curPoint = pointInfo.curPoint;
    var rotatedCurPosition = translate_1.calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle);
    var rotatedBottomMiddlePoint = translate_1.calculateRotatedPointCoordinate({
        x: curPoint.x,
        y: rotatedCurPosition.y,
    }, curPoint, container.angle);
    var newHeight = Math.sqrt(Math.pow((rotatedBottomMiddlePoint.x - symmetricPoint.x), 2) + Math.pow((rotatedBottomMiddlePoint.y - symmetricPoint.y), 2));
    if (newHeight > 0) {
        var newCenterPoint = {
            x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
        };
        var width = container.width;
        // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
        if (needLockProportion) {
            width = newHeight * proportion;
        }
        container.width = width;
        container.height = newHeight;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
//
function calculateLeft(container, curPosition, proportion, needLockProportion, pointInfo) {
    var symmetricPoint = pointInfo.symmetricPoint, curPoint = pointInfo.curPoint;
    var rotatedCurPosition = translate_1.calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle);
    var rotatedLeftMiddlePoint = translate_1.calculateRotatedPointCoordinate({
        x: rotatedCurPosition.x,
        y: curPoint.y,
    }, curPoint, container.angle);
    var newWidth = Math.sqrt(Math.pow((rotatedLeftMiddlePoint.x - symmetricPoint.x), 2) + Math.pow((rotatedLeftMiddlePoint.y - symmetricPoint.y), 2));
    if (newWidth > 0) {
        var newCenterPoint = {
            x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
        };
        var height = container.height;
        if (needLockProportion) {
            height = newWidth / proportion;
        }
        container.height = height;
        container.width = newWidth;
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
function calculateComponentPositionAndSize(name, container, curPosition, proportion, needLockProportion, pointInfo) {
    funcs[name](container, curPosition, proportion, needLockProportion, pointInfo);
}
exports.default = calculateComponentPositionAndSize;

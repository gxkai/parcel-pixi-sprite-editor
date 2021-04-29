import * as PIXI from "pixi.js-legacy";
// 角度转弧度
// Math.PI = 180 度
export function angleToRadian(angle) {
    return angle * Math.PI / 180
}

/**
 * 计算根据圆心旋转后的点的坐标
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
export function calculateRotatedPointCoordinate(point, center, rotate) {
    /**
     * 旋转公式：
     *  点a(x, y)
     *  旋转中心c(x, y)
     *  旋转后点n(x, y)
     *  旋转角度θ                tan ??
     * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
     * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
     */

    return {
        x: (point.x - center.x) * Math.cos(angleToRadian(rotate)) - (point.y - center.y) * Math.sin(angleToRadian(rotate)) + center.x,
        y: (point.x - center.x) * Math.sin(angleToRadian(rotate)) + (point.y - center.y) * Math.cos(angleToRadian(rotate)) + center.y,
    }
}

// 计算旋转角
export function calculateRotatedAngle(p1,p2, center) {
    const angle1 = Math.atan2(p1.y - center.y, p1.x - center.x) * 180/Math.PI;
    const angle2 = Math.atan2(p2.y - center.y, p2.x - center.x) * 180/Math.PI;

    return  angle2 - angle1;
}

// 求两点之间的中点坐标
export function getCenterPoint(p1, p2) {
    return {
        x: p1.x + ((p2.x - p1.x) / 2),
        y: p1.y + ((p2.y - p1.y) / 2),
    }
}

export function sin(rotate) {
    return Math.abs(Math.sin(angleToRadian(rotate)))
}

export function cos(rotate) {
    return Math.abs(Math.cos(angleToRadian(rotate)))
}

export function mod360(deg) {
    return (deg + 360) % 360
}
export function mod90(deg) {
    return (deg + 360) % 90
}
export function calculateLength(points: [PIXI.IPointData, PIXI.IPointData]) {
    const p0 = points[0];
    const p1 = points[1];
    return Math.pow(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y,2), 0.5)
}

//=================== 碰撞检测 https://github.com/francecil/leetcode/issues/1
// 判断线段AB 和线段CD 是否相交
function judgeSegmentsIntersect (A: PIXI.IPointData, B: PIXI.IPointData, C: PIXI.IPointData, D: PIXI.IPointData) {
    //快速排斥, 不考虑相切情况 判断时要算上等于
    if (Math.max(C.x, D.x) <= Math.min(A.x, B.x) || Math.max(C.y, D.y) <= Math.min(A.y, B.y) ||
        Math.max(A.x, B.x) <= Math.min(C.x, D.x) || Math.max(A.y, B.y) <= Math.min(C.y, D.y)) {
        return false
    }
    // 向量叉乘
    const crossMul = (v1, v2) => {
        return v1.x * v2.y - v1.y * v2.x
    }
    const vector = (start, end) => {
        return {
            x: end.x - start.x,
            y: end.y - start.y
        }
    }
    let AC = vector(A, C)
    let AD = vector(A, D)
    let BC = vector(B, C)
    let BD = vector(B, D)
    let CA = vector(C, A)
    let DA = vector(D, A)
    let CB = vector(C, B)
    let DB = vector(D, B)
    return (crossMul(AC, AD) * crossMul(BC, BD) <= 0)
        && (crossMul(CA, CB) * crossMul(DA, DB) <= 0)
}


/**
 * @description 判断矩形相交
 * @param {PIXI.IPointData[]} rect1 拖动光标形成的矩形
 * @param {PIXI.IPointData[]} rect2 已有矩形
 */
function judgeRectanglesIntersect (rect1:PIXI.IPointData[], rect2:PIXI.IPointData[]) {
    for (let i = 0; i < rect1.length; i++) {
        let A = rect1[i]
        let B = i === rect1.length - 1 ? rect1[0] : rect1[i + 1]
        for (let j = 0; j < rect2.length; j++) {
            let C = rect2[j]
            let D = j === rect2.length - 1 ? rect2[0] : rect2[j + 1]
            if (judgeSegmentsIntersect(A, B, C, D)) {
                return true
            }
        }
    }
    return false
}

/**
 * @description 已知两矩形不相交 判断矩形是否属于包含关系
 * @param {PIXI.IPointData[]} rect1 拖动光标形成的矩形
 * @param {PIXI.IPointData[]} rect2 已有矩形
 */
function judgeRectanglesContain (rect1:PIXI.IPointData[], rect2:PIXI.IPointData[]) {

    // 判断点P是否在水平坐标系的矩形box中
    const isInside = (p, rect1) => {
        return  p.x >= rect1[0].x && p.x <= rect1[2].x && p.y >= rect1[0].y && p.y <= rect1[2].y
    }
    return rect2.every(p => isInside(p, rect1));
}

/**
 * @description 判定碰撞
 * @param {PIXI.IPointData[]} rect1 拖动光标形成的矩形
 * @param {PIXI.IPointData[]} rect2 已有矩形
 */
export function judeRectanglesCollision(rect1:PIXI.IPointData[], rect2:PIXI.IPointData[]) {
    return judgeRectanglesIntersect(rect1, rect2) || judgeRectanglesContain(rect1, rect2);
}
//========================

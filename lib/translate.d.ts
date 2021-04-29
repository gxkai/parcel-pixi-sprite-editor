export declare function angleToRadian(angle: any): number;
/**
 * 计算根据圆心旋转后的点的坐标
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
export declare function calculateRotatedPointCoordinate(point: any, center: any, rotate: any): {
    x: any;
    y: any;
};
export declare function calculateRotatedAngle(p1: any, p2: any, center: any): number;
export declare function getCenterPoint(p1: any, p2: any): {
    x: any;
    y: any;
};
export declare function sin(rotate: any): number;
export declare function cos(rotate: any): number;
export declare function mod360(deg: any): number;
export declare function mod90(deg: any): number;
export declare function calculateLength(points: [PIXI.IPointData, PIXI.IPointData]): number;
/**
 * @description 判定碰撞
 * @param {PIXI.IPointData[]} rect1 拖动光标形成的矩形
 * @param {PIXI.IPointData[]} rect2 已有矩形
 */
export declare function judeRectanglesCollision(rect1: PIXI.IPointData[], rect2: PIXI.IPointData[]): boolean;

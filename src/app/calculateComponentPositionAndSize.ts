import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'

const funcs = {
    lt: calculateLeftTop,
    t: calculateTop,
    rt: calculateRightTop,
    r: calculateRight,
    rb: calculateRightBottom,
    b: calculateBottom,
    lb: calculateLeftBottom,
    l: calculateLeft,
}
// 计算容器位置
function calculateContainerPosition(newCenterPoint, container) {
    container.y = newCenterPoint.y;
    container.x = newCenterPoint.x;
}
// 计算周围点位置
export function calculateSurroundPoints(newCenterPoint, container) {
    const LTPoint = {
        x: newCenterPoint.x - container.width/2,
        y: newCenterPoint.y - container.height/2,
    }
    const RTPoint = {
        x: newCenterPoint.x + container.width/2,
        y: newCenterPoint.y - container.height/2
    }
    const LBPoint = {
        x: newCenterPoint.x - container.width/2,
        y: newCenterPoint.y + container.height/2
    }
    const RBPoint = {
        x: newCenterPoint.x + container.width/2,
        y: newCenterPoint.y + container.height/2
    }
    const TPoint = {
        x: newCenterPoint.x,
        y: newCenterPoint.y - container.height/2
    }
    const BPoint = {
        x: newCenterPoint.x,
        y: newCenterPoint.y + container.height/2
    }
    const LPoint = {
        x: newCenterPoint.x - container.width/2,
        y: newCenterPoint.y
    }
    const RPoint = {
        x: newCenterPoint.x + container.width/2,
        y: newCenterPoint.y
    }
    const   newLTPoint= calculateRotatedPointCoordinate(LTPoint, newCenterPoint, container.angle);
    const   newRTPoint= calculateRotatedPointCoordinate(RTPoint, newCenterPoint, container.angle);
    const   newLBPoint= calculateRotatedPointCoordinate(LBPoint, newCenterPoint, container.angle);
    const   newRBPoint= calculateRotatedPointCoordinate(RBPoint, newCenterPoint, container.angle);
    const   newTPoint= calculateRotatedPointCoordinate(TPoint, newCenterPoint, container.angle);
    const   newBPoint= calculateRotatedPointCoordinate(BPoint, newCenterPoint, container.angle);
    const   newLPoint= calculateRotatedPointCoordinate(LPoint, newCenterPoint, container.angle);
    const   newRPoint= calculateRotatedPointCoordinate(RPoint, newCenterPoint, container.angle);
    const   newUBPoint= calculateRotatedPointCoordinate({
        x: BPoint.x,
        y: BPoint.y + 50
    }, newCenterPoint, container.angle);
    return [newLTPoint, newRTPoint, newLBPoint, newRBPoint, newTPoint, newBPoint, newLPoint, newRPoint, newUBPoint];
}
function calculateLeftTop(container, curPosition,proportion, needLockProportion, pointInfo) {
    const { symmetricPoint } = pointInfo
    let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
    let newLTPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle)
    let newRBPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
    let newWidth = newRBPoint.x - newLTPoint.x
    let newHeight = newRBPoint.y - newLTPoint.y
    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newLTPoint.x += Math.abs(newWidth - newHeight * proportion)
            newWidth = newHeight * proportion
        } else {
            newLTPoint.y += Math.abs(newHeight - newWidth / proportion)
            newHeight = newWidth / proportion
        }

        // 由于现在求的未旋转前的坐标是以没按比例缩减宽高前的坐标来计算的
        // 所以缩减宽高后，需要按照原来的中心点旋转回去，获得缩减宽高并旋转后对应的坐标
        // 然后以这个坐标和对称点获得新的中心点，并重新计算未旋转前的坐标
        const rotatedLTPoint = calculateRotatedPointCoordinate(newLTPoint, newCenterPoint, container.angle)
        newCenterPoint = getCenterPoint(rotatedLTPoint, symmetricPoint)
        newLTPoint = calculateRotatedPointCoordinate(rotatedLTPoint, newCenterPoint, -container.angle)
        newRBPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
        newWidth = newRBPoint.x - newLTPoint.x
        newHeight = newRBPoint.y - newLTPoint.y
    }
    if (newWidth > 0 && newHeight > 0) {
        container.width =newWidth
        container.height =newHeight
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}

function calculateRightTop(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint } = pointInfo
    let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
    let newRTPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle)
    let newLBPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)

    let newWidth = newRTPoint.x - newLBPoint.x
    let newHeight = newLBPoint.y - newRTPoint.y

    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newRTPoint.x -= Math.abs(newWidth - newHeight * proportion)
            newWidth = newHeight * proportion
        } else {
            newRTPoint.y += Math.abs(newHeight - newWidth / proportion)
            newHeight = newWidth / proportion
        }

        const rotatedTopRightPoint = calculateRotatedPointCoordinate(newRTPoint, newCenterPoint, container.angle)
        newCenterPoint = getCenterPoint(rotatedTopRightPoint, symmetricPoint)
        newRTPoint = calculateRotatedPointCoordinate(rotatedTopRightPoint, newCenterPoint, -container.angle)
        newLBPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)

        newWidth = newRTPoint.x - newLBPoint.x
        newHeight = newLBPoint.y - newRTPoint.y
    }

    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth
        container.height =newHeight
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);

    }
}
//
function calculateRightBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint } = pointInfo
    let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
    let newLTPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
    let newRBPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle)

    let newWidth = newRBPoint.x - newLTPoint.x
    let newHeight = newRBPoint.y - newLTPoint.y

    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newRBPoint.x -= Math.abs(newWidth - newHeight * proportion)
            newWidth = newHeight * proportion
        } else {
            newRBPoint.y -= Math.abs(newHeight - newWidth / proportion)
            newHeight = newWidth / proportion
        }

        const rotatedBottomRightPoint = calculateRotatedPointCoordinate(newRBPoint, newCenterPoint, container.angle)
        newCenterPoint = getCenterPoint(rotatedBottomRightPoint, symmetricPoint)
        newLTPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
        newRBPoint = calculateRotatedPointCoordinate(rotatedBottomRightPoint, newCenterPoint, -container.angle)

        newWidth = newRBPoint.x - newLTPoint.x
        newHeight = newRBPoint.y - newLTPoint.y
    }

    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth
        container.height = newHeight
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}
//
function calculateLeftBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint } = pointInfo
    let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
    let newRTPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
    let newLBPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle)

    let newWidth = newRTPoint.x - newLBPoint.x
    let newHeight = newLBPoint.y - newRTPoint.y

    if (needLockProportion) {
        if (newWidth / newHeight > proportion) {
            newLBPoint.x += Math.abs(newWidth - newHeight * proportion)
            newWidth = newHeight * proportion
        } else {
            newLBPoint.y -= Math.abs(newHeight - newWidth / proportion)
            newHeight = newWidth / proportion
        }

        const rotatedBottomLeftPoint = calculateRotatedPointCoordinate(newLBPoint, newCenterPoint, container.angle)
        newCenterPoint = getCenterPoint(rotatedBottomLeftPoint, symmetricPoint)
        newRTPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
        newLBPoint = calculateRotatedPointCoordinate(rotatedBottomLeftPoint, newCenterPoint, -container.angle)

        newWidth = newRTPoint.x - newLBPoint.x
        newHeight = newLBPoint.y - newRTPoint.y
    }

    if (newWidth > 0 && newHeight > 0) {
        container.width = newWidth
        container.height = newHeight
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container);
    }
}
//
function calculateTop(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint, curPoint } = pointInfo
    let rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle)
    let rotatedTopMiddlePoint = calculateRotatedPointCoordinate({
        x: curPoint.x,
        y: rotatedCurPosition.y,
    }, curPoint, container.angle)

    // 勾股定理
    let newHeight = Math.sqrt((rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2)

    if (newHeight > 0) {
        const newCenterPoint = {
            x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
        }

        let width = container.width
        // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
        if (needLockProportion) {
            width = newHeight * proportion
        }

        container.width = width
        container.height =newHeight
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
//
function calculateRight(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint, curPoint } = pointInfo
    const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle)
    const rotatedRightMiddlePoint = calculateRotatedPointCoordinate({
        x: rotatedCurPosition.x,
        y: curPoint.y,
    }, curPoint, container.angle)

    let newWidth = Math.sqrt((rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2)
    if (newWidth > 0) {
        const newCenterPoint = {
            x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
        }

        let height = container.height
        // 因为调整的是宽度 所以只需根据锁定的比例调整高度即可
        if (needLockProportion) {
            height = newWidth / proportion
        }

        container.height = height
        container.width = newWidth
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
//
function calculateBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint, curPoint } = pointInfo
    const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle)
    const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate({
        x: curPoint.x,
        y: rotatedCurPosition.y,
    }, curPoint, container.angle)

    const newHeight = Math.sqrt((rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2)
    if (newHeight > 0) {
        const newCenterPoint = {
            x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
        }

        let width = container.width
        // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
        if (needLockProportion) {
            width = newHeight * proportion
        }

        container.width = width
        container.height = newHeight
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}
//
function calculateLeft(container, curPosition, proportion, needLockProportion, pointInfo) {
    const { symmetricPoint, curPoint } = pointInfo
    const rotatedCurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.angle)
    const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate({
        x: rotatedCurPosition.x,
        y: curPoint.y,
    }, curPoint, container.angle)

    const newWidth = Math.sqrt((rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2)
    if (newWidth > 0) {
        const newCenterPoint = {
            x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
        }

        let height = container.height
        if (needLockProportion) {
            height = newWidth / proportion
        }

        container.height = height
        container.width = newWidth
        container.x = newCenterPoint.x;
        container.y = newCenterPoint.y;
        // return calculateSurroundPoints(newCenterPoint, container)
    }
}

export default function calculateComponentPositionAndSize(name, container, curPosition,proportion, needLockProportion, pointInfo) {
      funcs[name](container, curPosition,proportion, needLockProportion, pointInfo)
}

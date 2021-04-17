import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'

const funcs = {
    lt: calculateLeftTop,
    // t: calculateTop,
    // rt: calculateRightTop,
    // r: calculateRight,
    // rb: calculateRightBottom,
    // b: calculateBottom,
    // lb: calculateLeftBottom,
    // l: calculateLeft,
}

function calculateLeftTop(container, curPosition, pointInfo) {
    const { symmetricPoint } = pointInfo
    let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
    let newTopLeftPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.angle)
    let newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.angle)
    let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    let newHeight = newBottomRightPoint.y - newTopLeftPoint.y
    // if (needLockProportion) {
    //     if (newWidth / newHeight > proportion) {
    //         newTopLeftPoint.x += Math.abs(newWidth - newHeight * proportion)
    //         newWidth = newHeight * proportion
    //     } else {
    //         newTopLeftPoint.y += Math.abs(newHeight - newWidth / proportion)
    //         newHeight = newWidth / proportion
    //     }
    //
    //     // 由于现在求的未旋转前的坐标是以没按比例缩减宽高前的坐标来计算的
    //     // 所以缩减宽高后，需要按照原来的中心点旋转回去，获得缩减宽高并旋转后对应的坐标
    //     // 然后以这个坐标和对称点获得新的中心点，并重新计算未旋转前的坐标
    //     const rotatedTopLeftPoint = calculateRotatedPointCoordinate(newTopLeftPoint, newCenterPoint, container.rotate)
    //     newCenterPoint = getCenterPoint(rotatedTopLeftPoint, symmetricPoint)
    //     newTopLeftPoint = calculateRotatedPointCoordinate(rotatedTopLeftPoint, newCenterPoint, -container.rotate)
    //     newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
    //
    //     newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    //     newHeight = newBottomRightPoint.y - newTopLeftPoint.y
    // }

    if (newWidth > 0 && newHeight > 0) {
        container.width = Math.round(newWidth)
        container.height = Math.round(newHeight)
        container.x = Math.round(newTopLeftPoint.x) + container.width / 2
        container.y = Math.round(newTopLeftPoint.y) + container.width / 2
    }
}

// function calculateRightTop(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint } = pointInfo
//     let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
//     let newTopRightPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.rotate)
//     let newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
//
//     let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
//     let newHeight = newBottomLeftPoint.y - newTopRightPoint.y
//
//     if (needLockProportion) {
//         if (newWidth / newHeight > proportion) {
//             newTopRightPoint.x -= Math.abs(newWidth - newHeight * proportion)
//             newWidth = newHeight * proportion
//         } else {
//             newTopRightPoint.y += Math.abs(newHeight - newWidth / proportion)
//             newHeight = newWidth / proportion
//         }
//
//         const rotatedTopRightPoint = calculateRotatedPointCoordinate(newTopRightPoint, newCenterPoint, container.rotate)
//         newCenterPoint = getCenterPoint(rotatedTopRightPoint, symmetricPoint)
//         newTopRightPoint = calculateRotatedPointCoordinate(rotatedTopRightPoint, newCenterPoint, -container.rotate)
//         newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
//
//         newWidth = newTopRightPoint.x - newBottomLeftPoint.x
//         newHeight = newBottomLeftPoint.y - newTopRightPoint.y
//     }
//
//     if (newWidth > 0 && newHeight > 0) {
//         container.width = Math.round(newWidth)
//         container.height = Math.round(newHeight)
//         container.left = Math.round(newBottomLeftPoint.x)
//         container.top = Math.round(newTopRightPoint.y)
//     }
// }
//
// function calculateRightBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint } = pointInfo
//     let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
//     let newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
//     let newBottomRightPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.rotate)
//
//     let newWidth = newBottomRightPoint.x - newTopLeftPoint.x
//     let newHeight = newBottomRightPoint.y - newTopLeftPoint.y
//
//     if (needLockProportion) {
//         if (newWidth / newHeight > proportion) {
//             newBottomRightPoint.x -= Math.abs(newWidth - newHeight * proportion)
//             newWidth = newHeight * proportion
//         } else {
//             newBottomRightPoint.y -= Math.abs(newHeight - newWidth / proportion)
//             newHeight = newWidth / proportion
//         }
//
//         const rotatedBottomRightPoint = calculateRotatedPointCoordinate(newBottomRightPoint, newCenterPoint, container.rotate)
//         newCenterPoint = getCenterPoint(rotatedBottomRightPoint, symmetricPoint)
//         newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
//         newBottomRightPoint = calculateRotatedPointCoordinate(rotatedBottomRightPoint, newCenterPoint, -container.rotate)
//
//         newWidth = newBottomRightPoint.x - newTopLeftPoint.x
//         newHeight = newBottomRightPoint.y - newTopLeftPoint.y
//     }
//
//     if (newWidth > 0 && newHeight > 0) {
//         container.width = Math.round(newWidth)
//         container.height = Math.round(newHeight)
//         container.left = Math.round(newTopLeftPoint.x)
//         container.top = Math.round(newTopLeftPoint.y)
//     }
// }
//
// function calculateLeftBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint } = pointInfo
//     let newCenterPoint = getCenterPoint(curPosition, symmetricPoint)
//     let newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
//     let newBottomLeftPoint = calculateRotatedPointCoordinate(curPosition, newCenterPoint, -container.rotate)
//
//     let newWidth = newTopRightPoint.x - newBottomLeftPoint.x
//     let newHeight = newBottomLeftPoint.y - newTopRightPoint.y
//
//     if (needLockProportion) {
//         if (newWidth / newHeight > proportion) {
//             newBottomLeftPoint.x += Math.abs(newWidth - newHeight * proportion)
//             newWidth = newHeight * proportion
//         } else {
//             newBottomLeftPoint.y -= Math.abs(newHeight - newWidth / proportion)
//             newHeight = newWidth / proportion
//         }
//
//         const rotatedBottomLeftPoint = calculateRotatedPointCoordinate(newBottomLeftPoint, newCenterPoint, container.rotate)
//         newCenterPoint = getCenterPoint(rotatedBottomLeftPoint, symmetricPoint)
//         newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -container.rotate)
//         newBottomLeftPoint = calculateRotatedPointCoordinate(rotatedBottomLeftPoint, newCenterPoint, -container.rotate)
//
//         newWidth = newTopRightPoint.x - newBottomLeftPoint.x
//         newHeight = newBottomLeftPoint.y - newTopRightPoint.y
//     }
//
//     if (newWidth > 0 && newHeight > 0) {
//         container.width = Math.round(newWidth)
//         container.height = Math.round(newHeight)
//         container.left = Math.round(newBottomLeftPoint.x)
//         container.top = Math.round(newTopRightPoint.y)
//     }
// }
//
// function calculateTop(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     let rotatedcurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.rotate)
//     let rotatedTopMiddlePoint = calculateRotatedPointCoordinate({
//         x: curPoint.x,
//         y: rotatedcurPosition.y,
//     }, curPoint, container.rotate)
//
//     // 勾股定理
//     let newHeight = Math.sqrt((rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2)
//
//     if (newHeight > 0) {
//         const newCenter = {
//             x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
//         }
//
//         let width = container.width
//         // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
//         if (needLockProportion) {
//             width = newHeight * proportion
//         }
//
//         container.width = width
//         container.height = Math.round(newHeight)
//         container.top = Math.round(newCenter.y - (newHeight / 2))
//         container.left = Math.round(newCenter.x - (container.width / 2))
//     }
// }
//
// function calculateRight(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     const rotatedcurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.rotate)
//     const rotatedRightMiddlePoint = calculateRotatedPointCoordinate({
//         x: rotatedcurPosition.x,
//         y: curPoint.y,
//     }, curPoint, container.rotate)
//
//     let newWidth = Math.sqrt((rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2)
//     if (newWidth > 0) {
//         const newCenter = {
//             x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
//         }
//
//         let height = container.height
//         // 因为调整的是宽度 所以只需根据锁定的比例调整高度即可
//         if (needLockProportion) {
//             height = newWidth / proportion
//         }
//
//         container.height = height
//         container.width = Math.round(newWidth)
//         container.top = Math.round(newCenter.y - (container.height / 2))
//         container.left = Math.round(newCenter.x - (newWidth / 2))
//     }
// }
//
// function calculateBottom(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     const rotatedcurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.rotate)
//     const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate({
//         x: curPoint.x,
//         y: rotatedcurPosition.y,
//     }, curPoint, container.rotate)
//
//     const newHeight = Math.sqrt((rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2)
//     if (newHeight > 0) {
//         const newCenter = {
//             x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
//         }
//
//         let width = container.width
//         // 因为调整的是高度 所以只需根据锁定的比例调整宽度即可
//         if (needLockProportion) {
//             width = newHeight * proportion
//         }
//
//         container.width = width
//         container.height = Math.round(newHeight)
//         container.top = Math.round(newCenter.y - (newHeight / 2))
//         container.left = Math.round(newCenter.x - (container.width / 2))
//     }
// }
//
// function calculateLeft(container, curPosition, proportion, needLockProportion, pointInfo) {
//     const { symmetricPoint, curPoint } = pointInfo
//     const rotatedcurPosition = calculateRotatedPointCoordinate(curPosition, curPoint, -container.rotate)
//     const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate({
//         x: rotatedcurPosition.x,
//         y: curPoint.y,
//     }, curPoint, container.rotate)
//
//     const newWidth = Math.sqrt((rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2)
//     if (newWidth > 0) {
//         const newCenter = {
//             x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
//             y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
//         }
//
//         let height = container.height
//         if (needLockProportion) {
//             height = newWidth / proportion
//         }
//
//         container.height = height
//         container.width = Math.round(newWidth)
//         container.top = Math.round(newCenter.y - (container.height / 2))
//         container.left = Math.round(newCenter.x - (newWidth / 2))
//     }
// }

export default function calculateComponentPositionAndSize(name, container, curPosition, pointInfo) {
    funcs[name](container, curPosition, pointInfo)
}

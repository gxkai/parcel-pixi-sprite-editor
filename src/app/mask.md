// const mask = new Mask([])
    // bg.on('pointerdown', function(event){
    //     let dragging = true;
    //     const startPoint = {
    //         x: event.data.global.x,
    //         y: event.data.global.y
    //     }
    //     // clearSelections();
    //     function onDragEnd() {
    //         dragging = false;
    //         mask.update([])
    //     }
    //     this.on('pointermove', function (event) {
    //         if (dragging) {
    //             const endPoint = {
    //                 x: event.data.global.x,
    //                 y: event.data.global.y
    //             }
    //             // 顺时针取点
    //             let xMin, xMax, yMin, yMax;
    //             if (startPoint.x > endPoint.x) {
    //                 xMin = endPoint.x;
    //                 xMax = startPoint.x;
    //             } else {
    //                 xMin = startPoint.x;
    //                 xMax = endPoint.x;
    //             }
    //             if (startPoint.y > endPoint.y) {
    //                 yMin = endPoint.y;
    //                 yMax = startPoint.y;
    //             } else {
    //                 yMin = startPoint.y;
    //                 yMax = endPoint.y;
    //             }
    //             const maskPoints: PIXI.IPointData[] = [{x: xMin, y: yMin}, {x: xMax, y: yMin}, {x: xMax, y: yMax}, {x: xMin, y: yMax}]
    //             mask.update(maskPoints);
    //             const newSelectedComponents= selectedComponents.filter(_ => _.typeName !=='group').filter(({selection}) => {
    //                 const isCollision = judeRectanglesCollision(maskPoints, selection.border.points);
    //                 selection.border.visible = false;
    //                 selection.dots.visible = false;
    //                 return isCollision;
    //             })
    //             if (newSelectedComponents.length === 0) {
    //                 return;
    //             } else if (newSelectedComponents.length === 1) {
    //                 const selection = newSelectedComponents[0].selection;
    //                 selection.visible = true;
    //                 selection.border.visible = true;
    //                 selection.dots.visible = true;
    //                 app.stage.addChild(selection)
    //             } else {
    //                 newSelectedComponents.forEach(_ => {
    //                     const {selection} = _;
    //                     selection.visible = true;
    //                     selection.border.visible = true;
    //                     selection.dots.visible = false;
    //                     app.stage.addChild(selection)
    //                 })
    //                 const pointList = newSelectedComponents.map(({selection}) => selection.border.points).reduce((previousValue, currentValue) => {
    //                    return previousValue.concat(currentValue)
    //                 },[]);
    //                 const pointXList = pointList.map(p => p.x)
    //                 const pointYList = pointList.map(p => p.y)
    //                 const xMin =  Math.min(...pointXList);
    //                 const xMax =  Math.max(...pointXList);
    //                 const yMin =  Math.min(...pointYList);
    //                 const yMax =  Math.max(...pointYList);
    //             }
    //             app.stage.addChild(mask);
    //         }
    //     }).on('pointerup', onDragEnd)
    //         .on('pointerupoutside', onDragEnd)
    // });

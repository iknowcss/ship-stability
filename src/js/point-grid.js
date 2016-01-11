function PointGrid(xDomain, yDomain) {
  let xStep = xDomain.step;
  let xMinInt = Math.floor(xDomain.min / xStep);
  let xMaxInt = Math.floor(xDomain.max / xStep);

  let yStep = yDomain.step;
  let yMinInt = Math.floor(yDomain.min / yStep);
  let yMaxInt = Math.floor(yDomain.max / yStep);

  let xLen = xMaxInt - xMinInt + 1;
  let yLen = yMaxInt - yMinInt + 1;

  let pointId, pointMap, xInt, yInt;

  this.reset = () => {
    pointId = 0;
    pointMap = new Array(xLen * yLen);
    xInt = xMinInt;
    yInt = yMinInt;
  };

  this.hasMorePoints = () => pointId < pointMap.length;

  this.getNextPoint = () => {
    let x = xInt*xStep;
    let y = yInt*yStep;
    let result = { id: pointId, x, y };
    pointMap[pointId] = { x, y };

    pointId++;
    xInt++;
    if (xInt > xMaxInt) {
      xInt = xMinInt;
      yInt++;
    }

    return result;
  };

  this.reset();
}

module.exports = PointGrid;
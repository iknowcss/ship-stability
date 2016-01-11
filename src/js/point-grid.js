function PointGrid(xDomain, yDomain) {
  let xStep = xDomain.step;
  let xMinInt = Math.floor(xDomain.min / xStep);
  let xMaxInt = Math.floor(xDomain.max / xStep);

  let yStep = yDomain.step;
  let yMinInt = Math.floor(yDomain.min / yStep);
  let yMaxInt = Math.floor(yDomain.max / yStep);

  let grid = new Array(yMaxInt - yMinInt + 1);

  // console.log({
  //   xStep,
  //   xMinInt,
  //   xMaxInt,
  //   yStep,
  //   yMinInt,
  //   yMaxInt
  // });

  function createYRow() {
    return new Int32Array(xMaxInt - xMinInt + 1);
  }

  let xInt, yInt;

  this.reset = () => {
    xInt = xMinInt;
    yInt = xMinInt;
  };

  this.hasMorePoints = () => yInt < yMaxInt;

  this.getNextPoint = () => {
    let result = { x: xInt*xStep, y: yInt*yStep };

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
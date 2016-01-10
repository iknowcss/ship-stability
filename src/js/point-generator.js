module.exports = function PointGenerator(xOptions, yOptions) {
  let x = xOptions.min,
      y = yOptions.min,
      hasNext = true;

  this.hasNext = () => hasNext;

  this.next = function () {
    if (!hasNext) {
      return { x: undefined, y: undefined };
    }

    var result = { x, y };

    x += xOptions.step;
    if (x > xOptions.max) {
      x = xOptions.min;
      y += yOptions.step;
    }

    if (y > yOptions.max) {
      x = undefined;
      y = undefined;
      hasNext = false;
    }
    
    return result;
  }
};
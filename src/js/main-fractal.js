if (!window.Worker) {
  alert('Error: This platform does not support Web Workers');
  throw 'This platform does not support Web Workers';
}

var worker = new Worker('capsize-test-worker.js');

let wDomain = {
  min: 0,
  max: 5000,
  step: 1000
};

let aDomain = {
  min: 0,
  max: 5000,
  step: 1000
};

let h = 0.001;
let steps = 5000;

let wCur;
let aCur;

function nextPoint() {
  if (!wCur) wCur = wDomain.min;
  if (!aCur) aCur = aDomain.min;

  if (wCur < 0 || aCur < 0) {
    return { w: -1, a: -1 };
  }

  wCur = wCur + wDomain.step;
  if (wCur > wDomain.max) {
    wCur = wDomain.min;
    aCur = aCur + aDomain.step;
  }

  if (aCur > aDomain.max) {
    wCur = undefined;
    aCur = undefined;
    return false;
  }
  
  return { w: wCur, a: aCur };
}

worker.onmessage = function (e) {
  var { capsize, steps } = e.data;
  console.log({ capsize, steps });
};

var testPoint;
while (testPoint = nextPoint()) {
  var {w, a} = testPoint;
  worker.postMessage([ w/1000, a/1000, h, steps ]);
}
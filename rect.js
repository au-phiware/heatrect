import * as _ from './util.js';
import {newLayout, forEachCell, paint} from './common.js';

export function rectangularMemoize(cols, fn) {
  if (fn.cache) return fn;
  let memo = function(x, y) {
    let i = cols * x + y;
    if (i in memo.cache) {
      return memo.cache[i];
    }
    let v = fn.call(this, x, y);
    memo.cache[i] = v;
    return v;
  }
  memo.cache = new Array();
  return memo;
}

export function getRectangularCell(x, y, i) {
  return this.children.item(i);
}

export function newRectangularLayout(createRoot, createCell, setColor, rows, cols) {
  let root = newLayout(
      _.partial(createRoot, rows, cols)
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , createCell
  );
  let renderer = _.bind(
      paint
    , root
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , setColor
  );
  renderer.memoize = _.partial(rectangularMemoize, cols);
  return [
      root
    , renderer
  ];
}

export function tickOffset(step, count) {
  let offset = count - Math.floor((count - (step + 1) % 2) / step) * step;
  offset -= (step + 1) % 2;
  offset /= 2;
  return offset;
}

function createTick(container, type, name) {
  var el = document.createElement('i');
  el.className = name + ' tick-tail';
  el.style[type] = name;
  container.appendChild(el);
  el = document.createElement('i');
  el.className = name + ' tick-head';
  el.style[type] = name;
  container.appendChild(el);
}

export function rectangularLayoutWithTicks(root, rows, cols, options) {
  let el;
  options = options || {};
  let tickLength = options.tickLength || '3px';
  let gutterLength = options.gutterLength || '1px';
  let borderLength = options.borderLength || '1px';
  let yTickCount = Math.min(rows, options.yTickCount || 10);
  let xTickCount = Math.min(cols, options.xTickCount || 10);
  let yTickFormat = options.yTickFormat;
  let xTickFormat = options.xTickFormat;

  let yTickStep = options.yTickStep || d3.tickStep(1, rows, yTickCount);
  let xTickStep = options.xTickStep || d3.tickStep(1, cols, xTickCount);
  let yTickHead = tickOffset(yTickStep, rows);
  let xTickHead = tickOffset(xTickStep, cols);
  yTickCount = Math.floor((rows - 2 * yTickHead) / yTickStep);
  xTickCount = Math.floor((cols - 2 * xTickHead) / xTickStep);
  let yTickTail = rows - yTickCount*yTickStep - yTickHead;
  let xTickTail = cols - xTickCount*xTickStep - xTickHead;

  let container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `[origin-start y-label-start] ${yTickFormat ? 'auto' : 0} [y-label-end y-axis-start] ${tickLength} [y-axis-end main-start] ${gutterLength} [origin-end] ${xTickHead > 0 ? xTickHead+'fr' : ''} repeat(${2*xTickCount}, ${xTickStep/2}fr) ${xTickTail > 0 ? xTickTail+'fr' : ''} [gutter-start] ${borderLength} [gutter-end main-end]`;
  container.style.gridTemplateRows = `[main-start gutter-start] ${borderLength} [gutter-end] ${yTickTail > 0 ? yTickTail+'fr' : ''} repeat(${2*yTickCount}, ${yTickStep/2}fr) ${yTickHead > 0 ? yTickHead+'fr' : ''} [origin-start] ${gutterLength} [main-end x-axis-start] ${tickLength} [x-axis-end x-label-start] ${xTickFormat ? 'auto' : 0} [x-label-end origin-end]`;

  root.style.gridArea = 'main';
  container.appendChild(root);

  el = document.createElement('div');
  el.className = 'origin';
  el.style.gridArea = 'origin';
  container.appendChild(el);

  el = document.createElement('div');
  el.className = 'gutter';
  el.style.gridRow = 'gutter';
  el.style.gridColumn = 'origin-start / y-axis-end';
  container.appendChild(el);

  let label;
  let y = Math.ceil(yTickHead + (yTickCount - 0.5) * yTickStep);
  if (yTickTail > 0) {
    el = document.createElement('div')
    el.className = 'y-axis y-axis-tail';
    el.style.gridColumn = 'y-label / y-axis';
    container.appendChild(el);
  }
  for (var i = 0; i < yTickCount; i++) {
    if (yTickFormat) {
      label = document.createElement('span');
      label.className = 'y-label';
      label.style.gridColumn = 'y-label';
      label.innerText = yTickFormat(y);
      y -= yTickStep;
      container.appendChild(label);
    }
    createTick(container, 'gridColumn', 'y-axis');
  }
  if (yTickHead > 0) {
    el = document.createElement('div')
    el.className = 'y-axis y-axis-head';
    el.style.gridColumn = 'y-label / y-axis';
    container.appendChild(el);
  }

  if (xTickHead > 0) {
    el = document.createElement('div')
    el.className = 'x-axis x-axis-head';
    el.style.gridRow = 'x-axis / x-label';
    container.appendChild(el);
  }
  for (var i = 0; i < xTickCount; i++) {
    createTick(container, 'gridRow', 'x-axis');
  }
  if (xTickTail > 0) {
    el = document.createElement('div')
    el.className = 'x-axis x-axis-tail';
    el.style.gridRow = 'x-axis / x-label';
    container.appendChild(el);
  }

  if (xTickFormat) {
    let x = Math.ceil(xTickHead + xTickStep / 2);
    for (var i = 0; i < xTickCount; i++) {
      el = document.createElement('span');
      el.className = 'x-label';
      el.style.gridRow = 'x-label';
      el.innerText = xTickFormat(x);
      x += xTickStep;
      container.appendChild(el);
    }
  }

  return container;
}

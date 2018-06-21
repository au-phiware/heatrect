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

var columnLabels = ["January", "February", "March", "April", "June", "July", "August", "September", "October", "November", "December"];
var rowLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function rectangularLayoutWithTicks(root, rows, cols) {
  let el;
  let tickLength = '7px';
  let gutterLength = '1px';

  let container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `[origin-start y-label-start] 100px [y-label-end y-axis-start] ${tickLength} [y-axis-end main-start] ${gutterLength} [origin-end] repeat(${2*cols}, 1fr) [gutter-start] ${gutterLength} [gutter-end main-end]`;
  container.style.gridTemplateRows = `[main-start gutter-start] ${gutterLength} [gutter-end] repeat(${2*rows}, 1fr) [origin-start] ${gutterLength} [main-end x-axis-start] ${tickLength} [x-axis-end x-label-start] 1.2em [x-label-end origin-end]`;

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
  for (var i = 0; i < rows; i++) {
    label = document.createElement('span');
    label.className = 'y-label';
    el = document.createElement('i');
    el.className = 'y-axis';
    if (i == 0) {
      label.classList.add('first');
      el.classList.add('first');
    }
    label.innerText = rowLabels[i];
    label.style.gridColumn = 'y-label';
    el.style.gridColumn = 'y-axis';
    container.appendChild(label);
    container.appendChild(el);
    el = document.createElement('i');
    el.className = 'y-axis';
    el.style.gridColumn = 'y-axis';
    container.appendChild(el);
  }
  label.classList.add('last');
  el.classList.add('last');

  for (var i = 0; i < 2*cols + 1; i++) {
    el = document.createElement('i');
    el.className = 'x-axis';
    if (i == 0) {
      el.classList.add('first');
    }
    el.style.gridRow = 'x-axis';
    container.appendChild(el);
  }
  el.classList.add('last');

  for (var i = 0; i < cols / 2; i++) {
    el = document.createElement('span');
    el.className = 'x-label';
    if (i == 0) {
      el.classList.add('first');
    } else {
      el.innerText = columnLabels[(i - 1) * 2 + 1]
    }
    el.style.gridRow = 'x-label';
    container.appendChild(el);
  }
  el.classList.add('last');

  return container;
}

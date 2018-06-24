import * as _ from './util.js';
import {rectangularMemoize} from './rect.js';

export function paint(forEachCell, update, color, value) {
  let paintCell = (e, y, x) => update.call(this, e, color.call(this, value.call(this, x, y)));
  return forEachCell.call(this, paintCell);
}

export function forEachCell(getCell, rows, cols, apply) {
  let i = 0;
  for (let y = 0; y < rows; y++) {
    let row = getCell.call(this, y) || this;
    for (let x = 0; x < cols; x++) {
      apply.call(row, getCell.call(row, y, x, i++), y, x);
    }
  }
}

export function newLayout(createRootElement, forEachCell, createCell) {
  let root = createRootElement.call(this);
  if (forEachCell) {
    forEachCell.call(root.children.item(0), function(e, y, x) { this.appendChild(createCell.call(this, y, x)) });
  }
  return root;
}

export function getRectangularCell(y, x, i) {
  if (arguments.length > 1) {
    return this.children.item(x);
  } else {
    return this.children.item(y);
  }
}

export function newRectangularLayout(createRoot, createCell, setColor, rows, cols) {
  let root = newLayout(
      _.partial(createRoot, rows, cols)
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , createCell
  );
  let renderer = _.bind(
      paint
    , root.children.item(0)
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , setColor
  );
  renderer.memoize = _.partial(rectangularMemoize, cols);
  return [
      root
    , renderer
  ];
}

export let newRectangularTable = _.partial(newRectangularLayout, createRectangularGridRoot, createRectangularGridCell, setGridCellColor);

function createRectangularGridRoot(rows, cols) {
  let root = document.createElement('table');
  let body = document.createElement('tbody');
  root.appendChild(body);
  for (let i = 0; i < rows; i++) {
    let row = document.createElement('tr');
    body.appendChild(row);
  }
  return root;
}

function createRectangularGridCell() {
  return document.createElement('td');
}

function setGridCellColor(e, v) {
  e.style.backgroundColor = v;
}


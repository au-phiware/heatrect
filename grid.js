import * as _ from './util.js';
import {newRectangularLayout} from './rect.js';

export let newRectangularGrid = _.partial(newRectangularLayout, createRectangularGridRoot, createRectangularGridCell, setGridCellColor);

function createRectangularGridRoot(rows, cols) {
  let root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  return root;
}

function createRectangularGridCell() {
  return document.createElement('div');
}

function setGridCellColor(e, v) {
  e.style.backgroundColor = v;
}


import * as _ from './util.js';
import {newRectangularLayout} from './rect.js';

const ns = 'http://www.w3.org/2000/svg';
function createRectangularSvgRoot(rows, cols) {
  let root = document.createElementNS(ns, 'svg');
  root.setAttribute('viewBox', `0 0 ${cols} ${rows}`);
  root.setAttribute('preserveAspectRatio', 'none');
  return root;
}

function createRectangularSvgCell(x, y) {
  let rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', 1);
  rect.setAttribute('height', 1);
  rect.setAttribute('style', 'stroke-width:1px;vector-effect:non-scaling-stroke;');
  return rect;
}

function setSvgCellColor(e, v) {
  e.style.fill = v;
  e.style.stroke = v;
}

export let newRectangularSvg = _.partial(newRectangularLayout, createRectangularSvgRoot, createRectangularSvgCell, setSvgCellColor);

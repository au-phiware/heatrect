let createRectangularSvgRoot, createRectangularSvgCell, setSvgCellColor;
(function(ns) {
  createRectangularSvgRoot = function(rows, cols) {
    let root = document.createElementNS(ns, 'svg');
    root.setAttribute('viewBox', `0 0 ${cols} ${rows}`);
    root.setAttribute('preserveAspectRatio', 'none');
    return root;
  }

  createRectangularSvgCell = function(x, y) {
    let rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', 1);
    rect.setAttribute('height', 1);
    rect.setAttribute('style', 'stroke-width:1px;vector-effect:non-scaling-stroke;');
    return rect;
  }

  setSvgCellColor = function(e, v) {
    e.style.fill = v;
    e.style.stroke = v;
  }
})('http://www.w3.org/2000/svg')

let newRectangularSvg = _.partial(newRectangularLayout, createRectangularSvgRoot, createRectangularSvgCell, setSvgCellColor);

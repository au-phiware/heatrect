let w = 160, h = 50;

let compute = _.flow(_.partial(value, hyperbola(w/3, h/2, w*2/3, h/2, 2/w)), color);

let layouts =
{ "rectangular-canvas": newRectangularCanvas
, "rectangular-grid": newRectangularGrid
, "rectangular": newRectangularSvg
}

let toolbar = {};
let updaters =
Object.entries(layouts).map(([id, layout]) => {
  let [el, update] = layout(compute, h, w);
  document.getElementById(id).appendChild(el);
  toolbar[id] = document.getElementById(`enable-${id}`);
  return [id, update];
});

let update = function() {
  updaters.forEach(([id, update]) => toolbar[id].checked && update());
  t--;
}

requestAnimationFrame(update);
start();

let t = 0;
function color(v) {
  return `hsl(${v*360+t}, 80%, 60%)`;
}

function value(f, x, y) {
  let dx = f(x,y);
  if (x < w/2) {
    return dx + 0.333;
  }
  return dx;
}
function hyperbola(ax, ay, bx, by, scale) {
  return (x, y) => Math.abs(d(x, y, ax, ay) - d(x, y, bx, by)) * scale;
}
function d(x1, y1, x2, y2) {
  let x = x2 - x1;
  let y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

var loop;
function stop() {
  clearInterval(loop);
}
function start() {
  loop = setInterval(update, 60)
}

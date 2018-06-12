let w = 80, h = 25;
let t = 0;
let compute = _.partial(value, hyperbola(w/3, h/2, w*2/3, h/2, 720/w));

let layouts =
{ "rectangular-canvas": newRectangularCanvas
, "rectangular-grid": newRectangularGrid
, "rectangular": newRectangularSvg
}

let toolbar = {};
let renderers =
Object.entries(layouts).map(([id, layout]) => {
  let [el, render] = layout(h, w);
  document.getElementById(id).appendChild(el);
  toolbar[id] = document.getElementById(`enable-${id}`);
  return [id, _.partial(render, color)];
});

let update = function() {
  renderers.forEach(([id, render]) => toolbar[id].checked && render(_.partial(compute, t)));
  t--;
}

start();

function color(v) {
  return `hsl(${v}, 80%, 60%)`;
}

function value(f, t, x, y) {
  let dx = f(x,y) + t;
  if (x < w/2) {
    return dx + 120;
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
  clearTimeout(loop);
}
function start() {
  requestAnimationFrame(update);
  loop = setTimeout(start, 16)
}

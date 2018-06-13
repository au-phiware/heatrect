let w = 96, h = 50;
let t = 0;
let duration = 4000;
let compute = _.partial(value, hyperbola(w/3, h/2, w*2/3, h/2, 720/w));

let layouts =
{ "rectangular-canvas": newRectangularCanvas
, "rectangular-grid": newRectangularGrid
, "rectangular": newRectangularSvg
}

let toolbar = {};
let transitions = {};
let renderers =
Object.entries(layouts).map(([id, layout]) => {
  let [el, render] = layout(h, w);
  render = _.partial(render, color);
  document.getElementById(id).appendChild(rectangularLayoutWithTicks(el, h, w));
  el.className = 'heatmap';
  toolbar[id] = document.getElementById(`enable-${id}`);
  toolbar[id].addEventListener('change', function() {
    if (this.checked) {
      let from = transitions[id]
        ? transitions[id]()
        : _.partial(compute, t + 360);
      transitions[id] = transition(render, EasingFunctions.linear, duration, from, _.partial(compute, t));
    } else if (transitions[id]) {
      transitions[id]();
    }
  });
  return [id, render];
});
let update = function() {
  let next = t - 360;
  let running = false;
  renderers.map(([id, render]) => {
    if (toolbar[id].checked) {
      running = true;
      let from = transitions[id]
        ? transitions[id]()
        : _.partial(compute, t);
      transitions[id] = transition(render, EasingFunctions.linear, duration, from, _.partial(compute, next));
    }
  });
  if (running) t = next;
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
  loop = setTimeout(start, duration)
}

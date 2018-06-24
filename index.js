import * as _ from './util.js';
import {transition, EasingFunctions} from './transition.js';
import {newRectangularGrid} from './grid.js';
import {newRectangularSvg} from './svg.js';
import {newRectangularCanvas} from './canvas.js';
import {newRectangularTable} from './table.js';
import {rectangularLayoutWithTicks} from './rect.js';

let w = 12, h = 7;
let t = 0;
let duration = 4000;
let compute = _.partial(value, hyperbola(w/3, h/2, w*2/3, h/2, 720/w));

let layouts =
{ "rectangular-table": newRectangularTable
, "rectangular-canvas": newRectangularCanvas
, "rectangular-grid": newRectangularGrid
, "rectangular": newRectangularSvg
}

let columnLabels = d3.scaleQuantize().domain([1, 12]).range(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
let rowLabels = d3.scaleQuantize().domain([1, 7]).range(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);

let toolbar = {};
let transitions = {};
let renderers =
Object.entries(layouts).map(([id, layout]) => {
  let [el, render] = layout(h, w);
  render = _.partial(render, color);
  document.getElementById(id).appendChild(
    rectangularLayoutWithTicks(
      rectangularLayoutWithTicks(el, h, w, {
        yTickCount: 50,
        xTickCount: 100,
        tickLength: '4px',
      }), h, w, {
        gutterLength: '5px',
        yTickCount: 15,
        xTickCount: 6,
        yTickFormat: rowLabels,
        xTickFormat: columnLabels
      }
    )
  );
  if (el.classList) {
    el.classList.add('heatmap');
  } else {
    el.className = 'heatmap';
  }
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

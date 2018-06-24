import * as _ from './util.js';

var transitionRate = 16;

export function transition(renderer, ease, duration, from, to) {
  let rate = transitionRate;
  let step = rate / duration;
  let shouldDrop = false
  let t = 0;
  if (renderer.memoize) {
    from = renderer.memoize(from);
    to = renderer.memoize(to);
  }
  let tween = _.partial(interpolate, ease, from, to);
  let render = () => {
    renderer(i && _.partial(tween, t) || to);
    shouldDrop = false
  };
  let i = setInterval(() => {
    t += step;
    if (t >= 1) {
      clearInterval(i);
      i = 0;
      t = 1;
    }
    if (!shouldDrop) {
      requestAnimationFrame(render)
      shouldDrop = true
    }
  }, rate);
  return () => {
    if (i) {
      clearInterval(i);
      i = 0;
      to = _.partial(tween, t)
    }
    return to;
  };
}

function interpolate(ease, from, to, t, x, y) {
  let d = ease(t);
  return d * to(x,y) + (1 - d) * from(x,y);
}

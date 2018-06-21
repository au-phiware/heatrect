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

/* https://gist.github.com/gre/1650294
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
let EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

export { EasingFunctions };

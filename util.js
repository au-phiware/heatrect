export function bind(fn, obj, ...left) {
  let curried = function(...right) {
    return fn.call(obj || this, ...left, ...right);
  };
  if (fn.memoize) {
    curried.memoize = fn.memoize;
  }
  return curried;
}

export function partial(fn, ...left) {
  return bind(fn, null, ...left);
}

export function identity(x) { return x; }


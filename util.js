let _ = {
  partial(fn, ...left) {
    return _.bind(fn, null, ...left);
  }

, bind(fn, obj, ...left) {
    let curried = function(...right) {
      return fn.call(obj || this, ...left, ...right);
    };
    if (fn.memoize) {
      curried.memoize = fn.memoize;
    }
    return curried;
  }
}


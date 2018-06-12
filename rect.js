function newRectangularLayout(createRoot, createCell, setColor, rows, cols) {
  let root = newLayout(
      _.partial(createRoot, rows, cols)
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , createCell
  );
  let renderer = _.bind(
      paint
    , root
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , setColor
  );
  renderer.memoize = _.partial(rectangularMemoize, cols);
  return [
      root
    , renderer
  ];
}

function getRectangularCell(x, y, i) {
  return this.children.item(i);
}

function rectangularMemoize(cols, fn) {
  if (fn.cache) return fn;
  let memo = function(x, y) {
    let i = cols * x + y;
    if (i in memo.cache) {
      return memo.cache[i];
    }
    let v = fn.call(this, x, y);
    memo.cache[i] = v;
    return v;
  }
  memo.cache = new Array();
  return memo;
}

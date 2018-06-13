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

function rectangularLayoutWithTicks(root, rows, cols) {
  let container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `[origin-start y-axis-start] 3px [y-axis-end origin-end main-start] repeat(${2*cols}, 1fr) [main-end]`;
  container.style.gridTemplateRows = `[main-start] repeat(${2*rows}, 1fr) [main-end origin-start x-axis-start] 3px [x-axis-end origin-end]`;
  var el = document.createElement('div');
  el.className = 'origin';
  el.style.gridArea = 'origin';
  container.appendChild(el);
  for (var i = 0; i < 2*rows + 1; i++) {
    el = document.createElement('div');
    el.className = 'y-axis';
    if (i == 0) {
      el.classList.add('first');
    }
    el.style.gridColumn = 'y-axis';
    container.appendChild(el);
  }
  el.classList.add('last');
  el.style.gridRow = 'x-axis';
  for (var i = 0; i < 2*cols + 1; i++) {
    el = document.createElement('div');
    el.className = 'x-axis';
    if (i == 0) {
      el.classList.add('first');
      el.style.gridColumn = 'y-axis';
    }
    el.style.gridRow = 'x-axis';
    container.appendChild(el);
  }
  el.classList.add('last');
  root.style.gridArea = 'main';
  container.appendChild(root);
  return container;
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

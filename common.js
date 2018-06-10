function noop() {}

function newLayout(createRootElement, forEachCell, createCell) {
  let root = createRootElement.call(this);
  if (forEachCell) {
    forEachCell.call(root, (e, x, y) => root.appendChild(createCell.call(root, x, y)));
  }
  return root;
}

function forEachCell(getCell, rows, cols, apply) {
  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      apply.call(this, getCell.call(this, x, y, i++), x, y);
    }
  }
}

function paint(forEachCell, update, color) {
  let paintCell = (e, x, y) => update.call(this, e, color.call(this, x, y));
  return forEachCell.call(this, paintCell);
}


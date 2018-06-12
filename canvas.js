let newRectangularCanvas = _.partial(newRectangularCanvasLayout, setCanvasCellColor);

function createRectangularCanvasRoot() {
  return document.createElement('canvas');
}

function newRectangularCanvasLayout(setColor, rows, cols) {
  let root = newLayout(createRectangularCanvasRoot);
  let context = root.getContext('2d');
  let forEach = _.partial(forEachCanvasCell, rows, cols);
  let renderer = _.bind(paint, context, forEach, setColor)
  renderer.memoize = _.partial(rectangularMemoize, cols);
  return [
      root
    , renderer
  ];
}

function forEachCanvasCell(rows, cols, apply) {
  this.save();
  this.scale(this.canvas.width/cols, this.canvas.height/rows);
  for (let y = 0; y < rows; y++) {
    this.save();
    for (let x = 0; x < cols; x++) {
      apply.call(this, null, x, y);
      this.translate(1, 0);
    }
    this.restore();
    this.translate(0, 1);
  }
  this.restore();
}

function setCanvasCellColor(e, v) {
  this.fillStyle = v;
  this.fillRect(0, 0, 1, 1);
}


function newRectangularLayout(createRoot, createCell, setColor, compute, rows, cols) {
  let root = newLayout(
      _.partial(createRoot, rows, cols)
    , _.partial(forEachCell, getRectangularCell, rows, cols)
    , createCell
  );
  return [
      root
    , _.bind(
          paint
        , root
        , _.partial(forEachCell, getRectangularCell, rows, cols)
        , setColor
        , compute
      )
  ];
}

function getRectangularCell(x, y, i) {
  return this.children.item(i);
}


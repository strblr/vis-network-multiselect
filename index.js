module.exports = ({ container, network, nodes, strokeColor, fillColor }) => {
  let drag = false, DOMRect = {};

  const toCanvas = (DOMx, DOMy) => {
    const { x, y } = network.DOMtoCanvas({ x: DOMx, y: DOMy });
    return [x, y];
  }

  const correctRange = (start, end) =>
    start < end ? [start, end] : [end, start];

  const selectFromDOMRect = () => {
    let [startX, startY] = toCanvas(DOMRect.startX, DOMRect.startY);
    let [endX, endY] = toCanvas(DOMRect.endX, DOMRect.endY);
    [startX, endX] = correctRange(startX, endX);
    [startY, endY] = correctRange(startY, endY);

    network.selectNodes(nodes.get().reduce(
      (selected, { id }) => {
        const { x, y } = network.getPositions(id)[id];
        return (startX <= x && x <= endX && startY <= y && y <= endY) ?
          selected.concat(id) : selected;
      }, []
    ));
  }

  container.oncontextmenu = () => false;

  container.onmousedown = event => {
    if(event.buttons === 2) {
      Object.assign(DOMRect, {
        startX: event.offsetX,
        startY: event.offsetY,
        endX: event.offsetX,
        endY: event.offsetY
      });
      drag = true;
    }
  };

  container.onmousemove = event => {
    if(drag) {
      if(event.buttons === 0) {
        drag = false;
        network.redraw();
      }
      else {
        Object.assign(DOMRect, {
          endX: event.offsetX,
          endY: event.offsetY
        });
        network.redraw();
      }
    }
  };

  container.onmouseup = () => {
    if(drag) {
      drag = false;
      network.redraw();
      selectFromDOMRect();
    }
  };

  network.on('afterDrawing', ctx => {
    if(drag) {
      const [startX, startY] = toCanvas(DOMRect.startX, DOMRect.startY);
      const [endX, endY] = toCanvas(DOMRect.endX, DOMRect.endY);
      ctx.setLineDash([6]);
      ctx.strokeStyle = strokeColor;
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      ctx.setLineDash([]);
      ctx.fillStyle = fillColor;
      ctx.fillRect(startX, startY, endX - startX, endY - startY);
    }
  });
}

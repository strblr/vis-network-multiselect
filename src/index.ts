import { Network, DataSetNodes } from "vis-network";

type Args = {
  container: HTMLDivElement;
  network: Network;
  nodes: DataSetNodes;
  strokeColor: string;
  fillColor: string;
};

export default ({
  container,
  network,
  nodes,
  strokeColor,
  fillColor
}: Args) => {
  let drag = false,
    DOMRect = {
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0
    };

  const toCanvas = (DOMx: number, DOMy: number) => {
    const { x, y } = network.DOMtoCanvas({ x: DOMx, y: DOMy });
    return [x, y];
  };

  const correctRange = (start: number, end: number) =>
    start < end ? [start, end] : [end, start];

  const selectFromDOMRect = () => {
    let [startX, startY] = toCanvas(DOMRect.startX, DOMRect.startY);
    let [endX, endY] = toCanvas(DOMRect.endX, DOMRect.endY);
    [startX, endX] = correctRange(startX, endX);
    [startY, endY] = correctRange(startY, endY);

    network.selectNodes(
      nodes.get().reduce((selected, { id }) => {
        const { x, y } = network.getPositions([id])[id];
        return startX <= x && x <= endX && startY <= y && y <= endY
          ? selected.concat(id as string)
          : selected;
      }, [] as string[])
    );
  };

  container.oncontextmenu = () => false;

  container.onmousedown = event => {
    if (event.buttons === 2) {
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
    if (drag) {
      if (event.buttons === 0) {
        drag = false;
        network.redraw();
      } else {
        Object.assign(DOMRect, {
          endX: event.offsetX,
          endY: event.offsetY
        });
        network.redraw();
      }
    }
  };

  container.onmouseup = () => {
    if (drag) {
      drag = false;
      network.redraw();
      selectFromDOMRect();
    }
  };

  network.on("afterDrawing", (ctx: CanvasRenderingContext2D) => {
    if (drag) {
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
};

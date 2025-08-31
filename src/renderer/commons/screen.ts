export const setBrightNess = (ctx: CanvasRenderingContext2D, alpha: number) => {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = 1.0;
};

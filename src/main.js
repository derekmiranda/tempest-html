let canvas, ctx;

function main() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");

  draw();
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

main();

if (module.hot) {
  module.hot.accept();
}

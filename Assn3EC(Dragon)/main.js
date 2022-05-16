angle = 0;

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    angle += 0;
    rabbit.MV = rotate(angle, [1, 1, 1]);

    rabbit.render();

    requestAnimationFrame(render);
}

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.clearColor(0.1,0.1,0.1,1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    rabbit = new Dragon(gl);
    render();
}

window.onload = init;
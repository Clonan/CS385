var time=0;

var gl;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.1,0.1,0.1,1);
    gl.enable(gl.DEPTH_TEST);
   
    // Add your sphere creation and configuration code here
    Sun = new Sphere();
    Earth = new Sphere();
    Moon = new Sphere();
    Saturn = new Sphere();
    Saturn.color = [1,0.7,0,1];

    Saturn.radius=58232*5; //5x Size for consistency
    Saturn.orbit=1400000000/250; //1/250 Size for visibility

    SaturnRing = new Disk(20, 0.7);
    SaturnRing.color = [1,0.8,0,1];

    SaturnRing.radius=62120*8; //5x Size for consistency

    Sun.radius=695508;
    Sun.color = [1,1,0,1];
    Earth.radius=6371*20; //10x Size for visibility
    Earth.orbit=150000000/50; //1/50 Size for visibility
    Earth.color = [0,1,0,1];
    Moon.radius=1738*20; //10x Size for visibility
    Moon.orbit=382500; //1/2 Size for scale
    Moon.color = [0.8, 0.8, 0.8, 1];
    D=2*Earth.orbit+Moon.orbit+Saturn.radius+Saturn.orbit;
    near=D*4;
    far=near+D;
    fov=2/Math.sin(Math.asin(((D/2)/(near+D/2))));
    aspect=1;
    Sun.P = perspective(fov,1,near,far);
    Earth.P = perspective(fov,1,near,far);
    Moon.P = perspective(fov,1,near,far);
    Saturn.P = perspective(fov,1,near,far);
    SaturnRing.P = perspective(fov,1,near,far);

    requestAnimationFrame(render);
}

function render() {
    
    // Update your motion variables here

    time-=1;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    // Add your rendering sequence here

    ms = new MatrixStack();
    var V = translate(0, 0, -0.5*(near+far));
    ms.load(V);
    ms.push();
        ms.scale(Sun.radius);
        ms.translate(0,0,0);
        Sun.MV = ms.current();
        Sun.render();
    ms.pop();
    ms.push();
        ms.rotate(time, [0,0,1]);
        ms.translate(Earth.orbit,0,0);
        ms.push();
            ms.scale(Earth.radius);
            Earth.MV = ms.current();
            Earth.render();
        ms.pop();
        ms.rotate(time*5, [0,0,1]);
        ms.translate(Moon.orbit,0,0);
        ms.scale(Moon.radius);
        Moon.MV = ms.current();
        Moon.render();
    ms.pop();
    ms.rotate(time/5, [0,0,1]);
    ms.translate(Saturn.orbit,0,0);
    ms.push();
        ms.scale(Saturn.radius);
        Saturn.MV = ms.current();
        Saturn.render();
    ms.pop();
    ms.scale(SaturnRing.radius);
    SaturnRing.MV=ms.current();
    SaturnRing.render();


    requestAnimationFrame(render);
}

window.onload = init;
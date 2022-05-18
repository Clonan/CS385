var time=0;

var gl;

cubeAngle=0;
cuberAngle=0;
rabbitAngle=0;
var zoomed=0;
var zoomTarget=0;
var zoomScale=1;
shrinking1=0;
shrinking2=0;
shrinking3=0;
shrinking4=0;


function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.1,0.1,0.1,1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
   
    CenterXPos=0;
    CenterYPos=0;

/***************************
 *  SOLAR SYSTEM SETUP     *
 ***************************/
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
/***************************
 *  SOLAR SYSTEM SETUP END *
 ***************************/


    cube = new Cube(gl);
    cuber = new Dragon(gl);
    rabbit = new Rabbit(gl);
    canvas.addEventListener("click", onClick, false);

    requestAnimationFrame(render);
}

function render() {
    
    // Update your motion variables here

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    // Add your rendering sequence here

    ms = new MatrixStack()

    if(zoomTarget==1){
        if(CenterXPos>-0.5){
            CenterXPos-=0.025;
            CenterYPos-=0.025;
        }
        cubeAngle+=1;
        if (zoomScale<5) {
            zoomScale+=0.1;
        }
    } else if(zoomTarget==2){
        if(CenterXPos>-0.5){
            CenterXPos-=0.025;
            CenterYPos+=0.025;
        }
        time+=1;
        if (zoomScale<5) {
            zoomScale+=0.1;
        }
    } else if(zoomTarget==3){
        if(CenterXPos<0.5){
            CenterXPos+=0.025;
            CenterYPos-=0.025;
        }
        rabbitAngle+=1;
        if (zoomScale<5) {
            zoomScale+=0.1;
        }
    } else if(zoomTarget==4){
        if(CenterXPos<0.5){
            CenterXPos+=0.025;
            CenterYPos+=0.025;
        }
        cuberAngle+=1;
        if (zoomScale<5) {
            zoomScale+=0.1;
        }
    } else {
        CenterXPos=0;
        CenterYPos=0;
        if(zoomScale>1) {
            zoomScale-=0.5;
        } else {
            shrinking1=0;
            shrinking2=0;
            shrinking3=0;
            shrinking4=0;
        }
    }
    ms.push();
        ms.translate(0.5+CenterXPos, 0.5+CenterYPos, 0);
        ms.scale(0.1);
        if((zoomed&&zoomTarget==1)||shrinking1) {
            ms.scale(zoomScale);
            shrinking1=1;
        }
        ms.rotate(cubeAngle, [1, 1.2, 1.4]);
        cube.MV=ms.current();
        cube.render();
    ms.pop();

    ms.push();
        ms.translate(-0.5+CenterXPos, -0.6+CenterYPos, 0);
        if(zoomed==1&&zoomTarget==4||shrinking4) {
            ms.scale(zoomScale);
            ms.translate(0,-0.015*zoomScale,0);
            shrinking4=1;
        }
        ms.rotate(cuberAngle, [0, 1, 0]);
        cuber.MV=ms.current();
        cuber.render();
    ms.pop();

    ms.push();
        ms.translate(-0.5+CenterXPos, 0.4+CenterYPos, 0);
        if(zoomed==1&&zoomTarget==3||shrinking3) {
            ms.scale(zoomScale);
            ms.translate(0,-0.015*zoomScale,0);
            shrinking3=1;
        }
        ms.scale(1);
        ms.rotate(rabbitAngle, [0, 1, 0]);
        rabbit.MV=ms.current();
        rabbit.render();
    ms.pop();

    ms.push();
        var V = translate(CenterXPos, CenterYPos, -0.5*(near+far));
        ms.load(V);
        ms.scale(0.5)
        if(zoomed==1&&zoomTarget==2||shrinking2) {
            ms.scale(zoomScale*3/5);
            shrinking2=1;
        }
        ms.translate(Saturn.orbit*1.5+CenterXPos*Sun.radius*25, -Saturn.orbit*1.5+CenterYPos*Sun.radius*25, 0);
        ms.rotate(40, [1, 0, 0]);
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
        ms.push();
            ms.scale(SaturnRing.radius);
            SaturnRing.MV=ms.current();
            SaturnRing.render();
        ms.pop();
    ms.pop();

    requestAnimationFrame(render);
}

function onClick(ev, gl, canvas) {
    var xPosition = ev.clientX;
    var yPosition = ev.clientY;
    console.log(xPosition+" "+yPosition);
    time=0;
    cubeAngle=0;
    cuberAngle=0;
    rabbitAngle=0;
    if (zoomed==0) {
        if(xPosition>560&&xPosition<655&&yPosition>156&&yPosition<254){
            zoomed=1;
            zoomTarget=1;
        } else if(xPosition>150&&xPosition<250&&yPosition>150&&yPosition<250){
            zoomed=1;
            zoomTarget=3;
        } else if(xPosition>170&&xPosition<250&&yPosition>560&&yPosition<650){
            zoomed=1;
            zoomTarget=4;
        } else if(xPosition>550&&xPosition<750&&yPosition>550&&yPosition<650){
            zoomed=1;
            zoomTarget=2;
        }
    } else {
        zoomed=0;
        zoomTarget=0;
    }
}
function initTexture () { 
    texture = gl.createTexture(); 
    texImage = new Image(); 
    texImage.onload = function () { 
        loadTexture(image, texture); 
    }; 
    texImage.src = "Dirt.png"; 
}

function loadTexture(image, texture) { 
    gl.bindTexture(gl.TEXTURE_2D, texture); 
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  
        gl.RGBA, gl.UNSIGNED_BYTE, image); 
    gl.texParameteri(gl.TEXTURE_2D,    
        gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
    gl.texParameteri(gl.TEXTURE_2D, 
        gl.TEXTURE_MIN_FILTER,  
        gl.LINEAR_MIPMAP_NEAREST); 
    gl.generateMipmap(gl.TEXTURE_2D); 
    gl.bindTexture(gl.TEXTURE_2D, null); 
}

window.onload = init;
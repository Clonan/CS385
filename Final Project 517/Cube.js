    function Cube() {
        var program = initShaders(gl, "Cube-vertex-shader", "Cube-fragment-shader");
        texture1 = initTexture();

        var MV = gl.getUniformLocation(program, "MV");
        this.MV = mat4();

        var P = gl.getUniformLocation(program, "P");
        this.P = mat4();

        this.render = function () {
            gl.useProgram( program );

            gl.uniformMatrix4fv(MV, false, flatten(this.MV));
            gl.uniformMatrix4fv(P, false, flatten(this.P));

            gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, 6);
        }
    }
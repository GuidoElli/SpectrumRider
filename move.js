var audio_ground_vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;
out vec3 position;

uniform mat4 matrix; 
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
    fsNormal = mat3(nMatrix) * normalize(inNormal); 
    gl_Position = matrix * vec4(inPosition, 1.0);
    position = inPosition;
}`;

var audio_ground_fs = `#version 300 es

precision mediump float;

in vec3 position;
in vec3 fsNormal;
out vec4 outColor;

uniform vec3 lightDirection; 
uniform vec3 lightColor; 
uniform mat4 lightDirMatrix;       

void main() {
    vec3 nNormal = normalize(fsNormal);
    vec3 lDir = mat3(lightDirMatrix) * lightDirection; 
    vec3 color = vec3(position.y/2.0, position.y/2.0, position.y/2.0);
    vec3 lambertColor = color * lightColor * max(-dot(lDir,nNormal), 0.0);
    //outColor = vec4(clamp(lambertColor, 0.0, 1.0), 1.0);
    outColor = vec4(color, 1.0);
}`;

function main() {

    var audio_ground_program = null;
    var audio_ground_world_matrix = null;

    //define directional light
    var dirLightAlpha = -utils.degToRad(60);
    var dirLightBeta  = -utils.degToRad(120);
    var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
              Math.sin(dirLightAlpha),
              Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
              ];
    var directionalLightColor = [0.1, 1.0, 1.0];

    var lastUpdateTime = (new Date).getTime();

    var canvas = document.getElementById("c");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    utils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, audio_ground_vs);
    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, audio_ground_fs);
    var audio_ground_program = utils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(audio_ground_program);

    var positionAttributeLocation = gl.getAttribLocation(audio_ground_program, "inPosition");  
    var normalAttributeLocation = gl.getAttribLocation(audio_ground_program, "inNormal");  
    var matrixLocation = gl.getUniformLocation(audio_ground_program, "matrix");
    var lightDirectionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirection');
    var lightColorHandle = gl.getUniformLocation(audio_ground_program, 'lightColor');
    var normalMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'nMatrix');
    var lightDirMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirMatrix');

    var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

    var vao = gl.createVertexArray();

    gl.bindVertexArray(vao);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_vert), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_norm), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(audio_ground_ind), gl.STATIC_DRAW); 

    var audio_ground_delta_Z = 0;
    
    
    drawScene();
    

    function animate(){
        var currentTime = (new Date).getTime(); // TODO: get time from song
        if(lastUpdateTime){
            audio_ground_delta_Z += .03 * (currentTime - lastUpdateTime);
        }

        audio_ground_world_matrix = utils.MakeWorld( 0.0, 0.0, audio_ground_delta_Z,   0.0, 0.0, 0.0,   80.0, 5.0, 1000.0);

        lastUpdateTime = currentTime;               
    }



    function drawScene() {
        animate();

        gl.clearColor(0.85, 0.85, 0.85, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // Audio Ground
        var viewMatrix = utils.MakeView(0.0, 20.0, -10.0, -35.0, 0.0);

        var lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));
        var worldViewMatrix = utils.multiplyMatrices(viewMatrix, audio_ground_world_matrix);
        var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);
        normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

        gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));
        gl.uniformMatrix4fv(lightDirMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(lightDirMatrix));
        gl.uniform3fv(lightColorHandle, directionalLightColor);
        gl.uniform3fv(lightDirectionHandle, directionalLight);

        gl.bindVertexArray(vao);
        gl.drawElements(gl.TRIANGLES, audio_ground_ind.length, gl.UNSIGNED_SHORT, 0 );

        window.requestAnimationFrame(drawScene);
    }



}



main();

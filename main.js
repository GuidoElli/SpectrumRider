function main() {

    // program
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    
    vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, audio_ground_vs);
    fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, audio_ground_fs);
    audio_ground_program = utils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(audio_ground_program);
    
    positionAttributeLocation = gl.getAttribLocation(audio_ground_program, "inPosition");
    normalAttributeLocation = gl.getAttribLocation(audio_ground_program, "inNormal");
    matrixLocation = gl.getUniformLocation(audio_ground_program, "matrix");
    lightDirectionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirection');
    lightColorHandle = gl.getUniformLocation(audio_ground_program, 'lightColor');
    normalMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'nMatrix');
    lightDirMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirMatrix');
    
    audio_ground_vao = [];
    for(let i = 0; i < audio_ground_vert.length; ++i){
        audio_ground_vao[i] = gl.createVertexArray();
        gl.bindVertexArray(audio_ground_vao[i]);
        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_vert[i]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_norm[i]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(audio_ground_ind[i]), gl.STATIC_DRAW); 
    }

    draw();
}



//to do in python
var pattern_power = [];
var pattern_bass = [];
var pattern_mid = [];
var pattern_high = [];
var song_duration = undefined;


//audio ground
var audio_ground_scale_x = 200.0;
var audio_ground_scale_y = 35.0;
var audio_ground_scale_z = 240.0;
var audio_ground_delta_z = 0.0;

//scene
var seconds_to_see = 8;

//camera
var camera_x = 0.0;
var camera_y = 37.0;
var camera_z = 1.1 * audio_ground_scale_z;
var camera_elev = -25.0;
var camera_angle = 0.0;

//directional light
var dirLightAlpha = -utils.degToRad(70.0);
var dirLightBeta  = -utils.degToRad(30.0);
var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
          Math.sin(dirLightAlpha),
          Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
          ];
var directionalLightColor = [0.7, 1.0, 0.7];


// key controls
document.addEventListener("keydown" ,function(e) { // TODO
    switch (e.keyCode) {
        case 38:
            camera_y += 5;
            break;
        case 40:
            camera_y -= 5;
            break;
        case 39:
            camera_x += 5;
            break;
        case 37:
            camera_x -= 5;
            break;
    }
})


var song_begun = false;
var start_time;
var audio = document.getElementById("song");

let start_button = document.getElementById("start_button");
start_button.addEventListener("mouseup", function(){
    audio.load();
    audio.play();
    audio.ontimeupdate = function () {
        if(!song_begun){
            song_begun = true;
            start_time = (new Date).getTime();
        }
    }

    document.documentElement.requestFullscreen();
    canvas = document.getElementById("c");
    canvas.width = screen.width;
    canvas.height = screen.height;
    canvas.style.display = "block";
    app_section = document.getElementById("app_section");
    app_section.style.display = "none";
    main();
})

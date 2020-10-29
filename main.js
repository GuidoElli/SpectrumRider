
//to do in python
var pattern_power = [];
var pattern_bass = [];
var pattern_mid = [];
var pattern_high = [];
var song_duration = undefined;
var audio_ground_shape = [36, 17];


//audio ground
var audio_ground_scale_x = 200.0;
var audio_ground_scale_y = 35.0;
var audio_ground_scale_z = 240.0;

//scene
var seconds_to_see = 6;

//camera
var camera_x = 0.0;
var camera_x_min = -audio_ground_scale_x/2 * 0.95;
var camera_x_max = audio_ground_scale_x/2 * 0.95;

var camera_y = audio_ground_scale_y+2+1e-10;
var camera_y_min = audio_ground_scale_y;
var camera_y_max = audio_ground_scale_y/2 * 0.95;

var camera_z_offset = 0.1 * audio_ground_scale_z;
var camera_z = 0.0;

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


let canvas = document.getElementById("c");
let synchronized = false;
let song_begun = false;
let song_start_time = undefined;
let song = document.getElementById("song");
let start_button = document.getElementById("start_button");
start_button.addEventListener("mouseup", function(){
    song.load();
    song.play().then(function () {
        song_begun = true;
        song_start_time = (new Date).getTime();
    });
    canvas.style.display = "block";
    let menu = document.getElementById("menu");
    menu.style.display = "none";
    document.documentElement.requestFullscreen().then(() => {
        draw();
    })
})

song.ontimeupdate = function (event) {
    let current = (new Date).getTime();
    if(!song_begun){
        song_start_time = current;
        song_begun = true;
    }else{
        if(!synchronized){
            synchronized = true;
            song_start_time = current - song.currentTime * 1000;
        }
    }
}



// program
let gl = canvas.getContext("webgl2");
canvas.width = screen.width;
canvas.height = screen.height;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);

let vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, audio_ground_vs);
let fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, audio_ground_fs);
let audio_ground_program = utils.createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(audio_ground_program);

let positionAttributeLocation = gl.getAttribLocation(audio_ground_program, "inPosition");
let normalAttributeLocation = gl.getAttribLocation(audio_ground_program, "inNormal");
let matrixLocation = gl.getUniformLocation(audio_ground_program, "matrix");
let lightDirectionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirection');
let lightColorHandle = gl.getUniformLocation(audio_ground_program, 'lightColor');
let normalMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'nMatrix');
let lightDirMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirMatrix');

let audio_ground_vao = [];
for(let i = 0; i < audio_ground_vert.length; ++i){
    audio_ground_vao[i] = gl.createVertexArray();
    gl.bindVertexArray(audio_ground_vao[i]);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_vert[i]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_norm[i]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(audio_ground_ind[i]), gl.STATIC_DRAW);
}

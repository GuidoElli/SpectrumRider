let coins_ground = [];
for(let i = 0; i < items_00.length; i++){
    coins_ground[i] = new Coin_ground(items_00[i][0], items_00[i][1], items_00[i][2]);
}













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
    });
    canvas.style.display = "block";
    let menu = document.getElementById("menu");
    menu.style.display = "none";
    document.documentElement.requestFullscreen().then(() => {
        draw();
    })
})

song.ontimeupdate = function () {
    let current = (new Date).getTime();
    if(!song_begun){
        song_begun = true;
    }else if(!synchronized){
        song_start_time = current - song.currentTime * 1000;
        synchronized = true;
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





// Audio Ground
let audio_ground_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, audio_ground_vs);
let audio_ground_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, audio_ground_fs);
let audio_ground_program = utils.createProgram(gl, audio_ground_vertex_shader, audio_ground_fragment_shader);
gl.useProgram(audio_ground_program);

let audio_ground_position_attribute = gl.getAttribLocation(audio_ground_program, 'inPosition');
let audio_ground_normal_attribute = gl.getAttribLocation(audio_ground_program, 'inNormal');
let audio_ground_matrix_uniform = gl.getUniformLocation(audio_ground_program, 'matrix');
let audio_ground_normal_matrix_uniform = gl.getUniformLocation(audio_ground_program, 'nMatrix');
let audio_ground_tot_seconds_uniform = gl.getUniformLocation(audio_ground_program, 'totSeconds');
let audio_ground_current_song_percentage_uniform = gl.getUniformLocation(audio_ground_program, 'currentSongPercentage');
let audio_ground_bass_light_uniform = gl.getUniformLocation(audio_ground_program, 'bassIntensity');
let audio_ground_mid_light_uniform = gl.getUniformLocation(audio_ground_program, 'midIntensity');
let audio_ground_high_light_uniform = gl.getUniformLocation(audio_ground_program, 'highIntensity');

let audio_ground_vao = [];
let audio_ground_position_buffer = [];
let audio_ground_normal_buffer = [];
let audio_ground_index_buffer = [];
for(let i = 0; i < audio_ground_vert.length; ++i){

    audio_ground_vao[i] = gl.createVertexArray();
    gl.bindVertexArray(audio_ground_vao[i]);

    audio_ground_position_buffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, audio_ground_position_buffer[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_vert[i]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(audio_ground_position_attribute);
    gl.vertexAttribPointer(audio_ground_position_attribute, 3, gl.FLOAT, false, 0, 0);

    audio_ground_normal_buffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, audio_ground_normal_buffer[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_norm[i]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(audio_ground_normal_attribute);
    gl.vertexAttribPointer(audio_ground_normal_attribute, 3, gl.FLOAT, false, 0, 0);

    audio_ground_index_buffer[i] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, audio_ground_index_buffer[i]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(audio_ground_ind[i]), gl.STATIC_DRAW);
}




// Player
let player_vert = [0.0, 1.0, 0.0];
let player_norm = [0.0, 1.0, 0.0];
///// Creates vertices
let k = 3;
for(let j = 1; j < 18; j++) {
    for(let i = 0; i < 36; i++) {
        let x = Math.sin(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
        let y = Math.cos(j*10.0/180.0*Math.PI);
        let z = Math.cos(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
        player_norm[k] = x;
        player_vert[k++] = x;
        player_norm[k] = y;
        player_vert[k++] = y;
        player_norm[k] = z;
        player_vert[k++] = z;
    }
}
let lastVert = k;
player_norm[k] = 0.0;
player_vert[k++] = 0.0;
player_norm[k] = -1.0;
player_vert[k++] = -1.0;
player_norm[k] = 0.0;
player_vert[k++] = 0.0;
////// Creates indices
let player_ind = [];
k = 0;
///////// Lateral part
for(let i = 0; i < 36; i++) {
    for(let j = 1; j < 17; j++) {
        player_ind[k++] = i + (j-1) * 36 + 1;
        player_ind[k++] = i + j * 36 + 1;
        player_ind[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
        player_ind[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
        player_ind[k++] = i + j * 36 + 1;
        player_ind[k++] = (i + 1) % 36 + j * 36 + 1;
    }
}
//////// Upper Cap
for(let i = 0; i < 36; i++) {
    player_ind[k++] = 0;
    player_ind[k++] = i + 1;
    player_ind[k++] = (i + 1) % 36 + 1;
}
//////// Lower Cap
for(let i = 0; i < 36; i++) {
    player_ind[k++] = lastVert;
    player_ind[k++] = (i + 1) % 36 + 541;
    player_ind[k++] = i + 541;
}

let player_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, player_vs);
let player_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, player_fs);
let player_program = utils.createProgram(gl, player_vertex_shader, player_fragment_shader);
gl.useProgram(player_program);

let player_position_attribute = gl.getAttribLocation(player_program, 'inPosition');
let player_normal_attribute = gl.getAttribLocation(player_program, 'inNormal');
let player_matrix_uniform = gl.getUniformLocation(player_program, 'matrix');
let player_normal_matrix_uniform = gl.getUniformLocation(player_program, 'nMatrix');

let player_vao = gl.createVertexArray();
gl.bindVertexArray(player_vao);

let player_position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, player_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player_vert), gl.STATIC_DRAW);
gl.enableVertexAttribArray(player_position_attribute);
gl.vertexAttribPointer(player_position_attribute, 3, gl.FLOAT, false, 0, 0);

let player_normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, player_normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player_norm), gl.STATIC_DRAW);
gl.enableVertexAttribArray(player_normal_attribute);
gl.vertexAttribPointer(player_normal_attribute, 3, gl.FLOAT, false, 0, 0);

let player_index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, player_index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(player_ind), gl.STATIC_DRAW);




//objects
//coins on ground
let coin_ground_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, coin_ground_vs);
let coin_ground_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, coin_ground_fs);
let coin_ground_program = utils.createProgram(gl, coin_ground_vertex_shader, coin_ground_fragment_shader);
gl.useProgram(coin_ground_program);

let coin_ground_position_attribute = gl.getAttribLocation(coin_ground_program, 'inPosition');
let coin_ground_normal_attribute = gl.getAttribLocation(coin_ground_program, 'inNormal');
let coin_ground_matrix_uniform = gl.getUniformLocation(coin_ground_program, 'matrix');
let coin_ground_normal_matrix_uniform = gl.getUniformLocation(coin_ground_program, 'nMatrix');

let coin_ground_vao = gl.createVertexArray();
gl.bindVertexArray(coin_ground_vao);

let coin_ground_position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, coin_ground_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player_vert), gl.STATIC_DRAW);//TODO
gl.enableVertexAttribArray(coin_ground_position_attribute);
gl.vertexAttribPointer(coin_ground_position_attribute, 3, gl.FLOAT, false, 0, 0);

let coin_ground_normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, coin_ground_normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player_norm), gl.STATIC_DRAW);
gl.enableVertexAttribArray(coin_ground_normal_attribute);
gl.vertexAttribPointer(coin_ground_normal_attribute, 3, gl.FLOAT, false, 0, 0);

let coin_ground_index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coin_ground_index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(player_ind), gl.STATIC_DRAW);

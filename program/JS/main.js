let coins_ground;
let coins_lv1;
let coins_lv2;
let coins_lv3;
let coins_all;

let items_2x;
let items_5x;
let items_10x;
let items_xx_all;

let score_manager;

this.vertex_shader = utils.createShader(this.gl, this.gl.VERTEX_SHADER, this.vs_text);
this.fragment_shader = utils.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fs_text);
this.program = utils.createProgram(this.gl, this.vertex_shader, this.fragment_shader);

function init(){
    score_manager = new Score_manger();

    //Coins
    coins_ground = [];
    for(let i = 0; i < items_00.length; i++){
        coins_ground[i] = new Coin_ground(items_00[i][0], items_00[i][1], items_00[i][2]);
    }
    coins_lv1 = [];
    for(let i = 0; i < items_10.length; i++){
        coins_lv1[i] = new Coin_lv1(items_10[i][0], items_10[i][1], items_10[i][2]);
    }
    coins_lv2 = [];
    for(let i = 0; i < items_20.length; i++){
        coins_lv2[i] = new Coin_lv2(items_20[i][0], items_20[i][1], items_20[i][2]);
    }
    coins_lv3 = [];
    for(let i = 0; i < items_30.length; i++){
        coins_lv3[i] = new Coin_lv3(items_30[i][0], items_30[i][1], items_30[i][2]);
    }
    coins_all = coins_ground.concat(coins_lv1.concat(coins_lv2.concat(coins_lv3)));


    items_2x = [];
    for(let i = 0; i < items_11.length; i++){
        items_2x[i] = new Item_2x(items_11[i][0], items_11[i][1], items_11[i][2]);
    }
    items_5x = [];
    for(let i = 0; i < items_21.length; i++){
        items_5x[i] = new Item_5x(items_21[i][0], items_21[i][1], items_21[i][2]);
    }
    items_10x = [];
    for(let i = 0; i < items_31.length; i++){
        items_10x[i] = new Item_10x(items_31[i][0], items_31[i][1], items_31[i][2]);
    }
    items_xx_all = items_2x.concat(items_5x.concat(items_10x));
}


function start_game(){
    init();
    show_screen("loading");
    playing = true;
    song.currentTime = 0;
    song.play().then(function () {
        song_begun = true;
    });
    song.ontimeupdate = function () {
        let current = (new Date).getTime();
        if(!song_begun){
            song_begun = true;
        }else if(!synchronized && playing){
            song_start_time = current - song.currentTime * 1000;
            synchronized = true;
            show_screen("game");
            in_game = true;
            draw();
        }
    }
}

function end_game(){
    score.innerHTML = score_manager.tot_points;
    show_screen("game_over");
    playing = false;
    song.pause();
    in_game = false;
    synchronized = false;
}

function exit_game(){
    show_screen("menu");
    playing = false;
    song.pause();
    in_game = false;
    synchronized = false;
}

function pause_game(){
    show_screen("pause");
    playing = false;
    synchronized = false;
    song.pause();
}

function resume_game(){
    show_screen("loading");
    playing = true;
    song.play();
}


// program
init();
window.addEventListener("load", () => {
    show_screen("menu");
})

let song_begun = false;
let song_start_time;

let start_button = document.getElementById("start_button");
start_button.addEventListener("mouseup", function (){
    document.documentElement.requestFullscreen()
    start_game();
})

let options_button = document.getElementById("options_button");
options_button.addEventListener("mouseup", function (){
    show_screen("options");
})


let menu_button = document.getElementById("menu_button");
menu_button.addEventListener("mouseup", function (){
    show_screen("menu");
})

let play_again_button = document.getElementById("play_again_button");
play_again_button.addEventListener("mouseup", function (){
    start_game();
})

let resume_button = document.getElementById("resume_button");
resume_button.addEventListener("mouseup", function (){
    resume_game();
})

let pause_menu_button = document.getElementById("pause_menu_button");
pause_menu_button.addEventListener("mouseup", function (){
    exit_game();
})
let pause_restart_button = document.getElementById("pause_restart_button");
pause_restart_button.addEventListener("mouseup", function (){
    start_game();
})

let options_back_button = document.getElementById("options_back_button");
options_back_button.addEventListener("mouseup", function (){
    show_screen("menu");
})

let score = document.getElementById("score");


//song
let song = document.getElementById("song");
song.load();

let canvasText = document.getElementById("text2d");
let ctx_2d = canvasText.getContext("2d");
canvasText.width = screen.width;
canvasText.height = screen.height;

let canvas3d = document.getElementById("webgl");
let gl = canvas3d.getContext("webgl2");
canvas3d.width = screen.width;
canvas3d.height = screen.height;
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);





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







//objects

//coins on ground
let coin_obj = parseObjText(obj_semiminima_text, false);
let coin_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, coin_vs);
let coin_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, coin_fs);
let coin_program = utils.createProgram(gl, coin_vertex_shader, coin_fragment_shader);
gl.useProgram(coin_program);

let coin_position_attribute = gl.getAttribLocation(coin_program, 'inPosition');
let coin_normal_attribute = gl.getAttribLocation(coin_program, 'inNormal');
let coin_matrix_uniform = gl.getUniformLocation(coin_program, 'matrix');
let coin_normal_matrix_uniform = gl.getUniformLocation(coin_program, 'nMatrix');
let coin_bass_light_uniform = gl.getUniformLocation(coin_program, 'bassIntensity');

let coin_vao = gl.createVertexArray();
gl.bindVertexArray(coin_vao);

let coin_position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, coin_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coin_obj.vert), gl.STATIC_DRAW);
gl.enableVertexAttribArray(coin_position_attribute);
gl.vertexAttribPointer(coin_position_attribute, 3, gl.FLOAT, false, 0, 0);

let coin_normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, coin_normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coin_obj.norm), gl.STATIC_DRAW);
gl.enableVertexAttribArray(coin_normal_attribute);
gl.vertexAttribPointer(coin_normal_attribute, 3, gl.FLOAT, false, 0, 0);

let coin_index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coin_index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(coin_obj.ind), gl.STATIC_DRAW);


//item 2x, 5x, 10x


// Access the models by array index
let note_obj = parseObjText(obj_doppiacroma_text, false);

let item_2x_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, item_2x_vs);
let item_2x_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, item_2x_fs);
let item_2x_program = utils.createProgram(gl, item_2x_vertex_shader, item_2x_fragment_shader);
gl.useProgram(item_2x_program);

let item_2x_position_attribute = gl.getAttribLocation(item_2x_program, 'inPosition');
let item_2x_normal_attribute = gl.getAttribLocation(item_2x_program, 'inNormal');
let item_2x_matrix_uniform = gl.getUniformLocation(item_2x_program, 'matrix');
let item_2x_normal_matrix_uniform = gl.getUniformLocation(item_2x_program, 'nMatrix');

let item_2x_vao = gl.createVertexArray();
gl.bindVertexArray(item_2x_vao);

let item_2x_position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, item_2x_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(note_obj.vert), gl.STATIC_DRAW);
gl.enableVertexAttribArray(item_2x_position_attribute);
gl.vertexAttribPointer(item_2x_position_attribute, 3, gl.FLOAT, false, 0, 0);

let item_2x_normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, item_2x_normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(note_obj.norm), gl.STATIC_DRAW);
gl.enableVertexAttribArray(item_2x_normal_attribute);
gl.vertexAttribPointer(item_2x_normal_attribute, 3, gl.FLOAT, false, 0, 0);

let item_2x_index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, item_2x_index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(note_obj.ind), gl.STATIC_DRAW);


let stand_obj = parseObjText(obj_chiavedisol_text, false);

let item_5x_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, item_5x_vs);
let item_5x_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, item_5x_fs);
let item_5x_program = utils.createProgram(gl, item_5x_vertex_shader, item_5x_fragment_shader);
gl.useProgram(item_5x_program);

let item_5x_position_attribute = gl.getAttribLocation(item_5x_program, 'inPosition');
let item_5x_normal_attribute = gl.getAttribLocation(item_5x_program, 'inNormal');
let item_5x_matrix_uniform = gl.getUniformLocation(item_5x_program, 'matrix');
let item_5x_normal_matrix_uniform = gl.getUniformLocation(item_5x_program, 'nMatrix');

let item_5x_vao = gl.createVertexArray();
gl.bindVertexArray(item_5x_vao);

let item_5x_position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, item_5x_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stand_obj.vert), gl.STATIC_DRAW);
gl.enableVertexAttribArray(item_5x_position_attribute);
gl.vertexAttribPointer(item_5x_position_attribute, 3, gl.FLOAT, false, 0, 0);

let item_5x_normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, item_5x_normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stand_obj.norm), gl.STATIC_DRAW);
gl.enableVertexAttribArray(item_5x_normal_attribute);
gl.vertexAttribPointer(item_5x_normal_attribute, 3, gl.FLOAT, false, 0, 0);

let item_5x_index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, item_5x_index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(stand_obj.ind), gl.STATIC_DRAW);





let item10_obj = parseObjText(obj_semicroma_text, false);

let item_10x_vertex_shader = utils.createShader(gl, gl.VERTEX_SHADER, item_10x_vs);
let item_10x_fragment_shader = utils.createShader(gl, gl.FRAGMENT_SHADER, item_10x_fs);
let item_10x_program = utils.createProgram(gl, item_10x_vertex_shader, item_10x_fragment_shader);
gl.useProgram(item_10x_program);

let item_10x_position_attribute = gl.getAttribLocation(item_10x_program, 'inPosition');
let item_10x_normal_attribute = gl.getAttribLocation(item_10x_program, 'inNormal');
let item_10x_matrix_uniform = gl.getUniformLocation(item_10x_program, 'matrix');
let item_10x_normal_matrix_uniform = gl.getUniformLocation(item_10x_program, 'nMatrix');

let item_10x_vao = gl.createVertexArray();
gl.bindVertexArray(item_10x_vao);

let item_10x_position_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, item_10x_position_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item10_obj.vert), gl.STATIC_DRAW);
gl.enableVertexAttribArray(item_10x_position_attribute);
gl.vertexAttribPointer(item_10x_position_attribute, 3, gl.FLOAT, false, 0, 0);

let item_10x_normal_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, item_10x_normal_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(item10_obj.norm), gl.STATIC_DRAW);
gl.enableVertexAttribArray(item_10x_normal_attribute);
gl.vertexAttribPointer(item_10x_normal_attribute, 3, gl.FLOAT, false, 0, 0);

let item_10x_index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, item_10x_index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(item10_obj.ind), gl.STATIC_DRAW);

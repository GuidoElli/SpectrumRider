
let max_delta_t_ms = 100;
let stretch_correction = 1 + 0.17 / 270;
let time_correction = 0;


//audio ground
let audio_ground_scale_x = 4.5;
let audio_ground_scale_y = 0.7;
let audio_ground_scale_z = 5.0;

//scene

let seconds_to_see = 5;
let current_z = 0;
let current_song_percentage = 0;
let current_time = 0;
let elapsed_time = 0;
let last_update_time = 0;

let synchronized = false;

//camera
let camera_x = 0.0;

let camera_y_min = audio_ground_scale_y * 2.1;
let camera_y = camera_y_min;

let camera_z_offset_min = 1.8;
let camera_z_offset = camera_z_offset_min;
let camera_fov = 80;

let camera_elev = -10.0;
let camera_angle = 0.0;


//lights
let current_bass_light = 0.0;
let current_mid_light = 0.0;
let current_high_light = 0.0;


//enviroment
let gravity = 10; // unitary mass (no acceleration parameters)
let x_force = 18 * audio_ground_scale_x;
let down_force = gravity * 6.0;
let max_vel_y_up_button = 1.4 * audio_ground_scale_y;
let up_force = gravity * 3;
let player_max_vel_x = 1.05 * audio_ground_scale_x;
let player_max_pos_x = audio_ground_scale_x / 2 * 0.97;
let player_max_pos_y = audio_ground_scale_y * 12;
let player_max_vel_y_up = 15 * audio_ground_scale_y;
let player_scale = audio_ground_scale_x * 0.025;
let player_y_offset = player_scale * 2;

let touching_ground = false;
let last_z_index = 0;
let last_x_index = 0;
let new_vert = false;
let last_max_diff = 0;

let player_force_x = 0.0;
let player_vel_x = 0.0;
let player_pos_x = 0.0;
let player_force_y = 0.0;
let player_vel_y = 0.0;
let player_pos_y = audio_ground_scale_y * 1.1;


// colors
let gl_clear_color = {
    r: 0.0,
    g: 0.0,
    b: 0.0
}

//keyboard
let up_pressed = false;
let down_pressed = false;
let right_pressed = false;
let left_pressed = false;



let playing = false;
let in_game = false;


function show_screen(s){
    let menu = document.getElementById("menu");
    let game = document.getElementById("game");
    let options = document.getElementById("options");
    let game_over = document.getElementById("game_over");
    let pause = document.getElementById("pause");
    let loading = document.getElementById("loading");
    menu.style.display = "none";
    game.style.display = "none";
    options.style.display = "none";
    game_over.style.display = "none";
    pause.style.display = "none";
    loading.style.display = "none";

    playing = false;

    switch (s){
        case "menu":
            menu.style.display = "block";
            break;
        case "game":
            game.style.display = "block";
            playing = true;
            break;
        case "options":
            options.style.display = "block";
            break;
        case "game_over":
            game_over.style.display = "block";
            break;
        case "pause":
            pause.style.display = "block";
            break;
        case "loading":
            loading.style.display = "block";
            break;
    }
}

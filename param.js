
//audio ground
let audio_ground_scale_x = 3.5;
let audio_ground_scale_y = 0.7;
let audio_ground_scale_z = 4.5;

//scene
let correction_coeff = 1 + 0.17 / 270;

let seconds_to_see = 6;
let current_z = 0;
let current_song_percentage = 0;
let current_time = 0;
let elapsed_time = 0;
let last_update_time = 0;

//camera
let camera_x = 0.0;

let camera_y_min = audio_ground_scale_y * 1.5;
let camera_y = camera_y_min;

let camera_z_offset_min = 1.3;
let camera_z_offset_max = 1.9;
let camera_z_offset = 0.9;
let camera_fov = 70;

let camera_elev = -22.0;
let camera_angle = 0.0;


//lights
let current_bass_light = 0.0;
let current_mid_light = 0.0;
let current_high_light = 0.0;


//enviroment
let gravity = 9; // unitary mass (no acceleration parameters)
let x_force = 20 * audio_ground_scale_x;
let down_force = gravity * 7.0;
let max_vel_y_up_button = 2 * audio_ground_scale_y;
let up_force = gravity * 4.5;
let player_max_vel_x = 1.05 * audio_ground_scale_x;
let player_max_pos_x = audio_ground_scale_x / 2 * 0.97;
let player_max_pos_y = audio_ground_scale_y * 20;
let player_max_vel_y_up = 12 * audio_ground_scale_y;
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


// objects
let taken_items = new Array(items_00.length).fill(false); //TODO false

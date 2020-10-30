//to do in python
// let pattern_bass = [];
// let pattern_mid = [];
// let pattern_high = [];
// let song_duration = undefined;
// let audio_ground_shape = [36, 17];

//audio ground
let audio_ground_scale_x = 250.0;
let audio_ground_scale_y = 40.0;
let audio_ground_scale_z = 500.0;

//scene
let seconds_to_see = 10;
let current_z = 0.0;
let current_song_percentage = 0.0;
let current_time = 0;
let elapsed_time = 0;
let last_update_time = 0;

//camera
let camera_x = 0.0;
let camera_x_min = -audio_ground_scale_x/2 * 0.95;
let camera_x_max = audio_ground_scale_x/2 * 0.95;

let camera_y = audio_ground_scale_y+2+1e-10;
let camera_y_min = audio_ground_scale_y;
let camera_y_max = audio_ground_scale_y/2 * 0.95;

let camera_z_offset = 0.3 * audio_ground_scale_z;

let camera_elev = -15.0;
let camera_angle = 0.0;




//enviroment
let gravity = 600; // unitary mass (no acceleration parameters)
let x_force = 15000;

//player
let player_max_vel_x = .0008 * audio_ground_scale_x;
let player_max_pos_x = audio_ground_scale_x / 2 * 0.95;
let player_force_x = 0.0;
let player_vel_x = 0.0;
let player_pos_x = 0.0;
let k_friction = 0.1;
let player_vel_y = 0.0;
let player_pos_y = audio_ground_scale_y * 1.1;

let player_scale = audio_ground_scale_x * 0.03;

//keyboard
let up_pressed = false;
let down_pressed = false;
let right_pressed = false;
let left_pressed = false;

let touching_ground = false;
let max_y_diff = 0.0;
let last_z_index = 0;
let last_x_index = 0;
let new_vert = false;

//directional light
let dirLightAlpha = -utils.degToRad(70.0);
let dirLightBeta  = -utils.degToRad(30.0);
let directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(dirLightAlpha),
    Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
];
let directionalLightColor = [0.7, 1.0, 0.7];


//audio ground
let audio_ground_scale_x = 1300.0;
let audio_ground_scale_y = 180.0;
let audio_ground_scale_z = 1700.0;

//scene
let correction_coeff = 1 + 0.2 / 270;

let seconds_to_see = 15;
let current_z = 0.0;
let current_song_percentage = 0.0;
let current_time = 0;
let elapsed_time = 0;
let last_update_time = 0;

//camera
let camera_x_min = -audio_ground_scale_x/2 * 0.95;
let camera_x_max = audio_ground_scale_x/2 * 0.95;
let camera_x = 0.0;

let camera_y_min = audio_ground_scale_y * 1.5;
let camera_y = camera_y_min;

let camera_z_offset = 0.3 * audio_ground_scale_z;
let camera_fov = 70;

let camera_elev = -25.0;
let camera_angle = 0.0;


//lights
let current_bass_light = 0.0;
let current_mid_light = 0.0;
let current_high_light = 0.0;


//enviroment
let gravity = 2500; // unitary mass (no acceleration parameters)
let x_force = 30 * audio_ground_scale_x;
let down_force = gravity * 7.0;
let max_vel_y_up_button = 340.0;
let up_force = gravity * 1.4;

//player
let player_max_vel_x = 0.8 * audio_ground_scale_x;
let player_max_pos_x = audio_ground_scale_x / 2 * 0.95;
let player_force_x = 0.0;
let player_vel_x = 0.0;
let player_pos_x = 0.0;
let k_friction = 0.1;
let player_force_y = 0.0;
let player_vel_y = 0.0;
let player_pos_y = audio_ground_scale_y * 1.1;

let player_scale = audio_ground_scale_x * 0.02;
let player_y_offset = player_scale * 2;

//keyboard
let up_pressed = false;
let down_pressed = false;
let right_pressed = false;
let left_pressed = false;

//motion
let touching_ground = false;
let last_y_diff = 0.0;
let last_z_index = 0;
let last_x_index = 0;
let new_vert = false;
let last_max_diff = 0;
let just_landed = false;


//directional light
let dirLightAlpha = -utils.degToRad(70.0);
let dirLightBeta  = -utils.degToRad(30.0);
let directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(dirLightAlpha),
    Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
];
let directionalLightColor = [0.7, 1.0, 0.7];

//to do in python
// let pattern_bass = [];
// let pattern_mid = [];
// let pattern_high = [];
// let song_duration = undefined;
// let audio_ground_shape = [36, 17];

//audio ground
let audio_ground_scale_x = 200.0;
let audio_ground_scale_y = 35.0;
let audio_ground_scale_z = 240.0;

//scene
let seconds_to_see = 6;

//camera
let camera_x = 0.0;
let camera_x_min = -audio_ground_scale_x/2 * 0.95;
let camera_x_max = audio_ground_scale_x/2 * 0.95;

let camera_y = audio_ground_scale_y+2+1e-10;
let camera_y_min = audio_ground_scale_y;
let camera_y_max = audio_ground_scale_y/2 * 0.95;

let camera_z_offset = 0.2 * audio_ground_scale_z;
let camera_z = 0.0;

let camera_elev = -25.0;
let camera_angle = 0.0;

//directional light
let dirLightAlpha = -utils.degToRad(70.0);
let dirLightBeta  = -utils.degToRad(30.0);
let directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
    Math.sin(dirLightAlpha),
    Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
];
let directionalLightColor = [0.7, 1.0, 0.7];

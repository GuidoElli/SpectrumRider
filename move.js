/*
info = "var n_vertex_per_row = {0:d};\n".format(interp_data.shape[1])
info += "var n_vertex_rows = {0:d};\n".format(interp_data.shape[0])
info += "var n_vertex = {0:d};\n".format(interp_data.shape[0]*interp_data.shape[1])

to add:
- song_duration_seconds
- vertex_fs (how many rows in 1 second)
- y_map = [[0, 1, 2, ... , n-1], [n, n+1, ... , 2n-1], ..., [...]];
- xz_map = [[-0.5, -0.493, ... ], ..., [...]] grid
*/


let current_time = 0;
let elapsed_time = 0;
let last_update_time = 0;

let gravity = .0004;
let x_force = .003;

//player
let player_max_vel_x = .0008 * audio_ground_scale_x;
let player_max_pos_x = audio_ground_scale_x / 2;

let player_force_x = 0.0;
let player_vel_x = 0.0;
let player_pos_x = 0.0;
let k_friction = 0.1;
let player_force_y = -gravity;
let player_vel_y = 0.0;
let player_pos_y = audio_ground_scale_y * 2.0;

//keyboard
let up_pressed = false;
let down_pressed = false;
let right_pressed = false;
let left_pressed = false;


function vertex_at_pos(i) {

}
function normal_at_pos(i) {

}


function move() {
    if(synchronized) {
        current_time = (new Date).getTime();
        elapsed_time = current_time-song_start_time;
        let delta_t;
        if (last_update_time){
            delta_t = current_time - last_update_time;
        }else{
            delta_t = 0;
        }

        //camera
        camera_z = -(current_time-song_start_time) * .001 * audio_ground_scale_z;

        //player
            //compute force
            if(left_pressed && !right_pressed) {
                player_force_x = -x_force;
            }else if(!left_pressed && right_pressed) {
                player_force_x = x_force;
            }else{
                player_force_x = 0.0;
                player_vel_x *= 0.9
            }
            player_force_y = -gravity;

            // compute new position and velocity
            player_vel_x += player_force_x * delta_t;
            player_pos_x += player_vel_x * delta_t;
            player_vel_y += player_force_y * delta_t;
            player_pos_y += player_vel_y * delta_t;

            //boundary control
            if(player_vel_x > player_max_vel_x){
                player_vel_x = player_max_vel_x;
            }else if(player_vel_x < -player_max_vel_x){
                player_vel_x = -player_max_vel_x;
            }
            if(player_pos_x > player_max_pos_x){
                player_pos_x = player_max_pos_x;
                player_vel_x = 0.0;
            }else if(player_pos_x < -player_max_pos_x){
                player_pos_x = -player_max_pos_x;
                player_vel_x = 0.0;
            }
            if(player_pos_y < 0){
                player_pos_y = -player_pos_y;
                player_vel_y = -player_vel_y;
            }

            // find 4 vertices and normals
            //

            last_update_time = current_time;
    }else{
        camera_z = camera_z_offset;
    }
}


// key controls
document.addEventListener("keydown" ,function(e) { // TODO
    switch (e.keyCode) {
        case 38: // up
            up_pressed = true;
            break;
        case 40: // down
            down_pressed = true;
            break;
        case 39: // right
            right_pressed = true;
            break;
        case 37: // left
            left_pressed = true;
            break;
    }
})
document.addEventListener("keyup" ,function(e) { // TODO
    switch (e.keyCode) {
        case 38: // up
            up_pressed = false;
            break;
        case 40: // down
            down_pressed = false;
            break;
        case 39: // right
            right_pressed = false;
            break;
        case 37: // left
            left_pressed = false;
            break;
    }
})
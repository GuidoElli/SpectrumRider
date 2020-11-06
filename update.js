/*
info = "var n_vertex_per_row = {0:d};\n".format(interp_data.shape[1])
info += "var n_rows = {0:d};\n".format(interp_data.shape[0])
info += "var n_vertex = {0:d};\n".format(interp_data.shape[0]*interp_data.shape[1])

to add:
- song_duration_seconds
- vertex_fs (how many rows in 1 second)
- y_map = [[0, 1, 2, ... , n-1], [n, n+1, ... , 2n-1], ..., [...]];

// let pattern_bass = [];
// let pattern_mid = [];
// let pattern_high = [];
// let audio_ground_shape = [36, 17];


Objects:

*/


function update() {
    current_time = (new Date).getTime();
    elapsed_time = current_time-song_start_time+time_correction;
    let delta_t;
    if (last_update_time){
        delta_t = current_time - last_update_time;
    }else{
        delta_t = 0;
    }
    current_z = -(current_time-song_start_time+time_correction) * .001 * audio_ground_scale_z;
    if (elapsed_time/1000 > song_duration_seconds - 0.2){
        return;
    }else if(elapsed_time/1000 < 0.2){
        return;
    }

    //player
    //compute force
    if(left_pressed && !right_pressed) {
        player_force_x = -x_force;
    }else if(!left_pressed && right_pressed) {
        player_force_x = x_force;
    }else{
        player_force_x = 0.0;
        player_vel_x *= 0.8;
    }
    // x
    player_vel_x += player_force_x * delta_t / 1000;
    if(player_vel_x > player_max_vel_x){
        player_vel_x = player_max_vel_x;
    }else if(player_vel_x < -player_max_vel_x){
        player_vel_x = -player_max_vel_x;
    }
    player_pos_x += player_vel_x * delta_t / 1000;
    if(player_pos_x > player_max_pos_x){
        player_pos_x = player_max_pos_x;
        player_vel_x = 0.0;
    }else if(player_pos_x < -player_max_pos_x){
        player_pos_x = -player_max_pos_x;
        player_vel_x = 0.0;
    }

    let x_index_cont = (player_pos_x / audio_ground_scale_x + 0.5) * (n_vertex_per_row-1);
    let x_index = Math.round(x_index_cont);

    let z_index_cont = -current_z / audio_ground_scale_z / song_duration_seconds * (n_rows-1) * stretch_correction;
    let z_index = Math.round(z_index_cont);

    let y_curr = y_map[z_index][x_index] * audio_ground_scale_y;
    let y_prev = [];
    let y_next = [];
    let range = 4;
    //compute path
    for(let i = 1; i <= range; i++){
        if(left_pressed && !right_pressed && player_pos_x > -player_max_pos_x + 0.01) {
            y_prev.push(y_map[Math.max(z_index-i, 0)][Math.min(x_index+i, n_vertex_per_row-1)] * audio_ground_scale_y);
            y_next.push(y_map[Math.min(z_index+i, n_rows-1)][Math.max(x_index-i, 0)] * audio_ground_scale_y);
        }else if(!left_pressed && right_pressed && player_pos_x < player_max_pos_x - 0.01) {
            y_prev.push(y_map[Math.max(z_index-i, 0)][Math.max(x_index-i, 0)] * audio_ground_scale_y);
            y_next.push(y_map[Math.min(z_index+i, n_rows-1)][Math.min(x_index+i, n_vertex_per_row-1)] * audio_ground_scale_y);
        }else{
            y_prev.push(y_map[Math.max(z_index-i, 0)][x_index] * audio_ground_scale_y);
            y_next.push(y_map[Math.min(z_index+i, n_rows-1)][x_index] * audio_ground_scale_y);
        }
    }
    //compute max difference
    let new_max_diff = -Infinity;
    for(let i = -range+1; i < range-1; i++){
        let curr;
        let next;
        if(i < -1){
            curr = y_prev[-i];
            next = y_prev[-i-1];
        }else if(i === -1){
            curr = y_prev[-i-1];
            next = y_curr;
        }else if(i === 0){
            curr = y_curr;
            next = y_next[i];
        }else{
            curr = y_next[i-1];
            next = y_next[i];
        }
        if(next - curr > new_max_diff){
            new_max_diff = next - curr;
        }
    }

    let alpha = z_index_cont - z_index;
    let y_cont;
    if(alpha > 0){
        y_cont = alpha * y_next[0] + (1 - alpha) * y_curr;
    }else{
        y_cont = -alpha * y_prev[0] + (1 + alpha) * y_curr;
    }

    if(z_index !== last_z_index || x_index !== last_x_index){
        last_z_index = z_index;
        last_x_index = x_index;
        new_vert = true;
    }else{
        new_vert = false;
    }

    if(touching_ground){//on ground
        if(down_pressed){
            player_pos_y = y_cont;
        }else if(new_vert){
            if(last_max_diff > y_next[0] - y_curr && // not on ground anymore
               y_next[0] - y_curr < y_curr - y_prev[0]){
                touching_ground = false;
                player_vel_y = last_max_diff * vertex_sample_rate;
                if(player_vel_y > player_max_vel_y_up){
                    player_vel_y = player_max_vel_y_up;
                }
                player_pos_y += player_vel_y * delta_t / 1000;
            }else{
                player_pos_y = y_cont;
            }
        }else{
            player_pos_y = y_cont;
        }
    }else{ // not on ground
        if(player_pos_y < y_cont - 1e-3){ //now on ground
            touching_ground = true;
            player_pos_y = y_cont;
        }else{ //still in the air
            if(up_pressed){
                if(player_vel_y < -max_vel_y_up_button){
                    player_force_y = up_force * (-max_vel_y_up_button - player_vel_y);
                }else{
                    player_force_y = -gravity;
                }
            }else if(down_pressed && !up_pressed){
                player_force_y = -down_force;
            }else{
                player_force_y = -gravity;
            }
            player_vel_y += player_force_y * delta_t / 1000;
            player_pos_y += player_vel_y * delta_t / 1000;
            if(player_pos_y > player_max_pos_y){
                player_pos_y = player_max_pos_y;
            }
        }
    }
    last_max_diff = new_max_diff;


    //lights
    current_bass_light = pattern_bass[z_index];
    current_mid_light = pattern_mid[z_index];
    current_high_light = pattern_high[z_index];


    //camera
    let camera_x_old = camera_x;
    let camera_x_target = player_pos_x*0.5;
    camera_x += (camera_x_target - camera_x_old) * 0.2;

    let camera_y_old = camera_y;
    let camera_y_target = camera_y_min * (player_pos_y/camera_y_min + 1 / (player_pos_y/camera_y_min + 1));
    camera_y += (camera_y_target - camera_y_old) * 0.35;

    camera_z_offset = camera_z_offset_min + (camera_y - camera_y_min) * 0.8;


    //colors
    let white_coeff = 0.05;
    gl_clear_color.r = white_coeff + (0.6 - white_coeff) * Math.pow(Math.min(pattern_bass[z_index+2], pattern_bass.length-1), 1.8);
    gl_clear_color.g = gl_clear_color.r
    gl_clear_color.b = gl_clear_color.r


    score_manager.update();



    last_update_time = current_time;

}


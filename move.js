/*
info = "var n_vertex_per_row = {0:d};\n".format(interp_data.shape[1])
info += "var n_rows = {0:d};\n".format(interp_data.shape[0])
info += "var n_vertex = {0:d};\n".format(interp_data.shape[0]*interp_data.shape[1])

to add:
- song_duration_seconds
- vertex_fs (how many rows in 1 second)
- y_map = [[0, 1, 2, ... , n-1], [n, n+1, ... , 2n-1], ..., [...]];
*/


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
        current_z = -(current_time-song_start_time) * .001 * audio_ground_scale_z;

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
            player_vel_x *= 0.7;
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

        // compute surface (based on vertex y-coordinate of 2 near consecutive vertices)
        let x_index_cont = (player_pos_x / audio_ground_scale_x + 0.5) * n_vertex_per_row;
        let z_index_cont = -current_z / audio_ground_scale_z / song_duration_seconds * n_rows;
        let x_index = Math.round(x_index_cont);
        let z_index_back = Math.floor(z_index_cont);
        let current_y = y_map[z_index_back][x_index] * audio_ground_scale_y;
        let next_y = [];
        let prev_y = [];
        next_y[0] = y_map[z_index_back+1][x_index] * audio_ground_scale_y;
        next_y[1] = y_map[z_index_back+2][x_index] * audio_ground_scale_y;
        prev_y[0] = y_map[z_index_back-1][x_index] * audio_ground_scale_y;
        let new_max_diff = Math.max( current_y - prev_y[0], next_y[0] - current_y, next_y[1] - next_y[0]);
        let beta = z_index_cont - z_index_back;
        let alpha = z_index_back + 1 - z_index_cont;
        if(z_index_back !== last_z_index || x_index !== last_x_index){
            last_z_index = z_index_back;
            last_x_index = x_index;
            new_vert = true;
        }else{
            new_vert = false;
        }
        if(touching_ground){//on ground
            if(down_pressed){
                player_pos_y = current_y * alpha + next_y[0] * beta;
            }else if(new_vert){
                if(last_max_diff > next_y[0] - current_y && // not on ground anymore
                         next_y[0] - current_y < current_y - prev_y[0] &&
                         next_y[0] - current_y > next_y[1] - next_y[0]){
                    touching_ground = false;
                    just_landed = true;
                    player_vel_y = last_max_diff * vertex_sample_rate;
                    player_pos_y = current_y * alpha + next_y[0] * beta;
                }else{
                    player_pos_y = current_y * alpha + next_y[0] * beta;
                }
            }else{
                player_pos_y = current_y * alpha + next_y[0] * beta;
            }
        }else{ // not on ground
            if(just_landed){
                player_pos_y += player_vel_y * delta_t / 1000;
                just_landed = false;
            }else{
                if(player_pos_y < next_y[1] - 1e-5 && !just_landed){ //now on ground
                    touching_ground = true;
                    player_pos_y = next_y[0] * alpha + next_y[1] * beta;
                }else{ //still in the air
                    if(up_pressed && !down_pressed){
                        if(player_vel_y < -max_vel_y_up_button){
                            player_force_y = up_force;
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
                }
            }

        }
        last_max_diff = new_max_diff;


        camera_x = player_pos_x;
        let coeff = player_pos_y/camera_y_min + 1 / (player_pos_y/camera_y_min + 1);
        camera_y = camera_y_min * coeff;

        last_update_time = current_time;
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

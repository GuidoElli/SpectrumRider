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

            // compute new position and velocity
            if(!touching_ground){
                player_vel_y += -gravity * delta_t / 1000;
                player_pos_y += player_vel_y * delta_t / 1000;
            }
            player_vel_x += player_force_x * delta_t / 1000;
            player_pos_x += player_vel_x * delta_t / 1000;


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

            let x_index_cont = (player_pos_x / audio_ground_scale_x + 0.5) * n_vertex_per_row;
            let z_index_cont = -current_z / audio_ground_scale_z / song_duration_seconds * n_rows;
            let x_index = Math.round(x_index_cont);
            let z_index_forth = Math.ceil(z_index_cont);
            let z_index_back = Math.floor(z_index_cont);
            if(z_index_forth === z_index_back){
                z_index_forth = z_index_back + 1;
            }
            let alpha = z_index_forth - z_index_cont;
            let beta = z_index_cont - z_index_back;
            let y0 = y_map[z_index_back][x_index] * audio_ground_scale_y;
            let y1 = y_map[z_index_forth][x_index] * audio_ground_scale_y;
            let y_cont = y0 * alpha + y1 * beta;
            let y_vel = (y1 - y0) * vertex_fs;

            if(z_index_back !== last_z_index || x_index !== last_x_index){
                last_z_index = z_index_back;
                last_x_index = x_index;
                new_vert = true;
            }else{
                new_vert = false;
            }
            if(touching_ground){
                if(new_vert){
                    if(y1 - y0 > max_y_diff + 1e-10){ // encountered a steeper path
                        max_y_diff = y1 - y0;
                    }else{
                        touching_ground = false;
                        player_vel_y = y_vel;
                    }
                }
                player_pos_y = y1;
            }else{
                if(player_pos_y < y_cont - 1e-5){
                    touching_ground = true;
                    player_pos_y = y_cont;
                    max_y_diff = y1 - y0;
                }
            }




            camera_x = player_pos_x;
            camera_y = audio_ground_scale_y * 1.5 + (player_pos_y - audio_ground_scale_y)*0.5; // TODO chasing camera

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

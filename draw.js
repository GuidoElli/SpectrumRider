
function draw() {

    if(synchronized) {
        update();

        current_song_percentage = elapsed_time / song_duration_seconds * .001 * correction_coeff;

        gl.clearColor(gl_clear_color.r, gl_clear_color.g, gl_clear_color.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // view/perspective
        let view_matrix = utils.MakeView(camera_x, camera_y, current_z * correction_coeff + camera_z_offset, camera_elev, camera_angle);
        let perspective_matrix = utils.MakePerspective(camera_fov, gl.canvas.width/gl.canvas.height, 0.1, seconds_to_see * audio_ground_scale_z);

        // Audio Ground
        gl.useProgram(audio_ground_program);
        let audio_ground_world_matrix = utils.MakeWorld(
           0.0, 0.0, 0.0,
           0.0, 0.0, 0.0,
           audio_ground_scale_x, audio_ground_scale_y, audio_ground_scale_z);
        let audio_ground_world_view_matrix = utils.multiplyMatrices(view_matrix, audio_ground_world_matrix);
        let audio_ground_projection_matrix = utils.multiplyMatrices(perspective_matrix, audio_ground_world_view_matrix);
        let audio_ground_normal_matrix = utils.invertMatrix(utils.transposeMatrix(audio_ground_world_matrix));

        gl.uniformMatrix4fv(audio_ground_matrix_uniform, gl.FALSE, utils.transposeMatrix(audio_ground_projection_matrix));
        gl.uniformMatrix4fv(audio_ground_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(audio_ground_normal_matrix));
        gl.uniform1f(audio_ground_bass_light_uniform, current_bass_light);
        gl.uniform1f(audio_ground_mid_light_uniform, current_mid_light);
        gl.uniform1f(audio_ground_high_light_uniform, current_high_light);
        gl.uniform1f(audio_ground_tot_seconds_uniform, song_duration_seconds);
        gl.uniform1f(audio_ground_current_song_percentage_uniform, current_song_percentage);

        let current_block = Math.floor(audio_ground_vert.length * current_song_percentage);

        for(let i = 0; i < audio_ground_vert.length; ++i){
            if(i >= current_block-1 && i <= current_block+1){
                gl.bindVertexArray(audio_ground_vao[i]);
                gl.bindBuffer(gl.ARRAY_BUFFER, audio_ground_position_buffer[i]);
                gl.drawElements(gl.TRIANGLES, audio_ground_ind[i].length, gl.UNSIGNED_SHORT, 0 );
            }
        }


        // Player
        gl.useProgram(player_program);
        gl.bindBuffer(gl.ARRAY_BUFFER, player_position_buffer);
        let player_world_matrix = utils.MakeWorld(
           player_pos_x, player_pos_y + player_y_offset, current_z * correction_coeff,
           0.0, 0.0, 0.0,
           player_scale, player_scale, player_scale);
        let player_world_view_matrix = utils.multiplyMatrices(view_matrix, player_world_matrix);
        let player_projection_matrix = utils.multiplyMatrices(perspective_matrix, player_world_view_matrix);
        let player_normal_matrix = utils.invertMatrix(utils.transposeMatrix(player_world_view_matrix));
        gl.uniformMatrix4fv(player_matrix_uniform, gl.FALSE, utils.transposeMatrix(player_projection_matrix));
        gl.uniformMatrix4fv(player_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(player_normal_matrix));

        gl.bindVertexArray(player_vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, player_position_buffer);
        gl.drawElements(gl.TRIANGLES, player_ind.length, gl.UNSIGNED_SHORT, 0 );


        //tokens
        gl.useProgram(token_program);
        for(let i = 0; i < tokens_00.length; ++i){
            let current_token = tokens_00[i];
            if(!taken_tokens[i] && current_token[2]*audio_ground_scale_z < current_z+1 && current_token[2]*audio_ground_scale_z > current_z - seconds_to_see*audio_ground_scale_z){
                gl.bindBuffer(gl.ARRAY_BUFFER, token_position_buffer[i]);
                let token_world_matrix = utils.MakeWorld(
                   current_token[0]*audio_ground_scale_x, (current_token[1]+0.07)*audio_ground_scale_y, current_token[2]*audio_ground_scale_z,
                   0.0, 0.0, 0.0,
                   token_scale, token_scale, token_scale);
                let token_world_view_matrix = utils.multiplyMatrices(view_matrix, token_world_matrix);
                let token_projection_matrix = utils.multiplyMatrices(perspective_matrix, token_world_view_matrix);
                let token_normal_matrix = utils.invertMatrix(utils.transposeMatrix(token_world_matrix));
                gl.uniformMatrix4fv(token_matrix_uniform, gl.FALSE, utils.transposeMatrix(token_projection_matrix));
                gl.uniformMatrix4fv(token_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(token_normal_matrix));

                gl.bindVertexArray(token_vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, token_position_buffer);
                gl.drawElements(gl.TRIANGLES, player_ind.length, gl.UNSIGNED_SHORT, 0 );//TODO
            }
        }
    }

    window.requestAnimationFrame(draw);
}


function draw() {

    if(synchronized) {
        update();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        current_song_percentage = elapsed_time / song_duration_seconds * .001 * stretch_correction;

        gl.clearColor(gl_clear_color.r, gl_clear_color.g, gl_clear_color.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // view/perspective
        let view_matrix = utils.MakeView(camera_x, camera_y, current_z * stretch_correction + camera_z_offset, camera_elev, camera_angle);
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
           player_pos_x, player_pos_y + player_y_offset, current_z * stretch_correction,
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


        //coins
        gl.useProgram(coin_program);
        for(let i = 0; i < coins_all.length; ++i){
            let coin = coins_all[i];
            if(coin.is_visible()){
                gl.bindBuffer(gl.ARRAY_BUFFER, coin_position_buffer[i]);
                let coin_world_matrix = utils.MakeWorld(
                   coin.position_x, coin.position_y, coin.position_z,
                   0.0, coin.current_y_rotation, 0.0,
                   coin.scale, coin.scale, coin.scale);
                let coin_world_view_matrix = utils.multiplyMatrices(view_matrix, coin_world_matrix);
                let coin_projection_matrix = utils.multiplyMatrices(perspective_matrix, coin_world_view_matrix);
                let coin_normal_matrix = utils.invertMatrix(utils.transposeMatrix(coin_world_matrix));
                gl.uniformMatrix4fv(coin_matrix_uniform, gl.FALSE, utils.transposeMatrix(coin_projection_matrix));
                gl.uniformMatrix4fv(coin_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(coin_normal_matrix));
                gl.uniform1f(coin_bass_light_uniform, current_bass_light);

                gl.bindVertexArray(coin_vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, coin_position_buffer);
                gl.drawElements(gl.TRIANGLES, coin_ind.length, gl.UNSIGNED_SHORT, 0 );//TODO
            }
        }



        //items
        gl.useProgram(item_2x_program);
        for(let i = 0; i < items_2x.length; ++i){
            let item_2x = items_2x[i];
            if(item_2x.is_visible()){
                gl.bindBuffer(gl.ARRAY_BUFFER, item_2x_position_buffer[i]);
                let item_2x_world_matrix = utils.MakeWorld(
                   item_2x.position_x, item_2x.position_y, item_2x.position_z,
                   0.0, item_2x.current_y_rotation, 0.0,
                   item_2x.scale, item_2x.scale, item_2x.scale);
                let item_2x_world_view_matrix = utils.multiplyMatrices(view_matrix, item_2x_world_matrix);
                let item_2x_projection_matrix = utils.multiplyMatrices(perspective_matrix, item_2x_world_view_matrix);
                let item_2x_normal_matrix = utils.invertMatrix(utils.transposeMatrix(item_2x_world_matrix));
                gl.uniformMatrix4fv(item_2x_matrix_uniform, gl.FALSE, utils.transposeMatrix(item_2x_projection_matrix));
                gl.uniformMatrix4fv(item_2x_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(item_2x_normal_matrix));

                gl.bindVertexArray(item_2x_vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, item_2x_position_buffer);
                gl.drawElements(gl.TRIANGLES, player_ind.length, gl.UNSIGNED_SHORT, 0 );//TODO
            }
        }


        gl.useProgram(item_5x_program);
        for(let i = 0; i < items_5x.length; ++i){
            let item_5x = items_5x[i];
            if(item_5x.is_visible()){
                gl.bindBuffer(gl.ARRAY_BUFFER, item_5x_position_buffer[i]);
                let item_5x_world_matrix = utils.MakeWorld(
                   item_5x.position_x, item_5x.position_y, item_5x.position_z,
                   0.0, item_5x.current_y_rotation, 0.0,
                   item_5x.scale, item_5x.scale, item_5x.scale);
                let item_5x_world_view_matrix = utils.multiplyMatrices(view_matrix, item_5x_world_matrix);
                let item_5x_projection_matrix = utils.multiplyMatrices(perspective_matrix, item_5x_world_view_matrix);
                let item_5x_normal_matrix = utils.invertMatrix(utils.transposeMatrix(item_5x_world_matrix));
                gl.uniformMatrix4fv(item_5x_matrix_uniform, gl.FALSE, utils.transposeMatrix(item_5x_projection_matrix));
                gl.uniformMatrix4fv(item_5x_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(item_5x_normal_matrix));

                gl.bindVertexArray(item_5x_vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, item_5x_position_buffer);
                gl.drawElements(gl.TRIANGLES, player_ind.length, gl.UNSIGNED_SHORT, 0 );//TODO
            }
        }


        gl.useProgram(item_10x_program);
        for(let i = 0; i < items_10x.length; ++i){
            let item_10x = items_10x[i];
            if(item_10x.is_visible()){
                gl.bindBuffer(gl.ARRAY_BUFFER, item_10x_position_buffer[i]);
                let item_10x_world_matrix = utils.MakeWorld(
                   item_10x.position_x, item_10x.position_y, item_10x.position_z,
                   0.0, item_10x.current_y_rotation, 0.0,
                   item_10x.scale, item_10x.scale, item_10x.scale);
                let item_10x_world_view_matrix = utils.multiplyMatrices(view_matrix, item_10x_world_matrix);
                let item_10x_projection_matrix = utils.multiplyMatrices(perspective_matrix, item_10x_world_view_matrix);
                let item_10x_normal_matrix = utils.invertMatrix(utils.transposeMatrix(item_10x_world_matrix));
                gl.uniformMatrix4fv(item_10x_matrix_uniform, gl.FALSE, utils.transposeMatrix(item_10x_projection_matrix));
                gl.uniformMatrix4fv(item_10x_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(item_10x_normal_matrix));

                gl.bindVertexArray(item_10x_vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, item_10x_position_buffer);
                gl.drawElements(gl.TRIANGLES, player_ind.length, gl.UNSIGNED_SHORT, 0 );//TODO
            }
        }



        //points

        ctx.clearRect(0, 0, canvasText.width, canvasText.height);
        ctx.font = '700 90px Arial';
        ctx.fillStyle = '#eeeeee';
        ctx.textAlign = "left";
        ctx.fillText(score_manager.tot_points, 60, 100);

        if(score_manager.multiply_factor != 1){
            ctx.font = '600 50px Arial';
            ctx.fillStyle = '#bbbbbb';
            ctx.textAlign = "right";
            ctx.fillText(score_manager.multiply_factor + "X", ctx.canvas.width*0.95, 100);
        }

        ctx.font = '100 15px Arial';
        ctx.fillStyle = '#888888';
        ctx.textAlign = "left";
        ctx.fillText("Time-Shift: " + time_correction + "ms", 60, gl.canvas.height * 0.94);
        ctx.fillText("Time-Stretch: " + (stretch_correction * 100).toFixed(3) + "%", 250, gl.canvas.height * 0.94);
        ctx.font = '500 12px Arial';
        ctx.fillText("CTRL + [A]/[S]", 250, gl.canvas.height * 0.97);
        ctx.fillText("CTRL + [Z]/[X]", 60, gl.canvas.height * 0.97);

    }

    window.requestAnimationFrame(draw);
}

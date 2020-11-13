
function draw() {

    if(synchronized) {

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
        gl.drawElements(gl.TRIANGLES, player_obj.ind.length, gl.UNSIGNED_SHORT, 0 );


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
                gl.drawElements(gl.TRIANGLES, coin_obj.ind.length, gl.UNSIGNED_SHORT, 0 );
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
                gl.drawElements(gl.TRIANGLES, note_obj.ind.length, gl.UNSIGNED_SHORT, 0 );
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
                gl.drawElements(gl.TRIANGLES, stand_obj.ind.length, gl.UNSIGNED_SHORT, 0 );
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
                gl.drawElements(gl.TRIANGLES, item10_obj.ind.length, gl.UNSIGNED_SHORT, 0 );
            }
        }




    }

    last_update_time = current_time;
    window.requestAnimationFrame(draw);
}

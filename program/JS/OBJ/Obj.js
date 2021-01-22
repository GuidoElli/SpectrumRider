class Obj {
    constructor(gl, program, objects) {

        this.gl = gl;
        this.program = program;
        this.objects = objects;

        this.a_position = this.gl.getAttribLocation(this.program, 'inPosition');
        this.a_normal = this.gl.getAttribLocation(this.program, 'inNormal');
        this.u_matrix = this.gl.getUniformLocation(this.program, 'matrix');
        this.u_normal_matrix = this.gl.getUniformLocation(this.program, 'nMatrix');
        this.u_tot_seconds = this.gl.getUniformLocation(this.program, 'totSeconds');
        this.u_current_song_percentage = this.gl.getUniformLocation(this.program, 'currentSongPercentage');
        this.u_bass_intensity = this.gl.getUniformLocation(this.program, 'bassIntensity');
        this.u_mid_intensity = this.gl.getUniformLocation(this.program, 'midIntensity');
        this.u_high_intensity = this.gl.getUniformLocation(this.program, 'highIntensity');

        this.vaos = [];
        this.position_buffer = [];
        this.normal_buffer = [];
        this.index_buffer = [];

        this.gl.useProgram(this.program);

        for(let i = 0; i < this.objects.length; ++i) {
            this.vaos[i] = this.gl.createVertexArray();
            this.gl.bindVertexArray(this.vaos[i]);

            this.position_buffer[i] = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer[i]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objects[i].vert), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(this.a_position);
            this.gl.vertexAttribPointer(this.a_position, 3, this.gl.FLOAT, false, 0, 0);

            this.normal_buffer[i] = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normal_buffer[i]);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objects[i].norm), this.gl.STATIC_DRAW);
            this.gl.enableVertexAttribArray(this.a_normal);
            this.gl.vertexAttribPointer(this.a_normal, 3, this.gl.FLOAT, false, 0, 0);

            this.index_buffer[i] = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_buffer[i]);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.objects[i].ind), this.gl.STATIC_DRAW);
        }
    }

    draw_obj = (i) => {
        this.gl.bindVertexArray(this.vaos[i]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.position_buffer[i]);
        this.gl.drawElements(this.gl.TRIANGLES, this.objects[i].ind.length, this.gl.UNSIGNED_SHORT, 0 );
    }

    draw = (world, view, perspective) => {
        this.bind_uniforms(world, view, perspective);
        for(let i = 0; i < this.objects.length; ++i) {
            this.draw_obj(i);
        }
    }

    bind_uniforms = (world, view, perspective) => {
        this.gl.useProgram(this.program);
        let world_view_matrix = utils.multiplyMatrices(view, world);
        let projection_matrix = utils.multiplyMatrices(perspective, world_view_matrix);
        let normal_matrix = utils.invertMatrix(utils.transposeMatrix(world_view_matrix));
        this.gl.uniformMatrix4fv(this.u_matrix, this.gl.FALSE, utils.transposeMatrix(projection_matrix));
        this.gl.uniformMatrix4fv(this.u_normal_matrix, this.gl.FALSE, utils.transposeMatrix(normal_matrix));
        this.gl.uniform1f(this.u_bass_intensity, app.current_bass_light);
        this.gl.uniform1f(this.u_mid_intensity, app.current_mid_light);
        this.gl.uniform1f(this.u_high_intensity, app.current_high_light);
        this.gl.uniform1f(this.u_tot_seconds, song_duration_seconds);
        this.gl.uniform1f(this.u_current_song_percentage, app.current_song_percentage);
    }
}

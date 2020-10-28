function main() {
    
    //to do in python
    pattern_power = [];
    pattern_bass = [];
    pattern_mid = [];
    pattern_high = [];
    song_duration = undefined;

    
    //scene
    seconds_to_see = 7;
    
    //camera
    camera_x = 0.0;
    camera_y = 25.0;
    camera_z = 200.0;
    camera_elev = -20.0;
    camera_angle = 0.0;

    //audio ground
    audio_ground_scale_x = 200.0;
    audio_ground_scale_y = 20.0;
    audio_ground_scale_z = 150.0;
    audio_ground_delta_z = 0.0;

    //directional light
    dirLightAlpha = -utils.degToRad(20.0);
    dirLightBeta  = -utils.degToRad(45.0);
    directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
              Math.sin(dirLightAlpha),
              Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)
              ];
    directionalLightColor = [0.1, 1.0, 1.0];

    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    
    vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, audio_ground_vs);
    fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, audio_ground_fs);
    audio_ground_program = utils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(audio_ground_program);
    
    positionAttributeLocation = gl.getAttribLocation(audio_ground_program, "inPosition");
    normalAttributeLocation = gl.getAttribLocation(audio_ground_program, "inNormal");
    matrixLocation = gl.getUniformLocation(audio_ground_program, "matrix");
    lightDirectionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirection');
    lightColorHandle = gl.getUniformLocation(audio_ground_program, 'lightColor');
    normalMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'nMatrix');
    lightDirMatrixPositionHandle = gl.getUniformLocation(audio_ground_program, 'lightDirMatrix');
    
    audio_ground_vao = [];
    for(let i = 0; i < audio_ground_vert.length; ++i){
        audio_ground_vao[i] = gl.createVertexArray();
        gl.bindVertexArray(audio_ground_vao[i]);
        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_vert[i]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audio_ground_norm[i]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(audio_ground_ind[i]), gl.STATIC_DRAW); 

    }
    
    
    current_time = (new Date).getTime();
    last_move_time = current_time;
    draw();
}

window.addEventListener("mousedown", function(){ // will be a start button
    
    canvas = document.getElementById("c");
    document.documentElement.requestFullscreen();
    canvas.width = screen.width;
    canvas.height = screen.height;
    canvas.style.display = "block";
    
    main();
})

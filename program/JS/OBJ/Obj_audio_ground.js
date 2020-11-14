class Obj_audio_ground extends Obj {
    constructor(gl){
        let vs_text = `#version 300 es
            
            in vec3 inPosition;
            in vec3 inNormal;
            out vec3 fsNormal;
            out vec3 position;
            
            uniform mat4 matrix;
            uniform mat4 nMatrix;     //matrix to transform normals
            
            void main() {
                fsNormal = mat3(nMatrix) * normalize(inNormal); 
                gl_Position = matrix * vec4(inPosition, 1.0);
                position = inPosition;
            }`;
        let fs_text = `#version 300 es
            
            precision mediump float;
            
            in vec3 position;
            in vec3 fsNormal;
            out vec4 outColor;
            
            uniform float totSeconds;
            uniform float currentSongPercentage;
            uniform float bassIntensity;
            uniform float midIntensity;
            uniform float highIntensity;
            
            vec3 hsv2rgb_smooth( in vec3 c ){
            vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
            rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing
            return c.z * mix( vec3(1.0), rgb, c.y);
            }
            float rand(float n){return fract(sin(n) * 43758.5453123);}
            float noise(float p){
            float fl = floor(p);
              float fc = fract(p);
            return mix(rand(fl), rand(fl + 1.0), fc);
            }
            
            void main() {
                vec3 nNormal = normalize(fsNormal);
                float currentZ = -totSeconds * currentSongPercentage;
                float currentTimeLineWidth = .01;
                float fadeIn = .02;
                float fadeOut = .2;
                float factor;
                
                float h = noise(position.z/20.0);
                float s = 0.5 + clamp( pow(bassIntensity, 1.5)*0.1 + pow(midIntensity, 1.5)*0.3 + pow(highIntensity, 1.5)*0.2, 0.0, 0.4);
                float v = 0.2 + clamp( pow(abs(1.0-nNormal.y), 0.5)*0.8 + pow(bassIntensity, 1.5)*0.6 + pow(midIntensity, 1.5)*0.2 + pow(highIntensity, 1.5)*0.2, 0.0, 0.8);
                vec3 color = clamp(hsv2rgb_smooth(vec3(h,s,v)), 0.0, 1.0);
               
                // current line
                if(position.z > currentZ + currentTimeLineWidth * 0.2){ 						//past
                    factor = (position.z - currentZ + currentTimeLineWidth * 0.2) / fadeOut;
                    factor = clamp(factor, 0.0, 1.0);
                    outColor = vec4(1.0-factor, 1.0-factor, 1.0-factor, 1.0);
                }else if(position.z < currentZ - currentTimeLineWidth * 0.8){  				   //yet to come
                    factor = -(position.z - currentZ + currentTimeLineWidth * 0.8) / fadeIn;
                    factor = clamp(factor, 0.0, 1.0);
                    outColor = vec4( 
                        clamp(factor * color.r + (1.0-factor), 0.0, 1.0), 
                        clamp(factor * color.g + (1.0-factor), 0.0, 1.0),
                        clamp(factor * color.b + (1.0-factor), 0.0, 1.0),
                        1.0);
                }else{   														  //current line
                    outColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            }
            `;
        let program = utils.create_program(gl, vs_text, fs_text);
        let objects = [];
        for(let i = 0; i < audio_ground_vert.length; ++i){
            objects.push({"vert": audio_ground_vert[i], "ind": audio_ground_ind[i], "norm": audio_ground_norm[i]});
        }
        super(gl, program, objects);
    }

    draw = (world, view, perspective) => {
        this.bind_uniforms(world, view, perspective);
        let current_block = Math.floor(audio_ground_vert.length * app.current_song_percentage);
        for(let i = 0; i < this.objects.length; ++i) {
            if(i >= current_block-1 && i <= current_block+1){
                this.draw_obj(i);
            }
        }
    }
}

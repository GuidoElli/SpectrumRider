class Obj_chiavedisol extends Obj {
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
            
            in vec3 fsNormal;
            in vec3 position;
            out vec4 outColor;
            
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
                float h = 0.3;
                float s = 0.8 - clamp( pow(nNormal.z, 25.0) + pow(bassIntensity, 3.0), 0.0, 0.8);
                float v = 0.6 + clamp( pow(nNormal.z, 25.0) + pow(bassIntensity, 3.0), 0.0, 0.4);
                vec3 color = clamp(hsv2rgb_smooth(vec3(h,s,v)), 0.0, 1.0);
                outColor = vec4(color, 1.0);
            }`;
        let program = utils.create_program(gl, vs_text, fs_text);
        let objects = [utils.parseObjText(obj_chiavedisol_text, false)];
        super(gl, program, objects);
    }

}

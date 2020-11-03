let audio_ground_vs = `#version 300 es

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

let audio_ground_fs = `#version 300 es

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
    float shadeIn = .02;
    float shadeOut = .09;
    float factor;
    
	 float h = (noise(position.z/15.0)*0.9 + pow(bassIntensity, 2.0)*0.1);
	 float s = 0.65;
	 float v = clamp( abs(1.0-nNormal.y) + pow(bassIntensity, 2.0)*0.7, 0.0, 1.0);
	 vec3 color = clamp(hsv2rgb_smooth(vec3(h,s,v)), 0.0, 1.0);
	
	 // current line
    if(position.z > currentZ + currentTimeLineWidth * 0.2){ 						//past
    	  factor = (position.z - currentZ + currentTimeLineWidth * 0.2) / shadeOut;
		  factor = clamp(factor, 0.0, 1.0);
        outColor = vec4(1.0-factor, 1.0-factor, 1.0-factor, 1.0);
    }else if(position.z < currentZ - currentTimeLineWidth * 0.8){  				   //yet to come
    	  factor = -(position.z - currentZ + currentTimeLineWidth * 0.8) / shadeIn;
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

let player_vs = `#version 300 es

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

let player_fs = `#version 300 es

precision mediump float;

in vec3 fsNormal;
in vec3 position;
out vec4 outColor;

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
	 float h = 0.9;
	 float s = 1.0;
	 float v = clamp( nNormal.z, 0.0, 1.0);
	 vec3 color = clamp(hsv2rgb_smooth(vec3(h,s,v)), 0.0, 1.0);
	 outColor = vec4(color, 1.0);
}`;

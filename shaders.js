var audio_ground_vs = `#version 300 es

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

var audio_ground_fs = `#version 300 es

precision mediump float;

in vec3 position;
in vec3 fsNormal;
out vec4 outColor;

uniform float totSeconds;
uniform float currentSongPercentage;
uniform float bassIntensity;
uniform float midIntensity;
uniform float highIntensity;

void main() {
    vec3 nNormal = normalize(fsNormal);
    float currentZ = -totSeconds * currentSongPercentage;
    float currentTimeLineWidth = .01;
    float shadeIn = .02;
    float shadeOut = .13;
    float factor;
    
    if(position.z > currentZ + currentTimeLineWidth * 0.2){
    	  factor = (position.z - currentZ + currentTimeLineWidth * 0.2) / shadeOut;
		  factor = clamp(factor, 0.0, 1.0);
        outColor = vec4(1.0-factor, 1.0-factor, 1.0-factor, 1.0);
    }else if(position.z < currentZ - currentTimeLineWidth * 0.8){
    	  factor = -(position.z - currentZ + currentTimeLineWidth * 0.8) / shadeIn;
		  factor = clamp(factor, 0.0, 1.0);
		  float red = factor * position.y * (0.5 + 0.3 * bassIntensity + 0.2 * midIntensity + 0.4 * highIntensity) + (1.0-factor);
		  float green = factor * position.y * (0.5 + 0.3 * bassIntensity + 0.4 * midIntensity + 0.1 * highIntensity) + (1.0-factor);
		  float blue = factor * position.y * (0.5 + 0.3 * bassIntensity + 0.1 * midIntensity + 0.4 * highIntensity) + (1.0-factor);
        vec3 color = vec3(red, green, blue);
		  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }else{
        outColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}`;

var player_vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;

uniform mat4 matrix;
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
    fsNormal = mat3(nMatrix) * normalize(inNormal); 
    gl_Position = matrix * vec4(inPosition, 1.0);
}`;

var player_fs = `#version 300 es

precision mediump float;

in vec3 fsNormal;
out vec4 outColor;

void main() {
	 outColor = vec4(0.6, 0.0, 0.9, 1.0);
}`;

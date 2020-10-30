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

uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform mat4 lightDirMatrix;
uniform float totSeconds;
uniform float currentSongPercentage;

void main() {
    vec3 nNormal = normalize(fsNormal);
    vec3 lDir = mat3(lightDirMatrix) * lightDirection;
    vec3 color;
    vec3 lambertColor;
    
    float currentZ = -totSeconds * currentSongPercentage;
    float currentTimeLineWidth = .01;
    float shadeIn = .02;
    float shadeOut = .2;
    float factor;
    if(position.z > currentZ + currentTimeLineWidth * 0.2){
    	  factor = (position.z - currentZ + currentTimeLineWidth * 0.2) / shadeOut;
		  factor = clamp(factor, 0.0, 1.0);
        outColor = vec4(1.0-factor, 1.0-factor, 1.0-factor, 1.0);
    }else if(position.z < currentZ - currentTimeLineWidth * 0.8){
    	  factor = -(position.z - currentZ + currentTimeLineWidth * 0.8) / shadeIn;
		  factor = clamp(factor, 0.0, 1.0);
        outColor = vec4(factor, factor, factor, 1.0);
        color = vec3(factor * position.y + (1.0-factor), factor * position.y + (1.0-factor), factor * position.y + (1.0-factor));
		  lambertColor = color * lightColor * max(-dot(lDir,nNormal), 0.0);
		  outColor = vec4(clamp(lambertColor, 0.0, 1.0), 1.0);
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
	 outColor = vec4(0.0, 1.0, 0.0, 1.0);
}`;

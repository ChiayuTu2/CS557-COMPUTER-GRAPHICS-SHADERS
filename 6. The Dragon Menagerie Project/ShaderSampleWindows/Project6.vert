#version 330 compatibility

uniform sampler3D Noise3;
uniform float uNoiseFreq;
uniform float uNoiseAmp;

float PI = 3.1415926;
float Y0 = 1.;

flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;

uniform float uLightX, uLightY, uLightZ;
vec3 eyeLightPosition = vec3(uLightX, uLightY, uLightZ);

const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main( )
{	
	vec3 vNormal = normalize( gl_NormalMatrix * gl_Normal );
	
	vec4 nvx = texture( Noise3, uNoiseFreq*gl_Vertex.xyz);
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
	
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(gl_Vertex.xy,gl_Vertex.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;
	
	vNormal = RotateNormal(angx,angy,vNormal);
	
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vNf = normalize( gl_NormalMatrix * vNormal );
	vNs = vNf;
	
	vLf = eyeLightPosition - ECposition;
	vLs = vLf;
	
	vEf = vec3(0., 0., 0.)  - ECposition;
	vEs = vEf;

	gl_Position =  gl_ModelViewProjectionMatrix*gl_Vertex;
}
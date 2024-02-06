#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:
uniform float uA, uB, uC, uD;
uniform float uLightX, uLightY, uLightZ;

uniform float Timer;

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out  vec2  vST;	  // (s,t) texture coordinates

out	vec3	 vMC;
out	vec3	 vEC;

// where the light is:
vec3 LightPosition = vec3(uLightX, uLightY, uLightZ);

// M_PI
const float M_PI = 3.14159265;
const float TWO_PI = 2. * M_PI;

void
main( )
{
	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
	float r = sqrt(x * x + y * y);

	vec4 new_gl_Vertex = gl_Vertex;
	new_gl_Vertex.z = uA * cos(TWO_PI * uB * r + uC) * exp(-uD * r);

	vMC = new_gl_Vertex.xyz;
	vEC = (gl_ModelViewMatrix * new_gl_Vertex).xyz;

	float drdx = x / r;
	float drdy = y / r;
	
	float dzdr = uA * (-sin(TWO_PI * uB * r + uC) * TWO_PI * uB * exp(-uD * r) + cos(TWO_PI * r + uC) * -uD * exp(-uD * r));

	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;

	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vec3(0., 1., dzdy);

	vN = normalize(cross(Tx, Ty));

	vST = gl_MultiTexCoord0.st;
	vL = LightPosition - vEC;	    // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - vEC;       // vector from the point to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * new_gl_Vertex;

}

#version 330 compatibility

// out variables to be interpolated in the rasterizer and sent to each fragment shader:
uniform float uA, uB, uC, uD;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye
out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vMC;

// M_PI
const float M_PI = 3.14159265359;

// where the light is:
const vec3 LightPosition = vec3(uLightX, uLightY, uLightZ);

void
main( )
{
	vST = gl_MultiTexCoord0.st;

    //----------------------
    float x = gl_Vertex.x;
    float y = gl_Vertex.y;
    float r = sqrt(x * x + y * y);
    float z = uA * cos(2. * M_PI * uB + uC) * exp(-uD * r);

    vec4 p = vec4(x, y, z, 1.);
	vMC = p.xyz;

    float dzdr = uA * (-sin(2. * M_PI * uB * r + uC) * 2. * M_PI * uB * exp(-uD * r) + cos(2. * M_PI * uB * r + uC) * -uD * exp(-uD * r)); 

    float drdx = x / r;
    float drdy = y / r;
    float dzdx = dzdr * drdx;
    float dzdy = dzdr * drdy;

    vec3 Tx = vec3(1., 0., dzdx);
    vec3 Ty = vec3(0., 1., dzdy );

    vec3 normal = normalize(cross(Tx, Ty));

    //-----------------------

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	vN = normalize( gl_NormalMatrix * gl_Normal );  // normal vector
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}

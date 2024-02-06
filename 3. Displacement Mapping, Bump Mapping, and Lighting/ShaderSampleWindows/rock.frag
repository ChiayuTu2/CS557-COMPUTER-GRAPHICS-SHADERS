#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
const float uKa = 0.2; // ambient coefficient
const float uKd = 0.7; // diffuse coefficient
const float uKs = 0.5; // specular coefficient
uniform vec4      uColor;		 // object color
uniform vec4      uSpecularColor;	 // light color
uniform float     uShininess;	 // specular exponent
uniform float     uNoiseAmp;
uniform float     uNoiseFreq;
uniform sampler3D Noise3;

// square-equation uniform variables -- these should be set every time Display( ) is called:

uniform float   uS0, uT0;

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vMC;
in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates

// Rotate Normal
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
	//vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3(1.0, 0.5, 0.0);           // Default color
    vec3 mySpecularColor = vec3(1.0, 1.0, 1.0);   // Specular color

	// Bumping-Mapping
    vec4 nvx = texture(Noise3, uNoiseFreq * vMC);
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture(Noise3, uNoiseFreq * vec3(vMC.xy, MC.z + 0.5));
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

	vec3 n = RotateNormal( angx, angy, vN );
	Normal = normalize(gl_NormalMatrix * n);

	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}


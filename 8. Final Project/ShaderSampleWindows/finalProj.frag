#version 330 compatibility
in vec3  vMC;
in vec3  vNf;
in vec3  vLf;
in vec3  vEf;
in vec2  vST;

uniform float uColorNoiseMag;
uniform float uColorNoiseFreq;
uniform float uSurfaceNoiseAmp;
uniform float uSurfaceNoiseFreq;
uniform float uA;
uniform float uTol;
uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform sampler3D Noise3;


const vec4 RED		= vec4( 1., 0., 0., 1. );
const vec4 ORANGE	= vec4( 1., .5, 0., 1. );
const vec4 YELLOW	= vec4( 1., 1., 0., 1. );
const vec4 GREEN	= vec4( 0., 1., 0., 1. );
const vec4 CYAN		= vec4( 0., 1., 1., 1. );
const vec4 BLUE		= vec4( 0., 0., 1., 1. );
const vec4 MAGENTA	= vec4( 1., 0., 1., 1. );
const vec4 WHITE	= vec4( 1., 1., 1., 1. );

const float ONE16      = 1./16.;
const float THREE16    = 3./16.;
const float FIVE16     = 5./16.;
const float SEVEN16    = 7./16.;
const float NINE16     = 9./16.;
const float ELEVEN16   = 11./16.;
const float THIRTEEN16 = 13./16.;
const float FIFTEEN16  = 15./16.;


void
main( void )
{
	vec3 Normal, Light, Eye;

	Normal = normalize(vNf);
	Light = normalize(vLf);
	Eye = normalize(vEf);

	vec4  nv  = texture3D( Noise3, uColorNoiseFreq * vMC );
	float n = nv.r + nv.g + nv.b + nv.a;	// 1. -> 3.
	n = n - 2.;				// -1. -> 1.
	float delta = uColorNoiseMag * n;

	//float f = fract( uA*(V+delta) );
	float f = 0.56 - 0.5 * cos(10 * uA * vST.s * vMC.y * vMC.x) - sin(0.7 * (vST.t + delta));
	float t = smoothstep( ONE16 - uTol, ONE16 + uTol, f );
	vec4 color = mix( WHITE, RED, t );
	if( f >= THREE16 - uTol )
	{
		t = smoothstep( THREE16 - uTol, THREE16 + uTol, f );
		color = mix( RED, ORANGE, t );
	}
	if( f >= FIVE16 - uTol )
	{
		t = smoothstep( FIVE16 - uTol, FIVE16 + uTol, f );
		color = mix( ORANGE, YELLOW, t );
	}
	if( f >= SEVEN16 - uTol )
	{
		t = smoothstep( SEVEN16 - uTol, SEVEN16 + uTol, f );
		color = mix( YELLOW, GREEN, t );
	}
	if( f >= NINE16 - uTol )
	{
		t = smoothstep( NINE16 - uTol, NINE16 + uTol, f );
		color = mix( GREEN, CYAN, t );
	}
	if( f >= ELEVEN16 - uTol )
	{
		t = smoothstep( ELEVEN16 - uTol, ELEVEN16 + uTol, f );
		color = mix( CYAN, BLUE, t );
	}
	if( f >= THIRTEEN16 - uTol )
	{
		t = smoothstep( THIRTEEN16 - uTol, THIRTEEN16 + uTol, f );
		color = mix( BLUE, MAGENTA, t );
	}
	if( f >= FIFTEEN16 - uTol )
	{
		t = smoothstep( FIFTEEN16 - uTol, FIFTEEN16 + uTol, f );
		color = mix( MAGENTA, WHITE, t );
	}

	vec4 ambient = uKa * color;

	vec4 diffuse = uKd * max(dot(Normal, Light), 0.) * color;

	float s = 0.;
	if (dot(Normal, Light) > 0.) {
		vec3 ref = normalize(2. * Normal * dot(Normal, Light) - Light);
		s = pow(max(dot(Eye,ref), 0.), uShininess);
	}
	vec4 specular = uKs * s * vec4(1., 1., 1., 1.);
	
	gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}

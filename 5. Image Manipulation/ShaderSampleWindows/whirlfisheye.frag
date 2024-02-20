#version 330 compatibility

uniform float uPower;
uniform float uRtheta;
uniform float uMosaic;
uniform float uBlend;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

in vec2 vST;

const vec4 BLACK = vec4( 0., 0., 0., 1. );
const float PI = 3.141592653589793238462643383;

float
atan2( float y, float x )
{
        if( x == 0. )
        {
                if( y >= 0. )
                        return  PI/2.;
                else
                        return -PI/2.;
        }
        return atan(y,x);
}

void
main( ){
    	
    vec2 st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
	float rad = length(st);
	float radius = pow((2*rad), uPower);

    float angle  = atan2( st.y, st.x );
	float ang = angle - uRtheta * radius;

    st = radius * vec2(cos(ang), sin(ang));  	// now in the range -1. to +1.
	st += 1;                       		        // change the range to 0. to +2.
	st *= 0.5; 		       				        // change the range to 0. to +1.



    // if s or t end up outside the range [0.,1.], paint the pixel black:
    if( any( lessThan(st, vec2(0, 0)) ) )
    {
        gl_FragColor = BLACK;
    }
    else
    {
        if( any( greaterThan(st, vec2(1., 1.)) ) )
        {
            gl_FragColor = BLACK;
        }
        else
        {
            // sample both textures at (s,t) giving back two rgb vec3's:
            vec3 image1 = texture2D(TexUnitA, st).rgb;
			vec3 image2 = texture2D(TexUnitB, st).rgb;

            vec3 rgb = mix(image1, image2, uBlend);

            // mix the two rgb's using uBlend
            gl_FragColor = vec4( rgb, 1. );
        }
    }
}
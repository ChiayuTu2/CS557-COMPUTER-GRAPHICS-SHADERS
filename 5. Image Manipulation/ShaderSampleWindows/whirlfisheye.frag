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
    // Fisheye	
    vec2 st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
	float rad = length(st);
	float radius = pow((2*rad), uPower);

    // Whirl
    float angle  = atan2( st.y, st.x );
	float ang = angle - uRtheta * radius;

    // Restoring(s, t)
    st = radius * vec2(cos(ang), sin(ang));  	// now in the range -1. to +1.
	st += 1;                       		        // change the range to 0. to +2.
	st *= 0.5; 		       				        // change the range to 0. to +1.

    // Mosaic'ing
    float Ar = uMosaic / 2.; 
	float Br = uMosaic / 2.;

    // which block of pixels will this pixel be in?
    int numins = int(vST.s / uMosaic);	// same as with the ellipses
    int numint = int(vST.t / uMosaic);	// same as with the ellipses
    
    float sc = float(numins) * uMosaic + Ar;		// same as with the ellipses
    float tc = float(numint) * uMosaic + Br;		// same as with the ellipses
    st = vec2(sc, tc);

    // for this block of pixels, we are only going to sample the texture at the center:
    st.s = sc;
    st.t = tc;

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

            // mix the two rgb's using uBlend
            vec3 rgb = mix(image1, image2, uBlend);

            gl_FragColor = vec4( rgb, 1. );
        }
    }
}
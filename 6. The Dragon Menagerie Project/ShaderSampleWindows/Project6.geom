#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable
layout( triangles )  in;
layout( triangle_strip, max_vertices= 146 )  out;

uniform float uVelScale;

uniform float Timer;

in vec3    vNormal[3];
in vec2    vST[3];

out float  gLightIntensity;
out vec2  gST;
const vec3 LIGHTPOS = vec3(-2., 0., 10. );

vec3    V0, V01, V02;
vec3    CG;


void
ProduceVertex( float s, float t  )
{
    vec3 v = V0 + s*V01 + t*V02;
    vec3 vel = uVelScale * ( v - CG );
    v = CG + vel*0.1;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( v, 1.);
    EmitVertex( );
}

void
main( )
{
    V01 = ( gl_PositionIn[1] -gl_PositionIn[0] ).xyz;
    V02 = ( gl_PositionIn[2] -gl_PositionIn[0] ).xyz;
    V0  =   gl_PositionIn[0].xyz;
    CG = ( gl_PositionIn[0].xyz + gl_PositionIn[1].xyz + gl_PositionIn[2].xyz ) / 3.;

   
    int numLayers = 1;
    float dt = 1. / float( numLayers );
    float t = 1.;

     for(int i = 0; i < 3; i++){
        gLightIntensity = dot( normalize(LIGHTPOS-  gl_PositionIn[i].xyz), vNormal[i] );
        gLightIntensity = abs( gLightIntensity );
        gST = vST[i];
    }

    for( int it = 0; it <= numLayers; it++ )
    {
        float smax = 1. - t;
        int nums = it + 1;
        float ds = smax / float( nums - 1 );
        float s = 0.;
        for( int is = 0; is < nums; is++ )
        {
            ProduceVertex( s, t );
            s += ds;
        }
        
    	   t -= dt;
    }
}

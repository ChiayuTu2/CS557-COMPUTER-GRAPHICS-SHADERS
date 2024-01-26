#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include <ctype.h>

#ifdef __APPLE__
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#else
#include <GL/gl.h>
#include <GL/glu.h>
#endif



#ifndef F_PI
#define F_PI            ((float)(M_PI))
#define F_2_PI          ((float)(2.f*F_PI))
#define F_PI_2          ((float)(F_PI/2.f))
#endif


void
OsuTorus( float innerRadius, float outerRadius, int nsides, int nrings )
{
	float ringDelta = 2.0f * F_PI / (float)nrings;
	float sideDelta = 2.0f * F_PI / (float)nsides;

	float theta    = 0.0;
	float cosTheta = 1.0;
	float sinTheta = 0.0;

	for( int i = 0; i < nrings; i++ )
	{
		float theta1 = theta + ringDelta;
		float cosTheta1 = cosf(theta1);
		float sinTheta1 = sinf(theta1);

		float phi = 0.0;
		float s0 = 1.f - (float)(i+0) / (float)nrings;
		float s1 = 1.f - (float)(i+1) / (float)nrings;

		glBegin( GL_TRIANGLE_STRIP );

		for( int j = 0; j <= nsides; j++ )
		{
			float cosPhi = cosf(phi);
			float sinPhi = sinf(phi);
			float dist = outerRadius + innerRadius * cosPhi;

			float t = 1.f - (float)j / (float)nsides;

			glTexCoord2f( s0, t);
			glNormal3f(cosTheta * cosPhi, sinPhi, -sinTheta * cosPhi);
			glVertex3f(cosTheta * dist, innerRadius * sinPhi, -sinTheta * dist);

			glTexCoord2f( s1, t );
			glNormal3f( cosTheta1 * cosPhi, sinPhi,               -sinTheta1 * cosPhi );
			glVertex3f( cosTheta1 * dist,   innerRadius * sinPhi, -sinTheta1 * dist );

			phi += sideDelta;
		}

		glEnd( );

		theta = theta1;
		cosTheta = cosTheta1;
		sinTheta = sinTheta1;
	}
}

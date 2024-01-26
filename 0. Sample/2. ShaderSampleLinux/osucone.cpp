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
#define F_PI		((float)(M_PI))
#define F_2_PI		((float)(2.f*F_PI))
#define F_PI_2		((float)(F_PI/2.f))
#endif


inline
void
_DrawConeLatLng( int ilat, int ilng, int numlats, int numlngs, float radbot, float radtop, float height )
{
	float t = (float)ilat / (float)(numlats-1);
	float y = t * height;
	float rad = t * radtop + ( 1.f - t ) * radbot;
	float lng = -F_PI  +  2.f * F_PI * (float)ilng / (float)(numlngs-1);
	float x =  cosf( lng );
	float z = -sinf( lng );
	float s = (float)ilng / (float)(numlngs-1);
	glTexCoord2f( s, t );
	float n[3] = { height*x, radbot - radtop, height*z };
	Unit( n, n );
	glNormal3fv( n );
	glVertex3f( rad * x, y,rad * z );
}


void
OsuCone( float radBot, float radTop, float height, int slices, int stacks )
{
	// sanity check:
	radBot = (float)fabs( (double)radBot );
	radTop = (float)fabs( (double)radTop );
	slices =  abs( slices );
	stacks =  abs( stacks );
	if( slices < 4 )	slices = 4;
	if( stacks < 4 )	stacks = 4;

	// gracefully handle degenerate case:

	if( radBot == 0.  &&  radTop == 0. )
	{
		glBegin( GL_LINES );
			glTexCoord2f( 0., 0. );
			glNormal3f( 0., -1., 0. );
			glVertex3f( 0., 0., 0. );

			glTexCoord2f( 0., 1. );
			glNormal3f( 0., 1., 0. );
			glVertex3f( 0., height, 0. );
		glEnd( );
		return;
	}

	int numLngs = slices;
	int numLats = stacks;


	// draw the sides:

	for( int ilat = 0; ilat < numLats-1; ilat++ )
	{
		glBegin( GL_TRIANGLE_STRIP );

		_DrawConeLatLng( ilat+0, 0, numLats, numLngs, radBot, radTop, height );
		_DrawConeLatLng( ilat+1, 0, numLats, numLngs, radBot, radTop, height );

		for( int ilng = 1; ilng < numLngs; ilng++ )
		{
			_DrawConeLatLng( ilat+0, ilng, numLats, numLngs, radBot, radTop, height );
			_DrawConeLatLng( ilat+1, ilng, numLats, numLngs, radBot, radTop, height );
		}

		glEnd( );
	}

	// draw the bottom circle:

	if( radBot != 0. )
	{

		glBegin( GL_TRIANGLES );
		for( int ilng = numLngs-1; ilng >= 0; ilng-- )
		{
			_DrawConeLatLng( 0, ilng+1, numLats, numLngs, radBot, radTop, height );
			_DrawConeLatLng( 0, ilng+0, numLats, numLngs, radBot, radTop, height );

			float s = (float)ilng / (float)(numLngs-1);
			glTexCoord2f( s, 0. );
			glNormal3f( 0., -1., 0. );
			glVertex3f( 0., 0., 0. );
		}
		glEnd( );
	}


	// draw the top circle:

	if( radTop != 0. )
	{
		glBegin( GL_TRIANGLES );
		for( int ilng = 0; ilng < numLngs-1; ilng++ )
		{
			float s = (float)ilng / (float)(numLngs-1);
			glTexCoord2f( s, 1. );
			glNormal3f( 0.,  1., 0. );
			glVertex3f( 0., height, 0. );

			_DrawConeLatLng( numLats-1, ilng+0, numLats, numLngs, radBot, radTop, height );
			_DrawConeLatLng( numLats-1, ilng+1, numLats, numLngs, radBot, radTop, height );
		}
		glEnd( );
	}
}

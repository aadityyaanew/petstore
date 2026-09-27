import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../../../../lib/models/User';
import connectDB from '../../../../lib/db';
import { NextResponse } from 'next/server';

// Fallback for development if env var is missing
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const { token } = await req.json();
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
      // Existing user, log them in
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: jwtToken,
      });
    } else {
      // New user, create a temporary secure signup token
      const signupToken = jwt.sign(
        { email, name, picture },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return NextResponse.json({
        requiresPhone: true,
        signupToken
      });
    }
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ message: 'Authentication failed' }, { status: 400 });
  }
}

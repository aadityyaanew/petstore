import jwt from 'jsonwebtoken';
import User from '../../../../../lib/models/User';
import connectDB from '../../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { signupToken, phone } = await req.json();

    if (!phone || !signupToken) {
      return NextResponse.json({ message: 'Phone number and secure token are required' }, { status: 400 });
    }

    // Verify the temporary token to securely extract email, name, avatar
    let decoded;
    try {
      decoded = jwt.verify(signupToken, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired signup session' }, { status: 401 });
    }
    
    const { email, name, picture: avatar } = decoded;

    await connectDB();

    let user = await User.findOne({ email });

    if (user) {
       return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    user = await User.create({
      name,
      email,
      phone,
      avatar,
      role: 'user',
    });

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: jwtToken,
    }, { status: 201 });
  } catch (error) {
    console.error('Complete Signup Error:', error);
    return NextResponse.json({ message: 'Signup failed' }, { status: 400 });
  }
}

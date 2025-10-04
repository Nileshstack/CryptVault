import { NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongo'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  const body = await req.json()
  const { email, password } = body || {}
  if (!email || !password) return NextResponse.json({ error: 'Missing' }, { status: 400 })

  const db = await getDb()
  const users = db.collection('users')
  const user = await users.findOne({ email })
  if (!user) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

  const token = jwt.sign({ sub: user._id.toString(), email }, process.env.JWT_SECRET || 'devsecret')
  return NextResponse.json({ token })
}

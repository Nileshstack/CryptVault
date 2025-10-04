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
  const exists = await users.findOne({ email })
  if (exists) return NextResponse.json({ error: 'User exists' }, { status: 400 })

  const hash = await bcrypt.hash(password, 10)
  const res = await users.insertOne({ email, password: hash, createdAt: new Date() })

  const token = jwt.sign({ sub: res.insertedId.toString(), email }, process.env.JWT_SECRET || 'devsecret')
  return NextResponse.json({ token })
}

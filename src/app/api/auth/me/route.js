import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getDb } from '../../../../lib/mongo'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    const db = await getDb()
    const user = await db.collection('users').findOne({ _id: new ObjectId(data.sub) }, { projection: { password: 0 } })
    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 })
  }
}

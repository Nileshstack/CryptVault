import { NextResponse } from 'next/server'
import { getDb } from '../../../lib/mongo'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

async function getUserId(req) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return null
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    return data.sub
  } catch (err) {
    return null
  }
}

export async function GET(req) {
  const uid = await getUserId(req)
  if (!uid) return NextResponse.json({ error: 'unauth' }, { status: 401 })
  const db = await getDb()
  const items = await db.collection('vault').find({ userId: uid }).toArray()
  return NextResponse.json({ items })
}

export async function POST(req) {
  const uid = await getUserId(req)
  if (!uid) return NextResponse.json({ error: 'unauth' }, { status: 401 })
  const body = await req.json()
  const db = await getDb()
  const item = { ...body, userId: uid, createdAt: new Date() }
  const res = await db.collection('vault').insertOne(item)
  return NextResponse.json({ id: res.insertedId })
}

export async function PATCH(req) {
  const uid = await getUserId(req)
  if (!uid) return NextResponse.json({ error: 'unauth' }, { status: 401 })
  const body = await req.json()
  const { id, ...rest } = body || {}
  if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 })
  const db = await getDb()
  await db.collection('vault').updateOne({ _id: new ObjectId(id), userId: uid }, { $set: rest })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req) {
  const uid = await getUserId(req)
  if (!uid) return NextResponse.json({ error: 'unauth' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 })
  const db = await getDb()
  await db.collection('vault').deleteOne({ _id: new ObjectId(id), userId: uid })
  return NextResponse.json({ ok: true })
}

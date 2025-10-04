"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

function randInt(max) {
  return Math.floor(Math.random() * max)
}

function generate(len, opts) {
  const lowers = 'abcdefghjkmnpqrstuvwxyz'
  const uppers = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  const nums = '23456789'
  const syms = '!@#$%^&*()-_=+[]{};:,.<>?'
  let pool = ''
  if (opts.l) pool += lowers
  if (opts.u) pool += uppers
  if (opts.n) pool += nums
  if (opts.s) pool += syms
  let out = ''
  for (let i = 0; i < len; i++) out += pool[randInt(pool.length)]
  return out
}

export default function Home() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [len, setLen] = useState(16)
  const [opts, setOpts] = useState({ l: true, u: true, n: true, s: false })
  const [gen, setGen] = useState('')
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setError('')
    const url = `/api/auth/${mode}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    })
    const data = await res.json()
    if (data.error) return setError(data.error)
    if (data.token) {
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    }
  }

  function onGen() {
    const p = generate(len, opts)
    setGen(p)
    setPass(p)
  }

  function copyAndClear() {
    if (!gen) return
    navigator.clipboard.writeText(gen)
    setGen('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Mini Vault</h1>
        <p className={styles.subtitle}>
          Your passwords, secured and encrypted on your device.
        </p>

        <div className={styles.modeSwitch}>
          <button
            onClick={() => setMode('login')}
            className={mode === 'login' ? styles.activeTab : styles.tab}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={mode === 'register' ? styles.activeTab : styles.tab}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit} className={styles.form}>
          <label>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.input}
          />

          <label>Password</label>
          <input
            value={pass}
            onChange={e => setPass(e.target.value)}
            type="password"
            required
            className={styles.input}
          />

          {mode === 'register' && (
            <div className={styles.generatorSection}>
              <h4>Password Generator</h4>

              <label>Length: {len}</label>
              <input
                type="range"
                min={8}
                max={64}
                value={len}
                onChange={e => setLen(Number(e.target.value))}
                className={styles.slider}
              />

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={opts.l}
                    onChange={e => setOpts({ ...opts, l: e.target.checked })}
                  />
                  lower
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={opts.u}
                    onChange={e => setOpts({ ...opts, u: e.target.checked })}
                  />
                  upper
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={opts.n}
                    onChange={e => setOpts({ ...opts, n: e.target.checked })}
                  />
                  numbers
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={opts.s}
                    onChange={e => setOpts({ ...opts, s: e.target.checked })}
                  />
                  symbols
                </label>
              </div>

              <button
                type="button"
                onClick={onGen}
                className={styles.generateBtn}
              >
                Generate Password
              </button>

              {gen && (
                <div className={styles.generatedBox}>
                  <input
                    type="text"
                    value={gen}
                    readOnly
                    className={styles.generatedInput}
                  />
                  <button
                    type="button"
                    onClick={copyAndClear}
                    className={styles.copyBtn}
                  >
                    Copy & Clear
                  </button>
                </div>
              )}
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  )
}

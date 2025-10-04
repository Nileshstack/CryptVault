"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import CryptoJS from "crypto-js"
import styles from "./page.module.css"

export default function Dashboard() {
  const [token, setToken] = useState("")
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const clearTimer = useRef()
  const router = useRouter()

  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) {
      router.push("/")
      return
    }
    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { authorization: "Bearer " + t },
        })
        const data = await res.json()
        if (data.error || !data.user) {
          router.push("/")
          return
        }
        setToken(t)
        fetchItems(t)
      } catch (err) {
        router.push("/")
      }
    })()
  }, [])

  async function fetchItems(t) {
    const res = await fetch("/api/vault", {
      headers: { authorization: "Bearer " + t },
    })
    const data = await res.json()
    setItems(data.items || [])
  }

  async function saveItem(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const obj = Object.fromEntries(form)

    const passphrase = prompt(
      "Enter local encryption passphrase (never sent to server)"
    )
    if (!passphrase) return alert("Cancelled")

    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(obj),
      passphrase
    ).toString()

    await fetch("/api/vault", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ data: ciphertext, title: obj.title || "" }),
    })

    fetchItems(token)
    e.target.reset()
  }

  function decryptItem(item) {
    const passphrase = prompt("Enter local encryption passphrase to decrypt")
    if (!passphrase) return
    try {
      const bytes = CryptoJS.AES.decrypt(item.data, passphrase)
      const txt = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(txt)
    } catch (err) {
      alert("Incorrect passphrase")
    }
  }

  function copyClear(txt) {
    navigator.clipboard.writeText(txt)
    if (clearTimer.current) clearTimeout(clearTimer.current)
    clearTimer.current = setTimeout(() => {
      navigator.clipboard.writeText("")
    }, 15000)
  }

  const filtered = items.filter(
    (i) => !q || (i.title && i.title.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🔐 Secure Vault</h2>
      <div className={styles.grid}>
        {/* Add item section */}
        <div className={styles.formSection}>
          <h3 className={styles.subheading}>Add New Item</h3>
          <form onSubmit={saveItem} className={styles.form}>
            <input name="title" placeholder="Title" className={styles.input} />
            <input
              name="username"
              placeholder="Username"
              className={styles.input}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className={styles.input}
            />
            <input
              name="url"
              placeholder="https://..."
              className={styles.input}
            />
            <textarea
              name="notes"
              placeholder="Notes"
              className={styles.textarea}
            />
            <button type="submit" className={styles.button}>
              Save Encrypted
            </button>
          </form>
        </div>

        {/* Saved items */}
        <div className={styles.savedSection}>
          <h3 className={styles.subheading}>Saved Items</h3>
          <input
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={styles.search}
          />
          <div className={styles.itemsList}>
            {filtered.map((it) => (
              <div key={it._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>{it.title || "Untitled"}</strong>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.smallButton}
                      onClick={async () => {
                        const d = decryptItem(it)
                        if (d) {
                          if (d.password) copyClear(d.password)
                          alert(JSON.stringify(d, null, 2))
                        }
                      }}
                    >
                      Open
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={async () => {
                        await fetch("/api/vault?id=" + it._id, {
                          method: "DELETE",
                          headers: { authorization: "Bearer " + token },
                        })
                        fetchItems(token)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className={styles.cardDate}>
                  {new Date(it.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

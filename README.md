# 🔐 CryptVault

A simple **privacy-first password manager** built with **Next.js**.  
All data is **AES encrypted locally** before being sent to the server, ensuring your secrets stay secure.  

---

## 🔑 Note on Crypto
I used **CryptoJS AES** for encryption because:  
- It’s lightweight and runs fully **client-side** (no server dependency).  
- AES is an industry-standard encryption algorithm that’s **fast and secure**.  
- The **passphrase never leaves the client**, so the server never knows your secret. 

## 🚀 Features
- Register / Login with JWT authentication  
- Add and store encrypted credentials (username, password, notes, URLs)  
- Local-only AES encryption with passphrase (never sent to server)  
- Copy password with auto-clear for security  
- Search and manage saved items  
- Clean, modern UI with gradient background  

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router, React Hooks)  
- **Backend:** Next.js API Routes (Node.js)  
- **Database:** MongoDB  
- **Crypto:** AES encryption with **CryptoJS**  
- **Auth:** JWT-based authentication  

---

## 📂 Project Setup

### Clone the repo
  ```bash
  git clone https://github.com/Nileshstack/CryptVault.git
  cd CryptVault
  npm install


## **Make a .env.local file in root and add your MongoDB + JWT secret**
# Example:
# MONGODB_URI=mongodb+srv://<your-cluster-url>
# MONGODB_DB=CryptVault
# JWT_SECRET=your_jwt_secret

# Run the development server
npm run dev



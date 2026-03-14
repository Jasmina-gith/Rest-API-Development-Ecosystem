import React, { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
// save production token and hard-redirect to /pro

    localStorage.setItem('token', 'true')
    window.location.href = '/pro'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-2xl bg-[rgba(15,23,42,0.72)] border border-cyan-500/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <h2 className="text-center text-3xl font-extrabold text-white mb-2">Sign in</h2>
          <p className="text-center text-sm text-cyan-200 mb-6">Enter your professional email and password</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-cyan-200 font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg px-3 py-2 bg-[#0f172a] border border-cyan-700/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs text-cyan-200 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full rounded-lg px-3 py-2 bg-[#0f172a] border border-cyan-700/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold shadow-lg"
            >
              Continue to Professional Dashboard
            </button>
          </form>
        </div>
By continuing you accept the production terms of service.
      </div>
    </div>
  )
}

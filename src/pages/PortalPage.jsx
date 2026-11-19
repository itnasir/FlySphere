import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Lock, Shield, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function PortalPage({ mode = 'account' }) {
  const { applications, showToast } = useApp()

  const config = {
    account: {
      title: 'Customer Portal',
      subtitle: 'Sign in with your mobile number or tracking ID to view your visa, work permit & ticket files.',
      badge: 'Customer Login',
      icon: User,
      demoLabel: 'Demo Customer Access',
    },
    agent: {
      title: 'B2B Agent Portal',
      subtitle: 'Partner travel agencies across Bangladesh can manage client work permit files and group fares.',
      badge: 'Partner Network',
      icon: Shield,
      demoLabel: 'Demo Agent Access',
    },
    admin: {
      title: 'Staff Operations Desk',
      subtitle: 'Internal Lusan Travels file processing, embassy scheduling & ticketing management.',
      badge: 'Staff Access',
      icon: Lock,
      demoLabel: 'Demo Staff View',
    },
  }[mode] || {
    title: 'Customer Portal',
    subtitle: 'Manage your travel and work permit applications.',
    badge: 'Portal',
    icon: User,
    demoLabel: 'Demo Access',
  }

  const Icon = config.icon
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [signedInUser, setSignedInUser] = useState(null)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (identifier.trim().length < 3) {
      setError('Please enter your phone number, email, or tracking ID.')
      return
    }
    if (password.trim().length < 4) {
      setError('Please enter your password or PIN (min 4 characters).')
      return
    }
    setSignedInUser(identifier.trim())
    showToast(`Signed in to ${config.title}`, 'success')
  }

  return (
    <main className="py-10 sm:py-16 min-h-[75vh]">
      <div className="wrap max-w-[960px]">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-royal hover:text-cta mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        {!signedInUser ? (
          <div className="max-w-[460px] mx-auto bg-white rounded-[20px] border border-line shadow-book p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-11 h-11 rounded-xl bg-tint text-navy flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-cta">
                  {config.badge}
                </span>
                <h1 className="display text-[24px] font-extrabold text-navy leading-tight">
                  {config.title}
                </h1>
              </div>
            </div>

            <p className="text-[14px] text-muted leading-relaxed mb-6">
              {config.subtitle}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="block text-[13px] font-bold text-ink mb-1.5">
                  Phone / Email / Tracking ID
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX or LT-WP-00001"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[14.5px] focus:border-royal focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="block text-[13px] font-bold text-ink mb-1.5">
                  Password / PIN
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-field text-[14.5px] focus:border-royal focus:outline-none"
                />
              </label>

              {error && (
                <p className="text-[13px] font-semibold text-bad bg-bad-bg px-3.5 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-[12px] bg-navy hover:bg-deep text-white font-bold text-[14.5px] cursor-pointer"
              >
                Sign in
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-line flex items-center justify-between gap-2">
              <span className="text-[12.5px] text-muted">Want to preview the dashboard?</span>
              <button
                type="button"
                onClick={() => {
                  setSignedInUser('Demo User (Banani Desk)')
                  showToast(`${config.demoLabel} activated`, 'info')
                }}
                className="text-[13px] font-bold text-royal hover:text-cta cursor-pointer"
              >
                {config.demoLabel} →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-navy text-white rounded-[18px] p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-cta-light">
                  {config.title}
                </span>
                <h1 className="display text-[26px] font-extrabold mt-0.5">
                  Welcome, {signedInUser}
                </h1>
                <p className="text-[14px] text-on-navy-2 mt-1">
                  Showing {applications.length} active files &amp; enquiries in your workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSignedInUser(null)}
                className="h-10 px-4 rounded-[10px] border border-white/30 bg-white/10 hover:bg-white/20 text-white text-[13.5px] font-bold cursor-pointer"
              >
                Sign out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-[16px] border border-line p-5 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[13px] font-bold px-2.5 py-1 rounded bg-tint text-navy">
                      {app.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-ok-bg text-ok">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {app.statusLabel}
                    </span>
                  </div>
                  <h2 className="display text-[18px] font-extrabold text-ink">
                    {app.applicant} · {app.country}
                  </h2>
                  <p className="text-[13.5px] text-muted">
                    {app.service} ({app.role})
                  </p>
                  <div className="pt-2 border-t border-line flex items-center justify-between text-[12.5px] text-muted">
                    <span>Officer: {app.officer}</span>
                    <span>{app.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

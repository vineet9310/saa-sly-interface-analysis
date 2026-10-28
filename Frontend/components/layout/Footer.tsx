import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer">
      <div className="section-wrap footer-grid">
        <div>
          <Link href="/" className="logo text-white flex items-center gap-2">
            <span className="logo-mark">✦</span>
            <strong className="text-white">SaaSly</strong>
          </Link>
          <p>The smarter way to run your business with AI-powered analytics and seamless team management.</p>
        </div>

        <div>
          <strong>Product</strong>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/pricing">Pricing</Link>
        </div>

        <div>
          <strong>Company</strong>
          <Link href="/#solutions">About us</Link>
          <Link href="/team">Our Team</Link>
          <Link href="/#resources">Resources</Link>
          <Link href="/#contact">Contact</Link>
        </div>

        <div>
          <strong>Legal</strong>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/security">Security Overview</Link>
        </div>
      </div>

      <div className="section-wrap footer-bottom">
        <span>© {new Date().getFullYear()} SaaSly Inc. All rights reserved.</span>
        <span>Made for teams that move fast.</span>
      </div>
    </footer>
  )
}

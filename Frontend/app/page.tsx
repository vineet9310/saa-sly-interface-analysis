'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, Play, Sparkles, Zap } from 'lucide-react'
import { SaaslyDashboardPreview } from '@/components/saasly-dashboard-preview'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const faqs = [
  ['What is SaaSly?', 'SaaSly is an all-in-one workspace for managing projects, teams, analytics, and everyday business operations.'],
  ['Can I try SaaSly for free?', 'Yes. Every plan starts with a 14-day free trial and no credit card is required.'],
  ['Can I cancel anytime?', 'Absolutely. You can change or cancel your plan whenever you need from your billing settings.'],
  ['How does the AI telemetry work?', 'Our engine analyzes velocity, revenue trends, and team capacity to forecast delivery milestones accurately.'],
  ['Is SaaSly SOC2 and GDPR compliant?', 'Yes, enterprise security protocols including end-to-end encryption and regular penetration audits are standard.'],
]

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [demoVideoOpen, setDemoVideoOpen] = useState(false)

  return (
    <main id="top" className="site-shell">
      <Navbar />

      {/* Hero Section */}
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={13} /> New &nbsp; AI-powered analytics now available
          </div>
          <h1>
            Build, Manage and<br />
            Grow Your Business<br />
            <span>with AI-Powered Tools</span>
          </h1>
          <p>
            All the tools you need to manage your projects, team, analytics, and automation in one powerful platform.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" href="/signup">
              Get Started Free <ArrowRight size={15} />
            </Link>
            <Link className="button button-ghost" href="/dashboard">
              <span className="play-icon">
                <Play size={11} fill="currentColor" />
              </span>{' '}
              Watch Demo
            </Link>
          </div>

          <div className="hero-trust">
            <span><Check size={13} /> No credit card required</span>
            <span><Check size={13} /> Free 14-day trial</span>
            <span><Check size={13} /> Cancel anytime</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-blob blob-one" />
          <div className="hero-blob blob-two" />
          <SaaslyDashboardPreview />
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted section-wrap">
        <span>Trusted by 10,000+ teams worldwide</span>
        <div className="trusted-logos">
          <strong>Google</strong>
          <strong>Microsoft</strong>
          <strong>slack</strong>
          <strong>Notion</strong>
          <strong>shopify</strong>
          <strong>Dropbox</strong>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="section-wrap feature-section">
        <div className="section-intro">
          <div className="eyebrow"><Zap size={13} /> Everything you need</div>
          <h2>One platform. <span>Endless possibilities.</span></h2>
          <p>Powerful tools designed to help your team work smarter, move faster, and grow further.</p>
        </div>

        <div className="feature-grid">
          {[
            ['01', 'Project management', 'Plan, track, and deliver projects with clarity and confidence.', '/projects'],
            ['02', 'Smart analytics', 'Turn your business data into clear, actionable insights with predictive AI.', '/analytics'],
            ['03', 'Team collaboration', 'Bring your team together and make work flow effortlessly with permission tiers.', '/team'],
          ].map(([number, title, text, href]) => (
            <article className="feature-card" key={title}>
              <span className="feature-number">{number}</span>
              <div className="feature-icon">
                <Sparkles size={18} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href={href}>
                Explore feature <ArrowRight size={13} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Solutions / Workflow Section */}
      <section id="solutions" className="workflow-section">
        <div className="section-wrap workflow">
          <div className="workflow-copy">
            <div className="eyebrow">Simple by design</div>
            <h2>Work better.<br /><span>Grow together.</span></h2>
            <p>From your first project to your next big milestone, SaaSly keeps everyone aligned and moving forward.</p>
            {['Bring your work into one place', 'See what matters at a glance', 'Make confident decisions faster'].map((item, i) => (
              <div className="check-row" key={item}>
                <span>{i + 1}</span>
                <strong>{item}</strong>
                <Check size={14} />
              </div>
            ))}
          </div>

          <div className="workflow-panel">
            <div className="workflow-top">
              <span>Project overview</span>
              <span className="live-pill">● Live</span>
            </div>
            <div className="workflow-progress">
              <div>
                <small>Website redesign</small>
                <strong>80%</strong>
              </div>
              <div className="progress-track">
                <span />
              </div>
            </div>
            <div className="workflow-tasks">
              <div><span className="task-check">✓</span><span>Research & planning</span><small>Done</small></div>
              <div><span className="task-check">✓</span><span>Design exploration</span><small>Done</small></div>
              <div><span className="task-pending">•</span><span>Development sprint</span><small>In progress</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Dashboard Showcase */}
      <section id="dashboard" className="section-wrap dashboard-section">
        <div className="section-intro">
          <div className="eyebrow">Your business, beautifully organized</div>
          <h2>Everything at a <span>glance.</span></h2>
          <p>A real-time view of the metrics and activity that move your business forward.</p>
        </div>
        <Link href="/dashboard" className="block cursor-pointer transition-transform hover:scale-[1.01]">
          <SaaslyDashboardPreview />
        </Link>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-wrap">
          <div className="section-intro">
            <div className="eyebrow">Simple, transparent pricing</div>
            <h2>Choose the perfect plan<br /><span>for your business</span></h2>
            <p>Start free and scale as you grow. All plans include core features and 24/7 support.</p>
          </div>

          <div className="pricing-grid">
            {[
              ['Starter', '$0', 'Perfect for individuals', ['Up to 3 projects', 'Basic analytics', '1 team member', 'Community support'], 'Get Started', '/signup?plan=starter'],
              ['Pro', '$29', 'Most popular for growing teams', ['Unlimited projects', 'Advanced analytics', 'Up to 10 team members', 'Priority support', 'Custom integrations'], 'Start Free Trial', '/signup?plan=pro'],
              ['Business', '$79', 'For large organizations', ['Everything in Pro', 'Unlimited team members', 'Advanced security', 'Dedicated support', 'Custom onboarding'], 'Contact Sales', '/signup?plan=business'],
            ].map(([name, price, desc, features, cta, href], i) => (
              <article className={`price-card ${i === 1 ? 'popular' : ''}`} key={name as string}>
                {i === 1 && <div className="popular-label">Most Popular</div>}
                <h3>{name}</h3>
                <p>{desc}</p>
                <div className="price">
                  <strong>{price}</strong>
                  <span>/month</span>
                </div>
                <div className="price-features">
                  {(features as string[]).map((feature) => (
                    <div key={feature}>
                      <Check size={14} />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link
                  href={href as string}
                  className={`button ${i === 1 ? 'button-primary' : 'button-outline'}`}
                >
                  {cta}
                </Link>
              </article>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="text-xs font-semibold text-blue-600 hover:underline">
              View full plan comparison & features →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="resources" className="faq-section section-wrap">
        <div className="section-intro">
          <div className="eyebrow">Frequently asked questions</div>
          <h2>Questions? <span>We&apos;ve got answers.</span></h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], i) => (
            <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={question}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{question}</span>
                <ChevronDown size={18} />
              </button>
              {openFaq === i && <p>{answer}</p>}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}

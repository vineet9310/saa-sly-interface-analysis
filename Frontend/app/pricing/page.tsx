'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, HelpCircle, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const plans = [
  {
    name: 'Starter',
    badge: null,
    popular: false,
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: 'Perfect for individuals and small side-projects',
    ctaText: 'Get Started',
    ctaHref: '/signup?plan=starter',
    features: [
      'Up to 3 projects',
      'Basic analytics',
      '1 team member',
      'Community support',
      '1GB Cloud storage',
      'Standard integrations',
    ],
  },
  {
    name: 'Pro',
    badge: 'Most Popular',
    popular: true,
    monthlyPrice: 29,
    yearlyPrice: 23,
    desc: 'Most popular for growing teams and scaling startups',
    ctaText: 'Start Free Trial',
    ctaHref: '/signup?plan=pro',
    features: [
      'Unlimited projects',
      'Advanced AI analytics',
      'Up to 10 team members',
      'Priority 24/7 support',
      'Custom integrations & Webhooks',
      '50GB Cloud storage',
      'Automated workflow triggers',
    ],
  },
  {
    name: 'Business',
    badge: null,
    popular: false,
    monthlyPrice: 79,
    yearlyPrice: 63,
    desc: 'For large organizations needing custom controls',
    ctaText: 'Contact Sales',
    ctaHref: '/signup?plan=business',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Advanced security & SSO',
      'Dedicated success manager',
      'Custom onboarding & SLA',
      'Audit logging & compliance',
      'Unlimited Cloud storage',
    ],
  },
]

const comparisonFeatures = [
  { category: 'Core Features', items: [
    { name: 'Active Projects', starter: '3', pro: 'Unlimited', business: 'Unlimited' },
    { name: 'Team Members', starter: '1', pro: '10', business: 'Unlimited' },
    { name: 'File Storage', starter: '1 GB', pro: '50 GB', business: 'Unlimited' },
    { name: 'Real-time telemetry', starter: true, pro: true, business: true },
  ]},
  { category: 'Analytics & Reporting', items: [
    { name: 'Standard KPI Dashboard', starter: true, pro: true, business: true },
    { name: 'AI Predictive Insights', starter: false, pro: true, business: true },
    { name: 'CSV & PDF Data Export', starter: false, pro: true, business: true },
    { name: 'Custom SQL Queries', starter: false, pro: false, business: true },
  ]},
  { category: 'Security & Management', items: [
    { name: 'Role-based Permissions', starter: false, pro: true, business: true },
    { name: 'Two-Factor Authentication', starter: true, pro: true, business: true },
    { name: 'Single Sign-On (SAML/SSO)', starter: false, pro: false, business: true },
    { name: 'Dedicated Account Manager', starter: false, pro: false, business: true },
  ]},
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="site-shell bg-[#ffffff]">
      <Navbar />

      <main className="py-16 md:py-24">
        {/* Header Section */}
        <section className="section-wrap text-center max-w-3xl mx-auto mb-14">
          <div className="eyebrow mb-3">Simple, transparent pricing</div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Choose the perfect plan<br />
            <span className="text-blue-600">for your business</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
            Start free and scale as you grow. All plans include core features and 24/7 support.
          </p>

          {/* Billing Toggle */}
          <div className="pricing-toggle mt-8">
            <button
              className={billingPeriod === 'monthly' ? 'active' : ''}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={billingPeriod === 'yearly' ? 'active' : ''}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
            </button>
            <span>Save 20%</span>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="section-wrap mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const price = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
              return (
                <article
                  key={plan.name}
                  className={`price-card flex flex-col justify-between ${
                    plan.popular ? 'popular' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="popular-label">Most Popular</div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mb-6">{plan.desc}</p>

                    <div className="price flex items-baseline gap-1 mb-6">
                      <strong className="text-4xl font-extrabold text-slate-900">
                        ${price}
                      </strong>
                      <span className="text-xs text-slate-400">/month</span>
                    </div>

                    <div className="price-features space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2.5 text-xs text-slate-600">
                          <Check size={14} className="text-blue-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={plan.ctaHref}
                    className={`button w-full text-center ${
                      plan.popular ? 'button-primary' : 'button-outline'
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </article>
              )
            })}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="section-wrap max-w-5xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Compare plan features
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Detailed breakdown of everything included in each tier.
            </p>
          </div>

          <div className="data-table-container shadow-sm border border-slate-200">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-th w-2/5">Features</th>
                  <th className="table-th text-center">Starter ($0)</th>
                  <th className="table-th text-center bg-blue-50/50 text-blue-700">Pro ($29)</th>
                  <th className="table-th text-center">Business ($79)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((cat) => (
                  <React.Fragment key={cat.category}>
                    <tr className="bg-slate-50">
                      <td colSpan={4} className="py-2.5 px-4 text-xs font-bold text-slate-700">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item) => (
                      <tr key={item.name} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <td className="table-td font-medium text-slate-800">{item.name}</td>
                        <td className="table-td text-center">
                          {typeof item.starter === 'boolean' ? (
                            item.starter ? (
                              <Check size={16} className="text-emerald-600 mx-auto" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="text-xs text-slate-600">{item.starter}</span>
                          )}
                        </td>
                        <td className="table-td text-center bg-blue-50/30">
                          {typeof item.pro === 'boolean' ? (
                            item.pro ? (
                              <Check size={16} className="text-blue-600 mx-auto" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="text-xs font-semibold text-blue-700">{item.pro}</span>
                          )}
                        </td>
                        <td className="table-td text-center">
                          {typeof item.business === 'boolean' ? (
                            item.business ? (
                              <Check size={16} className="text-emerald-600 mx-auto" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="text-xs text-slate-600">{item.business}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="section-wrap max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-500/10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to accelerate your workflow?
            </h3>
            <p className="text-blue-100 text-sm max-w-md mx-auto mb-6">
              Start your 14-day free trial now. No credit card required, cancel anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="button bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg text-xs"
              >
                Get Started Free <ArrowRight size={14} />
              </Link>
              <Link
                href="/dashboard"
                className="button bg-blue-700/60 border border-blue-400/40 text-white hover:bg-blue-700 font-semibold px-6 py-3 rounded-lg text-xs"
              >
                Explore Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

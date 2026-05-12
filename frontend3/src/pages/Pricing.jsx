import { useState } from "react"
import { Link } from "react-router-dom"

export default function Pricing() {
  const [billing, setBilling] = useState("monthly")

  const plans = [
    { name: "Starter", desc: "For small teams", monthly: 29, yearly: 290, features: ["Up to 5 cameras", "100 searches/mo", "Basic tracking", "Email support", "7-day retention"], popular: false },
    { name: "Pro", desc: "For security teams", monthly: 99, yearly: 990, features: ["Up to 25 cameras", "Unlimited searches", "Advanced analytics", "Priority support", "90-day retention", "Real-time alerts", "API access"], popular: true },
    { name: "Enterprise", desc: "For large orgs", monthly: 299, yearly: 2990, features: ["Unlimited cameras", "Unlimited everything", "Custom AI models", "Dedicated support", "1-year retention", "Custom integrations", "SLA guarantee"], popular: false },
  ]

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-white px-4 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold mb-2">Simple <span className="text-purple-300">Pricing</span></h1>
          <p className="text-gray-500 text-sm mb-6">Choose the plan that fits your needs.</p>
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button onClick={() => setBilling("monthly")} className={`px-5 py-1.5 rounded-lg text-xs font-medium transition-all ${billing === "monthly" ? "bg-purple-400 text-black" : "text-gray-400"}`}>Monthly</button>
            <button onClick={() => setBilling("yearly")} className={`px-5 py-1.5 rounded-lg text-xs font-medium transition-all ${billing === "yearly" ? "bg-purple-400 text-black" : "text-gray-400"}`}>Yearly <span className="opacity-70">-20%</span></button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-2xl p-6 ${plan.popular ? "bg-purple-500/5 border border-purple-500/20" : "bg-white/[0.03] border border-white/[0.06]"}`}>
              {plan.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-400 text-black text-[10px] font-bold rounded-full">POPULAR</div>}
              <div className="mb-4">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-xs text-gray-500">{plan.desc}</p>
              </div>
              <div className="mb-5">
                <span className="text-4xl font-bold">${billing === "monthly" ? plan.monthly : plan.yearly}</span>
                <span className="text-gray-500 text-sm">/{billing === "monthly" ? "mo" : "yr"}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`block text-center py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${plan.popular ? "bg-purple-400 hover:bg-purple-300 text-black" : "bg-white/5 hover:bg-white/10 border border-white/10"}`}>{plan.popular ? "Start Free Trial" : "Get Started"}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

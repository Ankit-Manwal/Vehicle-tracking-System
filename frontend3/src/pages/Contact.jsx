import { useState } from "react"
import { Link } from "react-router-dom"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); setForm({ name: "", email: "", subject: "", message: "" }) }

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-white px-4 py-4">
      <div className="max-w-4xl mx-auto pt-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">Get in <span className="text-purple-300">Touch</span></h1>
          <p className="text-gray-500 text-sm">We typically respond within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {[
              { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", title: "Email", val: "support@routetrack.com" },
              { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", title: "Phone", val: "+1 (555) 123-4567" },
              { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", title: "Office", val: "123 Tech St, San Francisco, CA" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-300">{item.title}</div>
                  <div className="text-[10px] text-gray-500">{item.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            {submitted && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs text-center">Message sent successfully!</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-400 mb-1">Name</label><input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" placeholder="Your name" /></div>
                <div><label className="block text-xs font-medium text-gray-400 mb-1">Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" placeholder="you@email.com" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-400 mb-1">Subject</label><input name="subject" value={form.subject} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" placeholder="How can we help?" /></div>
              <div><label className="block text-xs font-medium text-gray-400 mb-1">Message</label><textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none" placeholder="Tell us more..." /></div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-semibold text-sm transition-all active:scale-95">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

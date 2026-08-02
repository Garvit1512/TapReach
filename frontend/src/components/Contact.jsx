import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INITIAL = { name: "", business_name: "", business_type: "", phone: "", email: "", city: "", message: "" };

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="font-body mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#B8B8B8]">{label}</span>
    <input
      className="w-full rounded-xl border border-white/10 bg-[#0e0e0e] px-4 py-3.5 text-sm text-white outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#5c5c5c] focus:border-[#8BFF00] focus:shadow-[0_0_0_3px_rgba(139,255,0,0.12)]"
      {...props}
    />
  </label>
);

const Contact = () => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/demo`, form);
      setDone(true);
      setForm(INITIAL);
      toast.success("Demo booked — we'll reach out within 24 hours.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-black py-24 md:py-32" data-testid="contact-section">
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#8BFF00]/[0.06] blur-[130px]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:px-12 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center">
          <Chapter
            number="CH.10"
            label="Book A Demo"
            title={<>Ready to grow <span className="text-gradient-green">your reviews?</span></>}
            sub="Tell us about your business and we'll show you exactly how TapReach would look on your counter — free, no commitment."
          />
          <Reveal delay={0.2}>
            <div className="font-body mt-10 space-y-4 text-sm text-[#B8B8B8]">
              <p className="flex items-center gap-3"><Phone size={16} className="text-[#8BFF00]" /> +91 98765 43210</p>
              <p className="flex items-center gap-3"><Mail size={16} className="text-[#8BFF00]" /> hello@tapreach.in</p>
              <p className="flex items-center gap-3"><MapPin size={16} className="text-[#8BFF00]" /> Serving 60+ cities across India</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass rounded-[2rem] p-8 md:p-10" data-testid="contact-form-card">
            {done ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center" data-testid="contact-success">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8BFF00]/15">
                  <CheckCircle2 size={30} className="text-[#8BFF00]" />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-white">Demo booked.</h3>
                <p className="font-body mt-3 max-w-sm text-sm leading-relaxed text-[#B8B8B8]">
                  Our team will call you within 24 hours to schedule your free personalized demo.
                </p>
                <button
                  onClick={() => setDone(false)}
                  className="mt-8 rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-white/10"
                  data-testid="contact-book-another-btn"
                >
                  Book another demo
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" data-testid="contact-form">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Name" required placeholder="Your name" value={form.name} onChange={set("name")} data-testid="contact-name-input" />
                  <Field label="Business Name" required placeholder="Your business" value={form.business_name} onChange={set("business_name")} data-testid="contact-business-input" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Business Type" required placeholder="Salon, gym, cafe…" value={form.business_type} onChange={set("business_type")} data-testid="contact-type-input" />
                  <Field label="City" required placeholder="Your city" value={form.city} onChange={set("city")} data-testid="contact-city-input" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Phone" required type="tel" placeholder="+91" value={form.phone} onChange={set("phone")} data-testid="contact-phone-input" />
                  <Field label="Email" required type="email" placeholder="you@business.com" value={form.email} onChange={set("email")} data-testid="contact-email-input" />
                </div>
                <label className="block">
                  <span className="font-body mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#B8B8B8]">Message</span>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your goals…"
                    value={form.message}
                    onChange={set("message")}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0e0e0e] px-4 py-3.5 text-sm text-white outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#5c5c5c] focus:border-[#8BFF00] focus:shadow-[0_0_0_3px_rgba(139,255,0,0.12)]"
                    data-testid="contact-message-input"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8BFF00] to-[#65E600] py-4 text-base font-bold text-black shadow-[0_0_24px_rgba(139,255,0,0.3)] transition-[box-shadow,transform,opacity] duration-300 hover:shadow-[0_0_48px_rgba(139,255,0,0.55)] active:scale-[0.98] disabled:opacity-60"
                  data-testid="contact-submit-btn"
                >
                  {loading ? "Booking…" : (<>Book Free Demo <ArrowRight size={18} strokeWidth={2.5} /></>)}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;

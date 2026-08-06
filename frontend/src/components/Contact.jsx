import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, MessageCircle, Mail, MapPin } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INITIAL = { name: "", business_name: "", business_type: "", phone: "", email: "", city: "", message: "" };

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="font-body mb-1.5 block text-xs font-medium text-[#71717a]">{label}</span>
    <input
      className="w-full rounded-lg border border-white/[0.08] bg-[#111111] px-3.5 py-2.5 text-sm text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#52525b] focus:border-[#7ae02e]/50 focus:shadow-[0_0_0_3px_rgba(122,224,46,0.08)]"
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
      toast.success("Request received. We will reach out within 24 hours.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[#090909] py-20 md:py-28" data-testid="contact-section">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 md:px-8 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col justify-center">
          <Chapter
            number="10"
            label="Free Mockup"
            title={<>Get your TapReach <span className="text-gradient-green">mockup.</span></>}
            sub="Tell us your business name and product interest. We will share a custom preview and the best setup for your review link before you pay."
          />
          <Reveal delay={0.15}>
            <div className="font-body mt-8 space-y-3 text-sm text-[#71717a]">
              <p className="flex flex-wrap items-center gap-2.5">
                <MessageCircle size={15} className="text-[#7ae02e]" />
                <a href="https://wa.me/919953070340" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-white">+91 99530 70340</a>
                <span className="text-[#3f3f46]">·</span>
                <a href="https://wa.me/917000768428" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-white">+91 70007 68428</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#7ae02e]" />
                <a href="mailto:tapreach.co@gmail.com" className="transition-colors duration-200 hover:text-white">tapreach.co@gmail.com</a>
              </p>
              <p className="flex items-center gap-2.5"><MapPin size={15} className="text-[#7ae02e]" /> Delhi NCR</p>
              <div className="grid gap-2 pt-3 text-xs text-[#a1a1aa] sm:grid-cols-3">
                <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">Free design preview</span>
                <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">Ready in 3-5 days</span>
                <span className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">NFC + QR setup</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="surface rounded-xl p-6 md:p-8" data-testid="contact-form-card">
            {done ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center" data-testid="contact-success">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7ae02e]/10">
                  <CheckCircle2 size={24} className="text-[#7ae02e]" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">Request received.</h3>
                <p className="font-body mt-2 max-w-sm text-sm leading-relaxed text-[#71717a]">
                  Our team will call you within 24 hours with your custom mockup and next steps.
                </p>
                <button
                  onClick={() => setDone(false)}
                  className="mt-6 rounded-lg border border-white/[0.1] px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/[0.04]"
                  data-testid="contact-book-another-btn"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" data-testid="contact-form">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" required placeholder="Your name" value={form.name} onChange={set("name")} data-testid="contact-name-input" />
                  <Field label="Business Name" required placeholder="Your business" value={form.business_name} onChange={set("business_name")} data-testid="contact-business-input" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Business Type" required placeholder="Salon, gym, cafe…" value={form.business_type} onChange={set("business_type")} data-testid="contact-type-input" />
                  <Field label="City" required placeholder="Your city" value={form.city} onChange={set("city")} data-testid="contact-city-input" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Phone" required type="tel" placeholder="+91" value={form.phone} onChange={set("phone")} data-testid="contact-phone-input" />
                  <Field label="Email" required type="email" placeholder="you@business.com" value={form.email} onChange={set("email")} data-testid="contact-email-input" />
                </div>
                <label className="block">
                  <span className="font-body mb-1.5 block text-xs font-medium text-[#71717a]">Message</span>
                  <textarea
                    rows={4}
                    placeholder="Example: I want 1 Premium card for my salon reception."
                    value={form.message}
                    onChange={set("message")}
                    className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#111111] px-3.5 py-2.5 text-sm text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#52525b] focus:border-[#7ae02e]/50 focus:shadow-[0_0_0_3px_rgba(122,224,46,0.08)]"
                    data-testid="contact-message-input"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7ae02e] py-3 text-sm font-semibold text-[#090909] transition-[background-color,opacity] duration-200 hover:bg-[#8bff00] active:opacity-90 disabled:opacity-50"
                  data-testid="contact-submit-btn"
                >
                  {loading ? "Sending..." : (<>Get Free Mockup <ArrowRight size={16} strokeWidth={2.5} /></>)}
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

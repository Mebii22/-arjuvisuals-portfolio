import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiArrowUpRight, HiExclamationCircle, HiCheckCircle, HiArrowPath, HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { FaWhatsapp, FaInstagram } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import Magnetic from "../components/Magnetic";
import DoodleField from "../components/DoodleField";
import { InteractiveDoodle, VintageCameraDoodle } from "../components/Doodles";
import Reveal from "../components/Reveal";
import { inquiryService } from "../services/inquiryService";
import { serviceService } from "../services/serviceService";
import { defaultServices } from "../data/services";
import { useProfile } from "../hooks/useProfile";
import { useToast } from "../context/ToastContext";
import { validateField, validateInquiryForm } from "../utils/inquiryValidation";

const empty = {
  name: "",
  email: "",
  phone: "",
  service: "",
  eventDate: "",
  location: "",
  budget: "",
  message: "",
};

export default function Contact() {
  const { profile } = useProfile();
  const toast = useToast();
  const formRef = useRef(null);
  const [searchParams] = useSearchParams();
  const paramService = searchParams.get("service") || "";

  const [form, setForm] = useState(() => ({
    ...empty,
    service: paramService,
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [services, setServices] = useState([]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    serviceService.list().then((list) => {
      setServices(Array.isArray(list) ? list : []);
    }).catch(() => {
      setServices([]);
    });
  }, []);

  const handleFieldChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));

    // Real-time validation if the field was already touched or has an error
    if (touched[key] || errors[key]) {
      const err = validateField(key, value);
      setErrors((prev) => ({
        ...prev,
        [key]: err || undefined,
      }));
    }
  };

  const handleFieldBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const err = validateField(key, form[key]);
    setErrors((prev) => ({
      ...prev,
      [key]: err || undefined,
    }));
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    // Mark all fields as touched for comprehensive validation feedback
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      service: true,
      eventDate: true,
      location: true,
      budget: true,
      message: true,
    };
    setTouched(allTouched);

    const validationErrors = validateInquiryForm(form);
    setErrors(validationErrors);

    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      // Focus and scroll to first invalid input field
      const firstFieldId = errorKeys[0];
      const el = document.getElementById(firstFieldId);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.push("Please check the highlighted fields before sending.", "err");
      return;
    }

    setSubmitting(true);
    try {
      await inquiryService.create(form);
      setSubmittedData({ ...form });
      setDone(true);
      setForm(empty);
      setTouched({});
      setErrors({});
      toast.push("Thank you! Your inquiry has been sent to Arjun Murali.", "ok");
    } catch (err) {
      toast.push(err.message || "Could not submit inquiry. Please try again or reach out directly.", "err");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setDone(false);
    setSubmittedData(null);
    setForm(empty);
    setErrors({});
    setTouched({});
  };

  const cleanPhoneTel = useMemo(() => {
    if (!profile.phone) return "";
    return `tel:${String(profile.phone).trim().replace(/[^\d+]/g, "")}`;
  }, [profile.phone]);

  const cleanWhatsAppDigits = useMemo(() => {
    const raw = String(profile.whatsapp || profile.phone || "").replace(/\D/g, "");
    if (!raw) return "";
    return raw.length === 10 ? `91${raw}` : raw;
  }, [profile.whatsapp, profile.phone]);

  const whatsappUrl = useMemo(() => {
    if (!cleanWhatsAppDigits) return "";
    return `https://wa.me/${cleanWhatsAppDigits}`;
  }, [cleanWhatsAppDigits]);

  const whatsappDisplay = useMemo(() => {
    return profile.whatsapp || profile.phone || "Chat on WhatsApp";
  }, [profile.whatsapp, profile.phone]);

  const instagramUrl = useMemo(() => {
    if (!profile.instagram) {
      if (profile.instagramHandle) {
        return `https://instagram.com/${profile.instagramHandle.replace(/^@/, "").trim()}`;
      }
      return "";
    }
    const clean = profile.instagram.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
    return `https://instagram.com/${clean.replace(/^@/, "").replace(/\/$/, "")}`;
  }, [profile.instagram, profile.instagramHandle]);

  const instagramDisplay = useMemo(() => {
    if (profile.instagramHandle) return profile.instagramHandle;
    if (profile.instagram) {
      const handle = profile.instagram.trim().replace(/\/$/, "").split("/").pop();
      return handle ? (handle.startsWith("@") ? handle : `@${handle}`) : "@Arjuvisuals.co";
    }
    return "@Arjuvisuals.co";
  }, [profile.instagramHandle, profile.instagram]);

  const getFieldClass = (field) => {
    if (!touched[field]) return "";
    return errors[field] ? "is-invalid" : "is-valid";
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Let’s create something meaningful. Project inquiries for ArjuVisuals.co — Arjun Murali, Thrissur, Kerala."
      />
      <section className="page-b">
        <DoodleField variant="contact" />
        <div className="container">
          <p className="kicker">05 — Inquiry</p>
          <h1 className="display">
            LET’S <span className="mark">CREATE</span>
          </h1>
          <p className="intro">Let’s create something meaningful.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-split">
          <Reveal>
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              Write in
            </p>
            <h2 className="editorial" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "0.6rem 0 1rem" }}>
              Have a project, a creative idea, or a moment you want to capture? Tell me about it.
            </h2>
            <p style={{ fontWeight: 300, marginBottom: "1.6rem" }}>
              {profile.location}. Inquiries are sent directly to Arjun Murali and saved securely. You can expect a response within 24 to 48 hours.
            </p>

            <p className="kicker" style={{ color: "var(--cyprus)", marginBottom: "0.8rem" }}>
              Direct
            </p>

            <div className="direct-contact-list">
              {/* Email */}
              {profile.email && (
                <a
                  href={`mailto:${profile.email.trim()}`}
                  className="direct-contact-item"
                  title={`Email ${profile.name || "Arjun Murali"}`}
                >
                  <div className="direct-contact-icon email" aria-hidden="true">
                    <HiOutlineEnvelope size={20} />
                  </div>
                  <div className="direct-contact-details">
                    <span className="direct-contact-label">Email</span>
                    <span className="direct-contact-value">{profile.email}</span>
                  </div>
                  <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                </a>
              )}

              {/* Phone */}
              {profile.phone && (
                <a
                  href={cleanPhoneTel}
                  className="direct-contact-item"
                  title={`Call ${profile.name || "Arjun Murali"}`}
                >
                  <div className="direct-contact-icon phone" aria-hidden="true">
                    <HiOutlinePhone size={20} />
                  </div>
                  <div className="direct-contact-details">
                    <span className="direct-contact-label">Phone</span>
                    <span className="direct-contact-value">{profile.phone}</span>
                  </div>
                  <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                </a>
              )}

              {/* WhatsApp */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="direct-contact-item"
                  title="Chat on WhatsApp"
                >
                  <div className="direct-contact-icon whatsapp" aria-hidden="true">
                    <FaWhatsapp size={20} />
                  </div>
                  <div className="direct-contact-details">
                    <span className="direct-contact-label">WhatsApp</span>
                    <span className="direct-contact-value">{whatsappDisplay}</span>
                  </div>
                  <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                </a>
              )}

              {/* Instagram */}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="direct-contact-item"
                  title="View Instagram Profile"
                >
                  <div className="direct-contact-icon instagram" aria-hidden="true">
                    <FaInstagram size={20} />
                  </div>
                  <div className="direct-contact-details">
                    <span className="direct-contact-label">Instagram</span>
                    <span className="direct-contact-value">{instagramDisplay}</span>
                  </div>
                  <HiArrowUpRight className="direct-contact-arrow" size={16} aria-hidden="true" />
                </a>
              )}
            </div>

            <div style={{ marginTop: "2rem", display: "inline-block" }}>
              <InteractiveDoodle
                type="camera"
                floatType="gentle"
                floatDuration={7.6}
                floatDelay={0.4}
                animateOnScroll={false}
                label="Vintage camera sketch — click to snap snapshot"
              >
                <VintageCameraDoodle size={56} />
              </InteractiveDoodle>
            </div>
          </Reveal>

          <div>
            <AnimatePresence mode="wait">
              {done && submittedData ? (
                <motion.div
                  key="success-card"
                  className="inquiry-success-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="inquiry-success-head">
                    <span className="inquiry-success-badge">
                      <HiCheckCircle size={18} /> Inquiry Received
                    </span>
                  </div>

                  <h3 className="editorial" style={{ fontSize: "1.7rem", lineHeight: 1.25 }}>
                    Thank you, {submittedData.name}. Your inquiry has been received successfully. The ArjuVisuals team will get back to you soon.
                  </h3>

                  <div className="inquiry-success-summary">
                    <div className="inquiry-summary-item">
                      <span>Service</span>
                      <strong>{submittedData.service}</strong>
                    </div>
                    <div className="inquiry-summary-item">
                      <span>Email</span>
                      <strong>{submittedData.email}</strong>
                    </div>
                    {submittedData.phone && (
                      <div className="inquiry-summary-item">
                        <span>Phone</span>
                        <strong>{submittedData.phone}</strong>
                      </div>
                    )}
                    {submittedData.eventDate && (
                      <div className="inquiry-summary-item">
                        <span>Date / Timeline</span>
                        <strong>{submittedData.eventDate}</strong>
                      </div>
                    )}
                    {submittedData.location && (
                      <div className="inquiry-summary-item">
                        <span>Location</span>
                        <strong>{submittedData.location}</strong>
                      </div>
                    )}
                    {submittedData.budget && (
                      <div className="inquiry-summary-item">
                        <span>Budget</span>
                        <strong>{submittedData.budget}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    <button
                      type="button"
                      className="btn btn-cyprus"
                      onClick={handleReset}
                      style={{ width: "fit-content" }}
                    >
                      <HiArrowPath /> Send another inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="inquiry-form"
                  ref={formRef}
                  className="form-grid"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Row 1: Name and Email */}
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="name">
                        <span className="field-label-text">
                          Name <span className="req">*</span>
                        </span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Maya Krishnan"
                        value={form.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        onBlur={() => handleFieldBlur("name")}
                        className={getFieldClass("name")}
                        aria-required="true"
                        aria-invalid={touched.name && !!errors.name}
                        aria-describedby={touched.name && errors.name ? "name-error" : undefined}
                      />
                      {touched.name && errors.name && (
                        <div className="error" id="name-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="email">
                        <span className="field-label-text">
                          Email <span className="req">*</span>
                        </span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. maya@example.com"
                        value={form.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        onBlur={() => handleFieldBlur("email")}
                        className={getFieldClass("email")}
                        aria-required="true"
                        aria-invalid={touched.email && !!errors.email}
                        aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                      />
                      {touched.email && errors.email && (
                        <div className="error" id="email-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone and Service */}
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="phone">
                        <span className="field-label-text">Phone</span>
                        <span className="field-optional">Optional</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        onBlur={() => handleFieldBlur("phone")}
                        className={getFieldClass("phone")}
                        aria-invalid={touched.phone && !!errors.phone}
                        aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                      />
                      {touched.phone && errors.phone && (
                        <div className="error" id="phone-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="service">
                        <span className="field-label-text">
                          Service required <span className="req">*</span>
                        </span>
                      </label>
                      <select
                        id="service"
                        value={form.service}
                        onChange={(e) => handleFieldChange("service", e.target.value)}
                        onBlur={() => handleFieldBlur("service")}
                        className={getFieldClass("service")}
                        aria-required="true"
                        aria-invalid={touched.service && !!errors.service}
                        aria-describedby={touched.service && errors.service ? "service-error" : undefined}
                      >
                        <option value="">Select a service…</option>
                        {services.map((s) => (
                          <option key={s.id || s._id || s.title} value={s.title}>
                            {s.title} {s.category ? `(${s.category === "videography" ? "Videography" : "Photography"})` : ""}
                          </option>
                        ))}
                      </select>
                      {touched.service && errors.service && (
                        <div className="error" id="service-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.service}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Event Date and Location */}
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="eventDate">
                        <span className="field-label-text">Project or event date</span>
                        <span className="field-optional">Optional</span>
                      </label>
                      <input
                        id="eventDate"
                        type="date"
                        min={todayStr}
                        value={form.eventDate}
                        onChange={(e) => handleFieldChange("eventDate", e.target.value)}
                        onBlur={() => handleFieldBlur("eventDate")}
                        className={getFieldClass("eventDate")}
                        aria-invalid={touched.eventDate && !!errors.eventDate}
                        aria-describedby={touched.eventDate && errors.eventDate ? "eventDate-error" : undefined}
                      />
                      {touched.eventDate && errors.eventDate && (
                        <div className="error" id="eventDate-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.eventDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="location">
                        <span className="field-label-text">Location</span>
                        <span className="field-optional">Optional</span>
                      </label>
                      <input
                        id="location"
                        type="text"
                        placeholder="e.g. Thrissur, Kochi, or Destination"
                        value={form.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        onBlur={() => handleFieldBlur("location")}
                        className={getFieldClass("location")}
                        aria-invalid={touched.location && !!errors.location}
                        aria-describedby={touched.location && errors.location ? "location-error" : undefined}
                      />
                      {touched.location && errors.location && (
                        <div className="error" id="location-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field: Budget */}
                  <div className="field">
                    <label htmlFor="budget">
                      <span className="field-label-text">Estimated budget</span>
                      <span className="field-optional">Optional</span>
                    </label>
                    <input
                      id="budget"
                      type="text"
                      placeholder="e.g. ₹50,000 or to discuss"
                      value={form.budget}
                      onChange={(e) => handleFieldChange("budget", e.target.value)}
                      onBlur={() => handleFieldBlur("budget")}
                      className={getFieldClass("budget")}
                      aria-invalid={touched.budget && !!errors.budget}
                      aria-describedby={touched.budget && errors.budget ? "budget-error" : undefined}
                    />
                    {touched.budget && errors.budget && (
                      <div className="error" id="budget-error" role="alert">
                        <HiExclamationCircle size={15} />
                        <span>{errors.budget}</span>
                      </div>
                    )}
                  </div>

                  {/* Field: Message */}
                  <div className="field">
                    <label htmlFor="message">
                      <span className="field-label-text">
                        Message <span className="req">*</span>
                      </span>
                    </label>
                    <textarea
                      id="message"
                      maxLength={1500}
                      placeholder="Tell me about your vision, preferred style, dates, and anything else you’d like to create together..."
                      value={form.message}
                      onChange={(e) => handleFieldChange("message", e.target.value)}
                      onBlur={() => handleFieldBlur("message")}
                      className={getFieldClass("message")}
                      aria-required="true"
                      aria-invalid={touched.message && !!errors.message}
                      aria-describedby={touched.message && errors.message ? "message-error" : undefined}
                    />
                    <div className="field-footer">
                      {touched.message && errors.message ? (
                        <div className="error" id="message-error" role="alert">
                          <HiExclamationCircle size={15} />
                          <span>{errors.message}</span>
                        </div>
                      ) : (
                        <span />
                      )}
                      <span className={`char-count ${form.message.length >= 1400 ? "near-limit" : ""}`}>
                        {form.message.length} / 1500
                      </span>
                    </div>
                  </div>

                  <Magnetic>
                    <button
                      className="btn btn-cyprus"
                      type="submit"
                      disabled={submitting}
                      style={{ width: "fit-content" }}
                    >
                      {submitting ? "Saving inquiry…" : "Send inquiry"} <HiArrowUpRight />
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}


import { motion } from "framer-motion";
import { SOFTWARE_SKILLS } from "../data/softwareSkills";

export default function SoftwareSkills({ variant = "compact", title, subtitle }) {
  if (variant === "compact") {
    return (
      <div className="software-skills-compact">
        {title && (
          <p className="software-compact-title">
            <span>Core Software Toolkit</span> · High-End Post-Production
          </p>
        )}
        <div className="software-compact-grid">
          {SOFTWARE_SKILLS.map((item, i) => (
            <motion.div
              key={item.id}
              className="software-compact-chip"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div
                className="software-compact-icon"
                style={{
                  boxShadow: `0 4px 14px ${item.accentBg}`,
                }}
              >
                <img src={item.icon} alt={item.name} loading="lazy" />
              </div>
              <div className="software-compact-text">
                <span className="software-compact-name">{item.shortName}</span>
                <span className="software-compact-role">{item.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="software-skills-showcase">
      {title && (
        <div className="section-head">
          <div>
            <p className="kicker" style={{ color: "var(--cyprus)" }}>
              03 — Creative Toolkit
            </p>
            <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}>
              SOFTWARE <span className="mark sm">SKILLS</span>
            </h2>
          </div>
          <p>{subtitle || "From RAW sensor captures to polished master deliveries — the core post-production suite powering Arjun's photography, film editing, and color science."}</p>
        </div>
      )}

      <div className="software-grid">
        {SOFTWARE_SKILLS.map((item, i) => (
          <motion.article
            key={item.id}
            className="software-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <div className="software-card-top">
              <div
                className="software-card-icon-wrap"
                style={{
                  boxShadow: `0 8px 24px ${item.accentBg}`,
                }}
              >
                <img src={item.icon} alt={item.name} className="software-card-icon" />
              </div>
              <div className="software-card-badges">
                <span className="software-pill category">{item.category}</span>
                <span className="software-pill level">{item.experience}</span>
              </div>
            </div>

            <div className="software-card-body">
              <h3 className="software-card-name">{item.name}</h3>
              <p className="software-card-role" style={{ color: "var(--cyprus)" }}>
                {item.role}
              </p>
              <p className="software-card-desc">{item.description}</p>
            </div>

            <div
              className="software-card-accent-line"
              style={{ background: item.badgeColor }}
            />
          </motion.article>
        ))}
      </div>
    </div>
  );
}

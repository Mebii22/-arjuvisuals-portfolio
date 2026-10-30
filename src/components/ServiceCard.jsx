import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.article
      className="service-card"
      data-cursor="hover"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="media">
        <img src={service.cover} alt="" loading="lazy" />
      </div>
      <div className="body">
        <p className="kicker" style={{ color: "var(--cyprus)", marginBottom: "0.4rem" }}>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        {service.features?.length ? (
          <ul>
            {service.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : null}
        {service.startingPrice ? <div className="price">From {service.startingPrice}</div> : null}
        <Link
          to={`/contact?service=${encodeURIComponent(service.title)}`}
          className="btn btn-cyprus"
          style={{ marginTop: "auto", width: "fit-content" }}
        >
          Enquire <HiArrowUpRight />
        </Link>
      </div>
    </motion.article>
  );
}

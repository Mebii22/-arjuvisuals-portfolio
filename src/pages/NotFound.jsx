import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import SplitTitle from "../components/SplitTitle";
import Magnetic from "../components/Magnetic";
import DoodleField from "../components/DoodleField";

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" />
      <section className="combo-cta" style={{ minHeight: "100svh" }}>
        <DoodleField variant="minimal" />
        <div className="combo-cyprus">
          <p className="kicker">404</p>
          <h2 className="display">
            <SplitTitle text="LOST" />
          </h2>
          <div className="hex-row">
            <span className="hex-pill">No frame here</span>
          </div>
        </div>
        <Magnetic strength={0.2}>
          <Link to="/" className="combo-orb" data-cursor="hover">
            <span className="orb-ring" aria-hidden="true" />
            <span className="orb-label">Home</span>
          </Link>
        </Magnetic>
        <div className="combo-sand">
          <h2 className="display">
            <SplitTitle text="FRAME" delay={0.1} />
          </h2>
          <p>This page isn’t in the edit.</p>
          <div className="hex-row dark">
            <span className="hex-pill">ArjuVisuals.co</span>
          </div>
        </div>
      </section>
    </>
  );
}

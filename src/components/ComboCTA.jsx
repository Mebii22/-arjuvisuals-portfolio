import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";
import {
  VintageCameraDoodle,
  DSLRCameraDoodle,
  LensDoodle,
  HeartFrameDoodle,
  FilmRollDoodle,
  BirdDoodle,
  StarDoodle,
  InteractiveDoodle,
} from "./doodles/index.js";

export default function ComboCTA({
  kicker = "Commission",
  top = "LET'S WORK",
  bottom = "TOGETHER",
  to = "/contact",
  orb = "Start",
  sandNote = "Visuals with purpose. Stories that stay.",
}) {
  return (
    <section className="combo-cta" aria-label="Start a project">
      <div className="combo-cyprus">
        <div className="combo-doodles" aria-hidden="false">
          <InteractiveDoodle type="camera" className="cd cd-1" floatDelay={0.2} label="Vintage camera doodle">
            <VintageCameraDoodle size={48} />
          </InteractiveDoodle>
          <InteractiveDoodle type="lens" className="cd cd-2" floatDelay={0.7} label="Camera lens doodle">
            <LensDoodle size={42} />
          </InteractiveDoodle>
          <InteractiveDoodle type="heart" className="cd cd-3" floatDelay={1.1} label="Heart camera frame">
            <HeartFrameDoodle size={44} />
          </InteractiveDoodle>
          <InteractiveDoodle type="star" className="cd cd-4" floatDelay={1.5} label="Sparkle doodle">
            <StarDoodle size={30} variant="sparkle" />
          </InteractiveDoodle>
        </div>
        <p className="kicker">{kicker}</p>
        <h2 className="display">{top}</h2>
        <div className="hex-row">
          <span className="hex-pill">Create →</span>
          <span className="hex-pill">A frame that stays</span>
        </div>
      </div>

      <Magnetic strength={0.22}>
        <Link to={to} className="combo-orb" data-cursor="hover">
          <span className="orb-ring" aria-hidden="true" />
          <span className="orb-label">{orb}</span>
        </Link>
      </Magnetic>

      <div className="combo-sand">
        <div className="combo-doodles dark" aria-hidden="false">
          <InteractiveDoodle type="camera" className="cd cd-5" floatDelay={0.4} label="DSLR camera doodle">
            <DSLRCameraDoodle size={50} />
          </InteractiveDoodle>
          <InteractiveDoodle type="star" className="cd cd-6" floatDelay={0.9} label="Star doodle">
            <StarDoodle size={32} variant="star" />
          </InteractiveDoodle>
          <InteractiveDoodle type="bird" className="cd cd-7" floatDelay={1.3} label="Camera birdie doodle">
            <BirdDoodle size={42} />
          </InteractiveDoodle>
        </div>
        <h2 className="display">{bottom}</h2>
        <p>{sandNote}</p>
        <div className="hex-row dark">
          <span className="hex-pill">Thrissur</span>
          <span className="hex-pill">Kerala</span>
        </div>
      </div>
    </section>
  );
}

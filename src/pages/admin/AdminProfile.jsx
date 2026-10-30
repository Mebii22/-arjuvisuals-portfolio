import { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import { profileService } from "../../services/profileService";
import { defaultProfile } from "../../data/photographer";
import { useToast } from "../../context/ToastContext";
import { compressImageFile } from "../../utils/imageUtils";

export default function AdminProfile() {
  const toast = useToast();
  const [form, setForm] = useState(defaultProfile);

  useEffect(() => {
    profileService.get().then(setForm);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoUpload = async (field, file, label) => {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1600, 1600, 0.85);
      set(field, dataUrl);
      toast.push(`${label} preview updated — click Save profile to keep.`);
    } catch {
      toast.push(`Could not process ${label}.`, "err");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.tagline.trim()) {
      toast.push("Name and tagline are required.", "err");
      return;
    }
    const specialties = Array.isArray(form.specialties)
      ? form.specialties
      : String(form.specialties)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    await profileService.update({
      ...form,
      specialties,
      portrait: form.homeHeroPortrait || form.portrait,
      portraitCutout: form.homeHeroPortrait || form.portraitCutout,
      portraitAlt: form.homeAboutPortrait || form.portraitAlt,
      aboutPortrait: form.aboutMainPortrait || form.aboutPortrait,
    });
    toast.push("All 4 photos and profile saved in this browser.");
  };

  return (
    <>
      <SEO title="Profile" />
      <div className="admin-top">
        <h1>PROFILE</h1>
      </div>
      <div className="demo-banner">
        Biography and contact fields here drive the public site in this prototype. Social links stay hidden on
        the public pages until they contain a real URL or number.
      </div>

      <form className="admin-card form-grid" onSubmit={save}>
        <p className="kicker">Identity</p>
        <div className="form-row">
          <div className="field">
            <label>Photographer name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="field">
            <label>Brand name</label>
            <input value={form.brandName} onChange={(e) => set("brandName", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Tagline</label>
          <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div className="field">
          <label>Supporting headline</label>
          <input value={form.headline} onChange={(e) => set("headline", e.target.value)} />
        </div>
        <div className="field">
          <label>Role</label>
          <input value={form.role} onChange={(e) => set("role", e.target.value)} />
        </div>

        <p className="kicker">Story</p>
        <div className="field">
          <label>Short biography</label>
          <textarea value={form.shortBio} onChange={(e) => set("shortBio", e.target.value)} />
        </div>
        <div className="field">
          <label>Full biography</label>
          <textarea
            value={form.biography}
            onChange={(e) => set("biography", e.target.value)}
            style={{ minHeight: 220 }}
          />
        </div>
        <div className="field">
          <label>Creative philosophy</label>
          <textarea value={form.philosophy} onChange={(e) => set("philosophy", e.target.value)} />
        </div>
        <div className="field">
          <label>Specialties (comma separated)</label>
          <input
            value={Array.isArray(form.specialties) ? form.specialties.join(", ") : form.specialties}
            onChange={(e) => set("specialties", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Current education</label>
          <input value={form.education} onChange={(e) => set("education", e.target.value)} />
        </div>
        <div className="field">
          <label>Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>

        <p className="kicker">Photographer Photos (4 Admin Photos)</p>
        <div className="demo-banner" style={{ marginBottom: "1.2rem" }}>
          Arjun has <strong>4 photos</strong> across the website: <strong>2 on the Homepage</strong> and <strong>2 on the About page</strong>.
          You can paste image URLs or upload new photos directly from your device anytime. Changes save instantly to your browser.
        </div>

        <div className="admin-photos-manager">
          {/* PHOTO 1: HOME HERO */}
          <div className="photo-manager-card">
            <div className="photo-manager-card-head">
              <div>
                <h3>1. Home Hero Portrait</h3>
                <span className="badge-transparency-req">⚠️ Background Removed PNG Required</span>
              </div>
              <span className="photo-manager-badge">Homepage · 01</span>
            </div>
            <p className="photo-manager-desc">
              <strong>Requirement:</strong> Must be a <strong>transparent background-removed PNG or WebP</strong> so Arjun sits directly in front of the organic deep-red graphic shape, hand-drawn sketch doodles, and handwritten signature without a solid background box.
            </p>
            <div className="field">
              <label>Image URL (Transparent PNG / WebP)</label>
              <input
                value={form.homeHeroPortrait || form.portrait || ""}
                onChange={(e) => {
                  set("homeHeroPortrait", e.target.value);
                  set("portrait", e.target.value);
                }}
                placeholder="/images/profile/arjun-home-cutout.png"
              />
              <input
                type="file"
                accept="image/png, image/webp"
                onChange={(e) => handlePhotoUpload("homeHeroPortrait", e.target.files?.[0], "Home Hero Portrait (Transparent PNG)")}
                style={{ marginTop: "0.5rem" }}
              />
            </div>
            <div className="photo-manager-preview-box checker-bg" title="Transparency preview grid">
              <img
                src={form.homeHeroPortrait || form.portrait || "/images/profile/arjun-home-cutout.png"}
                alt="Home hero preview"
                className="photo-preview-img-cutout"
              />
            </div>
            <button
              type="button"
              className="photo-manager-reset-btn"
              onClick={() => {
                set("homeHeroPortrait", "/images/profile/arjun-home-cutout.png");
                set("portrait", "/images/profile/arjun-home-cutout.png");
                toast.push("Reset Home Hero portrait to default cutout.");
              }}
            >
              Reset to default cutout
            </button>
          </div>

          {/* PHOTO 2: HOME ABOUT SECTION */}
          <div className="photo-manager-card">
            <div className="photo-manager-card-head">
              <h3>2. Home 'About Arjun' Photo</h3>
              <span className="photo-manager-badge">Homepage · 02</span>
            </div>
            <p className="photo-manager-desc">
              Framed portrait displayed alongside Arjun’s biography excerpt in the lower section of the homepage, styled with the layered photo slab.
            </p>
            <div className="field">
              <label>Image URL</label>
              <input
                value={form.homeAboutPortrait || form.portraitAlt || ""}
                onChange={(e) => {
                  set("homeAboutPortrait", e.target.value);
                  set("portraitAlt", e.target.value);
                }}
                placeholder="/images/profile/arjun-portrait-alt.jpg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload("homeAboutPortrait", e.target.files?.[0], "Home About Portrait")}
                style={{ marginTop: "0.5rem" }}
              />
            </div>
            <div className="photo-manager-preview-box">
              <div className="photo-preview-slab-wrap">
                <div className="photo-preview-slab-bg" aria-hidden="true" />
                <img
                  src={form.homeAboutPortrait || form.portraitAlt || "/images/profile/arjun-portrait-alt.jpg"}
                  alt="Home about preview"
                  className="photo-preview-slab-img"
                />
              </div>
            </div>
            <button
              type="button"
              className="photo-manager-reset-btn"
              onClick={() => {
                set("homeAboutPortrait", "/images/profile/arjun-portrait-alt.jpg");
                set("portraitAlt", "/images/profile/arjun-portrait-alt.jpg");
                toast.push("Reset Home About photo to default studio portrait.");
              }}
            >
              Reset to default portrait
            </button>
          </div>

          {/* PHOTO 3: ABOUT PAGE MAIN PORTRAIT */}
          <div className="photo-manager-card">
            <div className="photo-manager-card-head">
              <div>
                <h3>3. About Collage Main Portrait</h3>
                <span className="badge-transparency-req">⚠️ Background Removed PNG Required</span>
              </div>
              <span className="photo-manager-badge">About · 01</span>
            </div>
            <p className="photo-manager-desc">
              <strong>Requirement:</strong> Must be a <strong>transparent background-removed PNG or WebP</strong> so Arjun sits as the central focal portrait directly over the About page deep-red organic shape with camera reticle and film strip.
            </p>
            <div className="field">
              <label>Image URL (Transparent PNG / WebP)</label>
              <input
                value={form.aboutMainPortrait || form.aboutPortrait || ""}
                onChange={(e) => {
                  set("aboutMainPortrait", e.target.value);
                  set("aboutPortrait", e.target.value);
                }}
                placeholder="/images/profile/arjun-home-cutout.png"
              />
              <input
                type="file"
                accept="image/png, image/webp"
                onChange={(e) => handlePhotoUpload("aboutMainPortrait", e.target.files?.[0], "About Main Portrait (Transparent PNG)")}
                style={{ marginTop: "0.5rem" }}
              />
            </div>
            <div className="photo-manager-preview-box checker-bg" title="Transparency preview grid">
              <img
                src={form.aboutMainPortrait || form.aboutPortrait || "/images/profile/arjun-home-cutout.png"}
                alt="About main preview"
                className="photo-preview-img-cutout"
              />
            </div>
            <button
              type="button"
              className="photo-manager-reset-btn"
              onClick={() => {
                set("aboutMainPortrait", "/images/profile/arjun-home-cutout.png");
                set("aboutPortrait", "/images/profile/arjun-home-cutout.png");
                toast.push("Reset About Collage main portrait to default cutout.");
              }}
            >
              Reset to default cutout
            </button>
          </div>

          {/* PHOTO 4: ABOUT PAGE POLAROID PHOTO */}
          <div className="photo-manager-card">
            <div className="photo-manager-card-head">
              <div>
                <h3>4. About Collage Polaroid Photo</h3>
                <span className="badge-transparency-req" style={{ background: "rgba(102, 8, 16, 0.35)", borderColor: "rgba(102, 8, 16, 0.7)", color: "var(--stone)" }}>
                  Collage Frame Consistent · Photo &amp; Text Dynamic
                </span>
              </div>
              <span className="photo-manager-badge">About · 02</span>
            </div>
            <p className="photo-manager-desc">
              Secondary photo inside the tilted Polaroid card with realistic washi tape detail. The collage layout remains consistent while the photo and both text lines below can be updated or changed anytime.
            </p>
            <p className="polaroid-custom-note">
              💡 <strong>Update Photo &amp; Captions:</strong> Change the image file or URL, and edit the two caption lines below. They appear directly on the bottom border of the Polaroid card on the About page.
            </p>
            <div className="field">
              <label>Polaroid Photo URL</label>
              <input
                value={form.aboutPolaroid || ""}
                onChange={(e) => set("aboutPolaroid", e.target.value)}
                placeholder="/images/profile/arjun-portrait-alt.jpg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload("aboutPolaroid", e.target.files?.[0], "About Polaroid Photo")}
                style={{ marginTop: "0.5rem" }}
              />
            </div>
            <div className="form-row" style={{ gap: "0.75rem", marginTop: "-0.2rem" }}>
              <div className="field">
                <label style={{ fontSize: "0.72rem", color: "var(--stone)" }}>Polaroid Caption Title (Printed on card)</label>
                <input
                  value={form.aboutPolaroidCaption || ""}
                  onChange={(e) => set("aboutPolaroidCaption", e.target.value)}
                  placeholder="Arjun Murali · Studio Candid"
                  style={{ fontSize: "0.82rem" }}
                />
              </div>
              <div className="field">
                <label style={{ fontSize: "0.72rem", color: "var(--stone)" }}>Polaroid Subtitle / Meta (Handwritten script)</label>
                <input
                  value={form.aboutPolaroidMeta || ""}
                  onChange={(e) => set("aboutPolaroidMeta", e.target.value)}
                  placeholder="Thrissur // Ray-Ban Studio"
                  style={{ fontSize: "0.82rem" }}
                />
              </div>
            </div>
            <div className="photo-manager-preview-box">
              <div
                style={{
                  background: "#ffffff",
                  padding: "8px 8px 14px 8px",
                  boxShadow: "0 8px 24px rgba(39, 7, 7, 0.25)",
                  borderRadius: "2px",
                  width: "135px",
                  transform: "rotate(2.5deg)",
                  textAlign: "center",
                }}
              >
                <img
                  src={form.aboutPolaroid || "/images/profile/arjun-portrait-alt.jpg"}
                  alt="Polaroid preview"
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "#270707",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {form.aboutPolaroidCaption || "Arjun Murali"}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "#660810",
                    fontFamily: "var(--font-script)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {form.aboutPolaroidMeta || "Thrissur"}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="photo-manager-reset-btn"
              onClick={() => {
                set("aboutPolaroid", "/images/profile/arjun-portrait-alt.jpg");
                set("aboutPolaroidCaption", "Arjun Murali · Studio Candid");
                set("aboutPolaroidMeta", "Thrissur // Ray-Ban Studio");
                toast.push("Reset Polaroid photo and text to defaults.");
              }}
            >
              Reset to default polaroid &amp; text
            </button>
          </div>
        </div>

        <p className="kicker">Contact — publish only when real</p>
        <div className="form-row">
          <div className="field">
            <label>Email</label>
            <input value={form.email || ""} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>WhatsApp number</label>
            <input value={form.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div className="field">
            <label>Instagram URL</label>
            <input value={form.instagram || ""} onChange={(e) => set("instagram", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Instagram Handle / Username</label>
            <input
              value={form.instagramHandle || ""}
              placeholder="@Arjuvisuals.co"
              onChange={(e) => set("instagramHandle", e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-sand" type="submit" style={{ width: "fit-content" }}>
          Save profile
        </button>
      </form>
    </>
  );
}

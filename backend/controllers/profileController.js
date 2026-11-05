const Profile = require("../models/Profile");

/**
 * @desc    Get public photographer profile
 * @route   GET /api/profile
 * @access  Public
 */
const getPublicProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    // If no profile document exists yet, initialize it with defaults in MongoDB
    if (!profile) {
      profile = await Profile.create({});
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Update photographer profile
 * @route   PUT /api/profile
 * @access  Private (Admin only)
 */
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile();
    }

    const {
      name,
      brandName,
      wordmark,
      tagline,
      headline,
      location,
      city,
      education,
      educationShort,
      role,
      shortBio,
      biography,
      philosophy,
      specialties,
      homeHeroPortrait,
      portrait,
      portraitCutout,
      portraitOriginal,
      homeAboutPortrait,
      portraitAlt,
      aboutMainPortrait,
      aboutPortrait,
      aboutPolaroid,
      aboutPolaroidCaption,
      aboutPolaroidMeta,
      signatureText,
      showSignature,
      cover,
      email,
      phone,
      whatsapp,
      instagram,
      instagramHandle,
      website,
      socials,
    } = req.body;

    // Apply allowed profile updates
    if (name !== undefined) profile.name = String(name).trim();
    if (brandName !== undefined) profile.brandName = String(brandName).trim();
    if (wordmark !== undefined) profile.wordmark = String(wordmark).trim();
    if (tagline !== undefined) profile.tagline = String(tagline).trim();
    if (headline !== undefined) profile.headline = String(headline).trim();
    if (location !== undefined) profile.location = String(location).trim();
    if (city !== undefined) profile.city = String(city).trim();
    if (education !== undefined) profile.education = String(education).trim();
    if (educationShort !== undefined) profile.educationShort = String(educationShort).trim();
    if (role !== undefined) profile.role = String(role).trim();
    if (shortBio !== undefined) profile.shortBio = String(shortBio).trim();
    if (biography !== undefined) profile.biography = String(biography).trim();
    if (philosophy !== undefined) profile.philosophy = String(philosophy).trim();

    if (specialties !== undefined) {
      profile.specialties = Array.isArray(specialties)
        ? specialties.map((s) => String(s).trim()).filter(Boolean)
        : String(specialties)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    // Photo 1: Home Hero Cutout
    const heroImg = homeHeroPortrait || portraitCutout || portrait;
    if (heroImg !== undefined) {
      profile.homeHeroPortrait = heroImg;
      profile.portrait = heroImg;
      profile.portraitCutout = heroImg;
    }
    if (portraitOriginal !== undefined) profile.portraitOriginal = portraitOriginal;

    // Photo 2: Home About Photo
    const homeAboutImg = homeAboutPortrait || portraitAlt;
    if (homeAboutImg !== undefined) {
      profile.homeAboutPortrait = homeAboutImg;
      profile.portraitAlt = homeAboutImg;
    }

    // Photo 3: About Collage Main Portrait
    const aboutMainImg = aboutMainPortrait || aboutPortrait;
    if (aboutMainImg !== undefined) {
      profile.aboutMainPortrait = aboutMainImg;
      profile.aboutPortrait = aboutMainImg;
    }

    // Photo 4: About Polaroid Photo & Captions
    if (aboutPolaroid !== undefined) profile.aboutPolaroid = aboutPolaroid;
    if (aboutPolaroidCaption !== undefined) profile.aboutPolaroidCaption = String(aboutPolaroidCaption).trim();
    if (aboutPolaroidMeta !== undefined) profile.aboutPolaroidMeta = String(aboutPolaroidMeta).trim();

    if (signatureText !== undefined) profile.signatureText = String(signatureText).trim();
    if (showSignature !== undefined) profile.showSignature = Boolean(showSignature);
    if (cover !== undefined) profile.cover = cover;

    // Contact & Socials
    if (email !== undefined) profile.email = String(email).trim();
    if (phone !== undefined) profile.phone = String(phone).trim();
    if (whatsapp !== undefined) profile.whatsapp = String(whatsapp).trim();
    if (instagram !== undefined) profile.instagram = String(instagram).trim();
    if (instagramHandle !== undefined) profile.instagramHandle = String(instagramHandle).trim();
    if (website !== undefined) profile.website = String(website).trim();
    if (socials !== undefined && Array.isArray(socials)) profile.socials = socials;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully in MongoDB Atlas",
      data: profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicProfile,
  updateProfile,
};


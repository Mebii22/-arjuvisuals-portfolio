import { useEffect, useState } from "react";
import { profileService } from "../services/profileService";
import { defaultProfile } from "../data/photographer";

export function useProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    profileService
      .get()
      .then((p) => {
        if (on) setProfile(p);
      })
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  return { profile, setProfile, loading };
}

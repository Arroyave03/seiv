/**
 * ONBOARDING STATE
 *
 * Rastrear si el usuario completó el onboarding inicial
 * Usa localStorage (disponible en web y nativo con Expo)
 */

const ONBOARDING_KEY = "seiv_onboarding_completed";

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    // localStorage está disponible en web y en React Native con Expo
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(ONBOARDING_KEY) === "true";
    }
    return false;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

export async function markOnboardingCompleted(): Promise<void> {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
  } catch (error) {
    console.error("Error marking onboarding completed:", error);
  }
}

export async function resetOnboarding(): Promise<void> {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(ONBOARDING_KEY);
    }
  } catch (error) {
    console.error("Error resetting onboarding:", error);
  }
}

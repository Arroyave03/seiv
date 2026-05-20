import React, { useEffect, useState } from "react";

import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { OnboardingScreen } from "@/features/onboarding/onboarding-screen";
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from "@/shared/storage/onboarding";
import { useFinanceStore } from "@/shared/store/finance";

export default function HomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const hydrate = useFinanceStore((state) => state.hydrate);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      setShowOnboarding(!completed);

      // Siempre cargar datos
      await hydrate();
    };

    void checkOnboarding();
  }, [hydrate]);

  const handleOnboardingComplete = async () => {
    await markOnboardingCompleted();
    setShowOnboarding(false);
  };

  // Mientras se verifica
  if (showOnboarding === null) {
    return null;
  }

  // Mostrar onboarding si es primera vez
  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Mostrar dashboard
  return <DashboardScreen />;
}

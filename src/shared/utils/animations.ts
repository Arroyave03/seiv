/**
 * ANIMATION UTILITIES
 *
 * Microanimaciones para mejorar la UX sin sacrificar rendimiento.
 * Animaciones simples, rápidas (<200ms), que añaden pulido.
 */

import { Animated, Easing } from "react-native";

/**
 * Fade in animation
 * Útil para: pantallas que aparecen, items que aparecen en listas
 */
export function createFadeInAnimation(duration = 300) {
  const opacity = new Animated.Value(0);

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    opacity.setValue(0);
  };

  return {
    opacity,
    fadeIn,
    fadeOut,
    reset,
  };
}

/**
 * Slide up animation
 * Útil para: modals, sheets que suben desde abajo
 */
export function createSlideUpAnimation(duration = 300) {
  const translateY = new Animated.Value(200);

  const slideUp = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(translateY, {
      toValue: 200,
      duration,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    translateY.setValue(200);
  };

  return {
    translateY,
    slideUp,
    slideDown,
    reset,
  };
}

/**
 * Scale animation
 * Útil para: botones, items que aparecen
 */
export function createScaleAnimation(duration = 150) {
  const scale = new Animated.Value(0.8);

  const scaleIn = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const scaleOut = () => {
    Animated.timing(scale, {
      toValue: 0.8,
      duration,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const reset = () => {
    scale.setValue(0.8);
  };

  return {
    scale,
    scaleIn,
    scaleOut,
    reset,
  };
}

/**
 * Pulse animation
 * Útil para: loading indicators, attention grabbing
 */
export function createPulseAnimation(duration = 1000) {
  const opacity = new Animated.Value(1);

  const pulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stop = () => {
    opacity.setValue(1);
  };

  return {
    opacity,
    pulse,
    stop,
  };
}

/**
 * Bounce animation (spring-like)
 * Útil para: FAB que aparece, confirmaciones
 */
export function createBounceAnimation(duration = 500) {
  const scale = new Animated.Value(0);

  const bounce = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: duration * 0.6,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.95,
        duration: duration * 0.2,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: duration * 0.2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const reset = () => {
    scale.setValue(0);
  };

  return {
    scale,
    bounce,
    reset,
  };
}

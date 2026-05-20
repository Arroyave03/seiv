/**
 * HAPTIC FEEDBACK
 *
 * Vibraciones/haptics para mejorar la experiencia táctil.
 * Sutil pero muy efectivo para:
 * - Confirmación de acciones
 * - Feedback en pulsaciones
 * - Alertas
 *
 * Usa Haptics.notificationAsync en Expo
 */

import * as Haptics from "expo-haptics";

export type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

/**
 * Trigger haptic feedback basado en tipo
 */
export async function triggerHaptic(type: HapticFeedbackType = "light") {
  try {
    switch (type) {
      case "light":
        // Ligero: tap/selección
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;

      case "medium":
        // Medio: acción confirmada
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;

      case "heavy":
        // Pesado: acción importante
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;

      case "success":
        // Success: acción completada exitosamente
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        break;

      case "warning":
        // Warning: advertencia
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );
        break;

      case "error":
        // Error: acción fallida
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch (error) {
    // Silently fail si haptics no está disponible
    console.debug("Haptic feedback not available:", error);
  }
}

/**
 * Helpers para casos comunes
 */
export const hapticFeedback = {
  tap: () => triggerHaptic("light"),
  press: () => triggerHaptic("medium"),
  delete: () => triggerHaptic("heavy"),
  success: () => triggerHaptic("success"),
  warning: () => triggerHaptic("warning"),
  error: () => triggerHaptic("error"),
};

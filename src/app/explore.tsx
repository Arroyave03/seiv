import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Roadmap</Text>
        <Text style={styles.subtitle}>Lo que viene después de la Home</Text>

        <View style={styles.list}>
          <Text style={styles.item}>
            • Crear movimiento rápido: ingreso, gasto fijo y gasto variable.
          </Text>
          <Text style={styles.item}>
            • Normalizar la base SQLite cuando CRUD crezca.
          </Text>
          <Text style={styles.item}>
            • Agregar autenticación y sincronización cuando exista backend.
          </Text>
          <Text style={styles.item}>
            • Separar metas, presupuestos y reportes por feature.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F2EB",
    padding: 16,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(15, 23, 42, 0.08)",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0E1116",
  },
  subtitle: {
    fontSize: 14,
    color: "#667085",
  },
  list: {
    gap: 8,
  },
  item: {
    fontSize: 14,
    lineHeight: 20,
    color: "#667085",
  },
});

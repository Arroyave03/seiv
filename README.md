# Seiv - Money Management App

Aplicación minimalista de finanzas personales construida con **Expo**, **React Native**, **TypeScript**, **Expo Router**, **Zustand**, y **SQLite**.

## 🎯 Fase Actual

**Phase 3: Expense Tracking System** ✅ COMPLETADA

Una aplicación **completamente funcional** para registrar y controlar gastos diarios con:

### ✨ Features Implementadas

#### Core Functionality

- ✅ **Sistema de onboarding** (primera vez): Setup de ingreso mensual
- ✅ **Agregar gastos** (3 segundos UX): Monto → Descripción → Categoría → Guardar
- ✅ **Editar gastos**: Pre-rellena form, actualiza en tiempo real
- ✅ **Eliminar gastos**: Botón inline en movimientos
- ✅ **Pantalla Movimientos** (Historial):
  - Transacciones agrupadas por fecha
  - Totales diarios
  - Búsqueda en tiempo real
  - Filtros por categoría
  - Diseño inspirado en Wallet/Revolut/Monzo

#### Financial Intelligence

- ✅ **Dashboard** (Home):
  - Dinero disponible (dato principal)
  - Métricas: Ingreso, Gastado, Presupuesto diario, % Uso
  - Transacciones recientes (últimas 6)
  - Navegación a movimientos completos

- ✅ **Cálculos financieros**:
  - Balance disponible = Ingreso - Gastos
  - Presupuesto diario = Balance / Días restantes
  - % Uso = Gastos / Ingreso
  - Proyecciones

#### Architecture

- ✅ **State Management** (Zustand):
  - Auto-save a localStorage/SQLite
  - Hydration en app init
  - Persistence automática

- ✅ **Custom Hooks** (Financial):
  - `useSummary()`: Resumen financiero completo (17 campos)
  - `useExpenses()`: Listado, grouping, CRUD
  - `useMonthlyStats()`: Estadísticas y top categorías
  - `useAvailableBalance()`: Dinero disponible
  - `useDailyTotal()`: Total diario

- ✅ **Pure Financial Logic**:
  - Cálculos sin side effects
  - Reutilizable en web/mobile/CLI
  - Testeable independientemente

- ✅ **Design System**:
  - Tokens (colores, spacing, tipografía)
  - Tema claro/oscuro automático
  - Sombras iOS-apropiadas
  - 9 categorías con emojis

#### UX Enhancements

- ✅ **Animaciones**: Utilidades listas para slide, fade, scale, bounce, pulse
- ✅ **Haptic Feedback**: Vibraciones en acciones
- ✅ **Skeleton Loaders**: Placeholders animados mientras carga
- ✅ **Estados vacíos**: Mensajes útiles cuando no hay datos
- ✅ **Validación**: Inputs con feedback visual

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Expo Router navigation
│   ├── _layout.tsx              # Root stack
│   ├── index.tsx                # Home + Onboarding logic
│   └── explore.tsx              # Movements screen
│
├── features/                    # Screens by feature
│   ├── dashboard/               # Home screen
│   ├── movements/               # History/Transactions
│   ├── expenses/                # Create/Edit modal
│   └── onboarding/              # Setup flow
│
├── shared/                      # Reusable code
│   ├── store/                   # Zustand (state management)
│   ├── hooks/                   # Custom hooks (useSummary, useExpenses, etc)
│   ├── database/                # SQLite repositories
│   ├── financial/               # Pure logic (calculations)
│   ├── design/                  # Design system (colors, tokens, etc)
│   ├── components/              # Reusable UI (Modal, Input, etc)
│   ├── utils/                   # Helpers (animations, haptics, etc)
│   └── storage/                 # Persistent storage (onboarding flag)
│
├── types/                       # TypeScript types
├── hooks/                       # Global hooks (useTheme, etc)
├── constants/                   # App constants
└── utils/                       # App utilities
```

## 🚀 Cómo Empezar

### Instalación

```bash
# Clonar repo
git clone <repo>
cd money-app

# Instalar dependencias
npm install
# o
yarn install
```

### Desarrollo

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Build

```bash
# EAS build
eas build --platform ios
eas build --platform android

# Web export
expo export:web
```

## 📊 Cómo Usar la App

### 1. Primera Vez (Onboarding)

1. Abre la app
2. Se muestra pantalla de setup
3. Ingresa tu ingreso mensual
4. Opcionalmente: meta de ahorro
5. ¡Listo! Dashboard con 0 gastos

### 2. Agregar Gasto (3 segundos)

1. Presiona botón "+" en dashboard
2. Ingresa **monto** (auto-focus teclado)
3. Ingresa **descripción** (requerido)
4. Selecciona **categoría** (swipe horizontal)
5. Agregar **nota** (opcional)
6. Presiona "Guardar"

### 3. Ver Historial

1. Dashboard → botón "Ver todo"
2. O navega a "Movimientos" en tabs
3. Busca por descripción
4. Filtra por categoría
5. Edita (✏️) o elimina (🗑) un gasto

### 4. Analizar Finanzas

1. Dashboard muestra:
   - **Dinero disponible**: Cuánto te queda
   - **Ingreso**: Tu salario mensual
   - **Gastado**: Total mes
   - **Diario**: Presupuesto diario
   - **% Uso**: Porcentaje de ingreso gastado

## 🏗️ Arquitectura

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para:

- Filosofía arquitectónica
- Flujo de datos
- Cómo agregar features
- Best practices
- Performance optimization
- Testing strategy
- Cómo escalar

## 📚 Guías Importantes

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Cómo está estructurado y cómo mantenerlo
2. **[AGENTS.md](./AGENTS.md)** - Guía Expo (versión v55.0.0)
3. **[CLAUDE.md](./CLAUDE.md)** - Referencias para AI

## 🔒 Datos & Persistencia

- **Web**: localStorage cache (sin persistencia)
- **iOS/Android**: SQLite local (persistencia total)
- **Sync**: Listo para cloud (agrega API cuando sea necesario)
- **Backup**: Exportar/importar CSV (feature futura)

## 🎨 Design System

- **Colores**: Teal primario, tonos neutrales
- **Tipografía**: 7 niveles (Display → Label)
- **Spacing**: Consistente (4px, 8px, 16px, 24px, etc)
- **Sombras**: 4 niveles (xs → lg)
- **Temas**: Light/Dark automático

## 📱 Dispositivos Soportados

- ✅ iOS 13+
- ✅ Android 5+
- ✅ Web (navegadores modernos)

## 🚢 Próximos Pasos (Opcional)

Si quieres escalar más allá:

1. **Backend**: Agregar API para sincronización
2. **Autenticación**: Firebase/Supabase
3. **Múltiples cuentas**: Selección de cartera
4. **Presupuestos**: Límites por categoría
5. **Reportes**: Gráficos y análisis
6. **Exportar**: CSV, PDF, estadísticas
7. **Compartir**: Gastos compartidos con otros usuarios

## 💡 Tips de Desarrollo

### Agregar Nueva Feature

1. Crear carpeta en `src/features/`
2. Crear tipos en `src/types/`
3. Agregar lógica pura en `src/shared/financial/`
4. Crear hook en `src/shared/hooks/`
5. Crear pantalla/componente
6. Agregar ruta en `src/app/_layout.tsx`

### Debugging

```bash
# TypeScript check
npx tsc --noEmit

# Linter
npm run lint
```

### Performance

- Todos los hooks usan `useMemo`
- Componentes son ligeros
- Listas virtualizadas cuando sea necesario
- Storage lazy-loaded

## 📄 Licencia

MIT - Libre de usar y modificar

---

**Última actualización**: Fase 3 - Sistema de gastos completamente funcional ✨

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start Expo.

   ```bash
   npm run start
   ```

3. Open it on iPhone simulator, Android emulator, or Expo Go.

## Local-first flow

On launch, the app:

1. opens the SQLite database
2. creates the `dashboard_snapshot` table if needed
3. seeds mock financial data on first run
4. hydrates Zustand from local storage

That makes the first product loop work offline and gives you a real path toward later CRUD and sync.

## Next steps

1. Add a transaction form screen and connect it to the store.
2. Split the snapshot into normalized SQLite tables when the model grows.
3. Add sync and auth contracts in `src/services/` when backend work starts.
4. Add tests for the formatter, store selectors, and repository layer.

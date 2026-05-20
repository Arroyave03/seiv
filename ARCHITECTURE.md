/\*\*

- SEIV - MONEY APP ARCHITECTURE GUIDE
-
- Guía completa de la estructura, filosofía, y cómo escalar el proyecto.
-
- Este documento explica:
- 1.  Filosofía arquitectónica
- 2.  Estructura de carpetas y responsabilidades
- 3.  Flujo de datos (state management)
- 4.  Cómo agregar nuevas features
- 5.  Best practices y patrones usados
      \*/

// ============================================================================
// 1. FILOSOFÍA ARQUITECTÓNICA
// ============================================================================

/\*\*

- SEIV usa una arquitectura Clean Architecture + Repository Pattern:
-
- Ventajas:
- ✅ Código testeable: lógica separada de UI
- ✅ Reutilizable: mismas funciones en web, mobile, CLI
- ✅ Mantenible: cambios aislados, sin efectos secundarios
- ✅ Escalable: fácil agregar features sin romper existentes
-
- Capas:
- 1.  Presentation (Screens, Components)
- 2.  Domain (Business logic, pure functions)
- 3.  Data (Storage, API, Repositories)
      \*/

// ============================================================================
// 2. ESTRUCTURA DE CARPETAS
// ============================================================================

/\*\*

- src/
- ├── app/ # Expo Router navigation
- │ ├── \_layout.tsx # Root stack configuration
- │ ├── index.tsx # Home - Onboarding logic
- │ ├── explore.tsx # Movements/History screen
- │ └── (other routes)
- │
- ├── features/ # Feature-specific screens & components
- │ ├── dashboard/ # Home screen
- │ │ ├── dashboard-screen.tsx # Main home screen
- │ │ └── mock-dashboard.ts # Mock data for testing
- │ ├── movements/ # Transactions history
- │ │ └── movements-screen.tsx # List, search, filter, edit, delete
- │ ├── expenses/ # Expense CRUD
- │ │ └── expense-modal.tsx # Create/edit modal
- │ └── onboarding/ # Setup flow
- │ └── onboarding-screen.tsx
- │
- ├── shared/ # Shared code (reusable)
- │ ├── store/ # State management (Zustand)
- │ │ ├── finance.ts # Main store, auto-saves
- │ │ └── metrics.ts # (deprecated, logic moved to hooks)
- │ │
- │ ├── hooks/ # Custom React hooks
- │ │ └── financial.ts # useSummary, useExpenses, etc
- │ │
- │ ├── database/ # Data access layer
- │ │ ├── repositories.ts # CRUD operations
- │ │ └── storage-adapter.ts # Platform-specific storage (web/native)
- │ │
- │ ├── design/ # Design system
- │ │ ├── tokens.ts # Colors, spacing, typography
- │ │ ├── typography.ts # Font sizes, weights, line heights
- │ │ ├── shadows.ts # Shadow definitions
- │ │ └── categories.ts # Category definitions with emojis
- │ │
- │ ├── components/ # Reusable components
- │ │ ├── modal.tsx # Base modal
- │ │ ├── input.tsx # Text input
- │ │ ├── category-selector.tsx # Horizontal scrolling categories
- │ │ ├── skeleton.tsx # Skeleton loaders
- │ │ └── (others)
- │ │
- │ ├── utils/ # Utility functions
- │ │ ├── animations.ts # Reusable animations
- │ │ ├── haptics.ts # Haptic feedback
- │ │ └── (others)
- │ │
- │ ├── financial/ # Pure financial logic
- │ │ └── logic.ts # Calculations, no side effects
- │ │
- │ └── storage/ # Persistent state
- │ └── onboarding.ts # First-time setup flag
- │
- ├── types/ # TypeScript types
- │ └── finance.ts # Transaction, FinancialConfig, etc
- │
- ├── hooks/ # Global hooks
- │ ├── use-theme.ts # Theme context
- │ └── use-color-scheme.ts # Color scheme detection
- │
- ├── constants/ # App constants
- │ └── theme.ts # Spacing, sizes, etc
- │
- ├── utils/ # App-level utilities
- │ ├── money.ts # formatMoney
- │ └── (others)
- │
- └── components/ # Global components
-     ├── themed-text.tsx         # Text with theme
-     └── (others)
  \*/

// ============================================================================
// 3. FLUJO DE DATOS (DATA FLOW)
// ============================================================================

/\*\*

- DATA FLOW DIAGRAM:
-
- [User Action]
-       ↓
- [Screen/Component]
-       ↓
- [Zustand Store] ← Handles state changes
-       ↓
- [Storage Adapter] ← Saves to localStorage/SQLite
-       ↓
- [Display Updates] ← Components re-render with new data
-
- EXAMPLE: User adds expense
-
- 1.  User taps "+" button in Dashboard
- 2.  ExpenseModal opens
- 3.  User enters amount, description, category
- 4.  User taps "Guardar"
- 5.  Modal calls: useFinanceStore.addTransaction(...)
- 6.  Zustand store:
- - Adds transaction to state.transactions
- - Calls saveSnapshot() to persist
- 7.  Storage adapter saves to device
- 8.  useExpenses() hook detects change (via Zustand subscription)
- 9.  Dashboard re-renders with new transaction
-
- KEY POINTS:
- - Pure functions don't have side effects
- - Store is single source of truth
- - Storage is automatic (via saveSnapshot)
- - No API calls yet (ready for backend)
    \*/

// ============================================================================
// 4. KEY COMPONENTS & THEIR ROLES
// ============================================================================

/\*\*

- ZUSTAND STORE (useFinanceStore)
- ─────────────────────────────────
- - monthlyIncome: number
- - transactions: Transaction[]
- - isHydrated: boolean (data loaded from storage)
- - snapshot: DashboardSnapshot (backwards compatibility)
-
- Methods:
- - hydrate(): Load from storage (called on app init)
- - setMonthlyIncome(amount): Update income
- - addTransaction(...): Create new transaction
- - updateTransaction(id, data): Edit transaction
- - deleteTransaction(id): Remove transaction
- - getMetrics(): Get calculated metrics (DEPRECATED - use useSummary())
-
- Auto-save: Every mutation calls saveSnapshot() automatically
  \*/

/\*\*

- CUSTOM HOOKS (in src/shared/hooks/financial.ts)
- ────────────────────────────────────────────────
- All use useMemo to prevent unnecessary recalculations
-
- useSummary()
- - Returns: FinancialSummary (17 calculated fields)
- - Fields: totalIncome, totalExpenses, availableBalance, dailyBudget,
-           usagePercent, daysRemaining, etc.
- - Updates: Whenever transactions change
- - Usage: Dashboard, summary cards
-
- useExpenses()
- - Returns: { expenses, byDate, byCategory, delete, etc }
- - expenses: Array of transactions this month
- - byDate: Map<date, Transaction[]>
- - byCategory: Map<category, Transaction[]>
- - Usage: Movements screen, filtering, grouping
-
- useMonthlyStats()
- - Returns: Aggregated stats and top 5 categories
- - For: Charts, summaries, reports
-
- useAvailableBalance()
- - Returns: Number (available to spend)
-
- useDailyTotal(date)
- - Returns: Total spent on specific date
    \*/

/\*\*

- PURE FINANCIAL LOGIC (src/shared/financial/logic.ts)
- ───────────────────────────────────────────────────
- All functions are pure (no side effects):
-
- calculateFinancialSummary(config, transactions)
- - Input: FinancialConfig + transactions
- - Output: FinancialSummary with 17 calculated fields
- - Examples:
- - totalExpenses = sum of all expenses
- - availableBalance = monthlyIncome - totalExpenses
- - dailyBudget = availableBalance / daysRemaining
- - usagePercent = totalExpenses / monthlyIncome
-
- groupExpensesByCategory(transactions)
- groupTransactionsByDate(transactions)
- getTransactionsThisMonth(transactions)
- getDailyTotal(transactions, date)
-
- These can be tested without UI or state management
- Can be reused in backend, CLI, reports
  \*/

// ============================================================================
// 5. CÓMO AGREGAR NUEVAS FEATURES
// ============================================================================

/\*\*

- EJEMPLO: Agregar presupuestos mensuales por categoría
-
- PASO 1: Update Types
- ───────────────────
- In src/types/finance.ts:
-
- export type Budget = {
- id: string;
- categoryId: CategoryId;
- limit: number;
- month: string; // "2025-05"
- createdAt: string;
- };
-
- export type FinancialConfig = {
- ...existing fields...
- budgets: Budget[];
- };
-
- PASO 2: Update Zustand Store
- ────────────────────────────
- In src/shared/store/finance.ts:
-
- - Add budgets to state
- - Add setBudget(categoryId, limit, month)
- - Add deleteBudget(id)
- - Include in saveSnapshot()
-
- PASO 3: Add Financial Logic
- ───────────────────────────
- In src/shared/financial/logic.ts:
-
- function getBudgetStatus(budgets, expenses, category, month) {
- const budget = budgets.find(b => b.categoryId === category && b.month === month);
- const spent = expenses
-     .filter(e => e.categoryId === category && e.month === month)
-     .reduce((sum, e) => sum + e.amount, 0);
-
- return {
-     limit: budget?.limit || 0,
-     spent,
-     remaining: (budget?.limit || 0) - spent,
-     percentUsed: spent / (budget?.limit || 1),
- };
- }
-
- PASO 4: Add Custom Hook
- ──────────────────────
- In src/shared/hooks/financial.ts:
-
- export function useBudgetStatus(categoryId: CategoryId, month: string) {
- const budgets = useFinanceStore(state => state.budgets);
- const { expenses } = useExpenses();
-
- return useMemo(() => {
-     return getBudgetStatus(budgets, expenses, categoryId, month);
- }, [budgets, expenses, categoryId, month]);
- }
-
- PASO 5: Create Feature Screen/Component
- ──────────────────────────────────────
- Create src/features/budgets/budget-screen.tsx
-
- - Import useBudgetStatus hook
- - Display budget status
- - Allow setting/editing budgets
- - Show warnings when approaching limit
-
- PASO 6: Add Navigation
- ─────────────────────
- Update src/app/\_layout.tsx to add new route
-
- PASO 7: Test
- ────────────
- - Test financial logic in isolation
- - Test hook calculations
- - Test UI integration
- - Test persistence
    \*/

// ============================================================================
// 6. DESIGN SYSTEM & STYLING
// ============================================================================

/\*\*

- All styling uses the design system for consistency:
-
- Colors (Theme)
- - Light/Dark modes automatic
- - Primary (teal), Danger (red), Success (green)
- - Uses useTheme() hook
-
- Typography
- - 7 levels: Display, Headline, Title, Body, Label
- - Platform-specific fonts (SF Display on iOS, Roboto on Android)
- - Consistent sizes and weights
-
- Spacing
- - Spacing.one = 4px, .two = 8px, .three = 16px, .four = 24px, etc.
- - Consistent gaps and padding
-
- Shadows
- - 4 levels: xs, sm, md, lg
- - iOS-appropriate, not too harsh
-
- Radius
- - 8px for small elements
- - 12px for cards
- - 16px for large elements
- - 20px for rounded buttons
- - 'pill' (9999) for fully rounded
    \*/

// ============================================================================
// 7. PERFORMANCE OPTIMIZATION
// ============================================================================

/\*\*

- Current optimizations:
-
- Memoization
- - useMemo in all hooks to prevent recalculations
- - Zustand selectors to prevent unnecessary re-renders
- - useCallback for event handlers (when needed)
-
- Data Structure
- - Transactions stored in flat array (simple, performant)
- - Grouping done in hooks (lazy, on-demand)
- - Maps used for quick lookups
-
- Rendering
- - Only recent 6 transactions shown (paginate if needed)
- - Skeleton loaders while data loads
- - Lists can be virtualized for 1000+ items
-
- Storage
- - AsyncStorage cache on web
- - SQLite on native (indexed queries)
- - Lazy load repository functions
-
- Future optimizations:
- - FlatList with virtualization for large lists
- - React Query / SWR if adding API
- - Pagination in movements
- - Computed selectors library
    \*/

// ============================================================================
// 8. TESTING STRATEGY
// ============================================================================

/\*\*

- Recommendation: Test pure functions, UI separately
-
- Unit Tests (Jest)
- - Financial logic (no dependencies)
- - Utility functions
- - Hooks logic
-
- Component Tests (React Native Testing Library)
- - Screens and components
- - User interactions
- - Navigation
-
- Integration Tests
- - Store + components
- - Data persistence
- - Full user flows
-
- Example test file:
-
- describe('Financial Logic', () => {
- it('calculates available balance correctly', () => {
-     const config = { monthlyIncome: 5000000 };
-     const transactions = [{
-       id: '1',
-       amount: 100000,
-       kind: 'expense'
-     }];
-
-     const summary = calculateFinancialSummary(config, transactions);
-
-     expect(summary.availableBalance).toBe(4900000);
- });
- });
  \*/

// ============================================================================
// 9. COMMON PATTERNS
// ============================================================================

/\*\*

- PATTERN 1: Loading State
- ────────────────────────
- const [isLoading, setIsLoading] = useState(false);
-
- const handleAction = async () => {
- setIsLoading(true);
- try {
-     await expensiveOperation();
- } finally {
-     setIsLoading(false);
- }
- };
-
-
- PATTERN 2: Local State + Global State
- ──────────────────────────────────────
- // Local: for UI state (modal open, search query)
- const [showModal, setShowModal] = useState(false);
-
- // Global: for business data
- const expenses = useFinanceStore(state => state.transactions);
-
-
- PATTERN 3: Derived Data with Memoization
- ─────────────────────────────────────────
- const filteredExpenses = useMemo(() => {
- return expenses.filter(e => e.amount > threshold);
- }, [expenses, threshold]);
-
-
- PATTERN 4: Theme Consistency
- ────────────────────────────
- const theme = useTheme();
-
- <View style={{ backgroundColor: theme.background }}>
- <Text style={{ color: theme.text }}>Content</Text>
- </View>
  */

// ============================================================================
// 10. DEPLOYMENT & SCALING
// ============================================================================

/\*\*

- FOR MOBILE (iOS/Android)
- ────────────────────────
- 1.  Build with EAS:
- eas build --platform ios
- eas build --platform android
-
- 2.  Submit to app stores:
- eas submit --platform ios
- eas submit --platform android
-
- 3.  Update management:
- Use EAS Updates for instant OTA updates
-
-
- FOR WEB
- ───────
- 1.  Build: expo export:web
- 2.  Deploy to Netlify, Vercel, etc.
- 3.  Note: No persistence yet (use localStorage adapter)
-
-
- ADDING BACKEND
- ──────────────
- 1.  Keep current local-first architecture
- 2.  Add API layer in src/shared/api/
- 3.  Add sync service for cloud backup
- 4.  Use React Query for server state
- 5.  Implement conflict resolution
-
-
- ADDING AUTHENTICATION
- ─────────────────────
- 1.  Use Firebase, Supabase, or custom backend
- 2.  Add auth context/store
- 3.  Add login/signup screens
- 4.  Protect routes
- 5.  Sync user data to cloud
-
-
- MULTIPLE ACCOUNTS/WALLETS
- ──────────────────────────
- 1.  Add accounts table to database
- 2.  Add account selection UI
- 3.  Update all queries to filter by account_id
- 4.  Update store to support active account
- 5.  Easy to implement with current architecture
      \*/

// ============================================================================
// 11. DEBUGGING & TROUBLESHOOTING
// ============================================================================

/\*\*

- COMMON ISSUES:
-
- Data not persisting?
- - Check: Does storage adapter have correct permissions?
- - Check: Is saveSnapshot() being called?
- - Check: Is isHydrated true after init?
-
-
- Modal not closing?
- - Check: Is onClose prop passed correctly?
- - Check: Does Modal dismiss on outside press?
-
-
- Performance slow?
- - Check: Are all hooks using useMemo?
- - Check: Are selectors optimized?
- - Check: Is list virtualized?
-
-
- Type errors?
- - Run: npx tsc --noEmit
- - Update: tsconfig.json if needed
-
-
- Zustand not updating?
- - Check: Are you returning new object from set()?
- - Check: Are subscriptions working?
- - Try: Zustand DevTools middleware
    \*/

export {};

### [Design System Rules — CRITICAL]
The design system is the law. Every visual value in the entire app must come from these tokens. No exceptions.

Always import Colors, Spacing, Typography from "**@theme**"

# Colors
```ts
import { Colors } from "@theme";

// CORRECT
backgroundColor: Colors.primary     // #0077B6
color: Colors.danger                // #E8445A
txtColor: Colors.textPrimary        // #1e1e1e

// WRONG — never hardcode
backgroundColor: "#0077B6"
color: "red"
txtColor: "#1e1e1e"
```

**Color reference:**
|------------------------|-----------|------------------------------|
|          Token         |   Value   |             Usage            |
|------------------------|-----------|------------------------------|
| `Colors.primary`       | #0671ab | Brand, CTAs, active states   | 
| `Colors.secondary`     | #058ba5 | Accents, highlights          | 
| `Colors.tertiary`      | #d7f8f9 | Light tint backgrounds       | 
| `Colors.danger`        | #d02a41 | Emergency UI, errors, delete | 
| `Colors.background`    | #F4FAFC | All screen backgrounds       | 
| `Colors.surface`       | #FFFFFF | Cards, modals, tab bar       | 
| `Colors.textPrimary`   | #1e1e1e | Main body text               | 
| `Colors.textSecondary` | #40566d | Labels, subtitles            | 
| `Colors.textTertiary`  | #95a2b2 | Placeholders, disabled       | 
|------------------------|-----------|------------------------------|

# Spacing
```ts
import { Spacing, Layout, BorderRadius } from "@theme";

// CORRECT
padding: Spacing.base             // 16
gap: Spacing.sm                   // 8
borderRadius: BorderRadius.md     // 16

// WRONG
padding: 16
gap: 8
borderRadius: 12
```

**Spacing scale:** `xs=4, sm=8, md=12, base=16, lg=20, xl=24, xxl=32, xxxl=40`
**Layout constants:** `listItemHeight=56, tabBarHeight=60, headerHeight=52, buttonHeight=48, inputHeight=46`
**Border radius:** `xs=4, sm=8, md=12, lg=16, xl=20, full=9999`

# Typography
```ts
import { FontFamily, FontSize, TextStyles } from "@theme";

// CORRECT
fontFamily: FontFamily.semiBold     // "PlusJakartaSans_600SemiBold"
fontSize: FontSize.base             // 14

// WRONG
fontFamily: "PlusJakartaSans_600SemiBold"
fontSize: 14
```

**Font families:** `regular, medium, semiBold, bold, extraBold`
**Font sizes:** `xs=11, sm=12, base=14, md=16, lg=18, xl=20, xxl=24, xxxl=28`

---

### [Styling Rules]

Use `StyleSheet.create()` for all styles. Do not use inline style objects unless the value is dynamic (calculated at runtime).

```tsx
// CORRECT — static styles in StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.base,
  },
});

// WRONG — static values as inline objects
<View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }} />

// ACCEPTABLE — dynamic value inline
<View style={{ width: progress * 100 + '%' }} />
```

Every screen file ends with `StyleSheet.create`. This is the 4-section file structure every file must follow:
```tsx
1. IMPORTS
2. TYPES (props interfaces, local types)
3. COMPONENT (the default export function)
4. STYLES (StyleSheet.create at the bottom)
```

---

### [Component File Rules]
Every component must have:

1. A named TypeScript props interface above the component
2. Provide appropriate accessibility properties (`accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, etc.) for interactive elements when needed.
3. Named export (not default) for components in `src/components/`
4. Default export for screen files in `app/` (Expo Router requirement)

```tsx
// CORRECT component structure
// 1. IMPORTS
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamily, FontSize } from '@theme';

// 2. TYPES
export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

// 3. COMPONENT
export const Button = ({ label, onPress, variant = 'primary', disabled = false }: ButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
    </TouchableOpacity>
  );
};

// 4. STYLES
const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
  },
  primary: { backgroundColor: Colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  disabled: { opacity: 0.5 },
  label: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  label_primary: { color: Colors.textInverse },
  label_outline: { color: Colors.primary },
});
```

---

### [Component Creation Rule]
Before creating any new component:

1. If a similar component exists, extend it via props — do not create a duplicate
2. Only create a new component if it is used in 2+ places, or if it clearly represents a reusable UI concept

When unsure:
> "Should this be a reusable component, or should I keep it inline for now?"

---

### [Screen File Rules]
Any screen that loads asynchronous data must handle loading, error, and empty states. No data-driven screen may assume data always exists.

```tsx
// Example for list screens
if (isLoading) return <LoadingSpinner visible />;
if (error || !data) return <ErrorState error={error} onRetry={refetch} />;
if (data.length === 0) return <EmptyState icon="inbox" title="Nothing here yet!" />;

// Render the actual content below
```

Screens within the bottom tab navigator should add bottom padding to ScrollView or FlatList content to prevent it from being hidden behind the tab bar.

```tsx
contentContainerStyle={{ 
  paddingBottom: Layout.tabBarHeight + Spacing.base 
}}
```

---


### [TypeScript Rules]
TypeScript strict mode is always ON. These rules are non-negotiable:

- No `any` types without an explicit justification comment
- All exported functions and public APIs must have explicit return types.
- All component props must have a named interface
- All API responses must have typed interfaces — never assume shape
- Safely handle nullable values using optional chaining (?.), nullish coalescing (??), or explicit null checks as appropriate.
- Prefer discriminated unions for complex state or result types (e.g., loading, success, and error states).

```tsx
// CORRECT — typed API result
interface MedicineDetailResponse {
  id: string;
  name: string;
  genericName: string;
  sideEffects: string[];
}

// WRONG — untyped
const handleResult = (data: any) => { ... }
```

---

### [Image / Asset Rules]
Use centralized image imports via `src/constants/images.ts`.

```ts
// src/constants/images.ts
import splashIcon from '@assets/images/splash-icon.png';
import avatarPlaceholder from '@assets/images/avatar-placeholder.png';

export const images = {
  splashIcon,
  avatarPlaceholder,
};
```

```tsx
// CORRECT usage
import { images } from '@constants/images';
<Image source={images.splashIcon} />

// WRONG — direct import in screen
import splashIcon from '../../assets/images/splash-icon.png';
```

Use expo-image for all network images. React Native's Image may be used for local static assets if appropriate.

---

### [UI Quality Bar]
Every screen must feel:
- Clinical but approachable — not cold and hospital-like, not overly playful
- Clear and trustworthy — users are making health decisions
- Fast and responsive — no jank, no layout shifts, no unhandled states

Use:
- Consistent card styling (white background, `BorderRadius.lg`)
- Clear visual hierarchy (size + weight contrast between title and body)
- Large touch targets (minimum 44×44 points)
- Accessible color contrast (all text on colored backgrounds must meet WCAG AA)
- Skeleton/loading states for any data that takes more than 300ms

---

### [UI Implementation Rules]
When the user provides a design reference (hand-drawn sketch, screenshot, demo, or description):

- Follow the layout and screen structure shown in the reference.
- Preserve the hierarchy and placement of key UI elements.
- Use the nearest `Spacing.*` values for margins and padding.
- Use `FontSize.*` and `FontFamily.*` to match the intended visual hierarchy.
- Use the project's `Colors.*` and `BorderRadius.*` tokens instead of hardcoded values.
- If the sketch omits visual details (colors, spacing, icons, etc.), implement them using the project's design system while preserving the intent of the sketch.
- Do not remove or add major UI elements unless explicitly instructed.

---

### [Accessibility Rules]
Every interactive element must have:

```tsx
accessibilityRole="button" // or correct role: link, image, search, etc.
accessibilityLabel="Clear action description"
accessibilityState={{ disabled: isDisabled }} // where applicable
```

Emergency elements require enhanced labels:

```tsx
// SOS button
accessibilityLabel="Emergency SOS. Double tap to access emergency protocols."

// Protocol steps
accessibilityLabel={`Step ${n} of ${total}: ${step.instruction}`}

// Vital readings
accessibilityLabel={`Blood pressure ${systolic} over ${diastolic}. Status: ${status}.`}
```

Minimum touch target: **44×44 points** on all interactive elements.

---

### [Performance Rules]
- Use `FlashList` (not `FlatList`) for all lists with more than 20 items
- Use `expo-image` with `cachePolicy="memory-disk"` for all network images
- Subscribe to only the specific Zustand fields you need: `useStore(s => s.specificValue)` not `useStore()`
- Use useCallback and useMemo only when they provide a measurable performance benefit or improve referential stability. Avoid premature optimization.
- Defer non-critical work with `InteractionManager.runAfterInteractions()`

---

### [Error Handling Rules]
Every async operation must handle all three outcomes:

```tsx
// REQUIRED pattern for all async screens
const { data, isLoading, error, refetch } = useQuery({ ... });

if (isLoading) return <LoadingSpinner visible />;
if (error) return <ErrorState error={error} onRetry={refetch} />;
Handle missing or empty data appropriately for the expected data type.
```

Never use empty catch blocks:
```tsx
// WRONG
try { ... } catch (e) {}

// CORRECT
try { ... } catch (e) {
  const appError = createAppError('NETWORK_ERROR', String(e));
  setError(appError);
}
```

All user-facing error messages must be human-readable and actionable — never show raw `Error.message` strings.
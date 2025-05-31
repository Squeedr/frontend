# Performance Optimization Guidelines

This document outlines the performance optimization techniques implemented in the Squeedr UI application.

## Image Optimization

### OptimizedImage Component

The `OptimizedImage` component (`components/ui/optimized-image.tsx`) is a wrapper around Next.js Image component that provides:

- Automatic fallback handling for missing images
- Loading state with skeleton placeholder
- Configurable quality and object-fit options

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image"

// Usage
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={300}
  height={200}
  fallbackSrc="/placeholder.jpg"
  priority={true}
  quality={75}
  objectFit="cover"
/>
```

### LazyImage Component

The `LazyImage` component (`components/ui/lazy-image.tsx`) uses Intersection Observer to lazy load images:

- Only loads images when they enter the viewport
- Provides loading state with skeleton placeholder
- Handles fallback images automatically

```tsx
import { LazyImage } from "@/components/ui/lazy-image"

// Usage
<LazyImage
  src="/path/to/image.jpg"
  alt="Description"
  width={300}
  height={200}
  fallbackSrc="/placeholder.jpg"
  priority={false}
  objectFit="cover"
/>
```

## Component Optimization

### LazyComponent

The `LazyComponent` (`components/ui/lazy-component.tsx`) enables code splitting and lazy loading:

- Loads components only when needed
- Provides a fallback UI during loading
- Reduces initial bundle size

```tsx
import { LazyComponent } from "@/components/ui/lazy-component"

// Usage
<LazyComponent
  importFn={() => import("@/components/HeavyComponent")}
  fallback={<div>Loading...</div>}
  props={{ prop1: "value1" }}
/>
```

### VirtualizedList

The `VirtualizedList` component (`components/ui/virtualized-list.tsx`) optimizes rendering of large lists:

- Only renders items that are visible in the viewport
- Maintains scroll position and performance with large datasets
- Configurable overscan for smoother scrolling

```tsx
import { VirtualizedList } from "@/components/ui/virtualized-list"

// Usage
<VirtualizedList
  items={largeArray}
  renderItem={(item, index) => <ListItem key={index} item={item} />}
  itemHeight={50}
  containerHeight={400}
  overscan={3}
/>
```

## State Management

### useSelectiveState

The `useSelectiveState` hook (`lib/state-utils.ts`) optimizes state updates:

- Updates only specific fields in the state
- Prevents unnecessary re-renders
- Maintains a reference to the current state

```tsx
import { useSelectiveState } from "@/lib/state-utils"

// Usage
const { state, updateField, updateFields, resetState } = useSelectiveState({
  name: "",
  email: "",
  age: 0,
})

// Update a single field
updateField("name", "John")

// Update multiple fields
updateFields({ email: "john@example.com", age: 30 })
```

### useHistoryState

The `useHistoryState` hook (`lib/state-utils.ts`) provides undo/redo functionality:

- Maintains a history of state changes
- Allows undoing and redoing changes
- Limits history size to prevent memory issues

```tsx
import { useHistoryState } from "@/lib/state-utils"

// Usage
const { state, updateState, undo, redo, canUndo, canRedo } = useHistoryState(
  { count: 0 },
  50 // max history entries
)

// Update state
updateState({ count: state.count + 1 })

// Undo
undo()

// Redo
redo()
```

## Form Handling

### useForm

The `useForm` hook (`lib/form-utils.ts`) optimizes form handling:

- Debounced field updates to prevent excessive re-renders
- Field-level validation
- Form-level validation
- Dirty state tracking

```tsx
import { useForm } from "@/lib/form-utils"

// Usage
const { fields, isSubmitting, isDirty, handleChange, handleBlur, handleSubmit } = useForm({
  initialValues: { name: "", email: "" },
  validationRules: {
    name: [
      { validate: (value) => value.length > 0, message: "Name is required" },
    ],
    email: [
      { validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: "Invalid email" },
    ],
  },
  onSubmit: async (values) => {
    // Submit form
  },
  debounceTime: 300,
})
```

## API Requests

### fetchWithCache

The `fetchWithCache` function (`lib/api-utils.ts`) optimizes API requests:

- Caches responses to prevent duplicate requests
- Deduplicates in-flight requests
- Configurable cache TTL

```tsx
import { fetchWithCache } from "@/lib/api-utils"

// Usage
const data = await fetchWithCache("/api/data", { method: "GET" }, true)
```

### useFetch

The `useFetch` hook (`lib/api-utils.ts`) provides a React-friendly way to fetch data:

- Caches responses
- Handles loading and error states
- Aborts previous requests when dependencies change

```tsx
import { useFetch } from "@/lib/api-utils"

// Usage
const { data, isLoading, error, refetch } = useFetch("/api/data", { method: "GET" }, true)
```

## Data Fetching with SWR

### useData

The `useData` hook (`lib/swr-utils.ts`) provides a simple way to fetch data with SWR:

- Automatic caching and revalidation
- Loading and error states
- Configurable options

```tsx
import { useData } from "@/lib/swr-utils"

// Usage
const { data, error, isLoading } = useData("/api/data", (url) => fetch(url).then((res) => res.json()))
```

### useDataWithOptimisticUpdates

The `useDataWithOptimisticUpdates` hook (`lib/swr-utils.ts`) enables optimistic UI updates:

- Updates UI immediately before the server responds
- Reverts to the previous state if the server request fails
- Provides a smooth user experience

```tsx
import { useDataWithOptimisticUpdates } from "@/lib/swr-utils"

// Usage
const [response, optimisticUpdate] = useDataWithOptimisticUpdates(
  "/api/data",
  (url) => fetch(url).then((res) => res.json())
)

// Update UI optimistically
optimisticUpdate(newData)
```

## Rendering Optimization

### memoizeWithShallowComparison

The `memoizeWithShallowComparison` function (`lib/render-utils.ts`) optimizes component rendering:

- Prevents re-renders if specific props haven't changed
- Uses shallow comparison for performance
- Configurable prop keys to compare

```tsx
import { memoizeWithShallowComparison } from "@/lib/render-utils"

// Usage
const OptimizedComponent = memoizeWithShallowComparison(MyComponent, ["id", "name"])
```

### useMemoizedChildren

The `useMemoizedChildren` hook (`lib/render-utils.ts`) optimizes child rendering:

- Prevents unnecessary re-renders of children
- Useful for complex component trees
- Simple to use

```tsx
import { useMemoizedChildren } from "@/lib/render-utils"

// Usage
const memoizedChildren = useMemoizedChildren(children)
```

## Best Practices

1. **Use the right tool for the job**
   - Use `OptimizedImage` for critical images
   - Use `LazyImage` for below-the-fold images
   - Use `VirtualizedList` for large lists
   - Use `LazyComponent` for heavy components

2. **Optimize state updates**
   - Use `useSelectiveState` for complex state
   - Use `useHistoryState` for undo/redo functionality
   - Use `usePersistentState` for persistent state

3. **Optimize form handling**
   - Use `useForm` for complex forms
   - Use debounced field updates
   - Validate fields on blur

4. **Optimize API requests**
   - Use `fetchWithCache` for one-off requests
   - Use `useFetch` for React components
   - Use SWR hooks for data fetching

5. **Optimize rendering**
   - Use `memoizeWithShallowComparison` for components
   - Use `useMemoizedChildren` for complex component trees
   - Use `useMemoizedRender` for expensive render functions

6. **Monitor performance**
   - Use React DevTools Profiler
   - Use Lighthouse for web vitals
   - Use Chrome DevTools Performance tab 
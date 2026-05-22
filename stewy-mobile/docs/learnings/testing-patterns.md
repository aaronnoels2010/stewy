# Testing Patterns (stewy-mobile)

### Tools
- **Jest**: Test runner.
- **jest-expo**: Preset for Expo projects.
- **react-test-renderer**: For snapshot testing.

### Directory Structure
- Components: `components/__tests__/[ComponentName]-test.tsx`
- Hooks: `hooks/__tests__/[HookName]-test.tsx` (if applicable)

### Snapshot Testing
Preferred for UI components to catch visual regressions.
```tsx
import * as React from 'react';
import renderer from 'react-test-renderer';
import { ThemedText } from '../ThemedText';

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();
  expect(tree).toMatchSnapshot();
});
```

### Unit Testing
For business logic in contexts or utility functions.

### Mocking
- Mock `expo-font`, `expo-router`, and other native modules using `jest.mock()`.
- Refer to `jest.setup.js` (if it exists) or local mocks.

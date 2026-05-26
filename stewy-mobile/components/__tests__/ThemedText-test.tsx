import * as React from 'react';
import { act, create } from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

function render(el: React.ReactElement) {
  let root: ReturnType<typeof create>;
  act(() => { root = create(el); });
  return root!;
}

it(`renders correctly`, () => {
  const tree = render(<ThemedText>Snapshot test!</ThemedText>).toJSON();
  expect(tree).toMatchSnapshot();
});

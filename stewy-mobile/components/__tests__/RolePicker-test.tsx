import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { RolePicker } from '../RolePicker';

function render(el: React.ReactElement) {
  let root: ReturnType<typeof create>;
  act(() => { root = create(el); });
  return root!;
}

describe('RolePicker', () => {
  const roles = [
    { value: 'HOOFD_STEWARD', label: 'HoofdSteward' },
    { value: 'DEVISIE_CHEF', label: 'DevisieChef' },
    { value: 'STEWARD', label: 'Steward' },
  ];

  it('renders all three role options', () => {
    const tree = render(
      <RolePicker roles={roles} value="" onChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('highlights the selected role', () => {
    const tree = render(
      <RolePicker roles={roles} value="STEWARD" onChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

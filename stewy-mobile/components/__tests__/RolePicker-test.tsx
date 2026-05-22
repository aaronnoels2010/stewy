import * as React from 'react';
import renderer from 'react-test-renderer';
import { RolePicker } from '../RolePicker';

describe('RolePicker', () => {
  const roles = [
    { value: 'HOOFD_STEWARD', label: 'HoofdSteward' },
    { value: 'DEVISIE_CHEF', label: 'DevisieChef' },
    { value: 'STEWARD', label: 'Steward' },
  ];

  it('renders all three role options', () => {
    const tree = renderer.create(
      <RolePicker roles={roles} value="" onChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('highlights the selected role', () => {
    const tree = renderer.create(
      <RolePicker roles={roles} value="STEWARD" onChange={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

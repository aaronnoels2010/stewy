import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { ClubCombobox } from '../ClubCombobox';
import type { ClubDto } from '@/types/api';

const clubs: ClubDto[] = [
  { id: '1', clubName: 'FC Barcelona' },
  { id: '2', clubName: 'Real Madrid' },
  { id: '3', clubName: 'AC Milan' },
];

function render(el: React.ReactElement) {
  let root: ReturnType<typeof create>;
  act(() => { root = create(el); });
  return root!;
}

describe('ClubCombobox', () => {
  it('renders with selected club', () => {
    const tree = render(
      <ClubCombobox
        clubs={clubs}
        selectedClubId="2"
        onSelect={() => {}}
        userHomeClubId="1"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders without selection', () => {
    const tree = render(
      <ClubCombobox
        clubs={clubs}
        selectedClubId=""
        onSelect={() => {}}
        userHomeClubId="1"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders empty list', () => {
    const tree = render(
      <ClubCombobox
        clubs={[]}
        selectedClubId=""
        onSelect={() => {}}
        userHomeClubId="1"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

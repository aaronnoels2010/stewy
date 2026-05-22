import * as React from 'react';
import renderer from 'react-test-renderer';
import { SearchableCombobox } from '../SearchableCombobox';

const options = [
  { id: '1', clubName: 'FC Barcelona' },
  { id: '2', clubName: 'Real Madrid' },
  { id: '3', clubName: 'AC Milan' },
];

describe('SearchableCombobox', () => {
  it('renders with options', () => {
    const tree = renderer.create(
      <SearchableCombobox
        options={options}
        value=""
        onSelect={() => {}}
        placeholder="Search clubs..."
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const tree = renderer.create(
      <SearchableCombobox
        options={[]}
        value=""
        onSelect={() => {}}
        placeholder="Search clubs..."
        loading={true}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders empty state', () => {
    const tree = renderer.create(
      <SearchableCombobox
        options={[]}
        value=""
        onSelect={() => {}}
        placeholder="Search clubs..."
        emptyMessage="No clubs found"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders error state', () => {
    const tree = renderer.create(
      <SearchableCombobox
        options={[]}
        value=""
        onSelect={() => {}}
        placeholder="Search clubs..."
        error="Failed to load clubs"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders create-new option when allowCreate is true', () => {
    const tree = renderer.create(
      <SearchableCombobox
        options={options}
        value=""
        onSelect={() => {}}
        placeholder="Search clubs..."
        allowCreate={true}
        createNewLabel="Create new 'FC'"
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

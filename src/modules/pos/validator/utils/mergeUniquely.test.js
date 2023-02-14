import mergeUniquely from './mergeUniquely';

describe('mergeUniquely', () => {
  it('returns merged results', () => {
    const newArray = { data: [{ key1: 'value1' }, { key2: 'value2' }] };
    const oldArray = [{ key1: 'value_a' }, { key2: 'value_b' }, { key1: 'value1', key2: 'value2' }];

    expect(mergeUniquely('key1', newArray, oldArray)).toEqual([
      { key1: 'value_a' },
      { key2: 'value_b' },
      { key1: 'value1', key2: 'value2' },
    ]);

    expect(mergeUniquely('key1', newArray)).toEqual(newArray.data);
  });
});

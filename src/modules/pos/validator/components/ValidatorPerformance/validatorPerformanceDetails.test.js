import validatorPerformanceDetails from './validatorPerformanceDetails';

describe('validatorPerformanceDetails', () => {
  it('returns the expected details for multiple time punished validators', () => {
    expect(
      validatorPerformanceDetails(
        [
          { start: 100, end: 101 },
          { start: 200, end: 201 },
          { start: 400, end: 401 },
        ],
        'punished',
        3
      )
    ).toEqual(
      'The validator was punished three times. Two more punishments will cause the permanent ban of the validator.'
    );
  });

  it('returns the expected details for one time punished validators', () => {
    expect(validatorPerformanceDetails([{ start: 100, end: 101 }], 'punished', 1)).toEqual(
      'The validator was punished one time. Four more punishments will cause the permanent ban of the validator.'
    );
  });

  it('returns the expected details for banned validators', () => {
    expect(
      validatorPerformanceDetails(
        [
          { start: 100, end: 101 },
          { start: 200, end: 201 },
          { start: 400, end: 401 },
          { start: 500, end: 501 },
          { start: 600, end: 601 },
        ],
        'banned',
        5
      )
    ).toEqual(
      'The validator is banned because of not generating blocks for 1 month and missing 5 consecutive blocks'
    );
  });

  it('returns default response if no pomHeight is given', () => {
    expect(validatorPerformanceDetails(undefined, 'punished', 0)).toEqual(
      'Punishment information unavailable.'
    );
  });
});

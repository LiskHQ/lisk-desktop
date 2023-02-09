const ValidatorPerformanceDetails = (pomHeights, status, consecutiveMissedBlocks = 0) => {
  if (!pomHeights) return 'Punishment information unavailable.';
  if (status === 'punished') {
    // Since this can only be accessed if the validator has been punished at least once
    // and is not banned yet due to not getting 5 punishments, the text to be displayed
    // will be for one to four punishments
    const textConversion = {
      1: 'One',
      2: 'Two',
      3: 'Three',
      4: 'Four',
      5: 'Five',
    };
    const timesLeft = 5 - pomHeights.length;
    const textCount = textConversion[timesLeft];

    return `The validator was punished ${pomHeights.length} time${
      pomHeights.length !== 1 ? 's' : ''
    }. ${textCount} more punishments will cause the permanent ban of the validator.`;
  }
  return `The validator is banned because of not generating blocks for 1 month and missing ${consecutiveMissedBlocks} consecutive blocks`;
};

export default ValidatorPerformanceDetails;

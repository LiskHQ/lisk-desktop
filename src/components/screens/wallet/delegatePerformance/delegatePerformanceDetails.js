const delegatePerformanceDetails = (count, status, consecutiveMissedBlocks = 0) => {
  if (status === 'punished') {
    // Since this can only be accessed if the delegate has been punished at least once
    // and is not banned yet due to not getting 5 punishments, the text to be displayed
    // will be for one to four punishments
    const textConversion = {
      1: 'One',
      2: 'Two',
      3: 'Three',
      4: 'Four',
      5: 'Five',
    };
    const timesLeft = 5 - count;
    const textCount = textConversion[timesLeft];

    return `The delegate was punished ${count} time${count !== 1 ? 's' : ''}. ${textCount} more punishments will cause the permanent ban of the delegate.`;
  }
  return `The delegate is banned because of not forging blocks for 1 month and missing ${consecutiveMissedBlocks} consecutive blocks`;
};

export default delegatePerformanceDetails;

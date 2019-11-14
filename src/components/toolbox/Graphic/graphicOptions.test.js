import {
  lineGraphOptions,
  barGraphOptions,
  doughnutGraphOptions,
  optionsByGraphic,
} from './graphicOptions';

describe('Graphic Options for Charts', () => {
  const extaOptions = {
    title: {
      display: true,
      text: 'Custom Chart Title',
    },
  };

  it('Options for LINE chart', () => {
    const options = optionsByGraphic('line', extaOptions);
    const lineOptions = lineGraphOptions(extaOptions);
    expect(options).toEqual(lineOptions);
  });

  it('Options for BAR chart', () => {
    const options = optionsByGraphic('bar', extaOptions);
    const barOptions = barGraphOptions(extaOptions);
    expect(options).toEqual(barOptions);
  });

  it('Options for DOUGGNUT chart', () => {
    const options = optionsByGraphic('doughnut', extaOptions);
    const doughnutOptions = doughnutGraphOptions(extaOptions);
    expect(options).toEqual(doughnutOptions);
  });

  it('invlid options', () => {
    const options = optionsByGraphic('scatter', extaOptions);
    expect(options).toEqual([]);
  });
});

export const noGroupTitle = 'groups-not-defined-properly';

export const isActiveGroup = (current, group) =>
  group.steps.map((step) => step.index).includes(current);

export const isActiveStep = (current, index) => current === index;

export const backButtonFn = (current, prevPage, prevStep) => {
  if (current === 0 && typeof prevPage === 'function') prevPage();
  else prevStep();
};

/**
 * groups the elements based on their title and group properties
 *
 * If not all the groups are defined properly, this function
 * creates a single group titled "groups-not-defined-properly"
 */
export const groupSteps = (steps) => {
  const allGroupsValid = steps.reduce(
    (prevGroupsWereValid, step) => typeof step.props.group === 'string' && prevGroupsWereValid,
    true
  );

  return steps.reduce((grouped, step, index) => {
    const g = grouped.filter((group) => group.title === step.props.group);
    if (g.length) g[0].steps.push({ index, component: step });
    else {
      grouped[index] = {
        title: allGroupsValid ? step.props.group : noGroupTitle,
        steps: [{ index, component: step }],
      };
    }
    return grouped;
  }, []);
};

/**
 * In React for web we use the "className" property to define
 * CSS class names. in React Native we use the "style" property
 * to define the style rules.
 * This function chooses between the "className" and "style"
 * based on the medium.
 */
export const getStyles = (styles) =>
  Object.keys(styles).reduce((acc, key) => {
    acc[key] =
      typeof document !== 'undefined' ? { className: styles[key] } : { style: styles[key] };
    return acc;
  }, {});

export const noGroupTitle = 'groups-not-defined-properly';

/**
 * @param {Number} current - The index number of the currently active group.
 * @param {Array} group - Array of group elements.
 */
export const isActiveGroup = (current, group) =>
  group.steps.map((step) => step.index).includes(current);

/**
 * @param {Number} current - The index number of the currently active group.
 * @param {Number} index - The index the group to check if it is active.
 */
export const isActiveStep = (current, index) => current === index;

/**
 * @param {Number} current - The index number of the currently active group.
 * @param {Function} prevPage - If passed it will be caeed when clicked
 *  the BAck button in the first step.
 * @param {Function} prevStep - A function to be called to remove to the previous step.
 */
export const backButtonFn = (current, prevPage, prevStep) => {
  if (current === 0 && typeof prevPage === 'function') prevPage();
  else prevStep();
};

/**
 * groups the elements based on their title and group properties
 *
 * If not all the groups are defined properly, this function
 * creates a single group titled "groups-not-defined-properly"
 *
 *
 * @param {Array} steps - An array of React elements.
 * @returns {Object} - The grouped object of React elements with the above specifications.
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
 *
 * @param {Object} styles - Object of the styles or class names
 * @returns {Object} - Objects with defined key names for React and RN
 */
export const getStyles = (styles) =>
  Object.keys(styles).reduce((acc, key) => {
    acc[key] =
      typeof document !== 'undefined' ? { className: styles[key] } : { style: styles[key] };
    return acc;
  }, {});

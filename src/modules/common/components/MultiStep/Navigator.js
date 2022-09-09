import React from 'react';
import NavigatorButton from './NavigatorButton';
import Element from './Element';
import { backButtonFn, isActiveStep, isActiveGroup, groupSteps, noGroupTitle } from './utils';

const MultiStepNav = ({
  steps,
  interactive,
  current,
  backButtonTitle,
  activeTitle,
  groupButton,
  stepButton,
  backButton,
  hideGroups,
  hideSteps,
  prevPage,
  prevStep,
  move,
  normalizedStyles,
}) => {
  const ActiveTitle = activeTitle;
  const groupedSteps = groupSteps(steps);
  return (
    <Element {...normalizedStyles.multiStepNavWrapper}>
      {backButton !== undefined && backButton !== null ? (
        <NavigatorButton
          customButton={backButton}
          disabled={current === 0}
          onClick={() => backButtonFn(current, prevPage, prevStep)}
        >
          {backButtonTitle}
        </NavigatorButton>
      ) : null}
      {ActiveTitle && groupedSteps.title !== noGroupTitle ? (
        <ActiveTitle>
          {hideSteps ? steps[current].props.group : steps[current].props.title}
        </ActiveTitle>
      ) : null}
      <Element {...normalizedStyles.multiStepGroupWrapper}>
        {groupedSteps.map((group, gIdx) => (
          <Element {...normalizedStyles.multiStepGroup} key={`group-${group.title}-${gIdx}`}>
            {!hideGroups && group.title !== noGroupTitle ? (
              <NavigatorButton
                customButton={groupButton}
                onClick={() => {
                  if (interactive) move({ to: group.steps[0].index });
                }}
                disabled={isActiveGroup(current, group)}
              >
                {group.title}
              </NavigatorButton>
            ) : null}
            {!hideSteps
              ? group.steps.map((step, sIdx) => (
                  <NavigatorButton
                    customButton={stepButton}
                    key={`step-${step.component.props.title}-${sIdx}`}
                    onClick={() => {
                      if (interactive) move({ to: step.index });
                    }}
                    disabled={isActiveStep(current, step.index)}
                  >
                    {step.component.props.title}
                  </NavigatorButton>
                ))
              : null}
          </Element>
        ))}
      </Element>
    </Element>
  );
};

export default MultiStepNav;

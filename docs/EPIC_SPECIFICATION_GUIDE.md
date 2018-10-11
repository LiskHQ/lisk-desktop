# Lisk Hub Epic Specificaiton Guideline

Lisk Hub team will gather community enhancement proposals in the backlog of the project. 

Once a substantial ammount of proposals have been identified as belonging to the same type/category of enhancemnt, an epic will be created to handle the development journey towards it's implementation. 

## Table Of Contents

1. [Requirements](#requirements)
1. [Epic creation best practices](#epic-creation-best-practices)
1. [Epic workflow](#epic-workflow)


## Requirements
Install [ZenHub](https://www.zenhub.com/) browser extension to your browser (Chrome and Firefox supported) to be able to access the Epic feature of ZenHub in Github

## Epic creation best practices

Please ensure you follow this practices when creating or working in an epic. 

_NOTE_ we use the following representation *{:parent:}* to express adding *parent* label to the issue.

1. A functional requirement triggers the creation of an Epic {:parent:} in the backlog. 
1. All information regarding the specifications of the epic resides in the {:parent:} epic.
1. An epic contains 3 specification issues {:functional-spec:, :design-spec:, :technical-spec:} and 1..n implementation issues {:implementation:}
1. When we start with the specs of an Epic we move the Epic and specification issues to the current sprint.
1. At this point the Epic will contain labels {:parent:, :in-progress:}
1. All spec subtasks being actively worked on will have also {:in-progress:}
1. Once a spec is finished goes to {:pending-review:}
1. If an update is done in any of the three specs issues {:functional-spec:, :design-spec:, :technical-spec:} containing {:approved:} status, then all of the three are set back to {:in-progress:}
1. The process goes on and on till all three spec issues are in {:approved:}
1. An epic is only set to {:ready-for-development:} only and only if all three specs are in {:approved:}
1. Only when an epic is set to {:ready-for-development:}, the implementation subtask then can be moved to sprint.
1. Process follows normal development [Pull Requests](PR_GUIDE.md), until the implementation subtask is in {:ready:} 
1. Once all {:implementation:} subtasks are in {:ready:}, Parent Epic is set to {:pending QA:}
1. Once QA approves it and feature is merged, parent epic is set to {:ready:}

## Epic workflow
![Epic workflow](./assets/Epic-workflow.png?raw=true "Epic workflow")
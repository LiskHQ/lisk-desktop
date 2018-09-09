# Lisk Hub Pull Request Guideline




## Table Of Contents

1. [PR workflow](#pr-workflow)
1. [PR practices](#pr-practices)



## PR workflow

![PR workflow](./assets/PR-workflow.png?raw=true "PR workflow")

## PR practices

##### Before creating PR make use that:
 - All conflicts are resolved
 - The PR follows our [Test guide](/LiskHQ/lisk-hub/blob/development/docs/TEST_GUIDE.md)
 - The PR follows our [CSS guide](/LiskHQ/lisk-hub/blob/development/docs/CSS_GUIDE.md)

When you're done, submit a pull request and for one of the maintainers to check it out. We would let you know if there is any problem or any changes that should be considered.
##### Format of pull requests
 - Title
   - Use the imperative mood ("Fix bug" not "Fixed bug")
   - Use this structure `[What the PR is about] - Closes #[issue number]` it will automatically close issue after PR will get merged.
   ex. `Fix bug - Closes #123`
- Description
    - Fill our [description template](/.github/pull_request_template.md)
- Labels
    - Use labels accordingly to current condition of PR
      - :eye: `pending review` - When PR is ready to Review
      - :building_construction: `in progress` - When there are still some changes to do on your PR
      - :white_check_mark: `ready` - After your PR gets approved and merged
- Base branch
  - Make sure that base branch of PR is the same one as issue version project, e.g. the branch for Project `Version 0.3.0` is `0.3.0`.
- Projects
  - Assign version according to issue version
  - Assign sprint according to issue sprint



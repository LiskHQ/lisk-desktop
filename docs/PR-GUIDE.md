# Lisk Desktop Pull Request Guideline

## Table Of Contents

1. [PR workflow](#pr-workflow)
2. [PR practices](#pr-practices)

## PR workflow

![PR workflow](./assets/PR-workflow.png?raw=true 'PR workflow')

## PR practices

##### Make sure to adhere to the following points below before creating a PR:

- The PR has an issue.
- All conflicts are resolved.
- The PR follows our [CSS guide](/docs/CSS_GUIDE.md).

When you're done, submit a pull request and one of the maintainers will check it out. You will be informed if there are any problems or changes that may need to be considered.

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

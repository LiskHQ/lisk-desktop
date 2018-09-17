
## Table of Contents
<!-- vim-markdown-toc GFM -->

* [How to contribute?](#how-to-contribute)
* [Finding first issue](#finding-first-issue)
* [Reporting issues](#reporting-issues)
* [Creating commits](#creating-commits)
* [Creating branch](#creating-branch)
* [Tests](#tests)

<!-- vim-markdown-toc -->
## How to contribute

First of all, thank you for taking the time to contribute to this project. :tada::tada::tada:
We've tried to make a stable project and try to fix bugs and add new features continuously. You can help us do more.

Before you start, read the **[README.md](/README.md)** file for info on the project and how to set it up.

## Finding first issue
Go to [issues tab](https://github.com/LiskHQ/lisk-hub/issues) and look for 

*✏️ `good first issue`* - it is a label for tasks that are perfect for people who want to start with lisk-hub.

## Reporting issues

 1. Check if problem already exist in [issues tab](https://github.com/LiskHQ/lisk-hub/issues)
 2. If not, create a new [issue](https://github.com/LiskHQ/lisk-hub/issues/new/choose)
 3. Fill our [template](/.github/issue_template.md)
 4. Click `Submit new issue`
##### Guidance

 * Include screenshots or animated GIF
 * Use a clear and descriptive title
 * Provide OS and browser version

##### Example
![Alt text](./docs/assets/issue.png?raw=true "Perfect Issue")

:heavy_exclamation_mark: Issues created that are not relevant to this project will be closed immediately.

## Writing some code!

Contributing to a project on Github is pretty straight forward. If this is you're first time, these are the steps you should take.

- Fork this repo.

And that's it! Read the code available and apply your changes according to the issue you're working on! You're change should not break the existing code and should pass the tests.

Start from the branch that **matches issue version** ex. `0.5.0` 
If there is no issue version start from `development`.
`git checkout development`
Create a new branch under the name of the issue and work in there. Remember about branch naming convention `[issue number]-ticket-description`
ex. `git checkout -b 123-create-docs`

## Creating commits
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  * :seedling: `:seedling:` when adding a new feature
  * :bug: `:bug:` when fixing a bug
  * :books: `:books:` when adding or updating documentation
  * :nail_care: `:nail_care:` when making changes to code style (e.g. lint settings)
  * :recycle: `:recycle:` when refactoring code
  * :fire: `:fire:` when removing code or files (including dependencies)
  * :racehorse: `:racehorse:` when improving performance
  * :white_check_mark: `:white_check_mark:` when adding or updating tests
  * :construction_worker: `:construction_worker:` when updating the build process
  * :bowtie: `:bowtie:` when updating CI
  * :house: `:house:` when performing chores
  * :new: `:new:` when adding a new dependency
  * :arrow_up: `:arrow_up:` when upgrading a dependency
  * :arrow_down: `:arrow_down:` when downgrading a dependency
  * :back: `:back:` when reverting changes

##### Guidance

 * Please use `rebase` instead of `merge` for resolving conflicts
 * Make sure that Jenkins build passes
 * Remember to delete branch after successfully merging the PR.

##### Example
![Alt text](./docs/assets/pr.png?raw=true "Perfect PR")

### Creating branch
We use naming convention `[issue number]-[what-the-ticket-is-about]`.
:heavy_exclamation_mark: Remember to use `-` instead of `_`.
ex. `12-create-new-sign-in-template`

## Tests

We've written tests and you can run them to assure the stability of the code, just try running `npm run test-live`.
If you're adding a new functionality please include tests for it.


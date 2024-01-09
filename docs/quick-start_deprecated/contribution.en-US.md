---
title: Contribution
order: 3
---

## Submitting Bugs

If you find a non-security related bug in OpenSPG, please search in the Issues first to confirm if the bug has already been reported.

If not, please create an Issue to describe the bug.

## Submitting Security Issues

If you discover a security issue in OpenSPG, please do not disclose it publicly. Instead, contact the owner via email and provide a detailed description of the security issue.

## Resolving Existing Issues

By checking the repository's Issues list, you can find information about the issues that need to be addressed. You can try to resolve one of those issues.

## Code standards

### Python

#### Code Style

Python code style generally requires adherence to the PEP 8 standard.

If you are using PyCharm for development, you can use the [BlackConnect](https://black.readthedocs.io/en/stable/integrations/editors.html) plugin to format your code.


#### Docstring

Use the Google style format for docstrings.

If you are using PyCharm, you can configure it in `Preferences -> Tools -> Python Integrated Tools -> Docstrings`.

### Java

#### Code style

Use the Google Style for Java.

If you are using IntelliJ for development, you can configure and format your code as follows:

(1) Download [intellij-java-google-style.xml](https://github.com/google/styleguide/blob/gh-pages/intellij-java-google-style.xml).

(2) In IntelliJ, you can configure it in `Settings -> Editor -> Code Style -> Import Scheme -> IntelliJ IDEA code style XML`.

## Issue and PR

For issues related to functionality optimization, feature expansion, bug fixes, etc., We highly encourage everyone to participate in discussions and make corresponding optimizations.

## Development Process

* Switch to your development branch
  ```bash
  git checkout -b your-branch
  ....
  git add xxx
  git commit -m "xxx"
  ```

* Develop your feature

* Add unit tests

* Submit a Pull Request (PR)

* Handle conflicts

  ```bash
  git checkout your-branch
  git rebase master # Make sure your local master branch is up to date
  ```

* Code review

  The code you submitted requires a code review to be mergeed into the master branch. Please be patient and wait.
  We will assign relevant colleagues for code review.
  If there is no response to your PR within two working days, please mention the relevant colleagues in your PR.
  The comments related to the code review will be directly posted on the relevant PR or issue. If you find the suggestions reasonable, please update your code accordingly.

* Merge into the master branch

  After the code review, we will arrange for further review by another colleague to ensure that each PR has at least two approvals before merging into the master.
  During this process, there may be some suggestions for modifications. Please be patient and make the necessary changes.
  Once everything is approved, the PR will be merged into the master branch.

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [1, "always"], // Ensure a blank line after the body
    "body-max-line-length": [2, "always", 100], // Limit body line length to 100 characters
    "footer-leading-blank": [1, "always"], // Ensure a blank line before the footer
    "footer-max-line-length": [2, "always", 100], // Limit footer line length to 100 characters
    "header-max-length": [2, "always", 100], // Limit header length to 100 characters
    "scope-case": [2, "always", "lower-case"], // Scope must be in lower case
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"], // Subject case rules
    ],
    "subject-empty": [2, "never"], // Subject must not be empty
    "subject-full-stop": [2, "never", "."], // Subject must not end with a period
    "type-case": [2, "always", "lower-case"], // Type must be in lower case
    "type-empty": [2, "never"], // Type must not be empty
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ], // Allowed types for commits
    ],
  },
};

// build	:Changes that affect the build system or external dependencies (e.g., pnpm, webpack).
// chore :	Miscellaneous tasks, such as updating package.json or configuration files, that don’t modify source code or tests.
// ci:	Changes to the Continuous Integration (CI) configuration or scripts (e.g., .github/workflows).
// docs:	Documentation changes, such as updates to README.md or code comments.
// feat	A new feature or functionality.
// fix: 	A bug fix.
// perf:	Performance improvements or optimizations.
// refactor:	Code changes that neither fix a bug nor add a feature, e.g., code restructuring.
// revert:	Reverting a previous commit.
// style:	Code style changes that don't affect functionality (e.g., formatting, linting fixes).
// test:	Adding or modifying tests.

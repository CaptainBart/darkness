// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.lint.json"]
      }
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsAll,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/unbound-method": [
        "error",
        {
            "ignoreStatic": true
        }
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowBoolean: true,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: true
        }
      ],
      "@angular-eslint/use-component-selector": 'off',
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateAll,
    ],
    rules: {
      '@angular-eslint/template/alt-text': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/elements-content': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/mouse-events-have-key-events': 'off',
      '@angular-eslint/template/no-autofocus': 'off',
      '@angular-eslint/template/no-distracting-elements': 'off',
      '@angular-eslint/template/role-has-required-aria': 'off',
      '@angular-eslint/template/table-scope': 'off',
      '@angular-eslint/template/valid-aria': 'off',
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/attributes-order': 'off',
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/prefer-self-closing-tags': 'off',
      '@angular-eslint/template/no-inline-styles': 'warn',
      '@angular-eslint/template/no-interpolation-in-attributes': 'warn',
    },
  }
);

import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const nextConfigs = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

/** @type {import('eslint').Linter.Config} */
const baseConfig = {
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    // https://eslint.org/docs/latest/rules/dot-notation
    "dot-notation": "error",
    // https://eslint.org/docs/latest/rules/no-useless-rename
    "no-useless-rename": "error",
    // https://github.com/lydell/eslint-plugin-simple-import-sort/?tab=readme-ov-file#usage
    "simple-import-sort/imports": "error",
  },
};

/** @type {import('eslint').Linter.Config} */
const typescriptConfig = {
  rules: {
    // https://typescript-eslint.io/rules/array-type/
    "@typescript-eslint/array-type": ["error"],
    // https://typescript-eslint.io/rules/consistent-indexed-object-style
    "@typescript-eslint/consistent-indexed-object-style": "error",
    // https://typescript-eslint.io/rules/consistent-type-imports/
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "inline-type-imports", prefer: "type-imports" },
    ],
    // https://typescript-eslint.io/rules/no-empty-function
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "error",
    // https://typescript-eslint.io/rules/no-inferrable-types
    "@typescript-eslint/no-inferrable-types": "error",
  },
};

/** @type {import('eslint').Linter.Config} */
const reactConfig = {
  files: ["src/**/*.{ts,tsx}"],
  ...reactPlugin.configs.flat["jsx-runtime"], // Add this if you are using React 17+
  rules: {
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    "react/react-in-jsx-scope": "off",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
    "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
    "react/jsx-curly-brace-presence": "error",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    "react/jsx-boolean-value": "error",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    "react/prop-types": "off",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
    "react/self-closing-comp": "error",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
    "react/jsx-fragments": "error",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
    "react/hook-use-state": "error",
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
    "react/function-component-definition": "error",
  },
};

export default tseslint.config(
  ...nextConfigs,
  prettierConfig,
  baseConfig,
  typescriptConfig,
  reactConfig
);

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Build output and deps are not ours to lint.
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      'react/jsx-no-comment-textnodes': 'off',
      'react/no-unescaped-entities': 'off'
    }
  }
];

export default eslintConfig;
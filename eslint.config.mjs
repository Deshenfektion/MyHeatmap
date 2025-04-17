import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Deaktiviert 'any' global
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    rules: {
      // Deaktiviert die Regel für 'any'
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;

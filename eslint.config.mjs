import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import eslintPluginJest from "eslint-plugin-jest";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 🔹 Soporte base para Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 🧪 Soporte para pruebas con Jest
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*.ts", "**/__tests__/**/*.tsx"],
    plugins: {
      jest: eslintPluginJest,
    },
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
      "@typescript-eslint/no-require-imports": "off", // Permitimos require en tests si lo necesitas
    },
  },

  // 🎨 Integración con Prettier (solo advertencias de formato)
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

export default eslintConfig;

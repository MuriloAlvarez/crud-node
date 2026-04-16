/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@contato/(.*)$": "<rootDir>/src/features/contato/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  collectCoverageFrom: [
    "src/features/contato/use-cases/**/*.ts",
    "src/features/contato/controllers/**/*.ts",
    "src/features/contato/validations/**/*.ts",
    "src/features/contato/dtos/**/*.ts",
    "src/features/contato/domain/**/*.ts",
    "src/features/contato/repositories/**/*.ts",
    "src/shared/**/*.ts",
    "!src/features/contato/infrastructure/**",
    "!src/main.ts",
    "!src/app.ts"
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      statements: 80,
      functions: 80,
      lines: 80
    }
  }
};
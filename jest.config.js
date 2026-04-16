/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "src/features/contato/**/application/**/*.ts",
    "src/features/contato/**/presentation/**/*.ts",
    "src/features/contato/shared/domain/**/*.ts",
    "src/shared/**/*.ts",
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
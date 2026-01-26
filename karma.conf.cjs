module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "src/**/*.ts",
            "src/**/*.tsx"
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
            "**/*.tsx": ["karma-typescript"]
        },
        plugins: [
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-typescript"
        ],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.spec.json",
            compilerOptions: {
                module: "commonjs",
                target: "es5",
                lib: ["dom", "es2015"],
                jsx: "react-jsx",
                allowSyntheticDefaultImports: true,
                esModuleInterop: true
            },
            exclude: ["src/setupTests.ts"],
            include: ["src/tests/unit.spec.tsx"],
            bundlerOptions: {
                transforms: [
                    require("karma-typescript-es6-transform")()
                ]
            }
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["ChromeHeadless"],
        singleRun: true
    });
};

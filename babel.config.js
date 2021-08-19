const BABEL_ENV = process.env.BABEL_ENV
const isCommonJS = BABEL_ENV !== undefined && BABEL_ENV === "cjs"
const isESM = BABEL_ENV !== undefined && BABEL_ENV === "esm"

module.exports = function(api) {
    api.cache(true)

    const presets = [
        [
            "next/babel",
            {
                loose: true,
                modules: isCommonJS ? "commonjs" : false,
                targets: {
                    esmodules: isESM ? true : undefined,
                },
            }
        ]
    ]
    const plugins = [
        ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ]

    return {
        presets,
        plugins
    }
}
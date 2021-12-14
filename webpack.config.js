const path = require("path");

module.exports = {
    entry: "./src/game.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
        minimize: true,
        usedExports: true,
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};

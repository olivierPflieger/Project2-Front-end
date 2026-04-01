module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        enforce: 'post',
        include: /src/,
        exclude: [
          /\.(spec|cy)\.ts$/,
          /node_modules/,
          /cypress/,
        ],
        use: {
          loader: '@jsdevtools/coverage-istanbul-loader',
          options: {
            esModules: true,
            produceSourceMap: true,
          },
        },
      },
    ],
  },
}

module.exports = {
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx", "cjs",'json'],
    extraNodeModules: {
      stream: require.resolve("readable-stream"),
    },
  },
};


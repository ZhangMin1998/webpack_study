module.exports = {
  // 预设
  // 智能预设：能够编译ES6语法
  presets: [
    [
      "@babel/preset-env",
      // 按需加载core-js的polyfill
      {
        useBuiltIns: "usage", // 按需加载
        corejs: {
          version: "3",
          proposals: true
        }
      }
    ]
  ],
}
// Node.js的核心模块，专门用来处理文件路径.
const path = require("path")

module.exports = {
  // 入口  相对路径和绝对路径都行
  entry: './src/main.js',
  // 输出
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  // 加载器
  module: {
    rules: [
      {
        test: /\.css$/, // // 用来匹配 .css 结尾的文件
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  // 插件
  plugins: [],
  // 模式
  mode: 'development'
}
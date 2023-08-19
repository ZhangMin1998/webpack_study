// Node.js的核心模块，专门用来处理文件路径.
const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  // 入口  相对路径和绝对路径都行
  entry: './src/main.js',
  // 输出
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/main.js', // 入口文件打包输出文件名
    clean: true, // 自动将上次打包目录资源清空
  },
  // 加载器
  module: {
    rules: [
      // ---------处理样式-----------
      {
        test: /\.css$/, // // 用来匹配 .css 结尾的文件
        use: [
          MiniCssExtractPlugin.loader, // 提取css成单独文件
          // "style-loader", 
          "css-loader"
        ],
      },
      {
        test: /\.less$/,
        use: [
          // compiles Less to CSS
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      {
        test: /\.styl$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ],
      },
      // ---------处理图片-----------
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 小于5kb的图片会被base64处理
            // 优点：减少请求数量
            // 缺点：体积变得更大
            maxSize: 5 * 1024
          }
        },
        generator: {
          // 输出图片名称
          // hash:8哈希值取8位
          // [ext]: 使用之前的文件扩展名
          // [query]: 添加之前的query参数
          filename: 'static/images/[hash:8][ext][query]'
        }
      },
      // ---------处理字体图标-----------
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash:8][ext][query]",
        },
      },
      // ---------babel-----------
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules代码不编译
        loader: "babel-loader",
        // options: { // 单独建文件写
        //   presets: ["@babel/preset-env"],
        // }
      },
    ]
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css"
    })
  ],
  // 模式
  mode: 'production'
}
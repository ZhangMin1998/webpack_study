// Node.js的核心模块，专门用来处理文件路径.
const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 模式
  mode: 'development',
  devtool: "cheap-module-source-map", // 打包编译速度快，只包含行映射
  // 入口  相对路径和绝对路径都行
  entry: './src/main.js',
  // 输出
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
  output: {
    // path: path.resolve(__dirname, '../dist'), // 可以不写了
    path: undefined,
    filename: 'static/js/main.js', // 入口文件打包输出文件名
    // clean: true, // 自动将上次打包目录资源清空  开发模式没有输出
  },
  // 加载器
  module: {
    rules: [
      // loader配置
      {
        // oneOf 每个文件只能被其中一个处理 处理一个就不看后面了
        oneOf: [
          // ---------处理样式-----------
          {
            test: /\.css$/, // // 用来匹配 .css 结尾的文件
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.less$/,
            use: [
              // compiles Less to CSS
              'style-loader',
              'css-loader',
              'less-loader',
            ]
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              // 将 JS 字符串生成为 style 节点
              'style-loader',
              // 将 CSS 转化成 CommonJS 模块
              'css-loader',
              // 将 Sass 编译成 CSS
              'sass-loader',
            ],
          },
          {
            test: /\.styl$/,
            use: [
              'style-loader',
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
            // include: path.resolve(__dirname, "../src"), // 也可以用包含
            loader: "babel-loader",
            options: {
              // presets: ["@babel/preset-env"], // 单独建文件写
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            }
          },
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      // exclude: "node_modules", // 默认值 .eslintignore配置了
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    })
  ],
  // 开发服务器 
  // 所有代码都会在内存中编译打包，并不会输出到 dist 目录下
  // 用 npx webpack serve 运行
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
  },
}
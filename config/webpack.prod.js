// Node.js的核心模块，专门用来处理文件路径.
const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
// const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")

const os = require("os") // nodejs核心模块，直接使用
const threads = os.cpus().length  // cpu核数
// 获取处理样式的Loaders
const getStyleLoaders = (proProcessor) => {
  return [
    MiniCssExtractPlugin.loader, // 提取css成单独文件
    "css-loader", 
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    proProcessor
  ].filter(Boolean)
}

module.exports = {
  // 模式
  mode: 'production',
  devtool: "source-map", // 包含行/列映射
  // 入口  相对路径和绝对路径都行
  entry: './src/main.js',
  // 输出
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname 当前文件的文件夹绝对路径
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[contenthash:8].js', // 入口文件打包输出文件名
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js', // 动态导入输出资源命名方式
    assetModuleFilename: 'static/media/[name].[hash:8][ext]', // 图片、字体等资源命名方式（注意用hash）
    clean: true, // 自动将上次打包目录资源清空
  },
  // 加载器
  module: {
    rules: [
      // loader配置
      {
        oneOf: [
          // ---------处理样式-----------
          {
            test: /\.css$/, // // 用来匹配 .css 结尾的文件
            use: getStyleLoaders(),
            // use: [
            //   MiniCssExtractPlugin.loader, // 提取css成单独文件
            //   // "style-loader", 
            //   "css-loader", // 将css资源编译成commonjs模块到js中
            //   {
            //     loader: "postcss-loader",
            //     options: {
            //       postcssOptions: {
            //         plugins: [
            //           "postcss-preset-env", // 能解决大多数样式兼容性问题
            //         ],
            //       },
            //     },
            //   }
            // ],
          },
          {
            test: /\.less$/,
            use: getStyleLoaders('less-loader'),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders('sass-loader'),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders('stylus-loader'),
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
            // generator: {
            //   // 输出图片名称
            //   // hash:8哈希值取8位
            //   // [ext]: 使用之前的文件扩展名
            //   // [query]: 添加之前的query参数
            //   filename: 'static/images/[hash:8][ext][query]'
            // }
          },
          // ---------处理字体图标-----------
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: "asset/resource",
            // generator: {
            //   filename: "static/media/[hash:8][ext][query]",
            // },
          },
          // ---------babel-----------
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            // include: path.resolve(__dirname, "../src"), // 也可以用包含
            // loader: "babel-loader",
            // options: {
              // presets: ["@babel/preset-env"], // 单独建文件写
              // cacheDirectory: true, // 开启babel编译缓存
              // cacheCompression: false, // 缓存文件不要压缩
            // },
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                },
              },
            ]
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
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      threads, // 开启多进程和设置进程数量
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html")
    }),
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }),
    // css压缩
    // new CssMinimizerPlugin(),
     // 开启多进程
    // new TerserPlugin({
    //   parallel: threads
    // })
    // new PreloadWebpackPlugin({
    //   rel: "preload", // preload兼容性更好
    //   as: "script",
    //   // rel: 'prefetch' // prefetch兼容性更差
    // })
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    })
  ],
  optimization: { // webpack5写法
    // 压缩操作
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads // 开启多进程
      })
    ],
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
    },
    // 提取runtime文件
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
  }
}
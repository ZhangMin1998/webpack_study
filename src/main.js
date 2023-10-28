import count from "./js/count"
import sum from "./js/sum"
// import "core-js"
// import "core-js/es/promise" // 手动按需引入

// 想要webpack打包，必须引入该资源
import "./css/index.css"
import "./css/iconfont.css"
import "./less/index.less"
import "./sass/index.sass"
import "./sass/index.scss"
import "./stylus/index.styl"

console.log(count(5,5))
console.log(sum(1,2,314))

document.getElementById('btn').onclick = function() {
  // eslint不能识别动态导入需要，需要修改eslint配置文件
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
  // "math"将来就会作为[name]的值显示
  import(/* webpackChunkName: "math" */'./js/math').then(({mul}) => {
    console.log(mul(3, 7))
  })
}

// 添加promise代码
const promise = Promise.resolve()
promise.then(() => {
  console.log("hello promise core-js")
})

// PWA  注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

// 判断是否支持HMR功能   以下代码生产模式下会删除
// 实际开发用比如：vue-loader, react-hot-loader
if (module.hot) {
  module.hot.accept('./js/count')
  module.hot.accept('./js/sum')
  // module.hot.accept('./js/count.js', function (count) {
  //   const result1 = count(5,2)
  //   console.log(result1)
  // })

  // module.hot.accept('./js/sum.js', function (sum) {
  //   const result2 = sum(1,2,3)
  //   console.log(result2)
  // })
}
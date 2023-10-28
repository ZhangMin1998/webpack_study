import count from "./js/count"
import sum from "./js/sum"

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
  // eslint不能识别动态导入需要，需要追加额外配置
  import('./js/math').then(({mul}) => {
    console.log(mul(3, 7))
  })
}

// 判断是否支持HMR功能
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
import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login",'/Login',"Login"),// /login路径，路由到登录组件
    {
      path:"/", // 根路径，路由到 Layout组件
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[ // 其它所有组件都是 Layout的子组件
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/news/category",'/news/Category',"Category"),
        route("/news/list",'/news/NewsList',"NewsList"),
        route("/news/carousel",'/news/CarouselNews',"CarouselNews"),
        route("/user/list",'/user/Statistics',"Statistics"),
        route("/trashCan/news",'/trashcan/NewsTrashCan',"NewsTrashCan"),
        route("/task/scheduling", '/task/TaskScheduling', 'TaskScheduling'),
        route("/trashCan/carousel",'/trashcan/CarouselTrashCan',"CarouselTrashCan")
      ]
    }
  ]
})

var menus = [
  {
    action: "home",
    title: "首页",
    path:"/index",
    items: [
      { title: "统计", path: "/dashboard" }
    ]
  },
  {
    action: "apps",
    title: "新闻管理",
    path:"/news",
    items: [
      { title: "分类管理", path: "/category" },
      { title: "新闻列表", path: "/list" },
      { title: "轮播图列表", path: "/carousel" }
    ]
  },
  // {
  //   action: "people",
  //   title: "用户管理",
  //   path:"/user",
  //   items: [
  //     { title: "用户管理", path: "/list" }
  //   ]
  // },
  {
    action: "gavel",
    title: "任务管理",
    path: "/task",
    items: [
      {title: "任务调度", path: "/scheduling"}
    ]
  },
  {
    action: "delete",
    title: "垃圾箱管理",
    path: "/trashCan",
    items: [
      {title: "新闻垃圾桶", path: "/news"},
      {title: "轮播图垃圾桶", path: "/carousel"}
    ]
  }
];

export default menus;

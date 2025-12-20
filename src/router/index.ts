import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
      }
    },
    {
      path: '/member/',
      name: 'member',
      component: () => import('@/views/MemberView.vue'),
      meta: {
        title: '成员系统 - 海口四中展翼科技社'
      }
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('@/views/HelpView.vue'),
      meta: {
        title: '指南 - 海口四中展翼科技社'
      }
    },

    // 新增公共大屏路由
    {
      path: '/PublicAttendanceDashboardView',
      name: 'PublicAttendanceDashboard',
      component: () => import('@/views/PublicAttendanceDashboard.vue'),
      meta: {
        title: '打卡数据大屏 - 海口四中展翼科技社'
      }
    },
    {
      path: '/live',
      name: 'live',
      component: () => import('@/views/LiveView.vue'),
      meta: {
        title: '科技社直播 - 海口四中展翼科技社'
      }
    }
  ],
})

// 路由守卫 - 动态设置标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = '海口市第四中学科技社' // 默认标题
  }
  next()
})

export default router
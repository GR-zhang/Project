import Layout from '@/layout'

const routes = [
  {
    path: '/bonus',
    component: Layout,
    meta: {
      title: '奖金管理',
      icon: 'jiangjin',
      superRedirect: 'bonus'
    },
    name: 'Bonus',
    //ps: 临时重定向path,后续使用meta.superRedirect
    redirect: '/bonus/bonus-set-views/referral-award',
    children: [
      {
        path: 'bonus-set-views',
        component: () => import('@/views/bonus/sec-view'),
        name: 'BonusSetViews',
        meta: {
          title: '奖金设置',
          superRedirect: '/bonus/bonus-set-views'
        },
        children: [
          {
            path: 'referral-award',
            component: () => import('@/views/bonus/bonus-set-views/referral-award'),
            name: 'ReferralAward',
            meta: {
              title: '推荐奖',
              superRedirect: '/bonus/bonus-set-views/referral-award'
            },
          },
          {
            path: 'creator-royalty-commission',
            component: () => import('@/views/bonus/bonus-set-views/creator-royalty-commission'),
            name: 'CreatorRoyaltyCommission',
            meta: {
              title: '创作者版税佣金',
              superRedirect: '/bonus/bonus-set-views/creator-royalty-commission'
            },
          }
        ]
      },
      {
        path: 'bonus-detail',
        component: () => import('@/views/bonus/bonus-detail'),
        name: 'BonusDetail',
        meta: {
          title: '奖金明细',
          superRedirect: '/bonus/bonus-detail'
        },
      }
    ]
  },
]

export default routes
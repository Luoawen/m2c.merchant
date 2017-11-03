import Vue from 'vue'
import Router from 'vue-router'
// s登录
const slogin = r => require.ensure([], () => r(require('@/components/slogin')), 'slogin')
// s顶部栏及左侧菜单栏
const s = r => require.ensure([], () => r(require('@/components/s')), 's')
// s1右侧内容
const home = r => require.ensure([], () => r(require('@/components/s/s1sy/home')), 's')
// s2右侧内容
const bug = r => require.ensure([], () => r(require('@/components/s/s2dd/1_bug')), 's')
const afterSale = r => require.ensure([], () => r(require('@/components/s/s2dd/2_afterSale')), 's')
const details = r => require.ensure([], () => r(require('@/components/s/s2dd/3_details')), 's')
const dealerOrDtl = r => require.ensure([], () => r(require('@/components/s/s2dd/4_dealerOrDtl')), 's')
// s3右侧内容
const goodList = r => require.ensure([], () => r(require('@/components/s/s3sp/1_goodList')), 's')
const goodAppraise = r => require.ensure([], () => r(require('@/components/s/s3sp/2_goodAppraise')), 's')
const goodAddModify = r => require.ensure([], () => r(require('@/components/s/s3sp/3_goodAddModify')), 's')
const gooddetail = r => require.ensure([], () => r(require('@/components/s/s3sp/4_gooddetail')), 's')
// s4右侧内容
const survey = r => require.ensure([], () => r(require('@/components/s/s4zj/1_survey')), 's')
const detail = r => require.ensure([], () => r(require('@/components/s/s4zj/2_detail')), 's')
const record = r => require.ensure([], () => r(require('@/components/s/s4zj/3_record')), 's')
// s5右侧内容
const marketing = r => require.ensure([], () => r(require('@/components/s/s5yx/marketing')), 's')
const fullCut = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCut')), 's')
// s6右侧内容
const data = r => require.ensure([], () => r(require('@/components/s/s6sj/data')), 's')
// s7右侧内容
const information = r => require.ensure([], () => r(require('@/components/s/s7sz/1_information')), 's')
const administer = r => require.ensure([], () => r(require('@/components/s/s7sz/2_administer')), 's')
const formwork = r => require.ensure([], () => r(require('@/components/s/s7sz/3_formwork')), 's')
const address = r => require.ensure([], () => r(require('@/components/s/s7sz/4_address')), 's')
const transact = r => require.ensure([], () => r(require('@/components/s/s7sz/5_transact')), 's')
const formworkadd = r => require.ensure([], () => r(require('@/components/s/s7sz/6_formworkadd')), 's')

const updatePass = r => require.ensure([], () => r(require('@/components/s/s8password/1_updatePass')), 's')
const userInfo = r => require.ensure([], () => r(require('@/components/s/s8password/2_userInfo')), 's')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/slogin'
    },
    {
      path: '/slogin',
      name: 'slogin',
      component: slogin
    },
    {
      path: '/s',
      name: 's',
      component: s,
      children: [
        {
          path: 'home',
          name: 'home',
          component: home
        },
        {
          path: 'bug',
          name: 'bug',
          component: bug
        },
        {
          path: 'afterSale',
          name: 'afterSale',
          component: afterSale
        },
        {
          path: 'details',
          name: 'details',
          component: details
        },
        {
          path: 'goodList',
          name: 'goodList',
          component: goodList
        },
        {
          path: 'goodAppraise',
          name: 'goodAppraise',
          component: goodAppraise
        },
        {
          path: 'goodAddModify',
          name: 'goodAddModify',
          component: goodAddModify
        },
        {
          path: 'gooddetail',
          name: 'gooddetail',
          component: gooddetail
        },
        {
          path: 'survey',
          name: 'survey',
          component: survey
        },
        {
          path: 'detail',
          name: 'detail',
          component: detail
        },
        {
          path: 'record',
          name: 'record',
          component: record
        },
        {
          path: 'marketing',
          name: 'marketing',
          component: marketing
        },
        {
          path: 'fullCut',
          name: 'fullCut',
          component: fullCut
        },
        {
          path: 'data',
          name: 'data',
          component: data
        },
        {
          path: 'information',
          name: 'information',
          component: information
        },
        {
          path: 'administer',
          name: 'administer',
          component: administer
        },
        {
          path: 'formwork',
          name: 'formwork',
          component: formwork
        },
        {
          path: 'address',
          name: 'address',
          component: address
        },
        {
          path: 'transact',
          name: 'transact',
          component: transact
        },
        {
          path: 'updatePass',
          name: 'updatePass',
          component: updatePass
        },
        {
          path: 'userInfo',
          name: 'userInfo',
          component: userInfo
        },
        {
          path: 'formworkadd',
          name: 'formworkadd',
          component: formworkadd
        },
        {
          path: 'dealerOrDtl',
          name: 'dealerOrDtl',
          component: dealerOrDtl
        }
      ]
    }
  ]
})

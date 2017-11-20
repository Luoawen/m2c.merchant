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
const printSendOrder = r => require.ensure([], () => r(require('@/components/s/s2dd/5_printSendOrder')), 's')
// s3右侧内容
const goodList = r => require.ensure([], () => r(require('@/components/s/s3sp/1_goodList')), 's')
const goodAppraise = r => require.ensure([], () => r(require('@/components/s/s3sp/2_goodAppraise')), 's')
const goodAddModify = r => require.ensure([], () => r(require('@/components/s/s3sp/3_goodAddModify')), 's')
const gooddetail = r => require.ensure([], () => r(require('@/components/s/s3sp/4_gooddetail')), 's')
// s4右侧内容
const survey = r => require.ensure([], () => r(require('@/components/s/s4zj/1_survey')), 's')
const detail = r => require.ensure([], () => r(require('@/components/s/s4zj/2_detail')), 's')
const record = r => require.ensure([], () => r(require('@/components/s/s4zj/3_record')), 's')
const countQuery = r => require.ensure([], () => r(require('@/components/s/s4zj/4_countQuery')), 's')
const cash = r => require.ensure([], () => r(require('@/components/s/s4zj/5_cash')), 's')
// s5右侧内容
const marketing = r => require.ensure([], () => r(require('@/components/s/s5yx/marketing')), 's')
const fullCut = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCut')), 's')
const fullCutDetail = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCutDetail')), 's')
const fullCutModify = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCutModify')), 's')
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
const cashPass = r => require.ensure([], () => r(require('@/components/s/s8password/cashPass')), 's')
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
          component: bug,
          meta: { title: '订货单' }
        },
        {
          path: 'afterSale',
          name: 'afterSale',
          component: afterSale,
          meta: { title: '售后单' }
        },
        {
          path: 'details',
          name: 'details',
          component: details,
          meta: { title: '售后单详情' }
        },
        {
          path: 'detail',
          name: 'detail',
          component: detail,
          meta: { title: '收支明细' }
        },
        {
          path: 'goodList',
          name: 'goodList',
          component: goodList,
          meta: { title: '商品列表' }
        },
        {
          path: 'goodAppraise',
          name: 'goodAppraise',
          component: goodAppraise,
          meta: { title: '商品评价' }
        },
        {
          path: 'goodAddModify',
          name: 'goodAddModify',
          component: goodAddModify,
          meta: {title: '商品修改新增'}
        },
        {
          path: 'gooddetail',
          name: 'gooddetail',
          component: gooddetail,
          meta: {title: '商品详情'}
        },
        {
          path: 'survey',
          name: 'survey',
          component: survey,
          meta: {title: '资金概况'}
        },
        {
          path: 'fullCutDetail',
          name: 'fullCutDetail',
          component: fullCutDetail
        },
        {
          path: 'record',
          name: 'record',
          component: record,
          meta: {title: '提现记录'}
        },
        {
          path: 'countQuery',
          name: 'countQuery',
          component: countQuery,
          meta: {title: '结算查询'}
        },
        {
          path: 'cash',
          name: 'cash',
          component: cash
        },
        {
          path: 'marketing',
          name: 'marketing',
          component: marketing,
          meta:{title:'工具'}
        },
        {
          path: 'fullCut',
          name: 'fullCut',
          component: fullCut,
          meta:{title:'满减'}
        },
        {
          path: 'fullCutModify',
          name: 'fullCutModify',
          component: fullCutModify,
          meta:{title:'满减'}
        },
        {
          path: 'data',
          name: 'data',
          component: data,
          meta: {title:'数据'}
        },
        {
          path: 'information',
          name: 'information',
          component: information,
          meta: {title:'店铺信息'}
        },
        {
          path: 'administer',
          name: 'administer',
          component: administer,
          meta: {title:'品牌管理'}
        },
        {
          path: 'formwork',
          name: 'formwork',
          component: formwork,
          meta: {title:'运费模板'}
        },
        {
          path: 'address',
          name: 'address',
          component: address,
          meta: {title:'售后地址'}
        },
        {
          path: 'transact',
          name: 'transact',
          component: transact //废除的交易密码
        },
        {
          path: 'updatePass',
          name: 'updatePass',
          component: updatePass,
          meta: {title:'修改密码'}
        },
        {
          path: 'cashPass',
          name: 'cashPass',
          component: cashPass,
          meta: {title:'交易密码'}
        },
        {
          path: 'userInfo',
          name: 'userInfo',
          component: userInfo,
          meta: {title:'账户信息'}
        },
        {
          path: 'formworkadd',
          name: 'formworkadd',
          component: formworkadd,
          meta: {title:'运费模板'}
        },
        {
          path: 'printSendOrder',
          name: 'printSendOrder',
          component: printSendOrder,
          meta: {title:'发货单详情'}
        },
        {
          path: 'dealerOrDtl',
          name: 'dealerOrDtl',
          component: dealerOrDtl,
          meta: { title: '订货单详情' }
        }
      ]
    }
  ]
})

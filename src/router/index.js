import Vue from 'vue'
import Router from 'vue-router'
// s登录
const slogin = r => require.ensure([], () => r(require('@/components/slogin')), 'slogin')
// s顶部栏及左侧菜单栏
const s = r => require.ensure([], () => r(require('@/components/s')), 's')
// s1右侧内容
const home = r => require.ensure([], () => r(require('@/components/s/s1sy/home')), 'home')
// s2右侧内容
const bug = r => require.ensure([], () => r(require('@/components/s/s2dd/1_bug')), 'bug')
const afterSale = r => require.ensure([], () => r(require('@/components/s/s2dd/2_afterSale')), 'afterSale')
const details = r => require.ensure([], () => r(require('@/components/s/s2dd/3_details')), 'details')
const dealerOrDtl = r => require.ensure([], () => r(require('@/components/s/s2dd/4_dealerOrDtl')), 'dealerOrDtl')
const printSendOrder = r => require.ensure([], () => r(require('@/components/s/s2dd/5_printSendOrder')), 'printSendOrder')
// s3右侧内容
const goodList = r => require.ensure([], () => r(require('@/components/s/s3sp/1_goodList')), 'goodList')
const goodAppraise = r => require.ensure([], () => r(require('@/components/s/s3sp/2_goodAppraise')), 'goodAppraise')
const goodAddModify = r => require.ensure([], () => r(require('@/components/s/s3sp/3_goodAddModify')), 'goodAddModify')
const gooddetail = r => require.ensure([], () => r(require('@/components/s/s3sp/4_gooddetail')), 'gooddetail')
// s4右侧内容
const survey = r => require.ensure([], () => r(require('@/components/s/s4zj/1_survey')), 'survey')
const detail = r => require.ensure([], () => r(require('@/components/s/s4zj/2_detail')), 'detail')
const record = r => require.ensure([], () => r(require('@/components/s/s4zj/3_record')), 'record')
const countQuery = r => require.ensure([], () => r(require('@/components/s/s4zj/4_countQuery')), 'countQuery')
const cash = r => require.ensure([], () => r(require('@/components/s/s4zj/5_cash')), 'cash')
// s5右侧内容
const tools = r => require.ensure([], () => r(require('@/components/s/s5yx/tools')), 'tools')
    // s5 满减功能
const marketing = r => require.ensure([], () => r(require('@/components/s/s5yx/marketing')), 'marketing')
const fullCut = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCut')), 'fullCut')
const fullCutDetail = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCutDetail')), 'fullCutDetail')
const fullCutModify = r => require.ensure([], () => r(require('@/components/s/s5yx/fullCutModify')), 'fullCutModify')
    //  s5 优惠券功能
const coupon_cash_dealer = r => require.ensure([], () => r(require('@/components/s/s5yx/coupon_cash_dealer')), 'coupon_cash_dealer')
const coupon_detail_dealer = r => require.ensure([], () => r(require('@/components/s/s5yx/coupon_detail_dealer')), 'coupon_detail_dealer')
const coupon_discount_dealer = r => require.ensure([], () => r(require('@/components/s/s5yx/coupon_discount_dealer')), 'coupon_discount_dealer')
const coupon_list = r => require.ensure([], () => r(require('@/components/s/s5yx/coupon_list')), 'coupon_list')
const coupon_modify_dealer = r => require.ensure([], () => r(require('@/components/s/s5yx/coupon_modify_dealer')), 'coupon_modify_dealer')
const couponShare = r => require.ensure([], () => r(require('@/components/s/s5yx/couponShare')), 'couponShare')
const couponShareRecord = r => require.ensure([], () => r(require('@/components/s/s5yx/couponShareRecord')), 'couponShareRecord')
// s6右侧内容
const data = r => require.ensure([], () => r(require('@/components/s/s6sj/data')), 'data')
// s7右侧内容
const information = r => require.ensure([], () => r(require('@/components/s/s7sz/1_information')), 'information')
const administer = r => require.ensure([], () => r(require('@/components/s/s7sz/2_administer')), 'administer')
const formwork = r => require.ensure([], () => r(require('@/components/s/s7sz/3_formwork')), 'formwork')
const address = r => require.ensure([], () => r(require('@/components/s/s7sz/4_address')), 'address')
const transact = r => require.ensure([], () => r(require('@/components/s/s7sz/5_transact')), 'transact')
const formworkadd = r => require.ensure([], () => r(require('@/components/s/s7sz/6_formworkadd')), 'formworkadd')

const updatePass = r => require.ensure([], () => r(require('@/components/s/s8password/1_updatePass')), 'updatePass')
const userInfo = r => require.ensure([], () => r(require('@/components/s/s8password/2_userInfo')), 'userInfo')
const cashPass = r => require.ensure([], () => r(require('@/components/s/s8password/cashPass')), 'cashPass')
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
          meta: { title: '售后单详情',bread: '售后单>售后单详情', pathR:'/s/afterSale' }
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
          meta: {title: '商品修改新增',bread: '商品列表>商品修改新增', pathR:'/s/goodList'}
        },
        {
          path: 'gooddetail',
          name: 'gooddetail',
          component: gooddetail,
          meta: {title: '商品详情',bread: '商品列表>商品详情', pathR:'/s/goodList'}
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
          component: fullCutDetail,
          meta: {title: '满减详情',bread: '工具>满减详情', pathR:'/s/marketing'}
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
          component: cash,
          meta: {title: '提现申请',bread: '资金概况>提现申请', pathR:'/s/survey'}
        },
        {
          path: 'marketingTools',
          name: 'marketingTools',
          component: tools,
          meta: {title: '工具'}
        },
        {
          path: 'coupon_cash_dealer',
          name: 'coupon_cash_dealer',
          component: coupon_cash_dealer,
          meta: {title: '代金券',bread: '工具>优惠券列表>代金券', pathR:'/s/coupon_list'}
        },
        {
          path: 'coupon_detail_dealer',
          name: 'coupon_detail_dealer',
          component: coupon_detail_dealer,
          meta: {title: '优惠券详情',bread: '工具>优惠券列表>优惠券详情', pathR:'/s/coupon_list'}
        },
        {
          path: 'coupon_discount_dealer',
          name: 'coupon_discount_dealer',
          component: coupon_discount_dealer,
          meta: {title: '折扣券',bread: '工具>优惠券列表>折扣券', pathR:'/s/coupon_list'}
        },
        {
          path: 'coupon_list',
          name: 'coupon_list',
          component: coupon_list,
          meta: {title: '优惠券列表',bread: '工具>优惠券列表', pathR:'/s/coupon_list'}
        },
        {
          path: 'coupon_modify_dealer',
          name: 'coupon_modify_dealer',
          component: coupon_modify_dealer,
          meta: {title: '修改优惠券',bread: '工具>优惠券列表>修改优惠券', pathR:'/s/coupon_list'}
        },
        {
          path: 'couponShare',
          name: 'couponShare',
          component: couponShare,
          meta: {title: '发放代金券',bread: '工具>优惠券列表>发放代金券', pathR:'/s/coupon_list'}
        },
        {
          path: 'couponShareRecord',
          name: 'couponShareRecord',
          component: couponShareRecord,
          meta: {title: '代金券发放记录',bread: '工具>优惠券列表>发放代金券>代金券发放记录', pathR:'/s/coupon_list'}
        },
        {
          path: 'marketing',
          name: 'marketing',
          component: marketing,
          meta: {title: '满减列表'}
        },
        {
          path: 'fullCut',
          name: 'fullCut',
          component: fullCut,
          meta: {title: '满减新增',bread: '工具>满减新增', pathR:'/s/marketing'}
        },
        {
          path: 'fullCutModify',
          name: 'fullCutModify',
          component: fullCutModify,
          meta: {title: '满减修改',bread: '工具>满减修改', pathR:'/s/marketing'}
        },
        {
          path: 'data',
          name: 'data',
          component: data,
          meta: {title: '数据'}
        },
        {
          path: 'information',
          name: 'information',
          component: information,
          meta: {title: '店铺信息'}
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
          meta: {title:'通用设置'}
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
          meta: {title:'运费模板',bread: '运费模板>运费模板新增修改', pathR:'/s/formwork'}
        },
        {
          path: 'printSendOrder',
          name: 'printSendOrder',
          component: printSendOrder,
          meta: {title:'发货单详情', pathR:'/s/bug'}
        },
        {
          path: 'dealerOrDtl',
          name: 'dealerOrDtl',
          component: dealerOrDtl,
          meta: { title: '订货单详情' ,bread: '订货单>订货单详情', pathR:'/s/bug'}
        }
      ]
    }
  ]
})

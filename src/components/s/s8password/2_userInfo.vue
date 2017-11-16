<template>
  <div class="Account">
    <div class="message"><b>账户信息</b></div>
    <div class="a_message"><span class="mr20">注册手机号</span><span id="userPhone">{{dealer_user_info.userPhone}}</span></div>
    <div class="message"><b>公司信息</b></div>
    <div class="a_message"><span class="mr20">商家名称</span><span id="userPhone">{{dealer_user_info.dealerName}}</span></div>
    <div class="a_message"><span class="mr20">商家类型</span><span id="userPhone">{{dealer_user_info.dealerFristClassifyName}}</span></div>
    <div class="a_message"><span class="mr20">签约时间</span><span id="userPhone">{{dealer_user_info.endSignDate}}</span></div>
    <div class="a_message"><span class="mr20">合作方式</span>
      <span id="userPhone" v-if="dealer_user_info.cooperationMode==1">包销</span>
      <span id="userPhone" v-if="dealer_user_info.cooperationMode==2">代销</span>
      <span id="userPhone" v-if="dealer_user_info.cooperationMode==3">经销</span>
      <span id="userPhone" v-if="dealer_user_info.cooperationMode==4">入驻</span>
    </div>
    <div class="a_message">
      <span class="mr20">详细地址</span>
      <span id="userPhone">{{dealer_user_info.dealerArea}},{{dealer_user_info.dealerCity}},{{dealer_user_info.dealerDetailAddress}}</span></div>
    <div class="message"><b>业务员信息</b></div>
    <div class="a_message"><span class="mr20">平台对接人</span><span id="userPhone">{{dealer_user_info.sellerName}},{{dealer_user_info.sellerPhone}}</span></div>
  </div>
</template>
<script>
  /* eslint-disable space-infix-ops,quotes */

  export default {
    data () {
      return {
        // 售后id
        addressId: '',
        dealer_user_info: '',
       // dealer_user_info: { userPhone: '' , dealerName : '' , dealerFristClassifyName : '' , dealerSecondClassifyName : '' , startSignDate : '' ,endSignDate : '' cooperationMode :'' ,dealerDetailAddress : '',sellerName : '' sellerPhone :'' },
        dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        userPhone: JSON.parse(sessionStorage.getItem('mUser')).mobile
      }
    },
    created () {
    },
    watch: {
    },
    methods: {

    },
    mounted () {
      let that = this
      var dealerId = JSON.parse(sessionStorage.getItem('mUser')).dealerId
      that.$.ajax({
        url: that.base + 'm2c.scm/dealer/sys/'+ dealerId,
        type: 'get',
        data: {
        },
        success: function (result) {
          if (result.status === 200) {
            that.dealer_user_info = result.content
            console.log(that.dealer_user_info)
          } else {
            alert(result.errorMessage)
          }
        }
      })
    }
  }
</script>
<style lang="scss" scoped>
.Account{
  width: 94%;
  min-height:800px;
  background: #fff;
  margin-top: 140px;
  margin-left: 20px;
  padding-top: 20px;
  padding-left: 20px;
  .message{
    font-size: 16px;
    color: #333333;
    line-height: 50px;
  }
  .a_message{
    font-size: 14px;
    color: #333333;
    line-height: 30px;
    padding-left: 30px;
  }
}
.mr20{
  margin-right: 20px;
}
</style>

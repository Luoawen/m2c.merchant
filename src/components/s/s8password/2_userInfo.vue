s<template>
  <div class="sz">
    账户信息
    <div>管理员手机号：<div id="userPhone"></div></div>
  </div>
</template>
<script>
  /* eslint-disable space-infix-ops,quotes */

  export default {
    data () {
      return {
        // 售后id
        addressId: '',
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
      sendVerficode () {
        let that = this
        that.$.ajax({
          url: that.base + 'm2c.users/user/sendSms',
          type: 'post',
          data: {
            token: sessionStorage.getItem('mToken'),
            codeType: 2,
            mobile: JSON.parse(sessionStorage.getItem('mUser')).mobile
          },
          success: function (result) {
            if (result.status === 200) {
              alert('已发送短信注意查收')
            } else {
              alert(result.errorMessage)
            }
          }
        })
      },
      modify_pass () {
        let that = this
        let verifyCode = that.$('#verifyCode').val()
        if (verifyCode.length !== 6) {
          alert('验证码长度必须6位')
          return false
        }
        let pass = that.$('#newPass').val()
        if (pass.length < 8 || pass.length > 16) {
          alert('密码长度8-16位')
          return false
        }
        let confirmNewPass = that.$('#confirmNewPass').val()
        if (confirmNewPass !== pass) {
          alert('两次密码不一致')
          return false
        }
        that.$.ajax({
          url: that.base + 'm2c.users/user/findPassword',
          type: 'post',
          data: {
            token: sessionStorage.getItem('mToken'),
            codeType: 2,
            mobile: that.userPhone,
            newPass: that.md5(pass).toLowerCase(),
            verifyCode: verifyCode
          },
          success: function (result) {
            if (result.status === 200) {
              alert('修改操作成功')
            } else if (result.status === 3) {
              alert('验证码不正确')
            } else {
              alert('修改失败')
            }
          }
        })
      }
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
          } else {
            alert(result.errorMessage)
          }
        }
      })
    }
  }
</script>

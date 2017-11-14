<template>
  <div class="sz">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-2 control-label">*验证码：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="verifyCode" placeholder="4位数验证码" maxlength="4">
        </div>
        <div class="col-sm-3">
          <button type="submit" class="btn btn-default btn-lg" @click="sendVerficode" :disabled="!show">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s</span>
          </button>
        </div>
        <label v-show="isSuccess" class="col-sm-3 control-label">已向手机号{{userPhone}}发送验证码</label>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*交易密码：</label>
        <div class="col-sm-3">
          <input type="password" class="form-control" id="newPass" maxlength="6" placeholder="6位数字密码">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*再次确认：</label>
        <div class="col-sm-3">
          <input type="password" class="form-control" id="confirmNewPass" maxlength="6" placeholder="6位数字密码">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" class="btn btn-info btn-lg save" @click="modify_pass()">保存</button>
          <button type="submit" class="btn btn-default btn-lg" @click="goBack">取消</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        userPhone: JSON.parse(sessionStorage.getItem('mUser')).mobile,
        show: true,
        count: sessionStorage.getItem('total') == null || sessionStorage.getItem('total') == '' ? 60 : sessionStorage.getItem('total'),
        total: '',
        isSuccess: false
      }
    },
    created () {
    },
    watch: {
    },
    methods: {
      goBack(){
        this.$router.go(-1);
      },
      timekeeping () {
        let that = this
        // 把按钮设置为不可以点击
        // 把按钮设置为不可以点击
        that.show = false
        var interval = setInterval(function () { // 每秒读取一次cookie
          // 从cookie 中读取剩余倒计时
          that.total = sessionStorage.getItem('total')
          // 在发送按钮显示剩余倒计时
          if (that.total == 1) {
            that.count = 60
          } else {
            that.count = that.total
          }
          // 把剩余总倒计时减掉1
          that.total--
          if (that.total <= 0) { // 剩余倒计时为零，则显示 重新发送，可点击
            // 清除定时器
            clearInterval(interval)
            // 删除cookie
            sessionStorage.removeItem('total')
            // 显示重新发送 把发送按钮设置为可点击
            that.show = true
            that.isSuccess = false
          } else { // 剩余倒计时不为零
            // 重新写入总倒计时
            sessionStorage.setItem('total', that.total)
          }
        }, 1000)
      },
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
              that.isSuccess = true
              sessionStorage.setItem('total', 60)
              that.timekeeping()
              that.show_tip('已发送短信注意查收')
            } else {
              that.show_tip(result.errorMessage)
            }
          }
        })
      },
      modify_pass () {
        let that = this
        let verifyCode = that.$('#verifyCode').val()
        if (verifyCode.length !== 4) {
          that.show_tip('验证码长度必须4位')
          return false
        }
        $('#newPass').bind('input propertychange',function(){ //添加监听input值的改变事件
          let tvalmum;
          //统计input输入字段的长度
          tvalnum = $(this).val().length;
          //如果大于8个字直接进行字符串截取
          if(tvalnum>16){
            var tval = $(this).val();
            tval = tval.substring(6,16);
            $(this).val(tval);
            that.show_tip('长度超过限制！');
          }
        });
        let pass = that.$('#newPass').val()
        if (pass.length < 6 || pass.length > 16) {
          that.show_tip('密码长度6-16位')
          return false
        }
        let confirmNewPass = that.$('#confirmNewPass').val()
        if (confirmNewPass !== pass) {
          that.show_tip('两次密码不一致')
          return false
        }
				that.$.ajax({
          type: 'post',
          url: that.base + 'm2c.trading/web/account/dealer/payPassword',
          data: {
            token: sessionStorage.getItem('mToken'),
						mobile: that.userPhone,
            newPass: that.md5(pass).toLowerCase(),
            verifyCode: verifyCode,
            correlationType: 2,
            correlationId: that.dealerId
          },
          success: function (result) {
            if (result.status === 200) {
              // 删除cookie
              sessionStorage.removeItem('total')
              // 显示重新发送 把发送按钮设置为可点击
              that.show = true
              that.isSuccess = false
              that.show_tip('修改操作成功')
              JSON.parse(sessionStorage.getItem('mUser')).dealerTradePassword = that.md5(pass).toLowerCase()
              that.$router.push({name:'cash'})
            } else if (result.status === 3) {
              that.show_tip('验证码不正确')
            } else {
              that.show_tip('修改失败')
            }
          }
        })
        // that.$.ajax({
        //   url: that.base + 'm2c.users/user/findPassword',
        //   type: 'post',
        //   data: {
        //     token: sessionStorage.getItem('mToken'),
        //     codeType: 2,
        //     mobile: that.userPhone,
        //     newPass: that.md5(pass).toLowerCase(),
        //     verifyCode: verifyCode
        //   },
        //   success: function (result) {
        //     if (result.status === 200) {
        //       // 删除cookie
        //       sessionStorage.removeItem('total')
        //       // 显示重新发送 把发送按钮设置为可点击
        //       that.show = true
        //       that.isSuccess = false
        //       that.show_tip('修改操作成功')
        //     } else if (result.status === 3) {
        //       that.show_tip('验证码不正确')
        //     } else {
        //       that.show_tip('修改失败')
        //     }
        //   }
        // })
      }
    },
    mounted () {
      let that = this
      if (sessionStorage.getItem('total') !== undefined && sessionStorage.getItem('total') !== 'NaN' && sessionStorage.getItem('total') !== 'null' && sessionStorage.getItem('total') !== null && sessionStorage.getItem('total') !== '') { // cookie存在倒计时
        that.show = false
        that.isSuccess = true
        that.total = sessionStorage.getItem('total')
        that.timekeeping()
      } else { // cookie 没有倒计时
        that.show = true
        that.count = 60
      }
    }
  }
</script>
<style scoped>

</style>
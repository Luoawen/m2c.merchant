<template>
  <div class="sz">
    <el-row :gutter="20" >
      <el-col  :span="2" :offset="1"> <label style="color: red">*</label>验证码
      </el-col>
      <el-col  :span="5" >   <input type="text" class="formControl" id="verifyCode" v-model="Info.verifyCode" placeholder="4位数验证码" maxlength="4">
        <p v-show="isSuccess" style='font-size:12px;color:#ccc;text-align:left;' >已向手机号<label style="color: red;">{{userPhone}}</label>发送验证码</p>
      </el-col>
      <el-col   :span="2" > 
        <el-button  class='w100'  type="plain" @click="sendVerficode" :disabled="disabled"> 
          <span v-show="show"  id="sendVer">获取验证码</span><span v-show="!show" class="count">{{count}} s</span> 
        </el-button> 
      </el-col>
    </el-row>
    <div class="clear"></div>
  <el-row :gutter="20" >
      <el-col  :span="2" :offset="1"> <label style="color: red">*</label>交易密码</el-col>
      <el-col   :span="6" >  <input type="password" class="formControl" id="newPass" v-model="Info.newPass" 
     minlength="6" maxlength="6" placeholder="6位数字密码"> </el-col>
   </el-row>
   <div class="clear"></div>
  <el-row :gutter="20" >
      <el-col :span="2" :offset="1"> <label style="color: red">*</label>再次确认 </el-col>
      <el-col :span="6" > <input type="password" class="formControl" id="confirmNewPass" v-model="Info.confirmNewPass" maxlength="6" minlength="6"  placeholder="6位数字密码"> </el-col>
   </el-row>
    <el-row :gutter="20" style='margin-top:30px;text-align:left' >
      <el-col   :span="6" :offset="3">  <el-button  type="primary" @click="modify_pass()">保存</el-button> 
        <el-button type="plain"  v-if="from=='cash'" @click="goBack">取消</el-button>
        </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        dealerId: JSON.parse(sessionStorage.getItem('mUser'))?JSON.parse(sessionStorage.getItem('mUser')).dealerId:'',
        userPhone: JSON.parse(sessionStorage.getItem('mUser')).mobile,
        show: true,
        count: sessionStorage.getItem('totalT') == null || sessionStorage.getItem('totalT') == '' ? 60 : sessionStorage.getItem('totalT'),
        total: '',
        isSuccess: false,
        from:'',
        masage:'',
        disabled: false,
        Info:{},
        flage:''
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
        that.show = false
        var interval = setInterval(function () { // 每秒读取一次cookie
          // 从cookie 中读取剩余倒计时
          that.total = sessionStorage.getItem('totalT')
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
            sessionStorage.removeItem('totalT')
            // 显示重新发送 把发送按钮设置为可点击
            that.show = true
            if(that.flage!=='save'){
              that.$("#sendVer").text("重新发送")
            }
            that.disabled = false
            that.isSuccess = false
          } else { // 剩余倒计时不为零
            // 重新写入总倒计时
            sessionStorage.setItem('totalT', that.total)
          }
        }, 1000)
      },
      sendVerficode () {
        //alert(0)
        let that = this
        if(that.disabled == true){
          return
        }
        that.disabled = true // 把按钮设置为不可以点击
        that.$.ajax({
          url: that.base + 'm2c.users/user/sendSms',
          timeout : 5000, //超时时间设置，单位毫秒
          type: 'post',
          data: {
            token: sessionStorage.getItem('mToken'),
            codeType: 5,
            mobile: JSON.parse(sessionStorage.getItem('mUser')).mobile
          },
          success: function (result) {
            if (result.status === 200) {
              that.isSuccess = true
              sessionStorage.setItem('totalT', 60)
              that.timekeeping()
              that.show_tip('已发送短信注意查收')
            } else {
              that.show_tip(result.errorMessage)
              that.disabled = false
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
    　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
    　　　　　 //ajaxTimeoutTest.abort();
    　　　　　 that.show_tip("请求超时");
              that.disabled = false
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
              sessionStorage.removeItem('totalT')
              // 显示重新发送 把发送按钮设置为可点击
              that.show = true
              that.isSuccess = false
              JSON.parse(sessionStorage.getItem('mUser')).dealerTradePassword = that.md5(pass).toLowerCase()
              that.show_tip('修改操作成功')
              that.$("#sendVer").text("获取验证码")
              that.flage = 'save'
              that.text = ''
              that.Info = {}
              if(that.$route.query.from == 'cash'){
                that.$router.push({name:'cash'})
              }
            }else {
              that.show_tip(result.errorMessage)
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
    clear(){
      let that = this
      that.text = ''
    },
    mounted () {
      let that = this
      that.from = that.$route.query.from
      if (sessionStorage.getItem('totalT') !== undefined && sessionStorage.getItem('totalT') !== 'NaN' && sessionStorage.getItem('totalT') !== 'null' && sessionStorage.getItem('totalT') !== null && sessionStorage.getItem('totalT') !== '') { // cookie存在倒计时
        that.show = false
        that.isSuccess = true
        that.total = sessionStorage.getItem('totalT')
        that.disabled = true
        that.timekeeping()
      } else { // cookie 没有倒计时
        that.show = true
        that.count = 60
      }
    }
  }
</script>
<style lang="scss" scoped>
.sz{
  width: 96%;
  height: 880px;
  background: #fff;
  margin: 20px 2%;
  margin-top: 140px;
  padding-top: 40px;

}
  .el-row {
      margin:0;
      line-height:40px;
      height:40px;
      text-align: right;
      p{line-height:20px;margin:0;}
    }
</style>


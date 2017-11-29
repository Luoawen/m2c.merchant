<template>
  <div class="sz">
    <form class="form-horizontal">
      <!--
      <div class="form-group" v-show="isSuccess">
        <label class="col-sm-3 control-label">已向手机号{{userPhone}}发送验证码</label>
      </div>
      -->
      <div class="form-group">
        <label class="col-sm-2 control-label"><label style="color: red">*</label>验证码：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="verifyCode" v-model="Info.verifyCode" placeholder="4位数验证码" maxlength="4">
        </div>
        <div class="col-sm-3">
          <a class="btn btn-default btn-lg" @click="sendVerficode" :disabled="disabled">
            <span v-show="show" id="sendVer">获取验证码</span>
            <span v-show="!show" class="count">{{count}} s</span>
          </a>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label" ></label>
        <div class="col-sm-3">
          <p v-show="isSuccess">已向手机号<label style="color: red">{{userPhone}}</label>发送验证码</p>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label"><label style="color: red">*</label>新密码：</label>
        <div class="col-sm-3">
          <input type="password" class="form-control" id="newPass" v-model="Info.newPass" maxlength="16" placeholder="6-16位数字密码">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label"><label style="color: red">*</label>再次确认：</label>
        <div class="col-sm-3">
          <input type="password" class="form-control" id="confirmNewPass" v-model="Info.confirmNewPass" maxlength="16" placeholder="6-16位数字密码">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <el-button  type="primary" @click="modify_pass()">保存</el-button>
          <!--<button type="submit" class="btn btn-default btn-lg">取消</button>-->
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: '',
        // 搜索参数
        search_params: {accNo: '', mediaName: '', province: '', proName: '', city: '', cityName: '', regionCode: '', areaName: '', parCate: '', cate: '', cooperWay: '', staff: '', addr: '', regisDateStart: '', regisDateEnd: '', detail: '', person: '', tel: ''},
        // 所有的省份(供搜索使用)
        province_all_search: [],
        // 可选的城市(供搜索使用)
        city_all_search: [],
        // 所有的区(供搜索使用)
        area_all_search: [],
        // 所有的省份(供新增搜索删除(上)使用)
        province_all_add_modify_1: [],
        // 所有的城市(供新增搜索删除(上)使用)
        city_all_add_modify_1: [],
        // 所有的省份(供新增搜索删除(下)使用)
        province_all_add_modify_2: [],
        // 所有的城市(供新增搜索删除(下)使用)
        city_all_add_modify_2: [],
        // 所有的区域(供新增搜索删除(下)使用)
        area_all_add_modify_2: [],
        // 售后id
        addressId: '',
        dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        userPhone: JSON.parse(sessionStorage.getItem('mUser')).mobile,
        show: true,
        count: sessionStorage.getItem('total') == null || sessionStorage.getItem('total') == '' ? 60 : sessionStorage.getItem('total'),
        total: '',
        isSuccess: false,
        disabled:false,
        Info:{},
        flage:''
      }
    },
    created () {
    },
    watch: {
    },
    methods: {
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
            // 显示重新发送 把发送按钮设置为可点击
            that.show = true
            if(that.flage!=='save'){
              that.$("#sendVer").text("重新发送")
            }
            sessionStorage.removeItem('total')
            that.disabled = false
            that.isSuccess = false
          } else { // 剩余倒计时不为零
            // 重新写入总倒计时
            sessionStorage.setItem('total', that.total)
          }
        }, 1000)
      },
      sendVerficode () {
        let that = this
        if(that.disabled == true){
          return
        }
        that.disabled = true
        that.$.ajax({
          url: that.base + 'm2c.users/user/sendSms',
          timeout : 2000, //超时时间设置，单位毫秒
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
              // 删除cookie
              sessionStorage.removeItem('total')
              // 显示重新发送 把发送按钮设置为可点击
              that.show = true
              that.isSuccess = false
              that.show_tip('修改操作成功')
              that.Info = {}
              that.$("#sendVer").text("获取验证码")
              that.flage = 'save'
            } else if (result.status === 3) {
              that.show_tip('验证码不正确')
            } else {
              that.show_tip('修改失败')
            }
          }
        })
      }
    },
    mounted () {
      let that = this
      if (sessionStorage.getItem('total') !== undefined && sessionStorage.getItem('total') !== 'NaN' && sessionStorage.getItem('total') !== 'null' && sessionStorage.getItem('total') !== null && sessionStorage.getItem('total') !== '') { // cookie存在倒计时
        that.show = false
        that.isSuccess = true
        that.total = sessionStorage.getItem('total')
        that.disabled = true
        that.timekeeping()
      } else { // cookie 没有倒计时
        that.show = true
        that.count = 60
      }
    }
  }
</script>
<style>
  .sz{
    width: 96%;
    height: 880px;
    background: #fff;
    margin: 20px 2%;
    margin-top: 140px;
    padding-top: 40px;

  }
  label{font-weight: normal;}
  .btn-group-lg>.btn, .btn-lg{
    padding:7px 16px;
    font-size:14px;
  }
</style>

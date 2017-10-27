s<template>
  <div class="sz">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-3 control-label">已向手机号{{userPhone}}发送验证码</label>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*验证码：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="verifyCode" placeholder="6位数字">
        </div>
        <div class="col-sm-3">
          <button type="submit" class="btn btn-default btn-lg" @click="sendVerficode">获取验证码</button>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*新密码：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="newPass" placeholder="8位数字密码">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*再次确认：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" id="confirmNewPass" placeholder="8位数字密码">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" class="btn btn-info btn-lg save" @click="modify_pass()">保存</button>
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
    }
  }
</script>

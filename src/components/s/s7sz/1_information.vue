<template xmlns:v-model="http://www.w3.org/1999/xhtml">
  <div class="message">
    <h4>店铺信息</h4>
    <div class="shop">
      <div class="shopMess">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">店铺名称：</label>
            <div class="col-sm-6">
              <input type="text" class="form-control" maxlength="20" id="inputEmail3" placeholder="1-20字符" v-model="storeinformation.appellation">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">店铺介绍：</label>
            <div class="col-sm-10">
              <textarea class="form-control" cols="80" rows="7" maxlength="200" placeholder="1-200字符" v-model="storeinformation.introduce" style="resize:none;"></textarea>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">客服电话：</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" onkeyup="value=value.replace(/[^\d-]/g,'') " ng-pattern="/[^a-zA-Z]/" maxlength="20" id="inputEmail3" placeholder="请填写" v-model="storeinformation.service">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">发票信息：</label>
            <div class="col-sm-10">
              <textarea class="form-control" cols="80" rows="7" placeholder="1-200字符"  maxlength="200" v-model="storeinformation.shopReceipt" style="resize:none;"></textarea>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
            <el-button type="submit"  @click="modifyDealerMess()">保存</el-button>
            <!--<button type="submit" class="btn btn-default btn-lg">取消</button>-->
            </div>
          </div>
        </form>
      </div>
      <div class="shopLogo pull-right">
        <div class="form-group nopad">
              <div class="col-sm-8">
                <input type="file" id="m11yhgl_img_input" style="display:none" @change="upload_img()">
                <div class="img_up">
                  <img width='100px' height='100px' v-show='imgshow' id="m11yhgl_img" v-model:src="storeinformation.imgUrl">
                </div>
                <span class="upload" onclick="document.querySelector('#m11yhgl_img_input').click()">
                  <div style="color:#337ab7;cursor:pointer;display:inline;">
                    <button class="btn btn-default">选择</button>
                  </div>
                </span>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable quotes,eqeqeq,space-unary-ops */

  export default {
  name: '',
  data () {
    return {
      // 上传图片后返回的地址
      imgshow: false,
      modify_params_imgurl: '',
      // 上传头像标识
      touxiang_change: false,
      storeinformation: {appellation: '', introduce: '', service: '', imgUrl: '', shopId: '' , shopReceipt: ''}
    }
  },
  created () {
  },
  methods: {
    // 上传头像时获取本地地址
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 上传头像
    upload_img () {
      let target = event.target
      let objUrl = this.getObjectURL(target.files[0])
      let size = target.files[0].size
      if (size >= 1024000 * 1) this.show_tip('图片超过1M了哦')
      else {
        if (objUrl) {
          // this.img_url = objUrl
          this.imgshow = true
          document.querySelector('#m11yhgl_img').src = objUrl
          console.log(document.querySelector('#m11yhgl_img').src)
          this.touxiang_change = true
        }
      }
    },
    // 修改图片
    modify_imgStep (callback) {
      let that = this
      if (!that.touxiang_change) {
        callback()
      } else {
        let formData = new FormData()
        formData.append('img', document.querySelector('#m11yhgl_img_input').files[0])
        formData.append('token', sessionStorage.getItem('mToken'))
        formData.append('imgGroup', 4)
        that.$.ajax({
          type: 'post',
          url: that.base + 'm2c.support/img/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function (result) {
            result = JSON.parse(result)
            // document.querySelector('#m11yhgl_img').src = that.img_url
            if (result.errorMessage && result.errorMessage !== '') {
              that.show_tip(result.errorMessage)
              that.touxiang_change = true
              return
            }
            // console.log('上传图片成功,返回结果是: ', result)
            that.storeinformation.imgUrl = result.content.url
            that.touxiang_change = false
            callback()
          }
        })
      }
    },
    // 查找经销商信息
    getDealerMess () {
      const that = this
      that.$.ajax({
        type: 'get',
        url: this.localbase + 'm2c.scm/shop/sys/shopInfo',
        data: {
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (res) {
          console.log(res)
          that.imgshow = true
          that.storeinformation.appellation = res.content.shopName
          that.storeinformation.introduce = res.content.shopIntroduce
          that.storeinformation.service = res.content.customerServiceTel
          that.storeinformation.imgUrl = res.content.shopIcon
          that.$("#m11yhgl_img")[0].src = res.content.shopIcon
          that.storeinformation.shopId = res.content.shopId
          that.storeinformation.shopReceipt = res.content.shopReceipt
        }
      })
    },
    // 修改店铺信息1
    modifyDealerMess (callback) {
      let that = this
      if (that.storeinformation.appellation == null || that.storeinformation.appellation.trim() == '' || that.storeinformation.appellation.length > 50){
        that.show_tip("请输入店铺名称")
        return
      }
      if (that.storeinformation.service == null || that.storeinformation.service.trim() == ''){
        that.show_tip("请输入客服电话")
        return
      }
      var pic = that.$("#m11yhgl_img")[0].src
      if (pic.indexOf('undifined') > -1) {
        that.show_tip('上传图片不成功')
        return
      }
      if (that.$("#m11yhgl_img")[0].src == null || that.$("#m11yhgl_img")[0].src.trim() == ''){
        that.show_tip("请选择图片")
        return
      }
      var methodStr = "post";
      if (typeof (that.storeinformation.shopId) != 'undefined' && that.storeinformation.shopId != '') {
        methodStr = "put";
      }
      that.modify_imgStep(function () {
        that.$.ajax({
          type: methodStr,
          url: that.localbase + 'm2c.scm/shop/sys/shopInfo',
          data: {
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            shopId: that.storeinformation.shopId,
            shopName: that.storeinformation.appellation,
            shopIntroduce: that.storeinformation.introduce,
            customerServiceTel: that.storeinformation.service,
            shopIcon: that.storeinformation.imgUrl,
            shopReceipt: that.storeinformation.shopReceipt
          },
          success: function (res) {
            if (res.status === 200) {
              that.show_tip('修改成功')
              that.getDealerMess()
            } else {
              that.show_tip(res.errorMessage)
            }
          }
        })
      })
    }
  },
  mounted () {
    this.getDealerMess()
  }
}
</script>

<style lang="scss" scoped>
  .message{
    width: 1583px;
    margin-top: 146px;
    margin-left: 30px;
    .shop{
      margin-top: 30px;
      .shopMess{
        display: inline-block;
        margin-left: 20px;
        button{
          width: 136px;
          height: 41px;
          margin-top: 80px;
        }
        button,.save{
          margin-right: 60px;
        }
      }
      .shopLogo{
        display: inline-block;
        .img_up{
          width: 100px;
          height: 100px;
          background-size: 100px 100px;
        }
        span{
          div{
            button{
              margin-top: 15px;
            }
          }
        }
      }
    }
  }
</style>

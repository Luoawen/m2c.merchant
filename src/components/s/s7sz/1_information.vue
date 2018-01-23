<template>
  <div class="message content clear">
    <div class="line"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="店铺信息" name="first">
        <div class="shop">
          <div class="shopMess">
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">店铺名称：</label>
                <div class="col-sm-6">
                  <input type="text" class="form-control" maxlength="15" id="inputEmail3" placeholder="1-15字符" v-model="storeinformation.appellation">
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
                <el-button type="primary" size="medium" @click="modifyDealerMess()">保存</el-button>
                <!--<button type="submit" class="btn btn-default btn-lg">取消</button>-->
                </div>
              </div>
            </form>
          </div>
          <div class="shopLogo pull-right">
            <div class="form-group nopad">
              <div class="col-sm-8">
                <input type="file" id="m11yhgl_img_input" style="display:none" @change="upload_img($event)">
                <div class="img_up">
                  <img width='100px' height='100px'  v-show='imgshow' id="m11yhgl_img" v-model:src="storeinformation.imgUrl"
                        onerror="this.src='../../../../static/assets/images/icon_uoloading.png';this.onerror=null" >
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
      </el-tab-pane>
      <el-tab-pane label="店铺主页" name="second">
        <p>店铺背景图片上传</p>
        <div class="shopBg">
          <input type="file" id="bgInput" style="display:none" accept=".jpg,.png" @change="uploadBg($event)" />
          <div class="shopGg fl">
            <img v-show='bgShow' id="bgImg" v-model:src="shopBackImg"
                  onerror="this.src='../../../../static/assets/images/icon_uoloading.png';this.onerror=null" >
          </div>
          <i class="fl">尺寸限制750px*240px，JPG/PNG格式，500K以内</i><br />
          <el-button class="upload fl" onclick="document.querySelector('#bgInput').click()">{{upText}}</el-button>
        </div>
        <div class="clear"></div>
        <el-button class="save" type="primary" size="medium" @click="postshopBackImg">保存设置</el-button>
        <img id="getWidth" :src='getImgWidth' />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /* eslint-disable quotes */

  export default {
  name: '',
  data () {
    return {
      // 上传图片后返回的地址
      imgshow: false,
      modify_params_imgurl: '',
      // 上传头像标识
      touxiang_change: false,
      storeinformation: {appellation: '', introduce: '', service: '', imgUrl: '', shopId: '' , shopReceipt: ''},
      shopBackImg:'',
      upText:'点击上传',
      bgShow:false,
      bgChange:false,
      activeName:'first',
      getImgWidth:'',
      height:'',
      width:'',
      objUrl:'',
      obj:''
    }
  },
  created () {
  },
  methods: {
    // 获取全部订单信息
    handleClick(tab, event) {
      let that = this
      if (tab.paneName==='first'){
        that.getDealerMess()
      }else if (tab.paneName==='second'){
        that.getshopBackImg()
      }
    },
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
    upload_img ($event) {
      let target = $event.target
      let objUrl = this.getObjectURL(target.files[0])
      let size = target.files[0].size
      if (size >= 1024000 * 1) this.$message.error('图片超过1M了哦')
      else {
        if (objUrl) {
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
              that.$message.error(result.errorMessage)
              that.touxiang_change = true
              return
            }
            console.log('上传图片成功,返回结果是: ', result)
            that.storeinformation.imgUrl = result.content.url
            that.touxiang_change = false
            callback()
          }
        })
      }
    },
    // 上传背景时获取本地地址
    getBgURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      console.log('url:',url)
      return url
    },
    // 上传背景图
    uploadBg ($event) {
      let target = $event.target
      // let objUrl
      // console.log('target.files[0]:',target.files[0])
      //let objUrl = this.getBgURL(target.files[0])
      if(target.files[0]!==undefined){
        this.objUrl = this.getBgURL(target.files[0])
        this.obj = document.querySelector('#bgInput').files[0]
        let size = target.files[0].size
        let type = target.files[0].type
        // console.log('---',target,this.objUrl,size,type)
        if(type=='image/png'||type=='image/jpeg'){
          // console.log(size)
          if (size >= 500000 )
          {
            this.$message.error('请上传500K以内的图片')
          }else {
            if (this.objUrl) {
              this.bgShow = true
              document.querySelector('#bgImg').src = this.objUrl
              // console.log(document.querySelector('#bgImg').src)
              this.bgChange = true
            }
          }
        }else{
          this.$message.error('请上传JPG/PNG格式的图片')
        }
      }else{
        // console.log("this.objUrl:",this.objUrl)
        return
      }
    },
    // 修改背景图
    modifyBg (callback) {
      let that = this
      if (!that.bgChange) {
        callback()
      } else {
        let formData = new FormData()
        formData.append('img', this.obj)
        formData.append('token', sessionStorage.getItem('mToken'))
        formData.append('imgGroup', 4)
        // console.log("document.querySelector('#bgInput').files[0]:",document.querySelector('#bgInput').files[0])
        // console.log("this.obj:",this.obj)
        that.$.ajax({
          type: 'post',
          url: that.base + 'm2c.support/img/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function (result) {
            result = JSON.parse(result)
            console.log(result)
            // document.querySelector('#m11yhgl_img').src = that.img_url
            if (result.errorMessage && result.errorMessage !== '') {
              that.$message.error(result.errorMessage)
              that.bgChange = true
              return
            }
            that.shopBackImg = result.content.url
            let imgObj = document.getElementById('getWidth')
            that.$nextTick(()=>{
              that.getImgWidth = result.content.url
              imgObj.style.display = 'block'
            })
            imgObj.onload = function(){
              that.width = imgObj.width
              that.height = imgObj.height
              imgObj.style.display = 'none'
              if(that.width=='750' && that.height=='240'){
                that.bgChange = false
                callback()
              }else{
                that.$message.error('请上传750px*240px的图片')
                return
              }
            }
            // imgObj.style.display = 'none'
          }
        })
      }
    },
    // 提交门头图
    postshopBackImg(){
      let that = this
      that.modifyBg(function () {
        if(that.shopBackImg===''){
          that.$message.error('请上传店铺背景图')
          return
        }else{
          // if(that.width!='750' || that.height!='240'){
          //   that.$message.error('请上传750px*240px的图片')
          //   return
          // }else{
            that.$.ajax({
              type: 'post',
              url: that.localbase + 'm2c.scm/shop/sys/web/shopBackImg',
              data: {
                dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
                shopId: that.storeinformation.shopId,
                shopBackImg: that.shopBackImg,
              },
              success: function (res) {
                if (res.status === 200) {
                  that.$message.success('修改成功')
                  that.getshopBackImg()
                } else {
                  that.$message.error('修改失败')
                }
              }
            })
          // }
        }
      })
    },
    // 查询店铺门头图
    getshopBackImg(){
      let that = this
      that.$.ajax({
        type: 'get',
        url: this.localbase + 'm2c.scm/shop/sys/web/shopBackImg',
        data: {
          shopId: that.storeinformation.shopId
        },
        success: function (res) {
          console.log(res)
          that.shopBackImg = res.content
          if(that.shopBackImg!==''){
            that.bgShow = true
            that.$("#bgImg")[0].src = res.content
          }else{
            that.bgShow = false
          }
        }
      })
    },
    // 查找经销商信息
    getDealerMess () {
      const that = this
      that.$.ajax({
        type: 'get',
        url: this.localbase + 'm2c.scm/shop/sys/web/shopInfo',
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
        that.$message.error("请输入店铺名称")
        return
      }
     if (that.storeinformation.service == null || that.storeinformation.service.trim() == ''){
       that.$message.error("请输入客服电话")
       return
     }
      if (that.$("#m11yhgl_img")[0].src.indexOf("undefined") != -1 ) {
        that.$message.error('上传图片不成功')
        return
      }
      if (that.$("#m11yhgl_img")[0].src == null || that.$("#m11yhgl_img")[0].src.trim() == ''){
        that.$message.error("请选择图片")
        return
      }
      var methodStr = "post";
      if (typeof (that.storeinformation.shopId) != 'undefined' && that.storeinformation.shopId != '') {
        methodStr = "put";
      }
      that.modify_imgStep(function () {
        that.$.ajax({
          type: methodStr,
          url: that.localbase + 'm2c.scm/shop/sys/web/shopInfo',
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
              that.$message.success('修改成功')
              that.getDealerMess()
            } else {
              that.$message.error('修改失败')
            }
          }
        })
      })
    }
  },
  mounted () {
    if(this.activeName=='first'){
      console.log(this.activeName)
      this.getDealerMess()
    }else{
      console.log(this.activeName)
      this.getshopBackImg()
    }

  }
}
</script>

<style lang="scss" scoped>
#getWidth{opacity:0;filter: alpha(opacity=0);position:absolute;}
.shopGg{width:232px;height:112px;background:url(../../../assets/images/def.png) no-repeat;
  margin-right:20px;
  img{width:100%;height:100%;}
}
.shopBg{float:left;margin:20px 0;margin-left:110px;
  i{
    text-decoration: none;margin-top:10px;margin-bottom:20px;
    font-style: normal;
    color: gray;
    font-size: 12px;
    width: 230px;
    display: block;
    float: left;}
}
.save{margin-left:110px;}
  .message{
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
          background:none;
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

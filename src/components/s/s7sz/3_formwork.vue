<template>
  <div class="sz content clear">
     <!-- -->
    <template v-if="formworks.length===0">
      <!--没有模板的情况 -->
      <h3 class="building">暂无运费模板<br />
        <el-button type="primary" size="medium" @click="goAdd">新增</el-button>
      </h3>
    </template>
    <template v-if="formworks.length>0">
      <el-button type="primary" size="medium" @click="goAdd">新增</el-button>
      <template v-for="(formwork,index) in formworks">
        <table class="table table-bordered">
          <thead>
            <tr class="active">
              <th width="30%">{{formwork.modelName}}</th>
              <th width="17.5%">{{formwork.chargeType===0?'按重量':formwork.chargeType===1?'按件数':''}}</th>
              <th width="17.5%" class="some">
                <p style="margin:0;" v-if="formwork.goodsUserNum==0">已有{{formwork.goodsUserNum}}个商品使用 </p>
                <router-link v-if="formwork.goodsUserNum!=0" :to="{name:'goodList'}">已有{{formwork.goodsUserNum}}个商品使用 </router-link></th>
              <th width="17.5%" class="act"><router-link :to="{ name:'formworkadd', query: {addModify: false, modelId: formwork.modelId} }">编辑</router-link></th>
              <th width="17.5%"><a @click="showdelete(formwork.modelId)"  v-if="formwork.goodsUserNum==0">删除</a></th>
            </tr>
          </thead>
          <tbody>
            <tr class="active">
              <th scope="row">可配送至</th>
              <td colspan="4" v-if="formwork.chargeType==2">运费/元</td>
              <td v-if="formwork.chargeType!=2">{{formwork.chargeType==1?'首件/个':'首重/kg'}}</td>
              <td v-if="formwork.chargeType!=2">运费/元</td>
              <td v-if="formwork.chargeType!=2">{{formwork.chargeType==1?'续件/个':'续重/kg'}}</td>
              <td v-if="formwork.chargeType!=2">续费/元</td>
            </tr>
            <tr v-if="formwork.chargeType!=2" v-for="(postageModelRule,index) in formwork.postageModelRules">
              
              <th scope="row">{{postageModelRule.defaultFlag==0 ?'全国（默认运费）':postageModelRule.address}}</th>
              
              <td>{{formwork.chargeType==1?postageModelRule.firstPiece:postageModelRule.firstWeight}}</td>
              <td>{{postageModelRule.firstPostage}}</td>
              <td>{{formwork.chargeType==1?postageModelRule.continuedPiece:postageModelRule.continuedWeight}}</td>
              <td>{{postageModelRule.continuedPostage}}</td>
            </tr>
            <tr v-if="formwork.chargeType==2">
              <th>全国（默认运费）</th>
              <td colspan="4" v-if="formwork.chargeType==2">0.00</td>
            </tr>
          </tbody>
        </table>
      </template>
      
    </template>
    <!--是否删除  弹框-->
    <div class="hptczp" v-show="deleteShow===true"></div>
    <div class="hptczp_content" v-show="deleteShow" >
      <div class="hptczp_header">
        <span>提示</span>
        <span class="iconfont fr" @click="deleteShow=false">&#xe661;</span>
        <!-- <span class="fr" @click="deleteShow=false">X</span> -->
      </div>
      <div class="hptczp_body"><h5>是否删除运费模板？</h5></div>
      <div class="hptczp_footer">
        <el-button size="medium" class="cancel" @click="deleteShow=false">取消</el-button>
        <el-button type="primary" size="medium" @click="deleted()">确认</el-button>
        <!-- <button type="button" class="btn save" @click = "deleted()">确认</button>
        <button type="button" class="btn cancel" @click="deleteShow=false">取消</button> -->
      </div>
    </div>
  </div>

</template>
<script>
export default {

  name: '',
  data () {
    return {
      formworks: [1],
      formworkId:'',
      deleteShow:false,
      dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
    }
  },
  created () {
    this.getTemplate()
  },
  methods: {
    goAdd(){
      this.$router.push({ name:'formworkadd', query: {addModify: 'true'}})
    },
    showdelete (modelId) {
      var that = this;
      that.formworkId = modelId;
      that.deleteShow = true;
    },
    deleted(){
        var that = this;
        that.delectModel (that.formworkId)
        that.deleteShow = false
    },
    delectModel (n) {
      // alert((sessionStorage.getItem('mUser')).dealerId)
      let that = this
      that.$.ajax({
        method: 'delete',
        url: this.localbase + 'm2c.scm/web/postage?dealerId=' + that.dealerId +'&modelId=' + n,
        data: {
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          if (result.status==200){
            // that.show_tip("删除成功")
            that.$message({
              type: 'success',
              message: '删除成功'
            })
            that.getTemplate()
          } else {
            that.show_tip(result.errorMessage)
          }

        }
      })
    },
    getTemplate () {
      const that = this
      that.$.ajax({
        method: 'get',
        url: this.localbase + 'm2c.scm/web/postage',
        data: {
          token: sessionStorage.getItem('mToken'),
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          that.formworks = result.content
        }
      })
    },
    goto (event) {
      let that = this
      that.$goRoute({path: 'formworkadd'})
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.building{
  font-size:20px;color:#666;
  padding:240px 0;
  line-height:40px;
  margin-top:100px;
  text-align: center;
  background:url(../../../assets/images/image_repair.png) no-repeat center top;
}
.sz{
    .add{
      margin: 31px 44px 5px 0;
    }
    .table{
      width:100%;
      margin-top: 20px;
      tr{
        th{
          font-weight:normal;
          border: 0px solid transparent;
          border-bottom:1px solid #e6ebf5
        }
        th.act{
          color: blue !important;
          cursor: pointer;
        }
        th.some{
          cursor: pointer;
        }
        td{font-weight:normal;}
      }
      thead tr.active th{background:#DFE9F6}
      tbody tr.active th{background:#f4f5fa}
    }
}

.agreetc_content,.refuse_content,.TowAgreeshow_content {
  width: 400px;
  height: 280px;
  background: #fff;
  z-index: 9999;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -180px;
  background: #FFFFFF;
  border-radius: 4px;
  .agreetc_header, .refuse_header {
    width: 100%;
    height: 50px;
    background: #DFE9F6;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 16px;
    span {
      display: inline-block;
      line-height: 50px;
    }
    span.fr{
      cursor: pointer;
    }
  }
}
.agreetc_header,.refuse_header{
  width:100%;
  height: 50px;
  background: #DFE9F6;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 16px;
  span{
    display: inline-block;
    line-height: 50px;
  }
  span.fr{
    cursor: pointer;
  }
}
.fr{
  float: right;
}
.agreetc_body{
  padding-left: 20px;
  padding-right: 20px;
  background: #FFFFFF;
  margin-top: 10px;
  text-align: center;
  font-size: 20px;
  color: #333333;
  line-height: 150px;
}
.agreetc_footer,.refuse_footer{
  height: 80px;
  padding-top: 10px;
  padding-left: 50%;
  .btn {
    width: 80px;
    height: 30px;
    border: none;
    border-radius: 2px;
    color: #fff;
  }

  .save {
    margin-left: -110px;
    background: #0086FF;
  }
  .cancel {
    margin-left: 40px;
    background: #FFF;
    border: 1px solid #CCCCCC;
    color: #444;
  }

}
</style>

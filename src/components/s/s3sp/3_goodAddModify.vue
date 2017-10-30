<template>
  <div class="infoBox">
    <el-row>
      <el-col :span="24"><div class="grid-content">基本信息</div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><div class="grid-content"><i class="Danger">*</i>商品名称</div></el-col>
      <el-col :span="7"><div class="grid-content"><el-input v-model="input" placeholder="请输入内容"></el-input></div></el-col>
      <el-col :span="4" :offset="2"><div class="grid-content">商品副标题</div></el-col>
      <el-col :span="7"><div class="grid-content"><el-input v-model="input" placeholder="请输入内容"></el-input></div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><i class="Danger">*</i>商品分类</el-col>
      <el-col :span="7">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2"></el-col>
      <el-col :span="4" :offset="2"><i class="Danger">*</i>商品品牌</el-col>
      <el-col :span="7"><div class="grid-content"><el-input v-model="input" placeholder="请输入内容"></el-input></div></el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    },
    created() {},
    watch: {
      
    },
    methods: {

    },
    mounted(){
      let that = this
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.operate/address/getinner.web',
        success: function (result) {
          that.datas = result.content.subs
        }
      })
      if (that.$route.query.addModify === true) {
        console.log('add')
        that.addModify = 'add'
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/postage/id',
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.modelId = result.content
          }
        })
      } else {
        console.log('modify')
        that.addModify = 'modify'
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/postage/' + that.$route.query.modelId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.formwork = result.content
            console.warn(that.formwork.postageModelRules)
          }
        })
      }
    }
  }
</script>
<style scoped>
.infoBox{width:90%}
  .el-row {
    margin-bottom: 20px;width:80%;margin-left:5%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

<template>
  <div class="addMess">
    <form class="form-horizontal" id="temMess">
      <div class="form-group">
        <label class="col-sm-2 control-label">*运费模板名称：</label>
        <div class="col-sm-3">
          <input type="text" class="form-control" placeholder="1-20字符" v-model="formwork.modelName" >
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">*计费方式：</label>
        <div class="col-sm-3">
          <form>
            <input name="tem" type="radio" value='0' v-model="formwork.chargeType" id="tem" /><label for="tem">按重量</label>
            <input name="tem" type="radio" value='1' v-model="formwork.chargeType" id="tem1" /><label for="tem1">按件数</label>
          </form>
        </div>
      </div>
      <!--按重量-->
      <template v-if="formwork.chargeType==0">
        <div class="form-group">
          <label class="col-sm-2 control-label">*运费计算规则：</label>
          <div class="col-sm-8">
            <table class="table table-bordered">
              <thead>
                <tr class="active">
                  <th style="width:210px">可配送至</th>
                  <th>首重/kg</th>
                  <th>运费/元</th>
                  <th>续重/kg</th>
                  <th>续费/元</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <template v-for="(postageModelRule,index) in formwork.postageModelRules">
                    <td v-if="addModify==='add'">全国（默认运费）</td>
                    <td v-if="addModify==='modify'">{{postageModelRule.address}}</td>
                    <td>
                      <input type="text" style="width:50px;height:30px;" v-model="postageModelRule.firstWeight">
                    </td>
                    <td>
                      <input type="text" style="width:50px;height:30px;" v-model="postageModelRule.firstPostage">
                    </td>
                    <td>
                      <input type="text" style="width:50px;height:30px;" v-model="postageModelRule.continuedWeight">
                    </td>
                    <td>
                      <input type="text" style="width:50px;height:30px;" v-model="postageModelRule.continuedPostage">
                    </td>
                    <td></td>
                  </template>
                </tr>
                <tr v-for="(addRow,index) in addRows" v-if="addRows.length!==0">
                  <td class="relative">未添加地区<a @click="addressCheckBox(index,$event)">编辑</a>
                  <!--地区选择-->
                    <div class="cityBox">
                      <h4>选择地区<a class="close" @click="cityBoxHide">X</a></h4>
                      <div class="test-div"></div>
                    </div>
                  </td>
                  <td>
                    <input type="text" style="width:50px;height:30px;" v-model="addRow.firstWeight">
                  </td>
                  <td>
                    <input type="text" style="width:50px;height:30px;" v-model="addRow.firstPostage">
                  </td>
                  <td>
                    <input type="text" style="width:50px;height:30px;" v-model="addRow.continuedWeight">
                  </td>
                <td>
                    <input type="text" style="width:50px;height:30px;" v-model="addRow.continuedPostage">
                  </td>
                  <td @click="delectRule(index)">删除</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          <p style="padding-left:290px;color:blue;cursor:pointer;" @click="addRow()">为制定地区设置运费</p>
          <div class="form-group">
            <label class="col-sm-2 control-label">模板说明：</label>
            <div class="col-sm-6">
              <textarea class="form-control" cols="80" rows="7" placeholder="1-200字符" style="resize:none;"></textarea>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="submit" class="btn btn-info btn-lg save" @click="goto()">保存</button>
              <button type="submit" class="btn btn-default btn-lg">取消</button>
            </div>
          </div>
      </template>
      <!--按件数-->
      <template v-if="formwork.chargeType==1">
        <div class="form-group">
          <label class="col-sm-2 control-label">*运费计算规则：</label>
          <div class="col-sm-8">
            <table class="table table-bordered">
              <thead>
                <tr class="active">
                  <th scope="row" style="width：210px;">可配送至</th>
                  <th>首件/个</th>
                  <th>运费/元</th>
                  <th>续件/个</th>
                  <th>续费/元</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <template v-for="(postageModelRule,index) in formwork.postageModelRules">
                    <td scope="row" v-if="addModify==='add'">全国（默认运费）</td>
                    <td scope="row" v-if="addModify==='modify'">{{postageModelRule.address}}</td>
                    <td>
                      <input type="text" style="width：79px;height:30px;" v-model="postageModelRule.firstPiece">
                    </td>
                    <td>
                      <input type="text" style="width：79px;height:30px;" v-model="postageModelRule.firstPostage">
                    </td>
                    <td>
                      <input type="text" style="width：79px;height:30px;" v-model="postageModelRule.continuedPiece">
                    </td>
                    <td>
                      <input type="text" style="width：79px;height:30px;" v-model="postageModelRule.continuedPostage">
                    </td>
                    <td></td>
                  </template>
                </tr>
                <tr v-for="(addRow,index) in addRows" v-if="addRows.length!==0">
                  <td scope="row" class="relative">未添加地区<span @click="addressCheckBox(index,$event)">编辑</span>
                  <!--地区选择-->
                    <div class="cityBox">
                      <h4>选择地区<a class="close" @click="cityBoxHide">X</a></h4>
                    </div>
                  </td>
                  <td>
                    <input type="text" style="width：79px;height:30px;" v-model="addRow.firstPiece">
                  </td>
                  <td>
                    <input type="text" style="width：79px;height:30px;" v-model="addRow.firstPostage">
                  </td>
                  <td>
                    <input type="text" style="width：79px;height:30px;" v-model="addRow.continuedPiece">
                  </td>
                <td>
                    <input type="text" style="width：79px;height:30px;" v-model="addRow.continuedPostage">
                  </td>
                  <td @click="delectRule(index)">删除</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          <p style="padding-left:290px;color:blue;cursor:pointer;" @click="addRow()">为制定地区设置运费</p>
          <div class="form-group">
            <label class="col-sm-2 control-label">模板说明：</label>
            <div class="col-sm-6">
              <textarea class="form-control" cols="80" rows="7" placeholder="1-200字符" style="resize:none;" v-model="formwork.modelDescription"></textarea>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="submit" class="btn btn-info btn-lg save" @click="goto()">保存</button>
              <button type="submit" class="btn btn-default btn-lg">取消</button>
            </div>
          </div>
      </template>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      type: 'normal',
      formwork: {chargeType: 0, postageModelRules: [{firstWeight: '', firstPiece: '', firstPostage: '', continuedWeight: '', continuedPiece: '', continuedPostage: ''}]},
      addRows: [],
      addModify: 'add',
      chargeType: 0
      // IdArr: [102,201001,202002,203003,2021,2022],
      // datas:[{
      //       id: 1,
      //       name: "华北北京",
      //       children:[{
      //           id: 101,
      //           name: "北京"
      //       },{
      //           id: 102,
      //           name: "天津"
      //       },{
      //           id: 103,
      //           name: "河北",
      //           children:[{
      //               id: 103001,
      //               name:"石家庄"
      //           },{
      //               id: 103002,
      //               name:"保定"
      //           },{
      //               id: 103003,
      //               name:"承德"
      //           }]
      //       }]
      //   },{
      //       id: 2,
      //       name: "华中",
      //       children:[{
      //           id: 201,
      //           name: "河南",
      //           children:[{
      //               id: 201001,
      //               name:"郑州市"
      //           },{
      //               id: 202002,
      //               name:"南阳市"
      //           },{
      //               id: 203003,
      //               name:"洛阳市"
      //           }]
      //       },{
      //           id: 202,
      //           name: "湖北",
      //           children:[{
      //               id: 2021,
      //               name:"武汉市"
      //           },{
      //               id: 2022,
      //               name:"黄石市"
      //           },{
      //               id: 2023,
      //               name:"十堰市"
      //           }]
      //       },{
      //           id:203,
      //           name: "湖南",
      //           children:[{
      //               id:2031,
      //               name:"长沙市"
      //           },{
      //               id:2032,
      //               name:"株洲市"
      //           },{
      //               id:2033,
      //               name:"衡阳市"
      //           }]
      //       }]
      //   }]
    }
  },
  created () {
  },
  methods: {
    // 新增行
    addRow () {
      let newRow = {firstWeight: '', firstPiece: '', firstPostage: '', continuedWeight: '', continuedPiece: '', continuedPostage: ''}
      this.addRows.push(newRow)
    },
    // 删除行
    delectRule (index) {
      this.addRows.splice(index, 1)
    },
    // 显示地区选择盒子
    addressCheckBox (index, $event) {
      let that = this
      var el = event.target
      that.$(el).parents('.table').find('.cityBox').eq(index).toggle()
    },
    // 隐藏地区选择盒子
    cityBoxHide () {
      this.$('.table').find('.cityBox').hide()
    }
  },
  mounted () {
    let that = this
    console.warn(that.$route.query.addModify)
    if (that.$route.query.addModify === 'true') {
      that.addModify = 'add'
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/postage/id',
        data: {
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.formwork.modelId = result.content
        }
      })
    } else if (that.$route.query.addModify === 'false') {
      that.addModify = 'modify'
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/postage/' + that.$route.query.modelId,
        data: {
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.formwork = result.content
        }
      })
    }
  }
}
</script>
<style scoped>
  .addMess{
    margin-top: 168px;
  }
  td.relative{position:relative;}
  td.relative a{display:block;float:right; margin-right:10px;}
  .cityBox{display:none;width:500px;height:400px;background:#fff;border:1px solid #ccc;position:absolute;
  top:40px;left: -150px;z-index:2;}
  .cityBox h4{width:100%;height:40px;background:#ededed;line-height:40px;text-indent:20px;}
  .cityBox h4 a.close{float:right;margin-right:10px;}
</style>


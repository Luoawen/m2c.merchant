<template>
  <div class="infoBox">
    <el-row>
      <el-col :span="24"><h4>基本信息</h4></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><i class="Danger">*</i>商品名称</el-col>
      <el-col :span="7"><el-input v-model="data.goodsName" placeholder="请输入内容"></el-input></el-col>
      <el-col :span="4" :offset="2">商品副标题</el-col>
      <el-col :span="7"><el-input v-model="data.goodsSubTitle" placeholder="请输入内容"></el-input></el-col>
    </el-row>
    <el-row :gutter="20" style="z-index:2;">
      <el-col :span="4"><i class="Danger">*</i>商品分类</el-col>
      <el-col :span="7" style="height:40px;z-index:2;">
        <el-cascader  :options="goodsClassifys" v-model="selectedOptions1" change-on-select :props="goodsClassifyProps"></el-cascader>
      </el-col>
      <el-col :span="4" :offset="2"><i class="Danger">*</i>商品品牌</el-col>
      <el-col :span="7">
        <el-select v-model="brandId" placeholder="请选择">
          <el-option
            v-for="item in brands"
            :key="item.brandId"
            :label="item.brandName"
            :value="item.brandId">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><i class="Danger">*</i>计量单位</el-col>
      <el-col :span="7">
        <el-select v-model="unitId" placeholder="请选择">
          <el-option
            v-for="item in units"
            :key="item.unitId"
            :label="item.unitName"
            :value="item.unitId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" :offset="2"><i class="Danger">*</i>最小起订量</el-col>
      <el-col :span="7"><el-input v-model="data.goodsMinQuantity" placeholder="请输入内容"></el-input></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"><i class="Danger">*</i>运费模板</el-col>
      <el-col :span="7">
        <el-select v-model="modelId" placeholder="请选择">
          <el-option
            v-for="item in models"
            :key="item.modelId"
            :label="item.modelName"
            :value="item.modelId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" :offset="2">商品条形码</el-col>
      <el-col :span="7"><el-input v-model="data.goodsBarCode" placeholder="请输入内容"></el-input></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">关键词</el-col>
      <el-col :span="7"><el-input v-model="data.goodsKeyWord" placeholder="请输入内容"></el-input></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">商品保障</el-col>
      <el-col :span="20">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="七天无理由退货"></el-checkbox>
          <el-checkbox label="正品保证"></el-checkbox>
          <el-checkbox label="物流保证"></el-checkbox>
          <el-checkbox label="包装完好"></el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <h4>商品规格</h4>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">商品规格</el-col>
      <el-col :span="21">
        <el-radio v-model="radio" label="1">单一规格</el-radio>
        <el-radio v-model="radio" label="2">多规格</el-radio>
      </el-col>
    </el-row>
    <div class="tabPane" v-if="radio==1">
      <table>
        <thead>
          <tr>
            <th>规格</th>
            <th>*库存</th>
            <th>*重量/kg（个）</th>
            <th>*拍获价/元</th>
            <th>市场价/元</th>
            <th>{{countMode==1?'供货价':'服务费率/%'}}</th>
            <th>商品编码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(good,index) in goods">
            <td>无</td>
            <td>
              <el-input v-model="good.availableNum" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.weight" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.photographPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.marketPrice" placeholder="请输入内容"></el-input>
            </td>
            <td v-if="countMode==1">{{good.serviceRate}}</td>
            <td v-if="countMode==2"><el-input v-model="good.supplyPrice" placeholder="请输入内容"></el-input></td>
            <td>
              <el-input v-model="good.goodsCode" placeholder="请输入内容"></el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tabPane" v-if="radio==2">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>规格</th>
            <th>规格值(鼠标选中或者“回车”可保存新增的规格值)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(format,index) in formats">
            <td><span @click="delect(index)" v-if="formats.length>1">移除</span></td>
            <td>
              <el-select v-model="stantardId" placeholder="请选择">
                <el-option
                  v-for="item in stantards"
                  :key="item.stantardId"
                  :label="item.stantardName"
                  :value="item.stantardId">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-autocomplete
                class="inline-input"
                v-model="state1"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
              <el-button type="primary" @click="specValue(state1)">确定</el-button>
              <el-button>取消</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <el-button type="primary" @click="addRow" v-if="formats.length<3">添加规格</el-button>
      <table>
        <thead>
          <tr>
            <th>规格值</th>
            <th>对外展示</th>
            <th>*库存</th>
            <th>*重量/kg（个）</th>
            <th>*拍获价/元</th>
            <th>市场价/元</th>
            <th>供货价</th>
            <th>商品编码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(good,index) in goods">
            <td>{{good.skuName}}</td>
            <td>
              <el-switch
                v-model="good.showStatus"
                active-color="#13ce66"
                inactive-color="#ccc">
              </el-switch>
            </td>
            <td>
              <el-input v-model="good.availableNum" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.weight" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.photographPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.marketPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.supplyPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.goodsCode" placeholder="请输入内容"></el-input>
            </td>
          </tr>
          <tr>
            <td colspan="2">批量设置</td>
            <td>
              <el-input v-model="good.availableNum" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.weight" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.photographPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.marketPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-input v-model="good.supplyPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-button>确定</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-row>
      <el-col :span="24"><h4>商品详情</h4></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">商品主图</el-col>
      <el-col :span="21">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :auto-upload=false >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <p class="marginTop20">最多上传5张主图，可以通过拖曳图片调整顺序</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">图文详情</el-col>
      <el-col :span="21" style="height:400px;">
        <div id="editor-container">
          <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><h4>设置上架</h4></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">*设置上架</el-col>
      <el-col :span="21">
        <el-radio v-model="data.goodsShelves" label="1">手动上架</el-radio>
        <p>平台审核通过后，商家需手动上架商品</p>
        <el-radio v-model="data.goodsShelves" label="2">审核通过立即上架</el-radio>
        <p>平台审核通过，商品自动上架，无需商家操作</p>
      </el-col>
    </el-row>
    <el-button type="primary">提交审核</el-button>
    <el-button type="primary">保存</el-button>
    <el-button>取消</el-button>
  </div>
</template>
<script>
  import UE from '../../../subcomponents/ue.vue'
  export default {
    components: {UE},
    data() {
      return {
        countMode:'', // 商家结算方式 1：按供货价 2：按服务费率
        checkList: ['七天无理由退货'],
        radio: '1',
        goods: [{skuName: 'L,蓝色', showStatus: '1', availableNum: '200', weight: '2', photographPrice: '400', marketPrice:'500', serviceRate: '5%', goodsCode: '1111111'},{skuName: 'L,蓝色', showStatus: '1', availableNum: '200', weight: '2', photographPrice: '400', marketPrice:'500', supplyPrice: '400', goodsCode: '1111111'}],
        good: {availableNum: '', weight: '', photographPrice: '', marketPrice:'', supplyPrice: ''},
        restaurants: [],
        state1: '',
        state2: '',
        data: {goodsName:'',goodsMinQuantity:'',goodsBarCode:'',goodsKeyWord:'',goodsShelves:'1',goodsClassifyId:''},
        options: [{value:'选项一',label:'选项一'},{value:'选项二',label:'选项二'},{value:'选项三',label:'选项三'}],
        value:'',
        formats:[{options: [{value:'选项一',label:'选项一'},{value:'选项二',label:'选项二'},{value:'选项三',label:'选项三'}]}],dynamicTags: ['标签一', '标签二', '标签三'],
        dialogImageUrl: '',
        dialogVisible: false,
        // 富文本编辑
        defaultMsg: 'ssssss',
        config: {
          initialFrameWidth: 700,
          initialFrameHeight: 300
        },
        handle_toggle:this.$route.query.isAdd, // 是否来自新增
        goodsId: '', // 获取的商品Id
        brandId: '', // 品牌ID
        brands: [], // 品牌列表
        unitId: '', // 计量单位ID
        units: [], // 计量单位列表
        modelId: '', // 模板ID
        models: [], // 模板列表
        stantardId: '',
        stantards: [], // 规格
        classifyId: '',
        classifys:[{
                    "parentClassifyId":"-1",
                    "classifyId":"SPFLA5BDED943A1D42CC9111B3723B0987BF",
                    "serviceRate":null,
                    "subClassify":[
                        {
                            "parentClassifyId":"SPFLA5BDED943A1D42CC9111B3723B0987BF",
                            "classifyId":"SPFL24DA77DDD22B49F8AFB50829E14FB6A3",
                            "serviceRate":null,
                            "classifyName":"短袖"
                        },
                        {
                            "parentClassifyId":"SPFLA5BDED943A1D42CC9111B3723B0987BF",
                            "classifyId":"SPFL24E123B9B3E84B6287735B7BB0C39336",
                            "serviceRate":null,
                            "subClassify":[
                                {
                                    "parentClassifyId":"SPFL24E123B9B3E84B6287735B7BB0C39336",
                                    "classifyId":"SPFL5BA8FC215D7541BEB4D2EA2B4101505B",
                                    "serviceRate":null,
                                    "classifyName":"长裙"
                                },
                                {
                                    "parentClassifyId":"SPFL24E123B9B3E84B6287735B7BB0C39336",
                                    "classifyId":"SPFL0E88D51410E1471295EA75841AC7BBBE",
                                    "serviceRate":null,
                                    "classifyName":"短裙"
                                }
                            ],
                            "classifyName":"裙子"
                        }
                    ],
                    "classifyName":"服装"
                },
                {
                    "parentClassifyId":"-1",
                    "classifyId":"SPFL25CE5FF3635A4A31ABEDFB548C6D82E4",
                    "serviceRate":null,
                    "subClassify":[
                        {
                            "parentClassifyId":"SPFL25CE5FF3635A4A31ABEDFB548C6D82E4",
                            "classifyId":"SPFL4032491809004CD79ABAE91B2BE90360",
                            "serviceRate":null,
                            "classifyName":"牛奶"
                        },
                        {
                            "parentClassifyId":"SPFL25CE5FF3635A4A31ABEDFB548C6D82E4",
                            "classifyId":"SPFLA91971C239A04219A99347412D160D0C",
                            "serviceRate":null,
                            "classifyName":"面包"
                        }
                    ],
                    "classifyName":"食品"
                }
        ],
        goodsClassifys:[],
        goodsClassifyProps: {
          value: 'classifyId',
          children: 'subClassify',
          label:'classifyName',
        },
        selectedOptions1: [''],
        dLabel1: false,
        dLabel2: false,
        dLabel3: false
      }
    },
    created() {},
    watch: {
      
    },
    methods: {
      // 添加规格值
      specValue (state1) {
        let that = this
        that.$.ajax({
          type: 'post',
          url: that.localbase + 'm2c.scm/goods/spec/value',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            specValue: state1
          },
          success: function (result) {
            that.dynamicTags.push(state1)
          }
        })
      },
      // 获取商品分类 
      goodsClassify () {//商品分类树
        let that = this
        that.$.ajax({
          type: 'GET',
          url: that.localbase + 'm2c.scm/goods/classify/tree',
          data: {parentClassifyId:-1},
          success: function (result) {
            that.goodsClassifys=result.content;
            that.goodsClassifys.unshift({"parentClassifyId":'',"classifyId":'',"serviceRate":'',"classifyName":"全部" });
          }
        })
      },
      secondClassifyShow1 () {
        let that = this
        that.dLabel1 = true
        that.dLabel2 = true
      },
      secondClassifyShow2 () {
        let that = this
        that.dLabel1 = true
        that.dLabel2 = true
        that.dLabel3 = true
      },
      outHide1 () {
        let that = this
        that.dLabel1 = false
      },
      overShow1 () {
        let that = this
        that.dLabel1 = true
      },
      firstClassifyShow1 () {
        this.dLabel1 = true
      },
      // 商品分类
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleCloseS(key, keyPath) {
        console.log(key, keyPath);
      },
      // 照片墙
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 规格小标签移除
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      // 删除规格行
      delect (index) {
        this.formats.splice(index, 1)
      },
      addRow(){
        let newRow = {
          options: [],
          dynamicTags: []
        }
        this.formats.push(newRow)
      },
      // 改变单多规则
      changeValue ($event) {
        let that = this
        if(that.valueswitch2 === false){
          that.valueswitch2 = true
          that.single = false
          that.couplue = true
        } else if(that.valueswitch2 === true) {
          that.valueswitch2 = false
          that.single = true
          that.couplue = false
        }
      },
      // 搜索建议
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          // { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          // { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          // { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          // { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          // { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
        ];
      },
      handleSelect(item) {
        console.log(item);
      }
    },
    mounted(){
      let that = this
      that.goodsClassify()
      that.restaurants=[
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
        ]
      alert("规格值"+that.restaurants)
      // 获取规格值
      // that.$.ajax({
      //   type: 'get',
      //   url: that.localbase + 'm2c.scm/goods/spec/value',
      //   data:{
      //     token: sessionStorage.getItem('mToken'),
      //     dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
      //   },
      //   success: function (result) {
      //     that.restaurants = result.content
      //   }
      // })
      // 获取规格
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/stantard',
        data:{
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.stantards = result.content
        }
      })
      // 获取商家结算模式
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/dealer/sys/' + JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        data:{
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.countMode = result.content.countMode
        }
      })
      // 获取商品品牌
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/brand',
        data:{
          token: sessionStorage.getItem('mToken'),
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          that.brands = result.content
        }
      })
      // 获取计量单位
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/unit',
        data:{
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.units = result.content
        }
      })
      // 获取运费模板列表
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/postage',
        data:{
          token: sessionStorage.getItem('mToken'),
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          that.models = result.content
        }
      })
      if (that.handle_toggle === 'add') {
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/goods/approve/id',
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.goodsId = result.content
          }
        })
      } else {
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/goods/' + that.$route.query.goodsId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.data = result.content
            console.warn(that.data)
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .dropdown1{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      z-index:999999999999999;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
      }
      .dropdown-menu,.dropdown1-menu {
        li{
          line-height: 30px;
          padding-left: 25px;
          position: relative;
          i{
            font-size: 10px;
            color: gray;
            padding-left: 15px;
            position: absolute;
            top: 8px;
            right: 19px;
          }
        }
      }
      .dropdown1-menu{
        position: relative;
        top:0;
      }
        .dropdown1-menu>li{
          width:120px;height:40px;background:#F56C6C;
        }
        .dropdown1-menu>li:hover{
          background:#f65ffC;
        }
        .dropdown1-menu>li .dropdown1-menuSecond{display:none;
          .dropdown1-menuTired{display:none;}
        }
        .dropdown1-menu>li:hover .dropdown1-menuSecond{
          display:block;
          position: absolute;
          left: 119px;top:0;
          li{
            width:120px;height:40px;background:#18DCF6;
            position: relative;
          }
          li:hover{
            background:#14DCc6;
          }
        }
        .dropdown1-menuSecond>li:hover .dropdown1-menuTired{
          display:block;
          position: absolute;
          left: 119px;top:0;
          li{
            width:120px;height:40px;background:#18DCF6;
            position: static;
          }
          li:hover{
            background:#14DCc6;
          }
        }
    }
  .marginTop20{margin-top:20px;}
  .el-upload--picture-card{overflow: hidden;}
  .infoBox{width:96%; margin:20px 2%;background:#fff;padding:20px 3%;float:left;}
  .infoBox h4{color:#333;line-height:30px;margin-left:-5%;}
  .el-row {
    margin-bottom: 20px;width:80%;margin-left:4%;
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
  .tabPane table{width:100%; line-height:60px; text-align: center;margin-top:20px;margin-bottom:20px;}
  .tabPane table th{
    background:#DFE9F6;text-align: center;
  }
  .tabPane table tr:nth-child(2n+1) td{
    background:#F4F5FA;
  }
  .tabPane table tr:nth-child(2n) td{
    background:#EDF0F7;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>
<style>
.el-upload--picture-card{overflow: hidden;}
 table .el-input__inner{width:100px;}
</style>
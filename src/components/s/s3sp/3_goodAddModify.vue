<template>
  <div class="infoBox">
    <el-row>
      <el-col :span="24"><h4>基本信息</h4></el-col>
    </el-row>
    <el-form :model="data" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="data.goodsName" placeholder="1-50字符"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品副标题" prop="goodsSubTitle">
            <el-input v-model="data.goodsSubTitle" placeholder="1-100字符"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="z-index:2;">
        <el-col :span="11" style="height:40px;z-index:2;">
          <el-form-item label="商品分类" prop="goodsClassifyId">
            <el-cascader expand-trigger="hover" :options="goodsClassifys" v-model="data.goodsClassifyIds" :props="goodsClassifyProps" @change="handleChange"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品品牌" prop="goodsBrandId">
            <el-select v-model="data.goodsBrandId" placeholder="请选择">
              <el-option
                v-for="item in brands"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="计量单位" prop="goodsUnitId">
            <el-select v-model="data.goodsUnitId" placeholder="请选择">
              <el-option
                v-for="item in units"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="最小起订量" prop="goodsMinQuantity">
            <el-input v-model="data.goodsMinQuantity" placeholder="请输入内容" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="运费模板" prop="goodsPostageId">
            <el-select v-model="data.goodsPostageId" placeholder="请选择">
              <el-option
                v-for="item in models"
                :key="item.modelId"
                :label="item.modelName"
                :value="item.modelId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品条形码">
            <el-input v-model="data.goodsBarCode" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="关键词">
            <el-input v-model="data.goodsKeyWord" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form-item label="商品保障">
          <el-checkbox-group v-model="goodsGuarantCheck">
            <el-checkbox v-for="(guarantee,index) in goodsGuaranteeList" :key="guarantee.guaranteeId" :label="guarantee.guaranteeId">{{guarantee.guaranteeDesc}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <el-row>
        <el-col>
          <h4>商品规格</h4>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">商品规格</el-col>
        <el-col :span="21">
          <el-radio v-model="data.skuFlag" label="0" id="skuFlag0" @change="clearSKU">单一规格</el-radio>
          <el-radio v-model="data.skuFlag" label="1" id="skuFlag1" @change="clearGoodsSKUs">多规格</el-radio>
        </el-col>
      </el-row>
      <div class="tabPane" v-if="data.skuFlag==0">
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
              <tr v-for="(good,index) in goodsSKUs">
                <td>无</td>
                <td>
                    <el-input v-model="good.availableNum" placeholder="请输入内容" type="number" @blur="checkInteger(good.availableNum,index,'availableNum',goodsSKUs)"></el-input>
                </td>
                <td>
                    <el-input v-model="good.weight" placeholder="请输入内容" type="number" @blur="checkNumber(good.weight,index,'weight',goodsSKUs)"></el-input>
                </td>
                <td>
                    <el-input v-model="good.photographPrice" placeholder="请输入内容" type="number" @blur="checkNumber(good.photographPrice,index,'photographPrice',goodsSKUs)"></el-input>
                </td>
                <td>
                  <el-input v-model="good.marketPrice" placeholder="请输入内容" type="number" @blur="checkNumber(good.marketPrice,index,'marketPrice',goodsSKUs)"></el-input>
                </td>
                <td v-if="countMode==1"><el-input v-model="good.supplyPrice" placeholder="请输入内容" type="number" @blur="checkNumber(good.supplyPrice,index,'supplyPrice',goodsSKUs)"></el-input></td>
                <td v-if="countMode==2">{{serviceRate}}</td>
                <td>
                  <el-input v-model="good.goodsCode" placeholder="请输入内容"></el-input>
                </td>
              </tr>
            </tbody>
        </table>
        <i v-if="sukShow" style="color:red; font-style:normal;">商品库存/重量/拍获价不能为空</i>
        <i v-if="sukShow1" style="color:red; font-style:normal;">商品重量/拍获价不能为负数</i>
        <i v-if="sukShow2" style="color:red; font-style:normal;">商品库存请输入正整数</i>
      </div>

      <div class="tabPane" v-if="data.skuFlag==1">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>规格</th>
              <th>规格值(鼠标选中或者“回车”可保存新增的规格值)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in goodsSpecifications">
              <td><span @click="delect(index)" v-if="goodsSpecifications.length>1 && handle_toggle=='add'">移除</span></td>
              <td>
                <el-select v-model="item.standardId" placeholder="请选择" @change="stantardIdChange(item,index)" :disabled="disabled">
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
                  v-for="tag in item.itemValue"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag.spec_name,index)">
                  {{tag.spec_name}}
                </el-tag>
                <el-autocomplete
                  class="inline-input"
                  v-model="item.state1"
                  @focus='query(item.standardId)'
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect(item.standardId)"
                  @keyup.enter.native="specValueClick(item.state1,index)"
                ></el-autocomplete>
                <el-button type="primary" @click="specValueClick(item.state1,index)">确定</el-button>
                <i style="color:red; font-style:normal;" v-if="standardIdShow">请先选择规格</i>
              </td>
            </tr>
          </tbody>
        </table>
        <el-button type="primary" @click="addRow" v-if="goodsSpecifications.length<3 && handle_toggle=='add'" >添加规格</el-button>
        <table>
          <thead>
            <tr>
              <th>规格值</th>
              <th>对外展示</th>
              <th>*库存</th>
              <th>*重量/kg（个）</th>
              <th>*拍获价/元</th>
              <th>市场价/元</th>
              <th>{{countMode==1?'供货价':'服务费率/%'}}</th>
              <th>商品编码</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(good,index) in goodsSKUs">
              <td>{{good.skuName}}</td>
              <td>
                <el-switch
                  v-model="good.show"
                  active-color="#13ce66"
                  inactive-color="#ccc">
                </el-switch>
              </td>
              <td>
                  <el-input v-model="good.availableNum" placeholder="请输入内容" type="number" @blur="checkInteger(good.availableNum,index,'availableNum',goodsSKUs)"></el-input>
              </td>
              <td>
                  <el-input v-model="good.weight" placeholder="请输入内容" type="number" @blur="checkNumber(good.weight,index,'weight',goodsSKUs)"></el-input>
              </td>
              <td>
                  <el-input v-model="good.photographPrice" placeholder="请输入内容" type="number" @blur="checkNumber(good.photographPrice,index,'photographPrice',goodsSKUs)"></el-input>
              </td>
              <td>
                <el-input v-model="good.marketPrice" placeholder="请输入内容" type="number" @blur="checkNumber(good.marketPrice,index,'marketPrice',goodsSKUs)"></el-input>
              </td>
              <td v-if="countMode==1"><el-input v-model="good.supplyPrice" placeholder="请输入内容" type="number" @blur="checkNumber(good.supplyPrice,index,'supplyPrice',goodsSKUs)"></el-input></td>
              <td v-if="countMode==2">{{serviceRate}}</td>
              <td>
                <el-input v-model="good.goodsCode" placeholder="请输入内容"></el-input>
              </td>
            </tr>
            <tr v-if="goodsSKUs.length!=0">
              <td colspan="2">批量设置</td>
              <td>
                <el-input v-model="setUp.availableNum" placeholder="请输入内容"></el-input>
              </td>
              <td>
                <el-input v-model="setUp.weight" placeholder="请输入内容"></el-input>
              </td>
              <td>
                <el-input v-model="setUp.photographPrice" placeholder="请输入内容"></el-input>
              </td>
              <td>
                <el-input v-model="setUp.marketPrice" placeholder="请输入内容"></el-input>
              </td>
              <td v-if="countMode==2">{{serviceRate}}</td>
              <td v-if="countMode==1">
                <el-input v-model="setUp.supplyPrice" placeholder="请输入内容"></el-input>
              </td>
              <td>
                <el-button @click="setUpSure">确定</el-button>
              </td>
            </tr>
          </tbody>
        </table>
        <i v-if="sukShow" style="color:red; font-style:normal;">商品库存/重量/拍获价不能为空</i>
        <i v-if="sukShow1" style="color:red; font-style:normal;">商品重量/拍获价不能为负数</i>
        <i v-if="sukShow2" style="color:red; font-style:normal;">商品库存请输入正整数</i>
      </div>
      <el-row>
        <el-col :span="24"><h4>商品详情</h4></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3"><i style="color:red;">* </i>商品主图</el-col>
        <el-col :span="21" id="dragImg">
          <el-upload
            :action="uploadUrl" name="img"
            list-type="picture" :on-success="success" :data="upLoadData" :file-list="fileList"
            show-file-list :limit=5 :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove" >
            <i class="el-icon-plus"></i>
          </el-upload>
          <i v-if="imgShowList" style="color:red; font-style:normal;">商品主图不能为空</i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset=2 :span=21 >
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
      <el-row v-if="handle_toggle=='add'">
        <el-col :span="24"><h4>设置上架</h4></el-col>
      </el-row>
      <el-row :gutter="20" v-if="handle_toggle=='add'">
        <el-col :span="3"><i style="color:red;">* </i>设置上架</el-col>
        <el-col :span="21">
          <el-radio v-model="data.goodsShelves" label="1">手动上架</el-radio>
          <p>平台审核通过后，商家需手动上架商品</p>
          <el-radio v-model="data.goodsShelves" label="2">审核通过立即上架</el-radio>
          <p>平台审核通过，商品自动上架，无需商家操作</p>
        </el-col>
      </el-row>
    <el-button v-if="handle_toggle=='add'" type="primary" @click="save('ruleForm')">提交审核</el-button>
    <el-button v-if="handle_toggle!='add'" type="primary" @click="save('ruleForm')">保存修改</el-button>
    <el-button @click="goBack">取消</el-button>
  </div>
</template>
<script>
  import UE from '../../../subcomponents/ue.vue'
  import validatorUtils from '../../../commonutils/validatorUtils'
  export default {
    components: {UE},
    data() {
      // 校验最小起订量不能为非整数
        var checkGoodsMinQuantity = (rule, value, callback) => {
          var reg = /^[1-9]\d*$/;
          if (!value) {
            return callback(new Error('最小起订量不能为空'));
          }
          setTimeout(() => {
            if (!reg.test(value)) {
              callback(new Error('必须为正整数'));
            } else {
              callback();
            }
          }, 1000);
        };
      return {
        ruleForm: {
          goodsName: '',
          goodsSubTitle: '',
          goodsClassifyId: '',
          goodsBrandId: '',
          goodsUnitId: '',
          goodsMinQuantity: '',
          goodsPostageId: ''
        },
        rules: {
          goodsClassifyId: [
            { required: true, message: '请选择商品分类', trigger: 'change' }
          ],
          goodsName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          goodsSubTitle: [
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
          ],
          goodsBrandId: [
            { required: true, message: '请选择商品品牌', trigger: 'change' }
          ],
          goodsUnitId: [
            { required: true, message: '请选择计量单位', trigger: 'change' }
          ],
          goodsMinQuantity: [
            {required: true, validator: checkGoodsMinQuantity, trigger: 'blur' }
          ],
          goodsPostageId: [
            { required: true, message: '请选择运费模板', trigger: 'change' }
          ],

        },
        standardIdShow:false,// 规格不能为空
        sukShow:false, // 商品库不能为空
        sukShow1:false, // 商品库不能为负数 可为小数
        sukShow2:false, // 商品库不能为负数
        imgShowList:false, // 商品主图不能为空
        countMode:'', // 商家结算方式 1：按供货价 2：按服务费率
        radio: '1',
        goods: [],
        // good: {availableNum: '', weight: '', photographPrice: '', marketPrice:'', supplyPrice: ''},
        restaurants: [],
        goodsGuaranteeList:[], // 获取保障详情
        goodsGuarantCheck:[],
        serviceRate:'',
        goodsSKUs:[{show:true,skuName: '', showStatus: true, marketPrice:'', goodsCode: '', supplyPrice: ''}],
        goodsSpecifications:[{itemName:'',itemValue:[],state1:''}],
        goodsMainImages:[],
        goodsGuarantee:[],
        data: {skuFlag: '0' ,goodsMinQuantity:'',goodsBarCode:'',goodsKeyWord:'',goodsShelves:'1',goodsClassifyId:''},
        value:'',
        dynamicTags: [],
        dialogImageUrl: '',
        dialogVisible: false,
        uploadUrl: this.localbase+"m2c.support/img/upload",
        upLoadData:{
          imgGroup:1
        },
        fileList:[],
        // 富文本编辑
        defaultMsg: '',
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
        standardId: '',
        stantards: [], // 规格
        classifyId: '',
        goodsClassifys:[],
        goodsClassifyProps: {
          value: 'classifyId',
          children: 'subClassify',
          label: 'classifyName',
        },
        selectedOptions1: [],
        dLabel1: false,
        dLabel2: false,
        dLabel3: false,
        goodsBrandName: '',
        setUp:{},
        disabled:false //禁用规格选择
      }
    },
    created() {},
    watch: {
      // 监听商品分类以获取费率
      // 监听goodsMainImages的长度
      'goodsMainImages.length':{
        handler: function (val, oldVal) {
          let that = this
          let div = that.$("#dragImg").find("div").find("div")
          if (val == 5) {
            that.$nextTick(function(){
              div.hide()
            })
          }else{
            div.show()
          }
        },
        deep: true
      },
      // 根据品牌ID获取品牌名
      'data.goodsBrandId': {
        handler: function (val, oldVal) {
          let that = this
          if (val != oldVal) {
            that.$.ajax({
              type: 'get',
              url: that.localbase + 'm2c.scm/brand/' +that.data.goodsBrandId,
              data:{
                token: sessionStorage.getItem('mToken')
              },
              success: function (result) {
                that.goodsBrandName=result.content.brandName
                console.log(that.goodsBrandName)
              }
            })
          }
        },
        deep: true
      }
    },
    methods: {
      //验证是否为数字
      checkNumber (val, index, arr, list) {
        setTimeout(() => {
          if (val && $.isNumeric(val) && val >= 0) {
            val = Number(val).toFixed(2)
            this.sukShow1 = false
          } else {
            val = ''
            this.sukShow1 = true
          }
          list[index][arr] = val
        }, 0)
      },
      //验证是否为正整数
      checkInteger (val, index, arr, list) {
        setTimeout(() => {
          var re = /^[0-9]\d*$/
          if (!re.test(val)) {
            list[index][arr] = ''
            this.sukShow2 = true
          }else{
            this.sukShow2 = false
          }
        }, 0)
      },
      stantardIdChange(item,index){
        let that=this
        that.standardId=item.standardId
        for(var i=0;i<that.stantards.length;i++){
          if(that.standardId==that.stantards[i].stantardId){
            that.goodsSpecifications[index].itemName=that.stantards[i].stantardName
          }
        }
        that.restaurants = []
        that.getValue()
        that.standardIdShow = false
      },
      // 清空单规格内值
      clearSKU(){
        let that = this
        that.goodsSKUs=[{show:true,skuName: '', showStatus: true, marketPrice:'', goodsCode: '', supplyPrice: ''}]
      },
      clearGoodsSKUs(){
        let that = this
        that.goodsSKUs=[]
      },
      // 批量设置
      setUpSure(){
        let that = this
        console.log(that.goodsSKUs.length)
        for(var i=0;i<that.goodsSKUs.length;i++){
          that.$set(that.goodsSKUs[i],'availableNum',that.setUp.availableNum)
          that.$set(that.goodsSKUs[i],'weight',that.setUp.weight)
          that.$set(that.goodsSKUs[i],'photographPrice',that.setUp.photographPrice)
          that.$set(that.goodsSKUs[i],'marketPrice',that.setUp.marketPrice)
          that.$set(that.goodsSKUs[i],'supplyPrice',that.setUp.supplyPrice)
        }
      },
      // 取消
      goBack(){
        this.$router.push({name:'goodList'})
      },
      // 提交保存或修改
      save (formName) {
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if(that.goodsMainImages.length<=0){
              that.imgShowList = true
              return
            }
            let liList = document.getElementById('dragImg').getElementsByTagName('li')
            let liLength = liList.length
            // for(var i=0;i<liLength;i++){
            //   that.goodsMainImages.push(that.$(liList[i]).find("img").src)
            //   console.log(that.$(liList[i]).find("img"))
            //   console.log(that.goodsMainImages)
            //   return
            // }
            for(var k=0;k<that.goodsSKUs.length;k++){
              if(that.goodsSKUs[k].availableNum===''||that.goodsSKUs[k].availableNum==undefined||that.goodsSKUs[k].weight===''||that.goodsSKUs[k].weight==undefined||that.goodsSKUs[k].photographPrice===''||that.goodsSKUs[k].photographPrice==undefined){
                that.sukShow = true
                return
              }else{
                that.sukShow = false
                that.goodsSKUs[k].marketPrice=parseFloat(that.goodsSKUs[k].marketPrice*100)
                that.goodsSKUs[k].photographPrice=parseFloat(that.goodsSKUs[k].photographPrice*100)
                that.goodsSKUs[k].showStatus=that.goodsSKUs[k].show
                if(that.countMode==1){
                  that.goodsSKUs[k].supplyPrice=parseFloat(that.goodsSKUs[k].supplyPrice*100)
                }
              }
            }
            let a={
              token: sessionStorage.getItem('mToken'),
              goodsId: that.goodsId,
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
              dealerName: JSON.parse(sessionStorage.getItem('mUser')).dealerName,
              goodsSKUs: JSON.stringify(that.goodsSKUs),
              goodsSpecifications: JSON.stringify(that.goodsSpecifications),
              goodsMainImages:that.goodsMainImages.length==0?'':that.goodsMainImages.toString(),
              goodsDesc:that.$refs.ue.getUEContent(),
              goodsBrandName:that.goodsBrandName,
              goodsGuarantee:that.goodsGuarantCheck.length==0?'':that.goodsGuarantCheck.toString(),
              goodsKeyWord:typeof that.data.goodsKeyWord =='string'?that.data.goodsKeyWord:that.data.goodsKeyWord.toString()
            }
            console.log(a.goodsSKUs)
            that.$.ajax({
              type: that.handle_toggle === 'add' ? 'post' : 'put',
              url: that.handle_toggle === 'add' ? that.localbase + 'm2c.scm/goods/approve' : that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined ? that.localbase + 'm2c.scm/goods' : that.localbase + 'm2c.scm/goods/approve',
              data:Object.assign(that.data,a),
              success: function (result) {
                if (result.status === 200) {
                  that.show_tip('保存成功')
                  that.$router.push({name:"goodList"})
                } else {
                  that.show_tip(result.errorMessage)
                  that.goodsGuarantee=[]
                }
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      // 获取商品分类别选中
      handleChange(children) {
        let that = this
        that.data.goodsClassifyId = children[children.length-1]
        //that.data.goodsClassifys = children.toString()
        if(that.countMode!=1){
          // 根据分类id获取分类名
          that.$.ajax({
            type: 'get',
            url: that.localbase + 'm2c.scm/goods/classify/service/rate',
            data:{
              token: sessionStorage.getItem('mToken'),
              classifyId:children[children.length-1]
            },
            success: function (result) {
              that.serviceRate = result.content
              that.data.goodsClassifys = children.toString()
              console.log(that.data.goodsClassifys)
            }
          })
        }
      },
      // 复选框选中
      handleCheckedCitiesChange(value) {
        console.log(value)
        console.log(this.goodsGuarantCheck)
      },
      // 获取多规格交叉属性
      mapValue () {
        let that = this
        let goodSkuList = that.goodsSKUs
        that.goodsSKUs=[]
          if(that.goodsSpecifications.length==1 || that.goodsSpecifications[1].itemValue.length==0){
            for(var j=0;j<that.goodsSpecifications[0].itemValue.length;j++){
              that.goodsSKUs.push(eval('(' + '{skuName:"'+ that.goodsSpecifications[0].itemValue[j].spec_name + '",show:true}' + ')'))
            }
            for(var a=0;a<goodSkuList.length;a++){
              for(var b=0;b<that.goodsSKUs.length;b++){
                if(goodSkuList[a].skuName==that.goodsSKUs[b].skuName){
                  that.goodsSKUs[b] = goodSkuList[a]
                }
              }
            }
          }else{
            if(that.goodsSpecifications.length==2){
              var p = [[],[]]
              for(var k=0;k<that.goodsSpecifications.length;k++){
                for(var y=0;y<that.goodsSpecifications[k].itemValue.length;y++){
                  p[k].push(that.goodsSpecifications[k].itemValue[y].spec_name)
                }
              }
            } else if(that.goodsSpecifications.length==3){
              var p = [[],[],[]]
              for(var k=0;k<that.goodsSpecifications.length;k++){
                for(var y=0;y<that.goodsSpecifications[k].itemValue.length;y++){
                  p[k].push(that.goodsSpecifications[k].itemValue[y].spec_name)
                }
              }
            } // 此定义不利于拓展，暂时没想到更好的方法
            var arr = js(p[0],p[1])
            var b = true
            var index = 2;
            while(b){
              if(p[index]){
                  arr = js(arr,p[index])
                  index ++;
              }else{
                  break;
              }
            }
            for(var i =0;i<arr.length;i++){
              that.goodsSKUs.push(eval('(' + '{skuName:"'+ arr[i] + '",show:true}' + ')'))
            }
            function js(arr1,arr2){
              var arr = Array()
              for(var i=0;i<arr1.length;i++){
                for(var j=0;j<arr2.length;j++){
                  arr.push(arr1[i]+','+arr2[j])
                }
              }
              return arr
              console.log(arr)
            }
            for(var a=0;a<goodSkuList.length;a++){
              for(var b=0;b<that.goodsSKUs.length;b++){
                if(goodSkuList[a].skuName==that.goodsSKUs[b].skuName){
                  that.goodsSKUs[b] = goodSkuList[a]
                }
              }
            }
          }
      },
      // 添加规格值
      specValueClick (state1, index) {
        let that = this
        if(that.standardId==''||that.standardId==undefined){
          that.standardIdShow = true
        }else{
          if (state1 === '' || state1.trim() === '') {
            that.show_tip('规格值不能为空')
            return
          }
          let arr = that.restaurants
          let state = {value:state1}
          if(JSON.stringify(arr).indexOf(JSON.stringify(state))===-1){
              that.$.ajax({
                type: 'post',
                url: that.localbase + 'm2c.scm/goods/spec/value',
                //url:'http://10.0.40.23:8080/m2c.scm/goods/spec/value',
                data: {
                  token: sessionStorage.getItem('mToken'),
                  dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
                  specValue: state1,
                  standardId: that.standardId
                },
                success: function (result) {
                  if(result.status==200){
                    that.getValue()
                  }else{
                    that.show_tip(result.errorMessage)
                  }
                }
              })
          }
          let array = that.goodsSpecifications[index].itemValue
          let state2 = {spec_name:state1}
          if(JSON.stringify(array).indexOf(JSON.stringify(state2))===-1){
            that.goodsSpecifications[index].itemValue.push(state2)
            console.log(that.goodsSpecifications[index])
            that.mapValue()
            that.goodsSpecifications[index].state1=''
          }else{
            that.show_tip("该规格值已添加")
          }
        }

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
            //that.goodsClassifys.unshift({"parentClassifyId":'',"classifyId":'',"serviceRate":'',"classifyName":"全部" });
          }
        })
      },
      // 商品分类
      handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleCloseS(key, keyPath) {
        console.log(key, keyPath)
      },
      // 照片墙
      handleRemove(file, fileList) {
        let that = this
        for(var i=0;i<that.goodsMainImages.length;i++){
          if(file.url==that.goodsMainImages[i]){
            that.goodsMainImages.splice(i,1)
          }
          if(file.response!=undefined){
            if(file.response.content.url==that.goodsMainImages[i]){
              that.goodsMainImages.splice(i,1)
            }
          }
        }
      },
      success (response, file, fileList) {
        let that = this
        that.dialogImageUrl = file.url
        that.dialogVisible = 1 > 0
        if (file.response.content.url == '' || file.response.content.url == undefined) {
          that.show_tip('上传失败,请重新上传')
        } else {
          that.goodsMainImages.push(file.response.content.url)
          that.picture()
        }
      },
      beforeAvatarUpload (file) {
        if (!file.type.includes('image/')) {
          this.$message.error('上传图片格式不正确!')
          return false
        }
        const isMA = file.size < 409600
        if (!isMA) {
          this.$message.error('上传图片大小不能超过 400Kb!')
        }
        return isMA;
      },
      // 规格小标签移除
      handleClose(tag,index) {
        let that =this
        if(that.handle_toggle=='add'){
          let specName={spec_name:tag}
          that.goodsSpecifications[index].itemValue.splice(that.goodsSpecifications[index].itemValue.indexOf(specName), 1)
          that.mapValue()
        }else{
          that.show_tip("已有规格不能移除")
        }
      },
      // 删除规格行
      delect (index) {
        this.goodsSpecifications.splice(index, 1)
      },
      addRow(){
        let newRow = {
          itemValue: []
        }
        this.goodsSpecifications.push(newRow)
      },
      // 搜索建议
      query(item){
        console.log(item)
        this.standardId = item
        //this.getValue()
      },
      querySearch(queryString, cb) {
        let that = this
        var restaurants = that.restaurants
        var results = queryString ? restaurants.filter(that.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          // $nextTick(() => {
          //   let that = this
          //   that.getValue()
          // })
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect (item) {
        console.log('item=' + item)
      },
      // 获取规格值
      getValue () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/goods/spec/value',
          data:{
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            standardId: that.standardId
          },
          success: function (result) {
            if(result.content==''){
              that.restaurants = []
            } else{
              that.restaurants = result.content
            }
          }
        })
      },
      picture(){
        let that = this
        that.$nextTick(() =>{
          console.log(document.getElementById('dragImg').getElementsByTagName('li').length)
          console.log(that.$('#dragImg').find('li').length)
          if(document.getElementById('dragImg').getElementsByTagName('li').length>0){
            var moveItem = document.getElementById('dragImg').getElementsByTagName('li');
            for (let i = 0; i < moveItem.length; i++) {
              moveItem[i].setAttribute('id', 'label' + i);
              moveItem[i].ondragstart = function (ev) {
                ev.dataTransfer.setData("Img", this.id);
              };
            }
            let con = document.getElementById('dragImg').getElementsByTagName('ul')[0]
            con.setAttribute("id","ulcon")
            document.getElementById('ulcon').ondragover = function (ev) {
              ev.preventDefault();
            }
            document.getElementById('ulcon').ondrop = function (ev) {
              ev.preventDefault();
              var id = ev.dataTransfer.getData('Img');
              var elem = document.getElementById(id);
              var toElem = ev.toElement.id;
              let flag = id.substr(id.length-1,1)
              let index = that.goodsMainImages[flag]
              that.goodsMainImages.splice(flag,1)
              that.goodsMainImages.push(index)
              this.appendChild(elem);
              console.log(that.goodsMainImages)
            }
          }
        })
      }
    },
    mounted () {
      let that = this
      window.onscroll = function () {
        if (window.scrollY > 864) {
          console.info(window.scrollY)
          $('.el-autocomplete-suggestion').hide()
        } else {
          $('.el-autocomplete-suggestion').show()
        }
      }
      that.goodsClassify()
      // 获取商品保障
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/goods/guarantee',
        data:{
          token: sessionStorage.getItem('mToken')
        },
        success: function (result) {
          that.goodsGuaranteeList = result.content
        }
      })
      // 获取规格值
      that.getValue()
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
        url: that.localbase + 'm2c.scm/brand/choice',
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
        that.goodsId=that.$route.query.goodsId
        that.$.ajax({
          type: 'get',
          url: (that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined)?that.localbase + 'm2c.scm/goods/' + that.$route.query.goodsId:that.localbase + 'm2c.scm/goods/approve/' + that.$route.query.goodsId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.disabled = true
            that.data = result.content
            that.serviceRate = result.content.serviceRate
            for(var i=0,len=that.goodsGuaranteeList.length;i<len;i++){
              for(var j=0,len=result.content.goodsGuarantee.length;j<len;j++){
                if(result.content.goodsGuarantee[j]===that.goodsGuaranteeList[i].guaranteeDesc){
                  that.goodsGuarantCheck.push(that.goodsGuaranteeList[i].guaranteeId)
                }
              }
            }
            that.data.skuFlag = result.content.skuFlag.toString()
            that.goodsSpecifications = result.content.goodsSpecifications
            that.goodsSKUs = result.content.goodsSKUs
            that.data.goodsMinQuantity = result.content.goodsMinQuantity.toString()
            for(var p=0;p<result.content.goodsSKUs.length;p++){
              that.goodsSKUs[p].marketPrice=result.content.goodsSKUs[p].marketPrice/100
              that.goodsSKUs[p].photographPrice=result.content.goodsSKUs[p].photographPrice/100
              if(result.content.goodsSKUs[p].supplyPrice!=''){
                that.goodsSKUs[p].supplyPrice=result.content.goodsSKUs[p].supplyPrice/100
              }
            }
            for(var i=0;i<result.content.goodsMainImages.length;i++){
              that.fileList.push(eval('(' + '{url:"'+ result.content.goodsMainImages[i] + '"}' + ')'))
              that.goodsMainImages.push(result.content.goodsMainImages[i])
            }
            that.picture()
            console.log("that.fileList="+that.fileList)
            if(result.content.skuFlag==1){
              that.$('#skuFlag0').hide()
            }else{
              that.$('#skuFlag1').hide()
            }
            that.$refs.ue.setUEContent(result.content.goodsDesc)
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
 #dragImg ul{width:auto;float:left;height:100px;display:block;margin-bottom:20px;}
 .el-upload-list--picture .el-upload-list__item{float:left;width:100px;height:100px;padding:0;margin-right:20px;margin-top:0;}
 .el-upload-list--picture .el-upload-list__item-thumbnail{width:100px;height:100px;float:left;position:static;margin-left:0;}
 .el-upload{width:100px;height:100px;display:inline-block;float:left;overflow:hidden;margin-right:20px;}
 .el-upload .el-icon-plus{width:98px;height:98px;background:#fff;border:1px dotted #B7C9E1;}
 .el-icon-plus:before{content:'';}
</style>

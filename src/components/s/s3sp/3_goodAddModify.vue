<template>
  <div class="infoBox">
    <el-row>
      <el-col :span="24"><h4>基本信息</h4></el-col>
    </el-row>
    <el-form :model="data" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="20" style="margin-bottom:0;">
        <el-col :span="11">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="data.goodsName"   placeholder="1-50字符" :maxlength="50" ></el-input>
            <i class="red fl" style="margin-top:-8px;color:#999;line-height:20px;">请将商品关键信息设置在前十字，以便刺激顾客购买</i>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品副标题" prop="goodsSubTitle">
            <el-input v-model="data.goodsSubTitle" placeholder="1-100字符" :maxlength="100"></el-input>
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
            <el-select v-model="data.goodsUnitId" placeholder="请选择" @change="unitChange">
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
          <el-form-item label="商品条形码" prop="goodsBarCode">
            <el-input v-model="data.goodsBarCode" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="关键词" prop="goodsKeyWord">
            <el-input v-model="data.goodsKeyWord" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="width:100%;">
        <el-col :span="24">
          <el-form-item label="商品保障" class="graySpan">
            <el-checkbox-group v-model="goodsGuarantCheck">
              <el-row :gutter="10" style="width:100%; margin-top:6px;">
                <template v-for="(guarantee,index) in goodsGuaranteeList" v-if="guarantee.isDefault===1">
                  <el-col :span="5">
                    <el-checkbox :key="guarantee.guaranteeId" :label="guarantee.guaranteeId" :title="guarantee.guaranteeName+' '+guarantee.guaranteeDesc">{{guarantee.guaranteeName}}<span v-if="guarantee.guaranteeDesc !=''">-{{guarantee.guaranteeDesc}}</span></el-checkbox>
                  </el-col>
                </template>
              </el-row>
              <el-row :gutter="10" style="width:100%;margin-left:0;" v-if="goodsGuaranteeList.length>4">
                <template v-for="(guarantee,index) in goodsGuaranteeList" v-if="guarantee.isDefault===0">
                  <el-col :span="10">
                    <el-checkbox :key="guarantee.guaranteeId" :label="guarantee.guaranteeId" class="ellipsis" style="width:100%;" :title="guarantee.guaranteeName+' '+guarantee.guaranteeDesc">{{guarantee.guaranteeName}}<span v-if="guarantee.guaranteeDesc !=''">-{{guarantee.guaranteeDesc}}</span></el-checkbox>
                  </el-col>
                </template>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <!-- :to="{name:'address',query:{activeName:'second'}}" -->
        <a class="addGuarantee" @click="addGuarantee">新增商品保障</a>
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
              <th><span style="color: red">*</span>库存</th>
              <th><span style="color: red">*</span>重量/kg{{unitName==''?'':'（'+unitName+'）'}}<div class="icon">
                <div class="tips" style="width:400px;z-index:2;">
                  <p>表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg</p>
                </div>
              </div></th>
              <th><span style="color: red">*</span>拍获价/元</th>
              <th>市场价/元</th>
              <th><span style="color: red" v-show="countMode==1">*</span>{{countMode==1?'供货价':'服务费率/%'}}</th>
              <th>商品编码</th>
            </tr>
          </thead>
            <tbody>
              <tr v-for="(good,index) in goodsSKUs">
                <td>无</td>
                <td>
                    <el-input v-model="good.availableNum" placeholder="请输入内容" type="number" @blur="checkInventory(good.availableNum,index,'availableNum',goodsSKUs)"></el-input>
                </td>
                <td>
                    <el-input v-model="good.weight" placeholder="请输入内容" type="number" @blur="checkWeight(good.weight,index,'weight',goodsSKUs)"></el-input>
                </td>
                <td>
                    <el-input v-model="good.photographPrice" placeholder="请输入内容" type="number" @blur="checkPhotographPrice(good.photographPrice,index,'photographPrice',goodsSKUs,good.supplyPrice)"></el-input>
                </td>
                <td>
                  <el-input v-model="good.marketPrice" placeholder="请输入内容" type="number" @blur="checkMarketPrice(good.marketPrice,index,'marketPrice',goodsSKUs)"></el-input>
                </td>
                <td v-if="countMode==1"><el-input v-model="good.supplyPrice" placeholder="请输入内容" type="number" @blur="checkSupplyPrice(good.supplyPrice,index,'supplyPrice',goodsSKUs,good.photographPrice)"></el-input></td>
                <td v-if="countMode==2">{{serviceRate}}</td>
                <td>
                  <el-input v-model="good.goodsCode" placeholder="请输入内容" :maxlength = "30" @blur="checkGoodsCode(good.goodsCode,index,'goodsCode',goodsSKUs)"></el-input>
                </td>
              </tr>
            </tbody>
        </table>
        <i v-if="sukShow" style="color:red; font-style:normal;">商品库存不能为空且为大于或等于0的正整数<br/></i>
        <i v-if="sukShow1" style="color:red; font-style:normal;">商品重量不能为空且为大于0的数字<br/></i>
        <i v-if="sukShow2" style="color:red; font-style:normal;">商品拍获价不能为空且为大于0的数字，不能超过999999.99元<br/></i>
        <i v-if="sukShow3" style="color:red; font-style:normal;">商品市场价为大于0的数字，不能超过999999.99元<br/></i>
        <i v-if="sukShow4" style="color:red; font-style:normal;">商品供货价不能为空且为大于0的数字，不能大于拍获价，不能超过999999.99元<br/></i>
        <i v-if="sukShow5" style="color:red; font-style:normal;">商品编码为1-30字符的字母或数字且不能重复</i>
      </div>

      <div class="tabPane" v-if="data.skuFlag==1">
        <table id="hideItemValue">
          <thead>
            <tr>
              <th></th>
              <th>规格</th>
              <th>规格值</th>
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
                  v-for="tag in item.itemValue"
                  :key="tag.spec_name"
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
              <th><span style="color: red">*</span>库存</th>
              <th><span style="color: red">*</span>重量/kg{{unitName==''?'':'（'+unitName+'）'}}<div class="icon">
                <div class="tips" style="width:400px;z-index:2;">
                  <p>表示每个计量单位对应的重量，比如0.05kg(个)表示每个重量为0.05kg</p>
                </div>
              </div></th>
              <th><span style="color: red">*</span>拍获价/元</th>
              <th>市场价/元</th>
              <th><span style="color: red" v-show="countMode==1">*</span>{{countMode==1?'供货价':'服务费率/%'}}</th>
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
                  <el-input v-model="good.availableNum" placeholder="请输入内容" type="number" @blur="checkInventory(good.availableNum,index,'availableNum',goodsSKUs)"></el-input>
              </td>
              <td>
                  <el-input v-model="good.weight" placeholder="请输入内容" type="number" @blur="checkWeight(good.weight,index,'weight',goodsSKUs)"></el-input>
              </td>
              <td>
                  <el-input v-model="good.photographPrice" placeholder="请输入内容" type="number" @blur="checkPhotographPrice(good.photographPrice,index,'photographPrice',goodsSKUs,good.supplyPrice)"></el-input>
              </td>
              <td>
                <el-input v-model="good.marketPrice" placeholder="请输入内容" type="number" @blur="checkMarketPrice(good.marketPrice,index,'marketPrice',goodsSKUs)"></el-input>
              </td>
              <td v-if="countMode==1"><el-input v-model="good.supplyPrice" placeholder="请输入内容" type="number" @blur="checkSupplyPrice(good.supplyPrice,index,'supplyPrice',goodsSKUs,good.photographPrice)"></el-input></td>
              <td v-if="countMode==2">{{serviceRate}}</td>
              <td>
                <el-input v-model="good.goodsCode" placeholder="请输入内容" :maxlength = "30" @blur="checkGoodsCode(good.goodsCode,index,'goodsCode',goodsSKUs)"></el-input>
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
      <!--  <i v-if="sukShow" style="color:red; font-style:normal;">商品库存/重量/拍获价不能为空</i>
        <i v-if="sukShow1" style="color:red; font-style:normal;">商品重量/拍获价不能为负数</i>
        <i v-if="sukShow2" style="color:red; font-style:normal;">商品库存请输入正整数</i>-->
        <i v-if="sukShow" style="color:red; font-style:normal;">商品库存不能为空且为大于或等于0的正整数<br/></i>
        <i v-if="sukShow1" style="color:red; font-style:normal;">商品重量不能为空且为大于0的数字<br/></i>
        <i v-if="sukShow2" style="color:red; font-style:normal;">商品拍获价不能为空且为大于0的数字，不能小于供货价，不能超过999999.99元<br/></i>
        <i v-if="sukShow3" style="color:red; font-style:normal;">商品市场价为大于0的数字，不能超过999999.99元<br/></i>
        <i v-if="sukShow4" style="color:red; font-style:normal;">商品供货价不能为空且为大于0的数字，不能大于拍获价，不能超过999999.99元<br/></i>
        <i v-if="sukShow5" style="color:red; font-style:normal;">商品编码为1-30字符的字母或数字且不能重复</i>
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
        <el-col :offset='2' :span='21' >
          <p class="marginTop20">最多上传5张主图，可以通过拖曳图片调整顺序</p>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" style="margin-top:20px;">主图视频</el-col>
        <el-col :span="20" class="upLoadBox">
          <div id="videoContainer" v-if="uploadBtn">
              <el-button id="selectVideo" type="primary">上传视频<i class="el-icon-upload el-icon--right"></i></el-button>
          </div>
          <div class="uploadProgress" v-if="uploadProgress">
            <img class="mainImg" v-if="goodsMainImages.length>0" :src="goodsMainImages[0]" />
            <img src="../../../assets/images/loading.gif" class="myicon">
            <a class="stop" @click="pauseUpload"></a>
          </div>
          <div class="uploadProgress" v-if="uploadRepeat" id="videoContainer">
            <a class="repeat" id="selectVideo"><i></i>重新上传</a>
            <img class="mainImg" v-if="goodsMainImages.length>0" :src="goodsMainImages[0]" />
            <a class="stop" @click="delectUpload"></a>
          </div>
        </el-col>
        <el-col :offset="3" :span='21'>
          <p class="marginTop20">仅支持mp4格式，视频大小30M以内</p>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="z-index:1;">
        <el-col :span="3">图文详情</el-col>
        <el-col :span="20" style="height:400px;z-index:1;">
          <div id="editor-container">
            <UE :config=config ref="ue"></UE>
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
      var checkGoodsBarCode = (rule, value, callback) => {
        var reg = /^[0-9a-zA-Z]{1,30}$/
        setTimeout(() => {
          if (value != '' && !reg.test(value)) {
            callback(new Error('只能为1到30位的数字或字母'))
          } else {
            callback();
          }
        }, 0);
      };
      var checkGoodsKeyWord = (rule, value, callback) => {
        var reg = /^.{1,20}$/
        setTimeout(() => {
          if (value != '') {
            var values
            if (this.handle_toggle == 'add') {
              values = value.split(',')
            } else {
              values = value
            }
            for (var i = 0; i < values.length; i++) {
              if (!reg.test(values[i])) {
                callback(new Error('每个关键词1-20字符，每个关键词用逗号隔开'))
              }
            }
            callback();
          } else {
            callback();
          }
        }, 0);
      };
      return {
        ruleForm: {
          goodsName: '',
          goodsSubTitle: '',
          goodsClassifyId: '',
          goodsBrandId: '',
          goodsUnitId: '',
          goodsMinQuantity: '',
          goodsPostageId: '',
          goodsBarCode: '',
          goodsKeyWord: ''
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
            { required: true, validator: checkGoodsMinQuantity, trigger: 'blur' }
          ],
          goodsPostageId: [
            { required: true, message: '请选择运费模板', trigger: 'change' }
          ],
          goodsBarCode: [
            { required: false, validator: checkGoodsBarCode, trigger: 'blur' }
          ],
          goodsKeyWord: [
            { required: false, validator: checkGoodsKeyWord, trigger: 'blur' }
          ]
        },
        standardIdShow: false, // 规格不能为空
        sukShow: false, // 商品库存不能为空且为正整数
        sukShow1: false, // 商品重量不能为空且为大于0的数字
        sukShow2: false, // 商品拍获价不能为空且为大于0的数字，不能超过999999.99元
        sukShow3: false, // 商品市场价为大于0的数字，不能超过999999.99元
        sukShow4: false, // 商品供货价不能为空且大于0的数字，不能超过999999.99元
        sukShow5: false, // 商品编码为1-30字符的字母或数字且不能重复
        imgShowList: false, // 商品主图不能为空
        countMode: '', // 商家结算方式 1：按供货价 2：按服务费率
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
        data: {skuFlag: '0' ,goodsMinQuantity:'',goodsBarCode:'',goodsKeyWord:'',goodsShelves:'1',goodsClassifyId:'',goodsMainVideo:''},
        value:'',
        dynamicTags: [],
        dialogImageUrl: '',
        dialogVisible: false,
        uploadUrl: this.localbase+"m2c.support/img/upload",
        upLoadData:{
          imgGroup:1
        },
        fileList:[],
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
        setUp: {},
        disabled: false, // 禁用规格选择
        tempGoodsMainImages: [],
        unitName: '',
        // goodsMainVideo:'',//视频地址
        qiniuUploader:null, //七牛云上传对象变量
        key:'',// 上传视频名
        uploadBtn:true,
        uploadProgress:false,// 进度loading
        uploadRepeat:false, //重新上传
        newClassifyName:'',//新的分类名
        oldServiceRate:'',//原分类费率
        newServiceRate:'',//新分类费率
        oldGoodsSpecifications:[],//原有规格值
      }
    },
    created() {},
    watch: {
      // 监听计量单位
      'data.goodsUnitId': {
        handler: function (val, oldVal) {
          let that = this
          if (val != oldVal) {
            that.$nextTick(function () {
              that.unitChange(val)
            })
          } else {
            return false
          }
        },
        deep: true
      },
      // 监听商品分类以获取费率
      // 监听goodsMainImages的长度
      'goodsMainImages.length':{
        handler: function (val, oldVal) {
          let that = this
          let div = that.$("#dragImg").find("div.el-upload")
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
                //console.log(that.goodsBrandName)
                // that.initUpload()
              }
            })
          }
        },
        deep: true
      }
    },
    methods: {
      // repeatUpload(){
      //   let that = this
      //   that.initUpload()
      //   document.getElementById('selectVideo').click()
      // },
      //删除视频
      delectUpload(){
        let that = this
        that.$.ajax({
            url: that.base + "m2c.support/file/rm/video",
            type: 'post',
            data: {
                fileKey:that.key
            },
            success: function (result) {
                that.$message.success('操作成功！')
                that.uploadBtn = true
                that.uploadProgress = false
                that.uploadRepeat = false
                that.data.goodsMainVideo=''
                that.$nextTick(()=>{
                  console.log("删除视频")
                  that.initUpload()
                })
            }
        })
      },
      //取消上传
      pauseUpload(){
        let that = this
        that.$confirm('是否取消视频上传?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(that.uploadProgress){
            that.qiniuUploader.stop()
            that.uploadProgress = false
            if(that.data.goodsMainVideo!==''){
              that.uploadRepeat = true
            }else{
              that.uploadBtn = true
            }
            that.$nextTick(()=>{
              console.log("取消上传视频")
              that.initUpload()
            })
          }else{
            that.$message.error("操作已失效！")
            //that.initUpload()
          }
        }).catch(() => {
          if(that.uploadProgress){
            that.$nextTick(()=>{
              console.log("取消按钮")
              that.initUpload()
            })
          }else{
            that.$message.error("操作已失效！")
            that.$nextTick(()=>{
              console.log("取消上传视频 失效")
              that.initUpload()
            })
          }
        })
      },
      //视频上传初始化
      initUpload(){
          let that = this
          console.log("初始化成功")
          that.qiniuUploader = new QiniuJsSDK().uploader({
              runtimes: 'html5,flash,html4',    //上传模式,依次退化
              browse_button: 'selectVideo',       //上传选择的点选按钮，**必需**
              // uptoken: getSStorageInfo("uptoken"), //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
              // uptoken_url:__webappserverUrl__ + "/third/file/getUploadToken",
              uptoken_func: function (file) {    // 在需要获取 uptoken 时，该方法会被调用
                  // do something
                  let uptoken = ""
                  that.$.ajax({
                      type: 'get',
                      async:false,
                      url: that.base + 'm2c.scm/unit/suibian',
                      success: function (result) {
                          if (result.status === 200){
                            let timestamp = (new Date()).valueOf()
                            let date = that.date_format(new Date(timestamp), 'yyyyMMdd')
                              that.key = "video" + "/" + '8' + "/" + date + result.content
                              that.$.ajax({
                                  url: that.base + "m2c.support/upload/token",
                                  type: 'GET',
                                  async:false,
                                  data: {
                                      fileKey:that.key
                                  },
                                  success: function (result) {
                                      uptoken = result.uptoken
                                  }
                              })
                          }
                      }
                  })
                  console.log('uptoken',uptoken)
                  return uptoken
              },
              filters: {
                  mime_types: [
                      {title: "视频文件", extensions: "mp4"}, // 限定mp4后缀上传
                  ]
              },//文件类型过滤，这里限制为图片类型
              domain: 'http://dl.m2c2017.com',   //bucket 域名，下载资源时用到，**必需**
              get_new_uptoken: true,  //设置上传文件的时候是否每次都重新获取新的token
              container: 'videoContainer',           //上传区域DOM ID，默认是browser_button的父元素，
              max_file_size: '30mb',           //最大文件体积限制
              //flash_swf_url: '../../../plupload/Moxie.swf',  //引入flash,相对路径
              max_retries: 3,                   //上传失败最大重试次数
              dragdrop: false,                   //开启可拖曳上传
              drop_element: 'videoContainer',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
              chunk_size: '4mb',                //分块上传时，每片的体积
              auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
              unique_names: false ,
              save_key: false,
              init: {
                  'FilesAdded': function(up, files) {
                      // plupload.each(files, function(file) {
                      //     // 文件添加进队列后,处理相关的事情
                      // });
                      // console.log('加进队列')
                      // console.log(up, file)
                  },
                  'BeforeUpload': function(up, file) {
                          // 每个文件上传前,处理相关的事情
                          // console.log(up, file)
                          that.uploadBtn = false
                          that.uploadProgress = false
                          that.uploadRepeat = false
                  },
                  'UploadProgress': function(up, file) {
                          // 每个文件上传时,处理相关的事情
                          that.uploadProgress = true
                  },
                  'FileUploaded': function(up, file, info) {
                          // 每个文件上传成功后,处理相关的事情
                          // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                          // {
                          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                          //    "key": "gogopher.jpg"
                          //  }
                          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                          let key
                          let res
                          if(info.response==undefined){
                            res = JSON.parse(info);
                            key = res.key
                          }else if(info.response!==undefined){
                            res = JSON.parse(info.response);
                            key = res.key
                          }else{
                            key = that.key
                          }
                          let domain = up.getOption('domain');
                          let sourceLink = domain +'/'+ key; //获取上传成功后的文件的Url
                          that.data.goodsMainVideo = sourceLink
                          console.log(that.data.goodsMainVideo)
                          console.log('上传成功后')
                          that.initUpload()
                  },
                  'Error': function(up, err, errTip) {
                          //上传出错时,处理相关的事情
                          // console.log("错误",err,errTip)
                          //let res = JSON.parse(err)
                          // console.log(err.code)
                          if(err.code===-600){
                            that.$message.error("请上传30M以内视频")
                          }
                          if(err.code===-601){
                            that.$message.error("请上传mp4格式视频")
                          }
                  },
                  'UploadComplete': function() {
                          //队列文件处理完毕后,处理相关的事情
                          that.uploadBtn = false
                          that.uploadProgress = false
                          that.uploadRepeat = true
                  },
                  'Key': function(up, file) {
                      // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                      // 该配置必须要在 unique_names: false , save_key: false 时才生效
                      var key = "";
                      key = that.key
                      // do something with key here
                      return key
                  }
              }
          });
      },
      // 获取商品详情
      getGoodsInfo(){
        let that = this
        //alert(0)
        that.goodsId=that.$route.query.goodsId
        that.$.ajax({
          type: 'get',
          url: (that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined)?that.localbase + 'm2c.scm/web/goods/' + that.$route.query.goodsId:that.localbase + 'm2c.scm/web/goods/approve/' + that.$route.query.goodsId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.disabled = true
            that.data = result.content
            that.data.goodsMainVideo = result.content.goodsMainVideo
            if(that.data.goodsMainVideo!=''){
              that.uploadBtn = false
            }
            that.serviceRate = result.content.serviceRate
            that.oldServiceRate = result.content.serviceRate
            for(var j=0,len=result.content.goodsGuarantee.length;j<len;j++){
              that.goodsGuarantCheck.push(result.content.goodsGuarantee[j].guaranteeId)
            }
            // console.log(that.goodsGuarantCheck)
            that.data.skuFlag = result.content.skuFlag.toString()
            that.goodsSpecifications = result.content.goodsSpecifications
            for(let a=0;a<result.content.goodsSpecifications.length;a++){
              for(let b=0;b<result.content.goodsSpecifications[a].itemValue.length;b++){
                that.oldGoodsSpecifications.push(result.content.goodsSpecifications[a].itemValue[b].spec_name)
              }
            }
            //that.oldGoodsSpecifications = result.content.goodsSpecifications
            // sessionStorage.setItem('oldGoodsSpecifications',JSON.stringify(result.content.goodsSpecifications))
            that.goodsSKUs = result.content.goodsSKUs
            that.data.goodsMinQuantity = result.content.goodsMinQuantity.toString()
            that.data.goodsKeyWord = result.content.goodsKeyWord.join()
            for(var p=0;p<result.content.goodsSKUs.length;p++){
              that.goodsSKUs[p].marketPrice=result.content.goodsSKUs[p].marketPrice
              that.goodsSKUs[p].photographPrice=result.content.goodsSKUs[p].photographPrice
              if(result.content.goodsSKUs[p].supplyPrice!=''){
                that.goodsSKUs[p].supplyPrice=result.content.goodsSKUs[p].supplyPrice
              }
            }
            for(var i=0;i<result.content.goodsMainImages.length;i++){
              that.fileList.push(eval('(' + '{url:"'+ result.content.goodsMainImages[i] + '"}' + ')'))
              that.goodsMainImages.push(result.content.goodsMainImages[i])
            }
            that.picture()
            //console.log("that.fileList="+that.fileList)
            if(result.content.skuFlag==1){
              that.$('#skuFlag0').hide()
            }else{
              that.$('#skuFlag1').hide()
            }
            if(that.data.goodsMainVideo === ''){
              that.uploadBtn = true
            }else{
              that.uploadRepeat = true
            }
            that.$refs.ue.setUEContent(result.content.goodsDesc)
            // that.initUpload()
          }
        })
        that.$nextTick(()=>{
          that.initUpload()
        })
      },
      // 新增商品保障
      addGuarantee(){
        sessionStorage.setItem('data',JSON.stringify(this.data))
        sessionStorage.setItem('goodsSpecifications',JSON.stringify(this.goodsSpecifications))
        sessionStorage.setItem('goodsSKUs',JSON.stringify(this.goodsSKUs))
        sessionStorage.setItem('goodsGuarantCheck',JSON.stringify(this.goodsGuarantCheck))
        sessionStorage.setItem('fileList',JSON.stringify(this.fileList))
        sessionStorage.setItem('goodsDesc',this.$refs.ue.getUEContent())
        sessionStorage.setItem('goodsMainImages',JSON.stringify(this.goodsMainImages))
        this.$router.push({name:'address',query:{goodsId:this.goodsId==''?this.$route.query.goodsId:this.goodsId,handle_toggle:this.handle_toggle==''?this.$route.query.handle_toggle:this.handle_toggle}})
      },
      unitChange (item) {
        let that = this
        if (that.units && that.units != '' && that.units != null && that.units.length > 0) {
          for (var i = 0; i < that.units.length; i++) {
            if (item == that.units[i].unitId) {
              that.unitName = that.units[i].unitName
              break
            }
          }
        }
      },
      checkGoodsCode (val, index, arr, list) { // 校验商品编码
        let that = this
        setTimeout(() => {
          var re = /^[0-9a-zA-Z]{1,30}$/
          if (val != '' && !re.test(val)) {
            list[index][arr] = ''
            that.sukShow5 = true
          } else {
            that.sukShow5 = false
            if(val != ''){
              this.$.ajax({
                type: 'get',
                url: this.localbase + 'm2c.scm/web/goods/code',
                data:{
                  token: sessionStorage.getItem('mToken'),
                  dealerId:JSON.parse(sessionStorage.getItem('mUser')).dealerId,
                  goodsCode:val
                },
                success: function (result) {
                  if(result.content!=''){
                    that.$message("商品编码已存在！")
                  }else{
                    return
                  }
                }
              })
            }
          }
        }, 0)
      },
      checkInventory (val, index, arr, list) {  // 校验库存
        setTimeout(() => {
          var re = /^[0-9]\d*$/
          if (!re.test(val)) {
            list[index][arr] = ''
            this.sukShow = true
          } else {
            this.sukShow = false
          }
        }, 0)
      },
      checkWeight (val, index, arr, list) { // 校验重量
        setTimeout(() => {
          if (val && $.isNumeric(val) && val > 0) {
            val = Number(val).toFixed(2)    //这里不能删
            this.sukShow1 = false
          } else {
            val = ''
            this.sukShow1 = true
          }
          list[index][arr] = val
        }, 0)
      },
      checkPhotographPrice (val, index, arr, list, val1) {
        setTimeout(() => {
          if (val && $.isNumeric(val) && val > 0) {
            if (val > 999999.99 || parseFloat(val) < parseFloat(val1)) {
              this.sukShow2 = true
            } else {
              val = Number(val)
              this.sukShow2 = false
              this.sukShow4 = false
            }
          } else {
            val = ''
            this.sukShow2 = true
          }
          list[index][arr] = val
        }, 0)
      },
      checkMarketPrice (val, index, arr, list) {
        setTimeout(() => {
          if (val && $.isNumeric(val) && val >= 0) {
            if (val > 999999.99 || val == 0) {
              this.sukShow3 = true
              return false
            } else {
              this.sukShow3 = false
              val = Number(val)
            }
          } else {
            if (val == '') {
              this.sukShow3 = false
            } else {
              this.sukShow3 = true
              return false
            }
          }
          list[index][arr] = val
        }, 0)
      },
      checkSupplyPrice (val, index, arr, list, val1) {
        setTimeout(() => {
          if (val && $.isNumeric(val) && val > 0) {
            if (val > 999999.99 || parseFloat(val) > parseFloat(val1)) {
              this.sukShow4 = true
            } else {
              val = Number(val)
              this.sukShow4 = false
              this.sukShow2 = false
            }
          } else {
            val = ''
            this.sukShow4 = true
          }
          list[index][arr] = val
        }, 0)
      },
      checkGoodsCodeSubmit (val) {  // 校验商品编码
        var re = /^[0-9a-zA-Z]{1,30}$/
        if (val != '' && !re.test(val)) {
          this.sukShow5 = true
        } else {
          this.sukShow5 = false
        }
      },
      checkInventorySubmit (val) {  // 校验库存
        var re = /^[0-9]\d*$/
        if (!re.test(val)) {
          this.sukShow = true
        } else {
          this.sukShow = false
        }
      },
      checkWeightSubmit (val) { // 校验重量
        if (val && $.isNumeric(val) && val > 0) {
          val = Number(val).toFixed(2)     //这里不能删
          this.sukShow1 = false
        } else {
          val = ''
          this.sukShow1 = true
        }
      },
      checkPhotographPriceSubmit (val) {
        if (val && $.isNumeric(val) && val > 0) {
          if (val > 999999.99) {
            this.sukShow2 = true
          } else {
            this.sukShow2 = false
          }
        } else {
          this.sukShow2 = true
        }
      },
      checkMarketPriceSubmit (val) {
        if (val && $.isNumeric(val) && val >= 0) {
          if (val > 999999.99 || val == 0) {
            this.sukShow3 = true
          } else {
            this.sukShow3 = false
          }
        } else {
          if (val == '') {
            this.sukShow3 = false
          } else {
            this.sukShow3 = true
          }
        }
      },
      checkSupplyPriceSubmit (val) {
        if (val && $.isNumeric(val) && val > 0) {
          if (val > 999999.99) {
            this.sukShow4 = true
          } else {
            this.sukShow4 = false
          }
        } else {
          this.sukShow4 = true
        }
      },
      stantardIdChange(item,index){
        let that=this
        // console.log(that.goodsSpecifications)
        let option = 0
        for(let j = 0;j<that.goodsSpecifications.length;j++){
          if(that.goodsSpecifications[j].standardId == item.standardId){
            option++
          }
        }
        if(option>1){
          that.$message('规格不能重复')
          item.standardId = ''
          return false
        }
        that.standardId=item.standardId
        for(var i=0;i<that.stantards.length;i++){
          if(that.standardId==that.stantards[i].stantardId){
            that.goodsSpecifications[index].itemName=that.stantards[i].stantardName
          }
        }
        that.goodsSpecifications[index].itemValue = []
        // console.log(that.goodsSpecifications)
        // if(index != 2){

        // }
        that.mapValue()
        //that.goodsSpecifications = []
        // that.restaurants = []
        // that.getValue()
        that.standardIdShow = false
      },
      // 清空单规格内值
      clearSKU(){
        let that = this
        that.goodsSKUs=[{show:true,skuName: '', showStatus: true, marketPrice:'', goodsCode: '', supplyPrice: ''}]
      },
      // 清空多规格内的值
      clearGoodsSKUs(){
        let that = this
        that.goodsSpecifications=[{itemName:'',itemValue:[],state1:''}]
        that.goodsSKUs=[]
      },
      // 批量设置
      setUpSure(){
        let that = this

        for(var i=0;i<that.goodsSKUs.length;i++){
          if(that.setUp.availableNum!=''&&that.setUp.availableNum!=undefined){
            that.$set(that.goodsSKUs[i],'availableNum',that.setUp.availableNum)
          }
          if(that.setUp.weight!=''&&that.setUp.weight!=undefined){
            that.$set(that.goodsSKUs[i],'weight',that.setUp.weight)
          }
          if(that.setUp.photographPrice!=''&&that.setUp.photographPrice!=undefined){
            that.$set(that.goodsSKUs[i],'photographPrice',that.setUp.photographPrice)
          }
          if(that.setUp.marketPrice!=''&&that.setUp.marketPrice!=undefined){
            that.$set(that.goodsSKUs[i],'marketPrice',that.setUp.marketPrice)
          }
          if(that.setUp.supplyPrice!=''&&that.setUp.supplyPrice!=undefined){
            that.$set(that.goodsSKUs[i],'supplyPrice',that.setUp.supplyPrice)
          }
        }
      },
      // 取消
      goBack(){
        if(this.$route.query.from=='a'){
					this.$router.push({name:'goodList',query:{activeName:'first'}})
				}else if(this.$route.query.from=='b'){
					this.$router.push({name:'goodList',query:{activeName:'second'}})
				}else{
          this.$router.push({name:'goodList',query:{activeName:'first'}})
        }
      },
      // 提交保存或修改
      save (formName) {
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            for (var k = 0; k < that.goodsSKUs.length; k++) {
              that.checkInventorySubmit(that.goodsSKUs[k].availableNum)
              if (that.sukShow == true) {
                that.$message("您还有信息未完善！")
                return
              }
              that.checkWeightSubmit(that.goodsSKUs[k].weight)
              if (that.sukShow1 == true) {
                that.$message("您还有信息未完善！")
                return
              }
              that.checkPhotographPriceSubmit(that.goodsSKUs[k].photographPrice)
              if (that.sukShow2 == true) {
                that.$message("您还有信息未完善！")
                return
              }
              // that.checkMarketPrice (that.goodsSKUs[k].marketPrice)
              if (that.sukShow3 == true) {
                that.$message("您还有信息未正确填写！")
                return
              }
            }
            if (that.goodsMainImages.length <= 0) {
              that.$message("您还有信息未完善！")
              that.imgShowList = true
              return
            }
            
            for (var k = 0; k < that.goodsSKUs.length; k++) {
              that.goodsSKUs[k].marketPrice = parseFloat(that.goodsSKUs[k].marketPrice).toFixed(2)
              that.goodsSKUs[k].photographPrice= parseFloat(that.goodsSKUs[k].photographPrice).toFixed(2)
              that.goodsSKUs[k].showStatus = that.goodsSKUs[k].show
              if (that.countMode == 1) {
                that.goodsSKUs[k].supplyPrice = parseFloat(that.goodsSKUs[k].supplyPrice).toFixed(2)
              }
            }
            let a = {
              // token: sessionStorage.getItem('mToken'),
              goodsId: that.goodsId==''?that.$route.query.goodsId:that.goodsId,
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
              dealerName: JSON.parse(sessionStorage.getItem('mUser')).dealerName,
              goodsSKUs: JSON.stringify(that.goodsSKUs),
              goodsSpecifications: JSON.stringify(that.goodsSpecifications),
              goodsMainImages:that.goodsMainImages.length==0?'':that.goodsMainImages.toString(),
              goodsDesc:that.$refs.ue.getUEContent(),
              goodsBrandName:that.goodsBrandName,
              goodsGuarantee:that.goodsGuarantCheck.length==0?'':that.goodsGuarantCheck.toString(),
              goodsKeyWord:typeof that.data.goodsKeyWord =='string'?that.data.goodsKeyWord:that.data.goodsKeyWord.toString(),
              // oldServiceRate:that.oldServiceRate,
              newServiceRate:that.serviceRate,
              // oldClassifyName:that.data.goodsClassify,
              newClassifyName:that.newClassifyName
            }
            // console.log(a.goodsSKUs)
            // console.log(that.data.goodsSKUs)
            that.$.ajax({
              type: that.handle_toggle === 'add' ? 'post' : 'put',
              url: that.handle_toggle === 'add' ? that.localbase + 'm2c.scm/web/goods/approve' : that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined ? that.localbase + 'm2c.scm/web/goods' : that.localbase + 'm2c.scm/web/goods/approve',
              // url: that.handle_toggle === 'add' ? 'http://10.0.40.23:8081/m2c.scm/web/goods/approve' : that.$route.query.approveStatus==''||that.$route.query.approveStatus==undefined ? 'http://10.0.40.23:8081/m2c.scm/web/goods' : 'http://10.0.40.23:8081/m2c.scm/web/goods/approve',
              data:Object.assign(that.data,a),
              success: function (result) {
                if (result.status === 200) {
                  that.$message({
                    type:'success',
                    message:'保存成功'
                  })
                  that.$router.push({name:"goodList"})
                } else {
                  that.$message(result.errorMessage)
                  that.goodsGuarantee=[]
                  for (var k = 0; k < that.goodsSKUs.length; k++) {
                    that.goodsSKUs[k].marketPrice = that.goodsSKUs[k].marketPrice
                    that.goodsSKUs[k].photographPrice= that.goodsSKUs[k].photographPrice
                    that.goodsSKUs[k].showStatus = that.goodsSKUs[k].show
                    if (that.countMode == 1) {
                      that.goodsSKUs[k].supplyPrice = that.goodsSKUs[k].supplyPrice
                    }
                  }
                }
              }
            })
          } else {
            that.$message("您还有信息未完善！")
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
            url: that.localbase + 'm2c.scm/web/goods/classify/service/rate',
            data:{
              token: sessionStorage.getItem('mToken'),
              classifyId:children[children.length-1]
            },
            success: function (result) {
              that.serviceRate = result.content
              //that.data.goodsClassifys = children.toString()
              // that.newClassifyName = document.querySelector('.el-cascader__label').innerText
            }
          })
        }
        that.$nextTick(()=>{
          that.data.goodsClassifys = children.toString()
          that.newClassifyName = document.querySelector('.el-cascader__label').innerText
          // console.log(document.querySelector('.el-cascader__label').innerText)
        })
        
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
        let goback = false
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
              //console.log(that.goodsSKUs)
              var p = [[],[],[]]
              for(var k=0;k<that.goodsSpecifications.length;k++){
                for(var y=0;y<that.goodsSpecifications[k].itemValue.length;y++){
                  p[k].push(that.goodsSpecifications[k].itemValue[y].spec_name)
                }
              }
              if(p[2].length==0){
                p.splice(2,1)
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
            that.$message('规格值不能为空')
            return
          }
          let arr = that.restaurants
          let state = {value:state1}
          if(JSON.stringify(arr).indexOf(JSON.stringify(state))===-1){
              that.$.ajax({
                type: 'post',
                url: that.localbase + 'm2c.scm/web/goods/spec/value',
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
                    that.$message(result.errorMessage)
                  }
                }
              })
          }
          let array = that.goodsSpecifications[index].itemValue
          let state2 = {spec_name:state1}
          if(JSON.stringify(array).indexOf(JSON.stringify(state2))===-1){
            that.goodsSpecifications[index].itemValue.push(state2)
            that.mapValue()
            that.goodsSpecifications[index].state1=''
          }else{
            that.$message("该规格值已添加")
          }
        }

      },
      // 获取商品分类
      goodsClassify () {//商品分类树
        let that = this
        that.$.ajax({
          type: 'GET',
          url: that.localbase + 'm2c.scm/web/goods/classify/tree',
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
          that.$message(file.response.errorMessage)
        } else {
          that.$nextTick(()=>{
            let l = that.$("#dragImg").find("img").length-1
            that.$("#dragImg").find("img")[l].src = file.response.content.url
            console.log(that.$("#dragImg").find("img")[l].src)
          })
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
          let j = 0
          let l = that.oldGoodsSpecifications.length
          // console.log(l)
          if(that.oldGoodsSpecifications.indexOf(tag)===-1){
            let specName={spec_name:tag}
            // console.log('goodsSpecifications1',that.goodsSpecifications)
            that.goodsSpecifications[index].itemValue.splice(that.goodsSpecifications[index].itemValue.indexOf(specName), 1)
            // console.log('goodsSpecifications1',that.goodsSpecifications)
            that.mapValue()
          }else{
            that.$message("已有规格不能移除")
            return
          }
        }
      },
      // 删除规格行
      delect (index) {
        let that = this
        that.goodsSpecifications.splice(index, 1)
        that.mapValue()
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
        this.getValue()
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
          url: that.localbase + 'm2c.scm/web/goods/spec/value',
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
        that.$nextTick(() => {
          if (document.getElementById('dragImg').getElementsByTagName('li').length > 0) {
            var moveItem = document.getElementById('dragImg').getElementsByTagName('li')
            for (let i = 0; i < moveItem.length; i++) {
              moveItem[i].setAttribute('id', 'label' + i);
              moveItem[i].ondragstart = function (ev) {
                ev.dataTransfer.setData('Img', this.id)
              }
            }
            let con = document.getElementById('dragImg').getElementsByTagName('ul')[0]
            con.setAttribute('id', 'ulcon')
            document.getElementById('ulcon').ondragover = function (ev) {
              ev.preventDefault()
              ev.stopPropagation()
            }
            document.getElementById('ulcon').ondrop = function (ev) {
              //var ev = event || window.event
              ev.preventDefault()
              ev.stopPropagation()
              var id = ev.dataTransfer.getData('Img')
              var startLocation = id.substring(5, id.length)
              //console.log('startLocation:' + startLocation)
              var toElem = ev.toElement || ev.target
              //console.log(ev)
              //console.log(ev.target)
              if (toElem != undefined && toElem.src != undefined) {
                var endLocation // 替换位置
                for (var i = 0; i < that.goodsMainImages.length; i++) {
                  if (toElem.src == that.goodsMainImages[i]) {
                    endLocation = i
                    break
                  }
                }
                that.tempGoodsMainImages = []
                for (var j = 0; j < that.goodsMainImages.length; j++) {
                  if (j == startLocation) {
                    that.tempGoodsMainImages.push(that.goodsMainImages[endLocation])
                  } else if (j == endLocation) {
                    that.tempGoodsMainImages.push(that.goodsMainImages[startLocation])
                  } else {
                    that.tempGoodsMainImages.push(that.goodsMainImages[j])
                  }
                }
                //console.log('tempGoodsMainImages',that.tempGoodsMainImages)
                that.goodsMainImages = []
                for (var k = 0; k < that.tempGoodsMainImages.length; k++) {
                  that.goodsMainImages.push(that.tempGoodsMainImages[k])
                }
                that.fileList = []
                for (var n = 0; n < that.goodsMainImages.length; n++) {
                  that.fileList.push(eval('(' + '{url:"' + that.goodsMainImages[n] + '"}' + ')'))
                }
                $('.el-upload-list__item-thumbnail').click()
                // $('.el-icon-upload-success .el-icon-check').text('::before')
                // 重新赋值id
                var moveItem = document.getElementById('dragImg').getElementsByTagName('li')
                for (let i = 0; i < moveItem.length; i++) {
                  moveItem[i].setAttribute('id', 'label' + i)
                  moveItem[i].ondragstart = function (ev) {
                    ev.dataTransfer.setData('Img', this.id)
                  }
                }
                let con = document.getElementById('dragImg').getElementsByTagName('ul')[0]
                con.setAttribute('id','ulcon')
                document.getElementById('ulcon').ondragover = function (ev) {
                  ev.preventDefault()
                  ev.stopPropagation()
                }
              }
            }
          }
        })
      }
    },
    mounted () {
      let that = this
      that.$nextTick(function(){
        that.$('.el-upload').appendTo("#dragImg")
        
      })
      window.onscroll = function () {
        if (that.standardId != '') {
          if (window.scrollY > 864) {
            $('.el-autocomplete-suggestion').hide()
          } else {
            for(var i=0;i<that.goodsSpecifications.length;i++){
              if(that.goodsSpecifications[i].itemValue != [] ){
                $('#hideItemValue').find('.el-autocomplete-suggestion').eq(i).hide()
              }else{
                $('.el-autocomplete-suggestion').show()
              }
            }
          }
        }
      }
      that.goodsClassify()
      // 获取商品保障
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/web/goods/guarantee/list',
        data:{
          token: sessionStorage.getItem('mToken'),
          dealerId:JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          that.goodsGuaranteeList = result.content
          // console.log(result.content)
          // console.log(that.goodsGuaranteeList)
        }
      })
      // 获取规格值
      //that.getValue()
      // 获取规格
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.scm/web/stantard',
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
        url: that.localbase + 'm2c.scm/dealer/sys/web/' + JSON.parse(sessionStorage.getItem('mUser')).dealerId,
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
        url: that.localbase + 'm2c.scm/web/brand/choice',
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
        url: that.localbase + 'm2c.scm/web/unit',
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
        url: that.localbase + 'm2c.scm/web/postage',
        data:{
          token: sessionStorage.getItem('mToken'),
          dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
        },
        success: function (result) {
          that.models = result.content
        }
      })
      if(that.$route.query.fromPath === 'guarantee'){
        if(that.$route.query.handle_toggle === 'add'){
          that.handle_toggle = 'add'
          this.data = JSON.parse(sessionStorage.getItem('data'))
          this.goodsSpecifications = JSON.parse(sessionStorage.getItem('goodsSpecifications'))
          this.goodsSKUs = JSON.parse(sessionStorage.getItem('goodsSKUs'))
          this.goodsGuarantCheck = JSON.parse(sessionStorage.getItem('goodsGuarantCheck'))
          this.fileList = JSON.parse(sessionStorage.getItem('fileList'))
          this.goodsMainImages = JSON.parse(sessionStorage.getItem('goodsMainImages'))
          this.$refs.ue.setUEContent(sessionStorage.getItem('goodsDesc'))
          sessionStorage.setItem('data','')
          sessionStorage.setItem('goodsSKUs','')
          sessionStorage.setItem('goodsGuarantCheck','')
          sessionStorage.setItem('fileList','')
          that.$nextTick(()=>{
            that.initUpload()
          })
        }else{
          if(sessionStorage.getItem('data') == ''){
            //alert('请求')'
            that.getGoodsInfo()
          }else{
            //that.getGoodsInfo()
            this.data = JSON.parse(sessionStorage.getItem('data'))
            this.goodsSpecifications = JSON.parse(sessionStorage.getItem('goodsSpecifications'))
            this.goodsSKUs = JSON.parse(sessionStorage.getItem('goodsSKUs'))
            this.goodsGuarantCheck = JSON.parse(sessionStorage.getItem('goodsGuarantCheck'))
            this.fileList = JSON.parse(sessionStorage.getItem('fileList'))
            this.goodsMainImages = JSON.parse(sessionStorage.getItem('goodsMainImages'))
            this.$refs.ue.setUEContent(sessionStorage.getItem('goodsDesc'))
            this.disabled = true
            sessionStorage.setItem('data','')
            sessionStorage.setItem('goodsSKUs','')
            sessionStorage.setItem('goodsGuarantCheck','')
            sessionStorage.setItem('fileList','')
            sessionStorage.setItem('goodsMainImages','')
            that.$nextTick(()=>{
              that.initUpload()
            })
          }
        }
      }else{
        //alert(that.$route.query.isAdd)
        if (that.$route.query.isAdd == 'add') {
          that.$.ajax({
            type: 'get',
            url: that.localbase + 'm2c.scm/web/goods/approve/id',
            data: {
              token: sessionStorage.getItem('mToken')
            },
            success: function (result) {
              that.goodsId = result.content
              // console.log(that.goodsId)
            }
          })
          that.$nextTick(()=>{
            that.initUpload()
          })
        } else {
          //alert(1)
          that.getGoodsInfo()
        }
      }
      
    }
  }
</script>
<style lang="scss" scoped>
.upLoadBox{height:auto;margin-top:20px;}
.uploadProgress{position:relative;height:100px;}
.uploadProgress img{position:absolute;top:0;left:0;width:150px;height:100px;}
.uploadProgress a.stop{position:absolute;top:-10px;left:140px;display:inline-block;width:20px;height:20px;z-index:2;
  background:url(../../../assets/images/icon-close.png) no-repeat center;background-size:20px;border-radius:50%; cursor: pointer;
}
.uploadProgress a.repeat{position:absolute;top:0px;left:0px;display:inline-block;width:150px;height:100px;z-index:2;
  background:rgba(0,0,0,0.5); cursor: pointer; transition: all 0.3s ease;
  text-align: center;line-height:136px;color:#fff;
}
.uploadProgress a.repeat i{width:20px;height:20px;display:inline-block;background:url(../../../assets/images/ico_repetition.png) no-repeat center 0;position:absolute;top:30px;left:65px;transition: all 0.3s ease;}
.uploadProgress a.repeat:hover{
  text-decoration:none;
}
.uploadProgress a.repeat:hover i{
  transform: rotate(120deg);
  -webkit-transform: rotate(120deg);
  -moz-transform: rotate(120deg);
}
/*ico_reduce.png
<div id="videoContainer" v-if="uploadBtn">
              <el-button id="selectVideo" type="primary">上传视频<i class="el-icon-upload el-icon--right"></i></el-button>
          </div>
          <div class="uploadProgress" v-if="uploadProgress">
            <img class="mainImg" v-if="goodsMainImages.length>0" :src="goodsMainImages[0]" />
            <img src="../../../assets/images/icon-delet.png" class="myicon">
            <a class="stop" @click="pauseUpload"></a>
          </div>
          <div class="uploadProgress" v-if="uploadRepeat">
            <img class="mainImg" v-if="goodsMainImages.length>0" :src="goodsMainImages[0]" />
            <a class="repeat" @click="initUpload"></a>
            <a class="stop" @click="delectUpload"></a>
          </div>
*/

  .graySpan span{color:#999;}
  .graySpan .el-row,.graySpan .el-row .el-col-10{margin-bottom:0;height:45px;}
  a.addGuarantee{margin-left:115px;padding-left:20px;margin-top:-10px;float:left;background:url(../../../assets/images/ico_add.png) no-repeat;}
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
  .infoBox{width:96%; margin:20px 2%;background:#fff;padding:20px 3%;float:left;position:relative;z-index:1;}
  .infoBox h4{color:#333;line-height:30px;margin-left:-5%;}
  .el-row {
    // margin-bottom: 20px;
    width:80%;margin-left:4%;
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
  .tabPane table .el-input{width:auto;}
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
 table .el-input__inner{width:118px;}
 #dragImg ul{width:auto;float:left;height:100px;display:block;margin-bottom:20px;}
 .el-upload-list--picture .el-upload-list__item{float:left;width:100px;height:100px;padding:0;margin-top:0;box-sizing:initial;border:none;border-right:20px solid #fff; border-radius:0;}
 .el-upload-list--picture .el-upload-list__item-thumbnail{width:100px;height:100px;float:left;position:static;margin-left:0;border-radius:4px; border:1px solid #c0ccda}
 .el-upload{width:100px;height:100px;display:inline-block;float:left;overflow:hidden;margin-right:20px;}
  .el-upload .el-icon-plus{width:98px;height:98px;background:#fff url(../../../assets/images/ico_add.png) no-repeat center center;border:1px dotted #B7C9E1;}
.demo-ruleForm .el-form-item__label{line-height:50px;}
 .el-icon-plus:before{content:'';}
</style>

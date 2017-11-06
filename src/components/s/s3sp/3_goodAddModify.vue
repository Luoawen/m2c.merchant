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
        <el-cascader expand-trigger="hover" :options="goodsClassifys" v-model="selectedOptions1" change-on-select :props="goodsClassifyProps" @change="handleChange"></el-cascader>
      </el-col>
      <el-col :span="4" :offset="2"><i class="Danger">*</i>商品品牌</el-col>
      <el-col :span="7">
        <el-select v-model="data.goodsBrandId" placeholder="请选择">
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
        <el-select v-model="data.goodsUnitId" placeholder="请选择">
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
        <el-select v-model="data.goodsPostageId" placeholder="请选择">
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
        <el-checkbox-group v-model="goodsGuarantCheck">
          <el-checkbox v-for="(guarantee,index) in goodsGuaranteeList" :key="guarantee.guaranteeId" :label="guarantee.guaranteeId">{{guarantee.guaranteeDesc}}</el-checkbox>
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
        <el-radio v-model="data.skuFlag" label="0" id="skuFlag0">单一规格</el-radio>
        <el-radio v-model="data.skuFlag" label="1" id="skuFlag1">多规格</el-radio>
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
            <td v-if="countMode==1"><el-input v-model="good.supplyPrice" placeholder="请输入内容"></el-input></td>
            <td v-if="countMode==2">{{serviceRate}}</td>
            <td>
              <el-input v-model="good.goodsCode" placeholder="请输入内容"></el-input>
            </td>
          </tr>
        </tbody>
      </table>
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
            <td><span @click="delect(index)" v-if="goodsSpecifications.length>1">移除</span></td>
            <td>
              <el-select v-model="item.itemName" placeholder="请选择"><!--这里需要后台返回规格Id-->
                <el-option
                  v-for="item in stantards"
                  :key="item.stantardName"
                  :label="item.stantardName"
                  :value="item.stantardName">
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
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
              <el-button type="primary" @click="specValueClick(item.state1,index)">确定</el-button>
              <el-button @click="clearValue(item.state1,index)">取消</el-button>
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
            <td v-if="countMode==1"><el-input v-model="good.supplyPrice" placeholder="请输入内容"></el-input></td>
            <td v-if="countMode==2">{{serviceRate}}</td>
            <td>
              <el-input v-model="good.goodsCode" placeholder="请输入内容"></el-input>
            </td>
          </tr>
          <tr>
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
            <td v-if="countMode==1">{{serviceRate}}</td>
            <td v-if="countMode==2">
              <el-input v-model="setUp.supplyPrice" placeholder="请输入内容"></el-input>
            </td>
            <td>
              <el-button @click="setUpSure">确定</el-button>
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
          :action="uploadUrl" name="img"
          list-type="picture-card" :on-success="success" :data="upLoadData" :file-list="fileList"
          :on-preview="handlePictureCardPreview" show-file-list :limit=5 :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove" >
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
    <el-row v-if="handle_toggle=='add'">
      <el-col :span="24"><h4>设置上架</h4></el-col>
    </el-row>
    <el-row :gutter="20" v-if="handle_toggle=='add'">
      <el-col :span="3">*设置上架</el-col>
      <el-col :span="21">
        <el-radio v-model="data.goodsShelves" label="1">手动上架</el-radio>
        <p>平台审核通过后，商家需手动上架商品</p>
        <el-radio v-model="data.goodsShelves" label="2">审核通过立即上架</el-radio>
        <p>平台审核通过，商品自动上架，无需商家操作</p>
      </el-col>
    </el-row>
    <el-button v-if="handle_toggle=='add'" type="primary" @click="save">提交审核</el-button>
    <el-button v-if="handle_toggle!='add'" type="primary" @click="save">保存修改</el-button>
    <el-button @click="goBack">取消</el-button>
  </div>
</template>
<script>
  import UE from '../../../subcomponents/ue.vue'
  export default {
    components: {UE},
    data() {
      return {
        countMode:'', // 商家结算方式 1：按供货价 2：按服务费率
        radio: '1',
        goods: [],
        good: {availableNum: '', weight: '', photographPrice: '', marketPrice:'', supplyPrice: ''},
        restaurants: [],
        goodsGuaranteeList:[], // 获取保障详情
        goodsGuarantCheck:[],
        serviceRate:'',
        goodsSKUs:[{skuName: '', showStatus: '', availableNum: '', weight: '', photographPrice: '', marketPrice:'', serviceRate: '', goodsCode: '', supplyPrice: ''}],
        goodsSpecifications:[{itemValue:[],state1:''}],
        goodsMainImages:[],
        goodsGuarantee:[],
        data: {skuFlag: '0' ,goodsName:'',goodsMinQuantity:'',goodsBarCode:'',goodsKeyWord:'',goodsShelves:'1',goodsClassifyId:''},
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
        stantardId: '',
        stantards: [], // 规格
        classifyId: '',
        goodsClassifys:[],
        goodsClassifyProps: {
          value: 'classifyId',
          children: 'subClassify',
          label:'classifyName',
        },
        selectedOptions1: [],
        dLabel1: false,
        dLabel2: false,
        dLabel3: false,
        goodsBrandName:'',
        setUp:{},
        2:true,
        1:false
      }
    },
    created() {},
    watch: {
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
      save () {
        let that = this
        for(var k=0;k<that.goodsSKUs.length;k++){
          that.goodsSKUs[k].marketPrice=that.goodsSKUs[k].marketPrice*100
          that.goodsSKUs[k].photographPrice=that.goodsSKUs[k].photographPrice*100
          that.goodsSKUs[k].showStatus=that.goodsSKUs[k].show
          if(that.countMode!=1){
            that.goodsSKUs[k].serviceRate=that.serviceRate
          }else{
            that.goodsSKUs[k].supplyPrice=that.goodsSKUs[k].supplyPrice*100
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
      },
      // 获取商品分类别选中
      handleChange(children) {
        let that = this
        that.data.goodsClassifyId = children[children.length-1]
        console.log(that.data.goodsClassifyId)
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
              console.log(that.serviceRate)
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
        that.goodsSKUs=[]
          if(that.goodsSpecifications.length==1 || that.goodsSpecifications[1].itemValue.length==0){
            for(var x=0;x<that.goodsSpecifications[0].itemValue.length;x++){
              that.goodsSKUs.push(eval('(' + '{skuName:"'+ that.goodsSpecifications[0].itemValue[x].spec_name + '"}' + ')'))
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
              that.goodsSKUs.push(eval('(' + '{skuName:"'+ arr[i] + '"}' + ')'))
            }
            function js(arr1,arr2){
              var arr = Array()
              for(var i=0;i<arr1.length;i++){
                  for(var j=0;j<arr2.length;j++){
                      arr.push(arr1[i]+" "+arr2[j])
                  }
              }
              return arr
              console.log(arr)
            }
          }
      },
      // 取消添加规格值
      clearValue (index) {
        let that = this
        //console.log(index)
        that.goodsSpecifications[index].state1=""
      },
      // 添加规格值
      specValueClick (state1,index) {
        let that = this
        let arr = that.restaurants
        let state = {value:state1}
        console.log("state1警告"+state1)
        if(JSON.stringify(arr).indexOf(JSON.stringify(state))===-1){
            that.$.ajax({
              type: 'post',
              url: that.localbase + 'm2c.scm/goods/spec/value',
              data: {
                token: sessionStorage.getItem('mToken'),
                dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
                specValue: state1
              },
              success: function (result) {
                if(result.status==200){
                  that.show_tip("添加规格值成功")
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
          that.clearValue(index)
          that.mapValue()
        }else{
          that.show_tip("该规格值已添加")
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
            that.goodsClassifys.unshift({"parentClassifyId":'',"classifyId":'',"serviceRate":'',"classifyName":"全部" });
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
        console.log("删除文件"+file.response.content.url)
        for(var i=0;i<that.goodsMainImages.length;i++){
          if(file.response.content.url=that.goodsMainImages[i]){
            that.goodsMainImages.splice(i,1)
            console.log("剩余文件"+that.goodsMainImages)
          }
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = 1>0
      },
      success(response, file, fileList) {
        let that = this
        that.dialogImageUrl = file.url
        that.dialogVisible = 1>0
        if(file.response.content.url==''||file.response.content.url==undefined){
          that.show_tip("上传失败,请重新上传")
        }else{
          that.goodsMainImages.push(file.response.content.url)
        }
        console.warn("url="+that.goodsMainImages)
      },
      beforeAvatarUpload(file) {
        const isMA = file.size < 409600;
        if (!isMA) {
          this.$message.error('上传图片大小不能超过 400Kb!');
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
      querySearch(queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        console.log(item);
      },
      // 获取规格值
      getValue () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/goods/spec/value',
          data:{
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
          },
          success: function (result) {
            that.restaurants = result.content
          }
        })
      }
    },
    mounted(){
      let that = this
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
            that.data = result.content
            for(var i=0,len=that.goodsGuaranteeList.length;i<len;i++){
              for(var j=0,len=result.content.goodsGuarantee.length;j<len;j++){
                if(result.content.goodsGuarantee[j]===that.goodsGuaranteeList[i].guaranteeDesc){
                  that.goodsGuarantCheck.push(that.goodsGuaranteeList[i].guaranteeId)
                }
              }
            }
            console.log(that.goodsGuarantCheck)
            that.data.skuFlag = result.content.skuFlag.toString()
            that.goodsSpecifications = result.content.goodsSpecifications
            that.goodsSKUs = result.content.goodsSKUs
            for(var p=0;p<result.content.goodsSKUs.length;p++){
              that.goodsSKUs[p].marketPrice=result.content.goodsSKUs[p].marketPrice/100
              that.goodsSKUs[p].photographPrice=result.content.goodsSKUs[p].photographPrice/100
              if(result.content.goodsSKUs[p].supplyPrice!=''){
                that.goodsSKUs[p].supplyPrice=result.content.goodsSKUs[p].supplyPrice/100
              }
              //that.goodsSKUs[p].supplyPrice=result.content.goodsSKUs[p].supplyPrice/100
            }
            that.$refs.ue.setUEContent(result.content.goodsDesc)
            for(var i=0;i<result.content.goodsMainImages.length;i++){
              that.fileList.push(eval('(' + '{url:"'+ result.content.goodsMainImages[i] + '"}' + ')'))
            }
            if(result.content.skuFlag==1){
              that.$('#skuFlag0').hide()
            }else{
              that.$('#skuFlag1').hide()
            }
            that.selectedOptions1 = result.content.goodsClassifyIds
            // console.warn(that.selectedOptions1)
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

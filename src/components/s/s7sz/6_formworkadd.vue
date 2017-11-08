<template>
  <div class="addMess">
    <form class="form-horizontal" id="temMess">
      <div class="form-group">
        <label class="col-sm-2 control-label"> 运费模板名称： </label>
        <div class="col-sm-3">
          <input type="text" class="form-control" placeholder="1-20字符" v-model="formwork.modelName" maxlength="20">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label"> 计费方式： </label>
        <div class="col-sm-3">
          <form>
            <input name="tem" type="radio" value='0' v-model="formwork.chargeType" id="tem"/>
            <label for="tem">按重量</label>
            <input name="tem" type="radio" value='1' v-model="formwork.chargeType" id="tem1"/>
            <label for="tem1">按件数</label>
          </form>
        </div>
      </div>
      <!--按重量-->
      <template v-if="formwork.chargeType==0">
        <div class="form-group">
          <label class="col-sm-2 control-label"> * 运费计算规则： </label>
          <div class="col-sm-8">
            <table class="table table-bordered">
              <thead>
              <tr class="active">
                <th style="width:210px"> 可配送至</th>
                <th> 首重 / kg</th>
                <th> 运费 / 元</th>
                <th> 续重 / kg</th>
                <th> 续费 / 元</th>
                <th> 操作</th>
              </tr>
              </thead>
              <tbody v-if="addModify==='add'">
                <tr>
                  <td v-model="add_postageModelRule_w.address"> 全国（ 默认运费）</td>
                  <td>
                    <input type="text"
                           style="width:50px;height:30px;" v-model="add_postageModelRule_w.firstWeight" @blur="checkDefaultNumber(add_postageModelRule_w.firstWeight,'firstWeight',add_postageModelRule_w)">
                  </td>
                  <td>
                    <input type="text" style="width:50px;height:30px;" v-model="add_postageModelRule_w.firstPostage" @blur="checkDefaultNumber(add_postageModelRule_w.firstPostage,'firstPostage',add_postageModelRule_w)">
                  </td>
                  <td>
                    <input type="text" style="width:50px;height:30px;" v-model="add_postageModelRule_w.continuedWeight" @blur="checkDefaultNumber(add_postageModelRule_w.continuedWeight,'continuedWeight',add_postageModelRule_w)">
                  </td>
                  <td>
                    <input type="text" style="width:50px;height:30px;" v-model="add_postageModelRule_w.continuedPostage" @blur="checkDefaultNumber(add_postageModelRule_w.continuedPostage,'continuedPostage',add_postageModelRule_w)">
                  </td>
                  <td></td>
                </tr>
                <tr v-for="(addRow,index) in addRows" v-if="addRows.length!==0">
                  <td class="relative">{{addressName.length == 0 ? '未添加地区' : addressName}}
                    <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                    <!--地区选择-->
                    <div class="cityBox">
                      <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                      <div class="test-div">
                        <div class="bigArea" v-for="(item,index) in datas">
                          <div class="left">
                            <input type="checkbox" v-model="addRow.areaIdArr" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                            {{item.name}}
                          </div>
                          <div class="pro" v-for="(pro,index) in item.subs">
                            <input type="checkbox" v-model="addRow.IdArr" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                            <span> {{pro.name}} </span>
                            <div class="cityWrap">
                              <div class="city" v-for="(city,index) in pro.subs">
                                <input type="checkbox" v-model="addRow.cityList" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <el-button @click="sureCheckCity($event)">确认</el-button>
                    </div>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstWeight" @blur="checkNumber(addRow.firstWeight,index,'firstWeight',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedWeight" @blur="checkNumber(addRow.continuedWeight,index,'continuedWeight',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)">
                  </td>
                  <td @click="delectRule(index)"> 删除</td>
                </tr>
              </tbody>
              <tbody v-if="addModify==='modify'">
                <tr v-for="(add_postageModelRule_w,index) in formwork.postageModelRules">
                  <td>{{add_postageModelRule_w.address=='' || add_postageModelRule_w.address==null ?'全国（ 默认运费）':add_postageModelRule_w.address}}
                    <!-- <a v-if="index!=0" @click="addressCheckBox(index,$event)">编辑 </a> -->
                  <!--地区选择-->
                    <!-- <div class="cityBox">
                      <h4> 选择地区 <a class="close"
                                  @click="cityBoxHide"> X </a></h4>
                      <div class="test-div">
                        <div class="bigArea"
                            v-for="(item,index) in datas">
                          <div class="left">
                            <input type="checkbox"
                                  v-model="addRow.areaIdArr" :value="item.code"
                                  @click="chooseArea(item.code,$event)"/>{{item.name}}
                          </div>
                          <div class="pro" v-for="(pro,index) in item.subs">
                            <input type="checkbox"
                                  v-model="addRow.IdArr" :value="pro.code"
                                  @click="choosePro(pro,$event)"/>
                            <span @click="cityShow(index,$event)"> {{pro.name}} </span>
                            <div class="cityWrap">
                              <div class="city" v-for="(city,index) in pro.subs">
                                <input type="checkbox"
                                      v-model="addRow.cityList" :value="city.code"
                                      @click="chooseCity(city,$event)"/> {{city.name}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td> -->
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule_w.firstWeight" @blur="checkNumber(add_postageModelRule_w.firstWeight,index,'firstWeight',formwork.postageModelRules)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule_w.firstPostage" @blur="checkNumber(add_postageModelRule_w.firstPostage,index,'firstPostage',formwork.postageModelRules)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule_w.continuedWeight" @blur="checkNumber(add_postageModelRule_w.continuedWeight,index,'continuedWeight',formwork.postageModelRules)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule_w.continuedPostage" @blur="checkNumber(add_postageModelRule_w.continuedPostage,index,'continuedPostage',formwork.postageModelRules)">
                  </td>
                  <td> <a v-if="index!=0" @click="delectRule1(index)">删除</a></td>
                </tr>
                <tr v-for="(addRow,index) in addRows"
                    v-if="addRows.length!==0">
                    <!--地区选择-->
                    <td class="relative">{{addressName.length == 0 ? '未添加地区' : addressName}}
                    <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                    <!--地区选择-->
                    <div class="cityBox">
                      <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                      <div class="test-div">
                        <div class="bigArea" v-for="(item,index) in datas">
                          <div class="left">
                            <input type="checkbox" v-model="addRow.areaIdArr" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                            {{item.name}}
                          </div>
                          <div class="pro" v-for="(pro,index) in item.subs">
                            <input type="checkbox" v-model="addRow.IdArr" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                            <span> {{pro.name}} </span>
                            <div class="cityWrap">
                              <div class="city" v-for="(city,index) in pro.subs">
                                <input type="checkbox" v-model="addRow.cityList" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <el-button @click="sureCheckCity($event)">确认</el-button>
                    </div>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstWeight" @blur="checkNumber(addRow.firstWeight,index,'firstWeight',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedWeight" @blur="checkNumber(addRow.continuedWeight,index,'continuedWeight',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)">
                  </td>
                  <td @click="delectRule(index)"> 删除</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p style="padding-left:290px;color:blue;cursor:pointer;" @click="addRow()"> 为制定地区设置运费 </p>
        <div class="form-group">
          <label class="col-sm-2 control-label"> 模板说明： </label>
          <div class="col-sm-6">
          <textarea class="form-control"
          cols="80"
          rows="7"
          placeholder="1-200字符"
          style="resize:none;"
          v-model="formwork.modelDescription" maxlength="200"> </textarea></div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit"
                    class="btn btn-info btn-lg save"
                    @click="save()"> 保存
            </button>
            <button type="submit"
                    class="btn btn-default btn-lg"
                    @click="back()"> 取消
            </button>
          </div>
        </div>
      </template>
      <!--按件数-->
      <template v-if="formwork.chargeType==1">
        <div class="form-group">
          <label class="col-sm-2 control-label"> * 运费计算规则： </label>
          <div class="col-sm-8">
            <table class="table table-bordered">
              <thead>
              <tr class="active">
                <th scope="row" style="width:210px "> 可配送至
                </th>
                <th> 首件 / 个</th>
                <th> 运费 / 元</th>
                <th> 续件 / 个</th>
                <th> 续费 / 元</th>
                <th> 操作</th>
              </tr>
              </thead>
              <!-- modify -->
              <tbody v-if="addModify==='modify'">
                  <tr v-for="(add_postageModelRule,index) in formwork.postageModelRules">
                    <td>{{add_postageModelRule.address=='' || add_postageModelRule.address== null ?'全国（ 默认运费）':add_postageModelRule.address}}</td>
                    <td>
                      <input type="text"
                            style="width:50px;height:30px;"
                            v-model="add_postageModelRule.firstPiece" @blur="checkInteger(add_postageModelRule.firstPiece,index,'firstPiece',formwork.postageModelRules)">
                    </td>
                    <td>
                      <input type="text"
                            style="width:50px;height:30px;"
                            v-model="add_postageModelRule.firstPostage" @blur="checkNumber(add_postageModelRule.firstPostage,index,'firstPostage',formwork.postageModelRules)">
                    </td>
                    <td>
                      <input type="text"
                            style="width:50px;height:30px;"
                            v-model="add_postageModelRule.continuedPiece" @blur="checkInteger(add_postageModelRule.continuedPiece,index,'continuedPiece',formwork.postageModelRules)">
                    </td>
                    <td>
                      <input type="text"
                            style="width:50px;height:30px;"
                            v-model="add_postageModelRule.continuedPostage" @blur="checkNumber(add_postageModelRule.continuedPostage,index,'continuedPostage',formwork.postageModelRules)">
                    </td>
                    <td><a v-if="index!=0" @click="delectRule1(index)">删除</a></td>
                </tr>
                <tr v-for="(addRow,index) in addRows"
                    v-if="addRows.length!==0">
                  <!--地区选择-->
                    <td class="relative">{{addressName.length == 0 ? '未添加地区' : addressName}}
                    <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                    <!--地区选择-->
                    <div class="cityBox">
                      <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                      <div class="test-div">
                        <div class="bigArea" v-for="(item,index) in datas">
                          <div class="left">
                            <input type="checkbox" v-model="addRow.areaIdArr" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                            {{item.name}}
                          </div>
                          <div class="pro" v-for="(pro,index) in item.subs">
                            <input type="checkbox" v-model="addRow.IdArr" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                            <span> {{pro.name}} </span>
                            <div class="cityWrap">
                              <div class="city" v-for="(city,index) in pro.subs">
                                <input type="checkbox" v-model="addRow.cityList" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <el-button @click="sureCheckCity($event)">确认</el-button>
                    </div>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstPiece" @blur="checkInteger(addRow.firstPiece,index,'firstPiece',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedPiece" @blur="checkInteger(addRow.continuedPiece,index,'continuedPiece',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)">
                  </td>
                  <td @click="delectRule(index)"> 删除</td>
                </tr>
              </tbody>
              <!-- add -->
              <tbody v-if="addModify==='add'">
                <tr>
                   <td v-model="add_postageModelRule.address"> 全国（ 默认运费）</td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule.firstPiece" @blur="checkDefaultInteger(add_postageModelRule.firstPiece,'firstPiece',add_postageModelRule)"/>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule.firstPostage" @blur="checkDefaultNumber(add_postageModelRule.firstPostage,'firstPostage',add_postageModelRule)"/>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule.continuedPiece" @blur="checkDefaultInteger(add_postageModelRule.continuedPiece,'continuedPiece',add_postageModelRule)"/>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="add_postageModelRule.continuedPostage" @blur="checkDefaultNumber(add_postageModelRule.continuedPostage,'continuedPostage',add_postageModelRule)"/>
                  </td>
                  <td></td>
                </tr>
                <tr v-for="(addRow,index) in addRows"
                    v-if="addRows.length!==0">
                  <!--地区选择-->
                    <td class="relative">{{addressName.length == 0 ? '未添加地区' : addressName}}
                    <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                    <!--地区选择-->
                    <div class="cityBox">
                      <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                      <div class="test-div">
                        <div class="bigArea" v-for="(item,index) in datas">
                          <div class="left">
                            <input type="checkbox" v-model="addRow.areaIdArr" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                            {{item.name}}
                          </div>
                          <div class="pro" v-for="(pro,index) in item.subs">
                            <input type="checkbox" v-model="addRow.IdArr" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                            <span> {{pro.name}} </span>
                            <div class="cityWrap">
                              <div class="city" v-for="(city,index) in pro.subs">
                                <input type="checkbox" v-model="addRow.cityList" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <el-button @click="sureCheckCity($event)">确认</el-button>
                    </div>
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstPiece" @blur="checkInteger(addRow.firstPiece,index,'firstPiece',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedPiece" @blur="checkInteger(addRow.continuedPiece,index,'continuedPiece',addRows)">
                  </td>
                  <td>
                    <input type="text"
                          style="width:50px;height:30px;"
                          v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)">
                  </td>
                  <td @click="delectRule(index)"> 删除</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p style="padding-left:290px;color:blue;cursor:pointer;"
           @click="addRow()"> 为制定地区设置运费 </p>
        <div class="form-group">
          <label class="col-sm-2 control-label"> 模板说明： </label>
          <div class="col-sm-6">
          <textarea class="form-control"
          cols="80"
          rows="7"
          placeholder="1-200字符"
          style="resize:none;"
          v-model="formwork.modelDescription"> </textarea></div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit"
                    class="btn btn-info btn-lg save"
                    @click="save()"> 保存
            </button>
            <button type="submit"
                    class="btn btn-default btn-lg"
                    @click="back()"> 取消
            </button>
          </div>
        </div>
        <div class="delectSizeWrap" v-show="delectBg">
          <div class="delectSizeCon">
            <p>是否删除运费模板</p>
            <button class="blueBtn" @click="delete_confirm()">确定</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button class="defultBtn" @click="deleteUnit()">取消</button>
            <a class="colseDelectBox" @click="deleteUnit()"><span class="	glyphicon glyphicon-remove"></span></a>
          </div>
        </div>
      </template>
    </form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 'normal',
        formwork: {
          chargeType: 0,
          postageModelRules: [{
              firstWeight: '',
              firstPiece: '',
              firstPostage: '',
              continuedWeight: '',
              continuedPiece: '',
              continuedPostage: ''
            }]
        },
        delectBg:'',
        addRows: [],
        addModify: 'add', // 判断是否是新增按钮进入
        chargeType: 0, // 按件还是按重
        areaIdArr: [], // area id
        IdArr: [], // 省id
        datas: [], // data树
        cityList: [], // 市id
        proList: [], // 省id暂存盒子
        cityLength: [], // 比对省下市是否全选
        address: [], // 选中的省/市名对象
        addressName: '', // 选中的省/市名
        postageModelRules: [], // 运费规则
        modelRules: [],
        modelId: '', // 模板id
        add_postageModelRule: {
          address: '',
          firstPiece: '',
          firstPostage: '',
          continuedPiece: '',
          continuedPostage: ''
        }, //add  allCoutry
        add_postageModelRule_w: {
          address: '',
          firstWeight: '',
          firstPostage: '',
          continuedWeight: '',
          continuedPostage: '',
          index: ''
        }
      }
    },
    created() {},
    watch: {
      'formwork.chargeType': {
        handler: function (val, oldVal) {
          let that = this
          if (val != oldVal) {
            that.add_postageModelRule = {}
            that.add_postageModelRule_w = {}
          }
        },
        deep: true
      }
    },
    methods: {
      cityBoxShow(index,$event){
        let that = this
        var el = event.target
        that.$(el).parents('.table').find('.cityBox').eq(index).show()
      },
      checkNumber (val, index, arr, list) {
        setTimeout(() => {
          if (val && $.isNumeric(val)) {
            val = Number(val).toFixed(2)
          } else {
            val = ''
          }
          list[index][arr] = val
        }, 0)
      },
      checkInteger (val, index, arr, list) {
        setTimeout(() => {
          var re = /^[0-9]+$/
          if (!re.test(val)) {
            list[index][arr] = ''
          }
        }, 0)
      },
      checkDefaultNumber (val, arr, obj) {
        setTimeout(() => {
          if (val && $.isNumeric(val)) {
            val = Number(val).toFixed(2)
          } else {
            val = ''
          }
          obj[arr] = val
        }, 0)
      },
      checkDefaultInteger (val, arr, obj) {
        setTimeout(() => {
          var re = /^[0-9]+$/
          if (!re.test(val)) {
            obj[arr] = ''
          }
        }, 0)
      },
      // 处理address数组为字符串
      sureCheckCity($event){
        let that = this
        let el = $event.target
        let proName = []
        for(var i=0;i<that.addRows[that.index].address.length;i++){
          if(that.addRows[that.index].address[i].cityName.length==0){
            proName.push(that.addRows[that.index].address[i].proName)
          }else{
            proName.push(that.addRows[that.index].address[i].proName+"("+that.addRows[that.index].address[i].cityName.toString()+")")
          }
        }
        that.addressName=proName.toString()
      },
// 选中大区时同时选中所有省市
      chooseArea(n, $event) {
        let that = this
        let el = event.target
        if (el.checked) {
          for (var i = 0; i < that.datas.length; i++) {
            if (that.datas[i].code === n) {
              for (var j = 0; j < that.datas[i].subs.length; j++) {
                // (that.addRows).push(that.datas[i].subs[j].code)
                that.addRows[that.index].IdArr.push(that.datas[i].subs[j].code)
                that.addRows[that.index].address.push(eval('(' + '{proName:"'+ that.datas[i].subs[j].name + '",cityName:[]}' + ')'))
                that.addRows[that.index].proList.push(that.datas[i].subs[j].code)
                for (var k = 0; k < that.datas[i].subs[j].subs.length; k++) {
                  if (that.datas[i].subs[j].subs[k].parent === that.datas[i].subs[j].code) {
                    that.addRows[that.index].cityList.push(that.datas[i].subs[j].subs[k].code)
                  }
                }
              }
            }
          }
        } else {
          for (var i = 0; i < that.datas.length; i++) {
            if (that.datas[i].code === n) {
              for (var j = 0; j < that.datas[i].subs.length; j++) {
                for (var k = 0; k < that.datas[i].subs[j].subs.length; k++) {
                  if (that.datas[i].subs[j].subs[k].parent === that.datas[i].subs[j].code) {
                    that.addRows[that.index].cityList.splice(that.$.inArray(that.datas[i].subs[j].subs[k].code, that.addRows[that.index].cityList), 1)
                  }
                }
                for(var x=0;x<that.addRows[that.index].address.length;x++){
                  if(that.datas[i].subs[j].name===that.addRows[that.index].address[x].proName){
                    that.addRows[that.index].address.splice(x, 1)
                    that.addRows[that.index].IdArr.splice(x, 1)
                  }
                }
              }

            }
          }
        }
      },
// 选中省时同时选中所有市
      choosePro(n, $event) {
        let that = this
        let el = event.target
        if (el.checked) {
          that.addRows[that.index].IdArr.push(n.code)
          //that.addRows[that.index].address.push(n.name)
          that.addRows[that.index].address.push(eval('(' + '{proName:"'+ n.name + '",cityName:[]}' + ')'))
          for (var i = 0; i < that.datas.length; i++) {
            for (var j = 0; j < that.datas[i].subs.length; j++) {
              if (that.datas[i].subs[j].code === n.code) {
                for (var k = 0; k < that.datas[i].subs[j].subs.length; k++) {
                  if (that.datas[i].subs[j].subs[k].parent === n.code) {
                    that.addRows[that.index].cityList.push(that.datas[i].subs[j].subs[k].code)
                  }
                }
              }
            }
          }
          for (var i = 0; i < that.datas.length; i++) {
            if(that.datas[i].code==n.parent){
              if(that.$.inArray(n.parent,that.addRows[that.index].areaIdArr)==-1){
                that.addRows[that.index].areaIdArr.push(n.parent)
              }
            }
          }
        } else {
          for (var i = 0; i < that.datas.length; i++) {
            for (var j = 0; j < that.datas[i].subs.length; j++) {
              for (var k = 0; k < that.datas[i].subs[j].subs.length; k++) {
                if (that.datas[i].subs[j].subs[k].parent === n.code) {
                  that.addRows[that.index].cityList.splice(that.$.inArray(that.datas[i].subs[j].subs[k].code, that.addRows[that.index].cityList), 1)
                }
              }
            }
          }
          for(var x=0;x<that.addRows[that.index].address.length;x++){
            if(n.name===that.addRows[that.index].address[x].proName){
              that.addRows[that.index].address.splice(x, 1)
              that.addRows[that.index].IdArr.splice(x, 1)
            }
          }
          let point=0
          for (var i = 0; i < that.datas.length; i++) {
            if(that.datas[i].code==n.parent){
              for(let j =0 ;j<that.datas[i].subs.length;j++){
                for(let p = 0; p<that.addRows[that.index].IdArr.length;p++){
                  if(that.datas[i].subs[j].code==that.addRows[that.index].IdArr[p]){
                    point++
                  }
                }
              }
              if(point==0){
                that.addRows[that.index].areaIdArr.splice(that.$.inArray(n.parent, that.addRows[that.index].areaIdArr), 1)
              }
            }
          }

        }
      },
// 市被选时对应省被选中,
      chooseCity(city, $event) {
        let that = this
        let el = event.target
        if (el.checked) {
          for (var i = 0; i < that.datas.length; i++) {
            for (var j = 0; j < that.datas[i].subs.length; j++) {
              if (that.datas[i].subs[j].code === city.parent) {
                if (that.$.inArray(that.datas[i].code, that.addRows[that.index].areaIdArr == -1)) {
                  that.addRows[that.index].areaIdArr.push(that.datas[i].code)
                }
                if (that.$.inArray(city.parent, that.addRows[that.index].IdArr) == -1) {
                  that.addRows[that.index].IdArr.push(city.parent)
                }
                let flag = false
                for(var x=0;x<that.addRows[that.index].address.length;x++){
                  if(that.datas[i].subs[j].name==that.addRows[that.index].address[x].proName){
                    //有省名
                    that.addRows[that.index].address[x].cityName.push(city.name)
                    let flag1 = 0
                    for (let m = 0; m < that.datas[i].subs[j].subs.length; m++) {
                      for (let p = 0; p < that.addRows[that.index].address[x].cityName.length; p++) {
                        if (that.datas[i].subs[j].subs[m].name == that.addRows[that.index].address[x].cityName[p]) {
                          flag1++ //检测省内被选中的市还剩几个
                        }
                      }
                    }
                    // if(flag1=that.datas[i].subs[j].subs.length){ //如果被选中的市与该省所有市数量相等 则清空address对应省下的市名
                    //   that.addRows[that.index].address[x].cityName=[]
                    // }
                    flag = true
                    break
                  }
                }
                if(!flag){
                  //没有省名
                  that.addRows[that.index].address.push(eval('(' + '{proName:"'+ that.datas[i].subs[j].name + '",cityName:["'+city.name+'"]}' + ')'))
                }
              }
            }
          }
        } else {
          let point = 0
          for (let i = 0; i < that.datas.length; i++) {
            for (let j = 0; j < that.datas[i].subs.length; j++) {
              if (that.datas[i].subs[j].code === city.parent) {
                for (let m = 0; m < that.datas[i].subs[j].subs.length; m++) {
                  for (let p = 0; p < that.addRows[that.index].cityList.length; p++) {
                    if (that.datas[i].subs[j].subs[m].code == that.addRows[that.index].cityList[p]) {
                      point++ //检测省内被选中的市还剩几个
                    }
                  }
                }
                if (point==1) { // 如果城市是省内被选中的最后一个
                  // that.addRows[that.index].IdArr.splice(that.$.inArray(city.parent, that.addRows[that.index].IdArr), 1)
                  // that.addRows[that.index].address.splice(that.$.inArray(that.datas[i].subs[j].name, that.addRows[that.index].address), 1)
                  for(var x=0;x<that.addRows[that.index].address.length;x++){
                    if(that.datas[i].subs[j].name===that.addRows[that.index].address[x].proName){
                      that.addRows[that.index].address.splice(x, 1)
                      that.addRows[that.index].IdArr.splice(x, 1)
                    }
                  }
                }else{
                  for(var x=0;x<that.addRows[that.index].address.length;x++){
                    if(that.datas[i].subs[j].name===that.addRows[that.index].address[x].proName){
                      for(var y=0;y<that.addRows[that.index].address[x].cityName.length;y++){
                        if(city.name==that.addRows[that.index].address[x].cityName[y]){
                          that.addRows[that.index].address[x].cityName.splice(y, 1)
                        }
                      }
                    }
                  }
                }
                // 检测大区内剩余省还剩几个
                let point2=0
                for(let n=0;n<that.datas.length;n++){
                    if(that.datas[i].subs[j].parent==that.datas[n].code){
                      for(let f=0;f<that.datas[n].subs.length;f++){
                          for(let y = 0; y < that.addRows[that.index].IdArr.length; y++){
                            if(that.addRows[that.index].IdArr[y]==that.datas[n].subs[f].code){
                              point2++
                            }
                          }
                      }
                      if(point2==0){
                         that.addRows[that.index].areaIdArr.splice(that.$.inArray(that.datas[n].code, that.addRows[that.index].areaIdArr), 1)
                      }
                    }
                }
                //that.addRows[that.index].address.splice(that.$.inArray(city.name, that.addRows[that.index].address), 1)
              }
            }
          }
        }
      },
// 点击取消
      back(){
        let that = this
        that.$goRoute({
          name: 'formwork'
        })
      },
// 新增行
      addRow(){
        let newRow = {
          address: [],
          areaIdArr: [],
          IdArr: [],
          cityList: [],
          proList: [],
          firstWeight: '',
          firstPiece: '',
          firstPostage: '',
          continuedWeight: '',
          continuedPiece: '',
          continuedPostage: ''
        }
        this.addRows.push(newRow)
      },
      isdelete(){
        let that = this;
        that.delectBg = true;
      },
// 删除行
      delectRule(index)
      {
        this.addRows.splice(index, 1)
      },
// 删除行
      delectRule1(index)
      {
        this.formwork.postageModelRules.splice(index, 1)
      },
// 显示地区选择盒子
      addressCheckBox(index, $event)
      {
        let that = this
        var el = event.target
        that.$(el).parents('.table').find('.cityBox').eq(index).toggle()
        that.index = index
      },
// 隐藏地区选择盒子
      cityBoxHide(){
        this.$('.table').find('.cityBox').hide()
      },
// 显示市级盒子
      cityShow (index, $event) {
        let that = this
        var el = event.target
        that.$(el).parent('.pro').find('.cityWrap').toggle()
      },
      // 点击保存
      save () {
        let that = this
        if (that.formwork.modelName === undefined || that.formwork.modelName.trim() === '') {
          that.show_tip('请输入模板名称')
          return
        }
        if (that.formwork.chargeType === undefined || that.formwork.chargeType === '') {
          that.show_tip('请选择计费方式')
          return
        }
        if (that.addModify === 'add') {
          if (that.formwork.chargeType == 1) {
            that.postageModelRules.push(that.add_postageModelRule)
          } else {
            that.postageModelRules.push(that.add_postageModelRule_w)
          }
          //console.log(that.postageModelRules)
          for (var i = 0; i < that.postageModelRules.length; i++) {
            if (that.formwork.chargeType === 1) {
              if (that.postageModelRules[i].firstPiece === '' || that.postageModelRules[i].firstPostage === '' || that.postageModelRules[i].continuedPiece === '' || that.postageModelRules[i].continuedPostage === '') {
                that.postageModelRules = []
                that.show_tip('运费计算规则不能为空')
                return
              }
            } else {
              if (that.postageModelRules[i].firstWeight === '' || that.postageModelRules[i].firstPostage === '' || that.postageModelRules[i].continuedWeight === '' || that.postageModelRules[i].continuedPostage === '') {
                that.postageModelRules = []
                that.show_tip('运费计算规则不能为空')
                return
              }
            }
          }
          if (that.addRows.length > 0) {
            for (var i = 0; i < that.addRows.length; i++) {
              if (that.addRows[i].address === undefined || that.addRows[i].address === '' || that.addRows[i].address.length === 0) {
                that.postageModelRules = []
                that.show_tip('请添加地区')
                return
              }
              if (that.formwork.chargeType == 1) {
                if (that.addRows[i].firstPiece === '' || that.addRows[i].firstPostage === '' || that.addRows[i].continuedPiece === '' || that.addRows[i].continuedPostage === '') {
                  that.postageModelRules = []
                  that.show_tip('运费计算规则不能为空')
                  return
                }
              } else {
                if (that.addRows[i].firstWeight === '' || that.addRows[i].firstPostage === '' || that.addRows[i].continuedWeight === '' || that.addRows[i].continuedPostage === '') {
                  that.postageModelRules = []
                  that.show_tip('运费计算规则不能为空')
                  return
                }
              }
              that.postageModelRule = {
                address: that.addRows[i].address.join(),
                cityCode: that.addRows[i].cityList.join(),
                continuedPiece: that.addRows[i].continuedPiece,
                continuedPostage: that.addRows[i].continuedPostage,
                continuedWeight: that.addRows[i].continuedWeight,
                firstPiece: that.addRows[i].firstPiece,
                firstPostage: that.addRows[i].firstPostage,
                firstWeight: that.addRows[i].firstWeight,
                defaultFlag: 1
              }
              that.postageModelRules.push(that.postageModelRule)
            }
          }
        } else {
          for (var i=0; i<that.formwork.postageModelRules.length; i++){
            that.postageModelRules.push(that.formwork.postageModelRules[i])
          }
          for (var i = 0; i < that.addRows.length; i++) {
            that.postageModelRule = {
              address: that.addRows[i].address.join(),
              cityCode: that.addRows[i].cityList.join(),
              continuedPiece: that.addRows[i].continuedPiece,
              continuedPostage: that.addRows[i].continuedPostage,
              continuedWeight: that.addRows[i].continuedWeight,
              firstPiece: that.addRows[i].firstPiece,
              firstPostage: that.addRows[i].firstPostage,
              firstWeight: that.addRows[i].firstWeight,
              defaultFlag: that.addRows[that.index].address === '' ? 0 : 1
            }
            that.postageModelRules.push(that.postageModelRule)
          }
        }

        for (var i = 0; i < that.postageModelRules.length; i++) {
          that.postageModelRules[i].continuedPostage = parseFloat(that.postageModelRules[i].continuedPostage * 100).toFixed(2)
          that.postageModelRules[i].firstPostage = parseFloat(that.postageModelRules[i].firstPostage * 100).toFixed(2)
        }
        that.$.ajax({
          type: that.addModify === 'add' ? 'post' : 'put',
          url: that.localbase + 'm2c.scm/postage',
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            modelId: that.addModify === 'add' ? that.modelId : that.$route.query.modelId,
            postageModelRules: JSON.stringify(that.postageModelRules),
            modelName: that.formwork.modelName,
            chargeType: that.formwork.chargeType,
            modelDescription: that.formwork.modelDescription
          },
          success: function (result) {
            that.postageModelRules = []
            if (result.status === 200) {
              that.show_tip('保存成功')
              that.$goRoute({path: 'formwork'})
            } else {
              that.show_tip(result.errorMessage)
            }
          }
        })
      }
    },
    mounted(){
      let that = this
      that.$(window).click(function(){
        that.$('.addMess').find('.cityBox').hide()
      })
      that.$.ajax({
        type: 'get',
        url: that.localbase + 'm2c.operate/address/getinner.web',
        success: function (result) {
          that.datas = result.content.subs
        }
      })
      if (that.$route.query.addModify === 'true') {
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
        that.addModify = 'modify'
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/postage/' + that.$route.query.modelId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.formwork = result.content
            if (that.formwork.postageModelRules.length > 0) {
              for (var i = 0; i < that.formwork.postageModelRules.length; i++) {
                that.formwork.postageModelRules[i].firstPostage = that.formwork.postageModelRules[i].firstPostage / 100
                that.formwork.postageModelRules[i].continuedPostage = that.formwork.postageModelRules[i].continuedPostage / 100
              }
            }
            console.log(that.formwork)
          }
        })
      }
    }
  }
</script>
<style scoped>
  .addMess {
    margin-top: 168px;
  }

  td.relative {
    position: relative;
  }

  td.relative a {
    display: block;
    float: right;
    margin-right: 10px;
  }

  .cityBox {
    display: none;
    width: 650px;
    height: 400px;
    background: #fff;
    border: 1px solid #ccc;
    position: absolute;
    top: 40px;
    left: -150px;
    z-index: 2;
  }

  .cityBox h4 {
    width: 100%;
    height: 40px;
    background: #ededed;
    line-height: 40px;
    text-indent: 20px;
  }

  .cityBox h4 a.close {
    float: right;
    margin-right: 10px;
  }

  .cityBox .bigArea {
    width: 100%;
    height: 48px;
    float: left;
    line-height: 48px;
    padding-left: 20px;
  }

  .cityBox .bigArea:nth-child(even) {
    background: #ccc
  }

  .cityBox .bigArea:nth-child(odd) {
    background: #fff
  }

  .cityBox .bigArea .left {
    float: left;
    font-weight: bold;
  }

  .cityBox .bigArea .pro {
    display: inline-block;
    float: left;
    width: 84px;
    margin-left: 12px;
    position: relative;
  }
  .pro span {
    width: 64px;
  }

  .pro span i {
    display: inline-block;
    margin-right: 14px;
    float: right;
  }

  .pro .cityWrap {
    display: none;
    width: 200px;
    height: auto;
    border: 1px solid #ccc;
    position: absolute;
    top: 30px;
    left: -30px;
    background: #fff;
    z-index: 2;
  }
  .cityBox .bigArea .pro:hover .cityWrap{
    display: block;
  }
  .cityWrap .city {
    display: inline-block;
    float: left;
    margin-left: 10px;
  }
</style>

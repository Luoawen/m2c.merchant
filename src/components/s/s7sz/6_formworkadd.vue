<template>
  <div class="content">
    <el-row :gutter="20">
      <el-col :span="4">
        <span class="alignRight"><i class="red">*</i>运费模板名称：</span>
      </el-col>
      <el-col :span="20">
        <el-input placeholder="1-20字符" v-model="formwork.modelName" :maxlength="20"></el-input>
      </el-col>
      <!-- <label class="col-sm-2 control-label"> </label>
      <div class="col-sm-3">
        <input type="text" class="form-control" >
      </div> -->
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <span class="alignRight"><i class="red">*</i>计费方式：</span>
      </el-col>
      <!-- <label class="col-sm-2 control-label"><i class="red">*</i>计费方式： </label> -->
      <el-col :span="20" style="margin-top:17px;">
        <el-radio-group v-model="formwork.chargeType" @change="changeChargeType">
          <el-radio :label="0" :disabled="addModify==='modify'">按重量</el-radio>
          <el-radio :label="1" :disabled="addModify==='modify'">按件数</el-radio>
          <el-radio :label="2" :disabled="addModify==='modify'">全国包邮</el-radio>
        </el-radio-group>
      </el-col>
        <!-- <form>
          <input name="tem" type="radio" value='0' v-model="formwork.chargeType" id="tem" v-if="addModify==='add'" />
          <input name="tem" type="radio" value='0' v-model="formwork.chargeType" id="tem" v-if="addModify==='modify'" :disabled="modifyFlag==1"/>
          <label for="tem">按重量</label>
          <input name="tem" type="radio" value='1' v-model="formwork.chargeType" id="tem1" v-if="addModify==='add'" />
          <input name="tem" type="radio" value='1' v-model="formwork.chargeType" id="tem1" v-if="addModify==='modify'" :disabled="modifyFlag!=1"/>
          <label for="tem1">按件数</label>
        </form> -->
      
    </el-row>
    <!--按重量-->
    <template v-if="formwork.chargeType==0">
      <el-row :gutter="20">
        <el-col :span="4">
          <span class="alignRight"><i class="red">*</i>运费计算规则
            <div class="icon">
              <div class="tips" style="width:400px;z-index:2; text-align: left;">
                <p>1、按重计费规则；即≤首重时，按首运费计算，超过首重的部分，按照续重、续费计算；比如商品5kg，首重1kg，首运费10元，续重2kg，续费5元（代表每增加0~1kg，运费增加2.5元）；则运费=10+4*（5/2）
                </p>
                <p>
                  2、按件计费规则；即≤首件时，按首运费计算，超过首件的部分，按照续件、续费计算；比如商品总共20件，首件5个，首运费10元，续件5个，续费15元；则运费=10+15*（15/5）
                </p>
              </div>
            </div>
          ： </span>
        </el-col>
        <el-col :span="16">
          <table class="table">
            <thead>
            <tr>
              <th style="width:210px"> 可配送至</th>
              <th> 首重 / kg</th>
              <th> 首运费 / 元</th>
              <th> 续重 / kg</th>
              <th> 续费 / 元</th>
              <th> 操作</th>
            </tr>
            </thead>
            <tbody v-if="addModify==='add'">
              <tr>
                <td v-model="add_postageModelRule_w.address"> 全国（ 默认运费）</td>
                <td>
                  <el-input type="text"
                          style="width:100px;height:30px;" v-model="add_postageModelRule_w.firstWeight" @blur="checkDefaultNumber(add_postageModelRule_w.firstWeight,'firstWeight',add_postageModelRule_w)"></el-input>
                </td>
                <td>
                  <el-input type="text" style="width:100px;height:30px;" v-model="add_postageModelRule_w.firstPostage" @blur="checkDefaultNumber(add_postageModelRule_w.firstPostage,'firstPostage',add_postageModelRule_w)"></el-input>
                </td>
                <td>
                  <el-input type="text" style="width:100px;height:30px;" v-model="add_postageModelRule_w.continuedWeight" @blur="checkDefaultNumber(add_postageModelRule_w.continuedWeight,'continuedWeight',add_postageModelRule_w)"></el-input>
                </td>
                <td>
                  <el-input type="text" style="width:100px;height:30px;" v-model="add_postageModelRule_w.continuedPostage" @blur="checkDefaultNumber(add_postageModelRule_w.continuedPostage,'continuedPostage',add_postageModelRule_w)"></el-input>
                </td>
                <td></td>
              </tr>
              <tr v-for="(addRow,index) in addRows" v-if="addRows.length!==0">
                <td class="relative">{{addRow.address == '' ? '未添加地区' : addRow.address}}
                  <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                  <!--地区选择-->
                  <div class="cityBox">
                    <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                    <div class="test-div">
                      <div class="bigArea" v-for="(item,index) in datas">
                        <div class="left">
                          <input type="checkbox" v-model="addRow.areaIdArr" :class="'area'+item.code" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                          {{item.name}}
                        </div>
                        <div class="pro" v-for="(pro,index) in item.subs">
                          <input type="checkbox" v-model="addRow.IdArr" :class="'pro'+pro.code" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                          <span> {{pro.name}} </span>
                          <div class="cityWrap">
                            <div class="city" v-for="(city,index) in pro.subs">
                              <input type="checkbox" v-model="addRow.cityList" :class="'city'+city.code" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-button @click.stop="sureCheckCity(index,$event)">确认</el-button>
                  </div>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstWeight" @blur="checkNumber(addRow.firstWeight,index,'firstWeight',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedWeight" @blur="checkNumber(addRow.continuedWeight,index,'continuedWeight',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)"></el-input>
                </td>
                <td><a @click="delectRule(index)">删除</a></td>
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
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule_w.firstWeight" @blur="checkNumber(add_postageModelRule_w.firstWeight,index,'firstWeight',formwork.postageModelRules)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule_w.firstPostage" @blur="checkNumber(add_postageModelRule_w.firstPostage,index,'firstPostage',formwork.postageModelRules)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule_w.continuedWeight" @blur="checkNumber(add_postageModelRule_w.continuedWeight,index,'continuedWeight',formwork.postageModelRules)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule_w.continuedPostage" @blur="checkNumber(add_postageModelRule_w.continuedPostage,index,'continuedPostage',formwork.postageModelRules)"></el-input>
                </td>
                <td> <a v-if="index!=0" @click="delectRule1(index)">删除</a></td>
              </tr>
              <tr v-for="(addRow,index) in addRows"
                  v-if="addRows.length!==0">
                  <!--地区选择-->
                  <td class="relative">{{addRow.address == '' ? '未添加地区' : addRow.address}}
                  <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                  <!--地区选择-->
                  <div class="cityBox">
                    <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                    <div class="test-div">
                      <div class="bigArea" v-for="(item,index) in datas">
                        <div class="left">
                          <input type="checkbox" v-model="addRow.areaIdArr" :class="'area'+item.code" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                          {{item.name}}
                        </div>
                        <div class="pro" v-for="(pro,index) in item.subs">
                          <input type="checkbox" v-model="addRow.IdArr" :class="'pro'+pro.code" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                          <span> {{pro.name}} </span>
                          <div class="cityWrap">
                            <div class="city" v-for="(city,index) in pro.subs">
                              <input type="checkbox" v-model="addRow.cityList" :class="'city'+city.code" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-button @click.stop="sureCheckCity(index,$event)">确认</el-button>
                  </div>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstWeight" @blur="checkNumber(addRow.firstWeight,index,'firstWeight',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedWeight" @blur="checkNumber(addRow.continuedWeight,index,'continuedWeight',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)"></el-input>
                </td>
                <td><a @click="delectRule(index)">删除</a></td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="5"></el-col>
        <el-col :offset="4" :span="16">
          <a @click="addRow()" style="cursor:pointer;">为指定地区设置运费</a>
        </el-col>
      </el-row>
    </template>
    <!--按件数-->
    <template v-if="formwork.chargeType==1">
      <el-row :gutter="20">
        <el-col :span="4">
          <span class="alignRight"><i class="red">*</i>运费计算规则
            <div class="icon">
              <div class="tips" style="width:400px;z-index:2; text-align: left;">
                <p>1、按重计费规则；即≤首重时，按首运费计算，超过首重的部分，按照续重、续费计算；比如商品5kg，首重1kg，首运费10元，续重2kg，续费5元（代表每增加0~1kg，运费增加2.5元）；则运费=10+4*（5/2）
                </p>
                <p>
                  2、按件计费规则；即≤首件时，按首运费计算，超过首件的部分，按照续件、续费计算；比如商品总共20件，首件5个，首运费10元，续件5个，续费15元；则运费=10+15*（15/5）
                </p>
              </div>
            </div>
            ：
          </span>
        </el-col>
        <el-col :span="16">
          <table class="table">
            <thead>
            <tr>
              <th scope="row" style="width:210px "> 可配送至
              </th>
              <th> 首件 / 个</th>
              <th> 首运费 / 元</th>
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
                    <el-input type="text"
                          style="width:100px;height:30px;"
                          v-model="add_postageModelRule.firstPiece" @blur="checkInteger(add_postageModelRule.firstPiece,index,'firstPiece',formwork.postageModelRules)"></el-input>
                  </td>
                  <td>
                    <el-input type="text"
                          style="width:100px;height:30px;"
                          v-model="add_postageModelRule.firstPostage" @blur="checkNumber(add_postageModelRule.firstPostage,index,'firstPostage',formwork.postageModelRules)"></el-input>
                  </td>
                  <td>
                    <el-input type="text"
                          style="width:100px;height:30px;"
                          v-model="add_postageModelRule.continuedPiece" @blur="checkInteger(add_postageModelRule.continuedPiece,index,'continuedPiece',formwork.postageModelRules)"></el-input>
                  </td>
                  <td>
                    <el-input type="text"
                          style="width:100px;height:30px;"
                          v-model="add_postageModelRule.continuedPostage" @blur="checkNumber(add_postageModelRule.continuedPostage,index,'continuedPostage',formwork.postageModelRules)"></el-input>
                  </td>
                  <td><a v-if="index!=0" @click="delectRule1(index)">删除</a></td>
              </tr>
              <tr v-for="(addRow,index) in addRows"
                  v-if="addRows.length!==0">
                <!--地区选择-->
                  <td class="relative">{{addRow.address == '' ? '未添加地区' : addRow.address}}
                  <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                  <!--地区选择-->
                  <div class="cityBox">
                    <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                    <div class="test-div">
                      <div class="bigArea" v-for="(item,index) in datas">
                        <div class="left">
                          <input type="checkbox" v-model="addRow.areaIdArr" :class="'area'+item.code" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                          {{item.name}}
                        </div>
                        <div class="pro" v-for="(pro,index) in item.subs">
                          <input type="checkbox" v-model="addRow.IdArr" :class="'pro'+pro.code" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                          <span> {{pro.name}} </span>
                          <div class="cityWrap">
                            <div class="city" v-for="(city,index) in pro.subs">
                              <input type="checkbox" v-model="addRow.cityList" :class="'city'+city.code" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-button @click.stop="sureCheckCity(index,$event)">确认</el-button>
                  </div>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstPiece" @blur="checkInteger(addRow.firstPiece,index,'firstPiece',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedPiece" @blur="checkInteger(addRow.continuedPiece,index,'continuedPiece',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)"></el-input>
                </td>
                <td><a @click="delectRule(index)">删除</a></td>
              </tr>
            </tbody>
            <!-- add -->
            <tbody v-if="addModify==='add'">
              <tr>
                  <td v-model="add_postageModelRule.address"> 全国（ 默认运费）</td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule.firstPiece" @blur="checkDefaultInteger(add_postageModelRule.firstPiece,'firstPiece',add_postageModelRule)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule.firstPostage" @blur="checkDefaultNumber(add_postageModelRule.firstPostage,'firstPostage',add_postageModelRule)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule.continuedPiece" @blur="checkDefaultInteger(add_postageModelRule.continuedPiece,'continuedPiece',add_postageModelRule)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="add_postageModelRule.continuedPostage" @blur="checkDefaultNumber(add_postageModelRule.continuedPostage,'continuedPostage',add_postageModelRule)"></el-input>
                </td>
                <td></td>
              </tr>
              <tr v-for="(addRow,index) in addRows"
                  v-if="addRows.length!==0">
                <!--地区选择-->
                  <td class="relative">{{addRow.address == '' ? '未添加地区' : addRow.address}}
                  <a @click.stop="addressCheckBox(index,$event)"> 编辑 </a>
                  <!--地区选择-->
                  <div class="cityBox">
                    <h4 @click.stop="cityBoxShow(index,$event)"> 选择地区 <a class="close" @click.stop="cityBoxHide"> X </a></h4>
                    <div class="test-div">
                      <div class="bigArea" v-for="(item,index) in datas">
                        <div class="left">
                          <input type="checkbox" v-model="addRow.areaIdArr" :class="'area'+item.code" :value="item.code" @click.stop="chooseArea(item.code,$event)"/>
                          {{item.name}}
                        </div>
                        <div class="pro" v-for="(pro,index) in item.subs">
                          <input type="checkbox" v-model="addRow.IdArr" :class="'pro'+pro.code" :value="pro.code" @click.stop="choosePro(pro,$event)"/>
                          <span> {{pro.name}} </span>
                          <div class="cityWrap">
                            <div class="city" v-for="(city,index) in pro.subs">
                              <input type="checkbox" v-model="addRow.cityList" :class="'city'+city.code" :value="city.code" @click.stop="chooseCity(city,$event)"/> {{city.name}}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-button @click.stop="sureCheckCity(index,$event)">确认</el-button>
                  </div>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstPiece" @blur="checkInteger(addRow.firstPiece,index,'firstPiece',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.firstPostage" @blur="checkNumber(addRow.firstPostage,index,'firstPostage',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedPiece" @blur="checkInteger(addRow.continuedPiece,index,'continuedPiece',addRows)"></el-input>
                </td>
                <td>
                  <el-input type="text"
                        style="width:100px;height:30px;"
                        v-model="addRow.continuedPostage" @blur="checkNumber(addRow.continuedPostage,index,'continuedPostage',addRows)"></el-input>
                </td>
                <td ><span @click="delectRule(index)">删除</span></td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="5"></el-col>
        <el-col :offset="4" :span="16">
          <a @click="addRow()" style="cursor:pointer;">为指定地区设置运费</a>
        </el-col>
      </el-row>
      <!-- <div class="form-group">
        <label class="col-sm-2 control-label"> 模板说明： </label>
        <div class="col-sm-6">
        <textarea class="form-control"
        cols="80"
        rows="7"
        placeholder="1-100字符"
        style="resize:none;"
        v-model="formwork.modelDescription" maxlength="100"> </textarea></div>
      </div>
      <div style="padding-left:290px;"><span style="color: #aab2bd">便于顾客看到每个商品的模板说明，以便知晓您的运费计费规则</span></div>
      <br/>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <el-button type="primary" @click="save()"> 保存
          </el-button>
          <el-button @click="back()"> 取消
          </el-button>
        </div>
      </div> -->
      <div class="delectSizeWrap" v-show="delectBg">
        <div class="delectSizeCon">
          <p>是否删除运费模板</p>
          <button class="blueBtn" @click="delete_confirm()">确定</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <button class="defultBtn" @click="deleteUnit()">取消</button>
          <a class="colseDelectBox" @click="deleteUnit()"><span class="	glyphicon glyphicon-remove"></span></a>
        </div>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="4"><span class="alignRight">模板说明：</span></el-col>
      <el-col :span="16">
        <el-input
        cols="80" type="textarea"
        :rows="3"
        placeholder="1-100字符"
        v-model="formwork.modelDescription" :maxlength="100"> </el-input>
      </el-col>
      <el-col :span="5"></el-col>
      <el-col :offset="4" :span="16" style="margin-top:10px;">
        <span style="color: #aab2bd;">便于顾客看到每个商品的模板说明，以便知晓您的运费计费规则</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :offset="4" :span="16" class="mt20">
        <el-button type="primary" @click="save()"> 保存
        </el-button>
        <el-button @click="back()"> 取消
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 'normal',
        ceshi:'abc',
        disabledList:[], // 多选框disable数组
        nowCityList:[],// 临时存放当前编辑的cityList 以防止用户点击关闭而非确认
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
        address: '', // 选中的省/市名对象
        addressName: [], // 选中的省/市名
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
        },
        modifyFlag: '',
        chargeTypeFlag:0 //包邮模板是否已存在
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
            that.addRows = []
            that.disabledList = []
          }
        },
        deep: true
      }
    },
    methods: {
      changeChargeType(){
        let that = this
        console.log(that.formwork.chargeType)
        if(that.formwork.chargeType==2){
          that.$.ajax({
            method: 'get',
            url: this.localbase + 'm2c.scm/web/postage/nationwide',
            data: {
              dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId
            },
            success: function (result) {
              if (result.status==200){
                if(result.content===true)
                {
                  that.chargeTypeFlag = 0
                  that.$message.info('全国包邮模板已存在')
                  return
                }else{
                  return
                }
              } else {
                that.$message.error(result.errorMessage)
              }
            }
          })
        }
      },
      cityBoxShow(index,$event){
        let that = this
        var el = event.target
        that.$(el).parents('.table').find('.cityBox').eq(index).show()
      },
      checkNumber (val, index, arr, list) {
        setTimeout(() => {
          if (val && $.isNumeric(val) && val >= 0) {
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
          if (val && $.isNumeric(val) && val >= 0) {
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
      sureCheckCity(index,$event){
        let that = this
        let el = $event.target
        let cityLength = []
        for(var i=0;i<that.datas.length;i++){
          for(var j=0;j<that.datas[i].subs.length;j++){
            for(var k=0;k<that.datas[i].subs[j].subs.length;k++){ // 循环到市
              cityLength.push(that.datas[i].subs[j].subs[k].code)
              //return cityLength
            }
          }
        }
        console.log(cityLength.length)
        console.log(that.addRows[that.index].cityList.length)
        if(cityLength.length==that.addRows[that.index].cityList.length){
          that.$message.error("请不要选中全国区域")
        } else{
          let proName = []
          for(var i=0;i<that.addRows[that.index].addressName.length;i++){
            if(that.addRows[that.index].addressName[i].cityName.length==0){
              proName.push(that.addRows[that.index].addressName[i].proName)
            }else{
              var res = [];
              var json = {};
              for(var j=0;j<that.addRows[that.index].addressName[i].cityName.length;j++){
                if(!json[that.addRows[that.index].addressName[i].cityName[j]]){
                res.push(that.addRows[that.index].addressName[i].cityName[j]);
                json[that.addRows[that.index].addressName[i].cityName[j]] = 1;
                }
              }
              console.log(res)
              proName.push(that.addRows[that.index].addressName[i].proName+"("+res.toString()+")")
            }
          }
          that.addRows[that.index].address=proName.toString()
          console.log(that.addRows[that.index].address)
          // 使本次选中的cityCode push到禁用数组
          for(var i = 0;i<that.addRows[that.index].cityList.length;i++){
            that.disabledList.push(that.addRows[that.index].cityList[i])
          }
          that.$(el).parents('.table').find('.cityBox').eq(index).toggle()
        }
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
                that.addRows[that.index].addressName.push(eval('(' + '{proName:"'+ that.datas[i].subs[j].name + '",cityName:[]}' + ')'))
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
                for(var x=0;x<that.addRows[that.index].addressName.length;x++){
                  if(that.datas[i].subs[j].name===that.addRows[that.index].addressName[x].proName){
                    that.addRows[that.index].addressName.splice(x, 1)
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
          that.addRows[that.index].addressName.push(eval('(' + '{proName:"'+ n.name + '",cityName:[]}' + ')'))
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
          for(var x=0;x<that.addRows[that.index].addressName.length;x++){
            if(n.name===that.addRows[that.index].addressName[x].proName){
              that.addRows[that.index].addressName.splice(x, 1)
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
                for(var x=0;x<that.addRows[that.index].addressName.length;x++){
                  if(that.datas[i].subs[j].name==that.addRows[that.index].addressName[x].proName){
                    //有省名
                    that.addRows[that.index].addressName[x].cityName.push(city.name)
                    let flag1 = 0
                    for (let m = 0; m < that.datas[i].subs[j].subs.length; m++) {
                      for (let p = 0; p < that.addRows[that.index].addressName[x].cityName.length; p++) {
                        if (that.datas[i].subs[j].subs[m].name == that.addRows[that.index].addressName[x].cityName[p]) {
                          flag1++ //检测省内被选中的市还剩几个
                        }
                      }
                    }
                    if(flag1==that.datas[i].subs[j].subs.length){ //如果被选中的市与该省所有市数量相等 则清空addressName对应省下的市名
                      that.addRows[that.index].addressName[x].cityName=[]
                    }
                    flag = true
                    break
                  }
                }
                if(!flag){
                  //没有省名
                  that.addRows[that.index].addressName.push(eval('(' + '{proName:"'+ that.datas[i].subs[j].name + '",cityName:["'+city.name+'"]}' + ')'))
                }
              }
            }
          }
        } else {
          let point = 0
          for (let i = 0; i < that.datas.length; i++) {
            for (let j = 0; j < that.datas[i].subs.length; j++) {
              if (that.datas[i].subs[j].code === city.parent) {
                for(var a=0;a<that.addRows[that.index].addressName.length;a++){
                  if(that.datas[i].subs[j].name===that.addRows[that.index].addressName[a].proName){
                    for (let c = 0; c < that.datas[i].subs[j].subs.length; c++) {
                      for (let b = 0; b < that.addRows[that.index].cityList.length; b++) {
                        if (that.datas[i].subs[j].subs[c].code == that.addRows[that.index].cityList[b]) {
                          that.addRows[that.index].addressName[a].cityName.push(that.datas[i].subs[j].subs[c].name)
                        }
                      }
                    }
                  }
                }
                for (let m = 0; m < that.datas[i].subs[j].subs.length; m++) {
                  for (let p = 0; p < that.addRows[that.index].cityList.length; p++) {
                    if (that.datas[i].subs[j].subs[m].code == that.addRows[that.index].cityList[p]) {
                      point++ //检测省内被选中的市还剩几个
                    }
                  }
                }
                if (point==1) { // 如果城市是省内被选中的最后一个
                  // that.addRows[that.index].IdArr.splice(that.$.inArray(city.parent, that.addRows[that.index].IdArr), 1)
                  // that.addRows[that.index].addressName.splice(that.$.inArray(that.datas[i].subs[j].name, that.addRows[that.index].addressName), 1)
                  for(var x=0;x<that.addRows[that.index].addressName.length;x++){
                    if(that.datas[i].subs[j].name===that.addRows[that.index].addressName[x].proName){
                      that.addRows[that.index].addressName.splice(x, 1)
                      that.addRows[that.index].IdArr.splice(x, 1)
                    }
                  }
                }else{
                  for(var x=0;x<that.addRows[that.index].addressName.length;x++){
                    if(that.datas[i].subs[j].name===that.addRows[that.index].addressName[x].proName){
                      for(var y=0;y<that.addRows[that.index].addressName[x].cityName.length;y++){
                        if(city.name==that.addRows[that.index].addressName[x].cityName[y]){
                          that.addRows[that.index].addressName[x].cityName.splice(y, 1)
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
                //that.addRows[that.index].addressName.splice(that.$.inArray(city.name, that.addRows[that.index].addressName), 1)
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
          addressName: [],
          address:'',
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
      delectRule(index) {
        let that = this
        for(var a=0;a<that.disabledList.length;a++){
          for(var b=0;b<that.addRows[index].cityList.length;b++){
            if(that.addRows[index].cityList[b]==that.disabledList[a]){
              that.disabledList.splice(a,1)
            }
          }
        }
        console.log(that.disabledList)
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
        that.$nextTick(()=>{
          //console.log(that.datas)
          if(that.addRows[index].cityList.length>0){ // 如果是编辑进入 对应选中省市可被操作
            for(var a=0;a<that.addRows[index].cityList.length;a++){
              that.nowCityList.push(that.addRows[index].cityList[a])// 防止用户不点确认点关闭使之前选中的市不能重新push进禁用数组
            }
          }
          //console.log("+暂存数组",that.nowCityList)
            if(that.addRows[index].cityList.length>0){ // 如果是编辑进入 对应选中省市可被操作
              for(var p = 0; p < that.disabledList.length; p++) {
                for(var b=0;b<that.addRows[index].cityList.length;b++){
                  if(that.addRows[index].cityList[b]==that.disabledList[p]){
                    that.disabledList.splice(p,1) // 从禁用数组中拿掉
                  }
                }
              }
              for(var i=0;i<that.datas.length;i++){
                for(var j=0;j<that.datas[i].subs.length;j++){
                  for(var k=0;k<that.datas[i].subs[j].subs.length;k++){ // 循环到市
                    for(var p = 0; p < that.disabledList.length; p++) {
                      if(that.disabledList[p]==that.datas[i].subs[j].subs[k].code){ // 对新的数组添加禁用
                        that.$('.city'+that.disabledList[p]).attr("disabled",true)// 市禁用
                        that.$('.pro'+that.datas[i].subs[j].code).attr("disabled",true)// 对应省禁用
                        that.$('.area'+that.datas[i].code).attr("disabled",true) // 对应大区禁用
                      }
                    }
                  }
                }
              }
              for(var i=0;i<that.datas.length;i++){
                for(var j=0;j<that.datas[i].subs.length;j++){
                  for(var k=0;k<that.datas[i].subs[j].subs.length;k++){ // 循环到市
                    for(var b=0;b<that.addRows[index].cityList.length;b++){
                      if(that.addRows[index].cityList[b]==that.datas[i].subs[j].subs[k].code){ // 解除禁用
                        that.$('.city'+that.addRows[index].cityList[b]).attr("disabled",false)
                        that.$('.pro'+that.datas[i].subs[j].code).attr("disabled",false)
                        that.$('.area'+that.datas[i].code).attr("disabled",false)
                      }
                    }
                  }
                }
              }
              console.log("去除当前省市的disableList",that.disabledList)
              //console.log("去除当前省市的disableList",that.disabledList)
            }else{
              for(var i=0;i<that.datas.length;i++){
                for(var j=0;j<that.datas[i].subs.length;j++){
                  for(var k=0;k<that.datas[i].subs[j].subs.length;k++){ // 循环到市
                    for(var p = 0; p < that.disabledList.length; p++) {
                      if(that.disabledList[p]==that.datas[i].subs[j].subs[k].code){ // 未选择地区内进入 不需要其他操作 直接禁用其他已有市
                        that.$('.city'+that.disabledList[p]).attr("disabled",true)
                        that.$('.pro'+that.datas[i].subs[j].code).attr("disabled",true)
                        that.$('.area'+that.datas[i].code).attr("disabled",true)
                      }
                    }
                  }
                }
              }
              console.log("首次disableList",that.disabledList)
            }

          // for(var i=0;i<that.datas.length;i++){
          //   for(var j=0;j<that.datas[i].subs.length;j++){
          //     for(var k=0;k<that.datas[i].subs[j].subs.length;k++){ // 循环到市

          //     }
          //   }
          // }
          console.log(that.disabledList)
        })
      },
// 隐藏地区选择盒子
      cityBoxHide(){
        let that = this
        //console.log("-暂存数据",that.nowCityList)
        if(that.nowCityList.length>0){
          for(var i=0;i<that.nowCityList.length;i++){
            that.disabledList.push(that.nowCityList[i]) // 将上次选中的市重新push进禁用数组
          }
        }
        //console.log(that.disabledList)
        that.nowCityList = []
        that.$('.table').find('.cityBox').hide()
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
          that.$message.error('请输入模板名称')
          return
        }
        if (that.formwork.chargeType === undefined || that.formwork.chargeType === '') {
          that.$message.error('请选择计费方式')
          return
        }
        if(that.formwork.chargeType!==2){
          if (that.addModify === 'add') {
            if (that.formwork.chargeType == 1) {
              that.postageModelRules.push(that.add_postageModelRule)
            } else {
              that.postageModelRules.push(that.add_postageModelRule_w)
            }
          } else {
            for (var i=0; i<that.formwork.postageModelRules.length; i++){
              that.postageModelRules.push(that.formwork.postageModelRules[i])
            }
          }
          if (that.postageModelRules == '') {
            that.$message.error('运费计算规则不能为空')
            return
          }
          for (var i = 0; i < that.postageModelRules.length; i++) {
            if (that.formwork.chargeType == 1) {
              if (that.postageModelRules[i].firstPiece === undefined || that.postageModelRules[i].firstPostage === undefined || that.postageModelRules[i].continuedPiece === undefined ||  that.postageModelRules[i].continuedPostage === undefined ||
                that.postageModelRules[i].firstPiece === '' || that.postageModelRules[i].firstPostage === '' || that.postageModelRules[i].continuedPiece === '' || that.postageModelRules[i].continuedPostage === '' ||
                that.postageModelRules[i].firstPiece === null || that.postageModelRules[i].firstPostage === null || that.postageModelRules[i].continuedPiece === null || that.postageModelRules[i].continuedPostage === null) {
                that.postageModelRules = []
                that.$message.error('运费计算规则不能为空')
                return
              }
            } else {
              if (that.postageModelRules[i].firstWeight === undefined || that.postageModelRules[i].firstPostage === undefined || that.postageModelRules[i].continuedWeight === undefined ||  that.postageModelRules[i].continuedPostage === undefined ||
                that.postageModelRules[i].firstWeight === '' || that.postageModelRules[i].firstPostage === '' || that.postageModelRules[i].continuedWeight === '' || that.postageModelRules[i].continuedPostage === ''||
                that.postageModelRules[i].firstWeight === null || that.postageModelRules[i].firstPostage === null || that.postageModelRules[i].continuedWeight === null || that.postageModelRules[i].continuedPostage === null) {
                that.postageModelRules = []
                that.$message.error('运费计算规则不能为空')
                return
              }
            }
          }
          if (that.addRows.length > 0) {
            for (var i = 0; i < that.addRows.length; i++) {
              if (that.addRows[i].address === undefined || that.addRows[i].address === '' || that.addRows[i].address.length === 0) {
                that.postageModelRules = []
                that.$message.error('请添加地区')
                return
              }
              if (that.formwork.chargeType == 1) {
                if (that.addRows[i].firstPiece === undefined || that.addRows[i].firstPostage === undefined || that.addRows[i].continuedPiece === undefined ||  that.addRows[i].continuedPostage === undefined ||
                  that.addRows[i].firstPiece === '' || that.addRows[i].firstPostage === '' || that.addRows[i].continuedPiece === '' || that.addRows[i].continuedPostage === ''||
                  that.addRows[i].firstPiece === null || that.addRows[i].firstPostage === null || that.addRows[i].continuedPiece === null || that.addRows[i].continuedPostage === null) {
                  that.postageModelRules = []
                  that.$message.error('运费计算规则不能为空')
                  return
                }
              } else {
                if (that.addRows[i].firstWeight === undefined || that.addRows[i].firstPostage === undefined || that.addRows[i].continuedWeight === undefined ||  that.addRows[i].continuedPostage === undefined ||
                  that.addRows[i].firstWeight === '' || that.addRows[i].firstPostage === '' || that.addRows[i].continuedWeight === '' || that.addRows[i].continuedPostage === '' ||
                  that.addRows[i].firstWeight === null || that.addRows[i].firstPostage === null || that.addRows[i].continuedWeight === null || that.addRows[i].continuedPostage === null) {
                  that.postageModelRules = []
                  that.$message.error('运费计算规则不能为空')
                  return
                }
              }
            }
          }
          for (var i = 0; i < that.addRows.length; i++) {
            that.postageModelRule = {
              address: that.addRows[i].address,
              cityCode: that.addRows[i].cityList.join(),
              continuedPiece: that.addRows[i].continuedPiece,
              continuedPostage: that.addRows[i].continuedPostage,
              continuedWeight: that.addRows[i].continuedWeight,
              firstPiece: that.addRows[i].firstPiece,
              firstPostage: that.addRows[i].firstPostage,
              firstWeight: that.addRows[i].firstWeight,
              defaultFlag: (that.addRows[that.index] != undefined && that.addRows[that.index].address === '') ? 0 : 1
            }
            that.postageModelRules.push(that.postageModelRule)
          }
          for (var i = 0; i < that.postageModelRules.length; i++) {
            that.postageModelRules[i].continuedPostage = parseFloat(that.postageModelRules[i].continuedPostage).toFixed(2)
            that.postageModelRules[i].firstPostage = parseFloat(that.postageModelRules[i].firstPostage).toFixed(2)
          }
        }
        
        that.$.ajax({
          type: that.addModify === 'add' ? 'post' : 'put',
          url: that.localbase + 'm2c.scm/web/postage',
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
              // that.$message.error('保存成功')
              that.$router.push({name: 'formwork'})
            } else {
              that.$message.error(result.errorMessage)
            }
          }
        })
      },
      // 获取省市区
      getcityTree () {
        let that = this
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.operate/address/getinner.web',
          success: function (result) {
            that.datas = result.content.subs
          }
        })
      }
    },
    mounted(){
      let that = this
      if (that.$route.query.addModify === 'true') {
        that.addModify = 'add'
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/web/postage/id',
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.modelId = result.content
            that.getcityTree()
          }
        })
      } else {
        that.addModify = 'modify'
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/web/postage/' + that.$route.query.modelId,
          data: {
            token: sessionStorage.getItem('mToken')
          },
          success: function (result) {
            that.formwork = result.content
            that.modifyFlag = result.content.chargeType
            if (that.formwork.postageModelRules.length > 0) {
              for (var i = 0; i < that.formwork.postageModelRules.length; i++) {
                that.formwork.postageModelRules[i].firstPostage = that.formwork.postageModelRules[i].firstPostage
                that.formwork.postageModelRules[i].continuedPostage = that.formwork.postageModelRules[i].continuedPostage
              }
            }
            for(var j=0;j<result.content.postageModelRules.length;j++){
              if(result.content.postageModelRules[j].cityCode!=null){
                for(var k=0;k<result.content.postageModelRules[j].cityCode.split(',').length;k++){
                  that.disabledList.push(result.content.postageModelRules[j].cityCode.split(',')[k])
                }
              }
            }
            that.$.ajax({
              type: 'get',
              url: that.localbase + 'm2c.operate/address/getinner.web',
              success: function (result) {
                that.datas = result.content.subs
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
.alignRight{text-align: right; line-height:50px;color:#666;font-size:14px;display: inline-block;width:100%;}
  td.relative {
    position: relative;
  }
  .table{border-top:1px solid #ddd;border-left:1px solid #ddd;}
  .table thead th{font-weight: normal;background:#DFE9F6;}
  .table td,.table th{line-height:30px;border-bottom:1px solid #ddd;border-right:1px solid #ddd;}
  .table .el-input{margin:0;height:20px;}
.el-row{margin-bottom:20px;}
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

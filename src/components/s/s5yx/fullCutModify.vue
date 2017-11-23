<template>
  <div class="m93xq">
    <div class="content">
      <div class="info-content">
        <h4>基础信息</h4>
        <div class="base wrap">
          <div>
            <p><span>编号：</span><span v-text="item.fullCutNo"></span></p>
            <p>有效期：
              <span v-text="item.expirationTimeStart"></span>
              <span>~</span>
              <span v-text="item.expirationTimeEnd"></span>
            </p>
          </div>
          <div>
            <p>
              <span>满减名称：</span>
              <input type="text" class="form-control set_name" placeholder="请输入满减名称" maxlength="11" v-model="params.full_cut_name" @blur="formValidator(1)">
              <span class="set_bz" style="color: red;" v-show="tip_show.name">名称为最多11位汉字数字英文,不能为空</span>
            </p>
            <p>
              <span>数量：</span>
              <input class="small-input form-control set_name" type="number" placeholder="请输入数量" v-model="params.total_num" oninput="if(value > 99999){value = 0}" @blur="formValidator(2)">
              <span class="set_bz" style="color: red;" v-show="tip_show.total_num">满减数量最多5位正整数</span>
            </p>
          </div>
          <div>
            <p><span>生成者：</span><span v-text="item.creatorType == 1 ? '平台' : item.creatorType == 2 ? '商家' : ''"></span></p>
            <p><span>状态：</span><span v-text="item.status == 1 ? '未生效' : item.status == 2 ? '已生效' : item.status == 3 ? '已失效' : ''"></span></p>
          </div>
          <div>
            <span><span>使用情况：</span><span v-text="item.isUse"></span></span>
          </div>

        </div>
      </div>
      <div class="info-content">
        <h4>规则条件</h4>
        <div class="base rule">
          <div class="intr">
            <p><span>形式：</span><span v-text="item.fullCutType===1?'减钱':item.fullCutType===2?'打折':item.fullCutType===3?'换购':''"></span></p>
            <!--满钱减钱-->
            <div class="tier" v-if="item.fullCutType===1&&item.thresholdType==1">
              <div v-for="fullCutItem in item.itemList">
                <p>
                  层级<span v-text="fullCutItem.level"></span>
                  &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold/100"></span>&nbsp;
                  元减&nbsp;<span v-text="fullCutItem.money/100"></span>&nbsp;元
                </p>
              </div>
            </div>
            <!--满件减钱-->
            <div class="tier" v-if="item.fullCutType===1&&item.thresholdType==2">
              <div v-for="fullCutItem in item.itemList">
                <p>
                  层级<span v-text="fullCutItem.level"></span>
                  &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold"></span>&nbsp;
                  件减&nbsp;<span v-text="fullCutItem.money/100"></span>&nbsp;元
                </p>
              </div>
            </div>
            <!--满钱打折-->
            <div class="tier" v-if="item.fullCutType===2&&item.thresholdType==1">
              <div v-for="fullCutItem in item.itemList">
                <p>
                  层级<span v-text="fullCutItem.level"></span>
                  &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold/100"></span>&nbsp;
                  元打&nbsp;<span v-text="fullCutItem.discount"></span>&nbsp;折
                </p>
              </div>
            </div>
            <!--满件打折-->
            <div class="tier" v-if="item.fullCutType===2&&item.thresholdType==2">
              <div v-for="fullCutItem in item.itemList">
                <p>
                  层级<span v-text="fullCutItem.level"></span>
                  &nbsp;--&nbsp;门槛&nbsp;:&nbsp;满&nbsp;<span v-text="fullCutItem.threshold"></span>&nbsp;
                  件打&nbsp;<span v-text="fullCutItem.discount"></span>&nbsp;折
                </p>
              </div>
            </div>
            <!--满件换购-->
            <div class="tier" v-if="item.fullCutType===3&&item.thresholdType==1">
              <div v-for="fullCutItem in item.itemList">
                <p>
                  满&nbsp;<span v-text="fullCutItem.threshold/100"></span>
                  &nbsp;元加上&nbsp;<span v-text="fullCutItem.buyingPrice/100"></span>&nbsp;
                  元换购商品
                </p>
                <p><span v-for="goods in exchangeGoodsList">&nbsp;{{goods.goodsName}}&nbsp;</span></p>
              </div>
            </div>
            <!--满件换购-->
            <div class="tier" v-if="item.fullCutType===3&&item.thresholdType==2">
              <div v-for="fullCutItem in item.itemList">
                <p>
                  满&nbsp;<span v-text="fullCutItem.threshold"></span>
                  &nbsp;件加上&nbsp;<span v-text="fullCutItem.buyingPrice/100"></span>&nbsp;
                  元换购商品
                </p>
                <p><span v-for="goods in exchangeGoodsList">&nbsp;{{goods.goodsName}}&nbsp;</span></p>
              </div>
            </div>
            <div class="sale">
              <span>发放方式：<span>自动领取</span></span>
              <span>每人优惠<b v-text="item.numPerOne"></b>次，每天仅可优惠<b v-text="item.numPerDay"></b>次</span>
            </div>
          </div>
          <div class="range">
            <p>作用范围：
              <span v-text="item.rangeType === 0? '全店' : item.rangeType === 2 ? '商品' : ''"></span>
              <a class="ml10" v-show="item.rangeType === 2" @click="openGoodsChoose">点我选择商品</a>
              <a class="ml10" v-show="item.rangeType === 0" @click="openFullRange">设置需要单独排除，不参与这次满减的商品</a>
            </p>
            <div class="goods" v-if="item.rangeType === 2" >
              <p>已选<span>{{chooseGoodsList.length}}</span>件商品</p>
              <ul>
                <li v-for="(goods, index) in chooseGoodsList">
                  <div>{{goods.goodsName}}</div>
                  <i class="icon_dele" @click="deleteGoods(index, goods)"></i>
                </li>
              </ul>
              <div class="more" v-show="chooseGoodsList.length > 8">
                <a @click="goods_all_show = true">查看全部商品</a>
              </div>
            </div>
            <div class="all" v-if="item.rangeType == 0" >
              <div>
                <p>已排除<span>{{removeGoodsList.length}}</span>商品</p>
                <ul>
                  <li v-for="(goods, index) in removeGoodsList">
                    <div>{{goods.goodsName}}</div>
                    <i class="icon_dele" @click="deleteRemoveGoods(index, goods)"></i>
                  </li>
                </ul>
                <div class="more" v-show="removeGoodsList.length > 8">
                  <a @click="goods_remove_all_show = true">查看全部商品></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-content">
        <h4>备注</h4>
        <p>{{item.remark == '' ? '暂无' : item.remark}}</p>
      </div>
      <p class="back">
        <button @click="postform">完成</button>
        <button style="margin-left: 100px;" @click="itemback">返回</button>
      </p>
    </div>
    <!--作用范围为全店的商品筛选弹窗s-->
    <div class="modal fade frame_layer01" id="full_range_dialog"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog shop_goodchoose" style="margin:10% 35%;">
        <div class="frame_total ">
          <div class="modal-header">
            <div class="modal-title text-center wid100">
             <span>选择商品</span>
            </div>
            <div class="guanb"  @click.stop="closeBox1()"  aria-hidden="true"></div>
          </div>
          <!--商品条件-->
          <div class="shop_choose_sort clear">
            <div class="fl">
              <input placeholder="请输入商品名称进行搜索" class="form-control sort_input fl" v-model="goods_query_item.condition"/>
              <button class="sort" @click="goodsSelect()">搜索</button>
            </div>
          </div>
          <!--商品-->
          <div class="shop_body">
            <div class="good_choose">
              <div class="merchant fl" style="position: relative;" v-for="(goods, index) in goodsResult.content" @click="addRemoveGoods(goods)">
                <h6>{{goods.goodsName}}</h6>
                <img class="fl" :src="goods.goodsImageUrl"/>
                <div>
                  <div class="goodsInfoText">{{goods.dealerName}}</div>
                  <div>{{goods.goodsPrice/100}}元</div>
                   <!--<div class="pickSpecificationsStyle" :vaule='goods.isChooseSpecification' @click.stop="chooseSpecification(goods,index)">{{goods.isChooseSpecification}}</div>-->
                </div>
                <div class="fc" v-show="goods.isRemoved"></div>
                <div class="fcimg" v-show="goods.isRemoved"></div>
              </div>
            </div>
            <div class="page">
              <button>上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
              <span>页</span>
            </div>
          </div>
          <div class="footer">
            <button type="button" class="btn save" data-dismiss="modal" @click="cancelRemove()">取消</button>
            <button type="button" class="btn cancel" @click="makeRemoveIds()">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--作用范围为全店的商品商家筛选弹窗e-->
    <!--作用范围商品筛选弹框s-->
    <div class="modal fade frame_layer01" v-if="item.rangeType===2" id="choose_goods"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog frame" style="background:#fff;">
        <div class="frame_total ">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              <div type="button" class="guanb"  @click.stop="closeBox()"   data-dismiss="modal" aria-hidden="true" style="right:-20px;"></div>
            </h5>
          </div>
          <div class="search">
            <div class="search_tit">选择商品：</div>
            <div class="clear">
              <input class="input form-control fl" v-model="goods_query_item.condition" type="text" placeholder="请输入商品标题或者编号进行搜索" />
              <button class="sort fl" @click="goodsSelect()">搜索</button>
              <div class="right">
              </div>
            </div>
          </div>
          <div class="goods_body">
            <div class="merchant fl" v-for="(goods, index) in goodsResult.content"  @click="addChooseGoods(goods,index)" >
              <!-- <div @click="openGoodsSku(goods,index)"> -->
              <div>
                <div>
                  <h6>{{goods.goodsName}}</h6>
                  <img class="fl" :src="goods.goodsImageUrl"/>
                  <div>
                    <!-- <div>供应商</div> -->
                    <div class="goodsInfoText" >{{goods.dealerName}}</div>
                    <div>价格<b>{{goods.goodsPrice/100}}元</b></div>
                     <div class="pickSpecificationsStyle" :vaule='goods.isChooseSpecification' @click.stop="chooseSpecification(goods, index)">{{goods.isChooseSpecification}}</div>
                  </div>
                </div>
                <div class="fc" v-show="goods.isChoosed == 1">
                </div>
                <div class="fcimg" v-show="goods.isChoosed == 1" @click="goodsSkuChoose(goods, 0)"></div>
              </div>
            </div>
            <div class="page">
              <button>上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
              <span>页</span>
            </div>
          </div>
          <div class="footer">
            <button type="button" class="btn save" @click="cancleMakeGoodsIds()" >取消</button>
            <button type="button" class="btn cancel" @click="makeGoodsIds()">保存</button>
          </div>
        </div>
      </div>
    </div>
    <!--作用范围商品筛选弹框e-->
    <!--作用范围商品规格选择弹窗s-->
    <div v-if="item.rangeType===2" id="goods_sku_dialog" class="modal fade frame_layer01" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 99999;">
      <div class="specification_container modal-dialog">
        <div class="specification_cen clear">
          <div class="specification_img fl">
            <div class="shop_choosebox ">
              <div class="tit">{{goodsInfo.goodsName}}</div>
              <div class="img"><img :src="goodsInfo.goodsImageUrl"/></div>
            </div>
          </div>
          <div class="specification_tab fl">
            <div class="tit">选择规格</div>
            <table class="spec_table">
              <thead>
              <tr>
                <td>是否参与满减</td>
                <td>规格</td>
                <td>现有库存</td>
                <td>参与满减库存</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="sku in goodsInfo.goodsSkuList">
                <td>
                  <input type="checkbox" v-model="sku.isCheck"/>
                  <input type="hidden" name="goodsSkuId" v-model="sku.goodsSkuId"/>
                </td>
                <td>
                  <input type="hidden" name="goodsSkuName" v-model="sku.goodsSkuName"/>
                  {{sku.goodsSkuName == '' ? '通用' : sku.goodsSkuName}}
                </td>
                <td>{{sku.goodsSkuInventory}}</td>
                <td><input class="form-control set_num fl " v-model="sku.goodsSkuNum" @blur="chcekSkuNum()" /></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="specification_footer">
          <button type="button" class="btn save" data-dismiss="modal"    @click="cancleGoodsSkuChoose(goodsInfo)" >取消</button>
          <button type="button" class="btn cancel" @click="goodsSkuChoose(goodsInfo, 1)">确认</button>
        </div>
      </div>
    </div>
    <!--作用范围商品规格选择弹窗e-->
    <!--商品筛选已选商品全部弹窗s-->
    <div :class='["frame_layer",goods_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已选择商品
              <div class="guanb"  @click="goods_all_show=false"></div>
            </h5>
          </div>
          <div class="modal-body">
            <div class="shop_choose_total" >
              <div class="shop_choose_s" >
                    <span v-for="goods in chooseGoodsList">
                    <span class="shop_choose_tit">
                        <span>{{goods.goodsName}}</span>
                    </span>
                    </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--商品筛选已选商品全部弹窗e-->
    <!--全店排除已排除的商品全部弹窗s-->
    <div :class='["frame_layer",goods_remove_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已排除商品
              <div class="guanb"  @click="goods_remove_all_show=false"></div>
            </h5>
          </div>
          <div class="modal-body">
            <div class="shop_choose_total" >
              <div class="shop_choose_s" >
                    <span v-for="goods in removeGoodsList">
                    <span class="shop_choose_tit">
                        <span>{{goods.goodsName}}</span>
                    </span>
                   </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--全店排除已排除的商品全部弹窗e-->
    <!-- 遮罩层s -->
    <div v-show="modalShadow" class="modal-backdrop fade in" style="z-index:1;"></div>
    <!-- 遮罩层e -->
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        modalShadow: false,
        item: '',
        goodsIds: '',
        exchangeGoodsList: [],
        chooseGoodsList: [],
        chooseSkuList: [],
        removeGoodsList: [],
        goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
        goodsResult: '',
        goodsInfo: '',
        goods_sku_show: false,
        goods_all_show: false,
        goods_remove_all_show: false,
        costJson: {platform: '0', dealer: '100'},
        params: {
          full_cut_id: '',
          full_cut_name: '',
          total_num: '',
          range_type: ''
        },
        tip_show: {
          name: false,
          total_num: false
        }
      }
    },
    methods: {
      itemback () {
        window.history.go(-1)
      },
      closeBox1 () {
        let that = this
        that.$('#full_range_dialog').modal('hide')
        that.modalShadow = false
      },
      closeBox () {
        var that = this
        that.$('#choose_goods').modal('hide')
        that.modalShadow = false
      },
      chcekSkuNum () {
        let that = this
        for (var i = 0; i < that.goodsInfo.goodsSkuList.length; i++) {
          if (parseInt(that.goodsInfo.goodsSkuList[i].goodsSkuInventory) < parseInt(that.goodsInfo.goodsSkuList[i].goodsSkuNum)) {
            that.goodsInfo.goodsSkuList[i].goodsSkuNum = 0
          }
        }
        console.log('goodsSkuList:' + JSON.stringify(that.goodsInfo.goodsSkuList))
      },
      formValidator (flag) {
        let that = this
        // flag 1:名称，2：总数
        if (flag == 0 || flag == 1) {
          if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,11}$/.test(that.params.full_cut_name)) {
            that.tip_show.name = true
            return false
          } else {
            that.tip_show.name = false
          }
        }
        if (flag == 0 || flag == 2) {
          if (that.params.total_num === '') {
            that.params.total_num = 0
          }
          if (!/^[0-9]{1,5}$/.test(that.params.total_num)) {
            that.params.total_num = 0
            that.tip_show.total_num = true
            return false
          } else {
            that.tip_show.total_num = false
          }
        }
        if (flag == 0) {
          if (that.params.range_type == 1 && that.chooseShopList.length <= 0) {
            alert('作用范围为商家时已选商家不能为空')
            return false
          }
          if (that.params.range_type == 2 && that.chooseGoodsList.length <= 0) {
            alert('作用范围为商品时已选商品不能为空')
            return false
          }
        }
        return true
      },
      //  发送修改请求
      postform () {
        let that = this
        var flag = that.formValidator(0)
        if (flag) {
          var rebody = {
            full_cut_id: that.params.full_cut_id,
            full_cut_name: that.params.full_cut_name,
            total_num: that.params.total_num,
            range_type: that.params.range_type,
            goods_ids: JSON.stringify(that.chooseGoodsList),
            remove_goods_ids: JSON.stringify(that.removeGoodsList),
            cost_json: JSON.stringify(that.costJson),
            sku_list: JSON.stringify(that.chooseSkuList)
          }
          that.$.ajax({
            url: that.base + 'm2c.market/fullcut/modify',
//            url: 'http://localhost:8080/m2c.market/fullcut/modify',
            contentType: 'application/json', // 必须有
            type: 'post',
            data: JSON.stringify(rebody),
            success: function (result) {
              if (result.status == 200) {
                console.log('status:', result.status)
                that.$router.push({path: '/s/marketing'})
              }
            }
          })
        }
      },
      // 点击选择全店
      openFullRange () {
        var that = this
        that.modalShadow = true
        that.$('#full_range_dialog').modal({'show': true, 'backdrop': false})
        that.goods_query_item.goodsClassifyId = ''
        that.goods_query_item.condition = ''
        that.goods_query_item.dealerId = ''
        that.goods_query_item.pageNum = 1
        that.goods_query_item.rows = 10
        that.goodsSelect()
      },
      // 打开 作用范围 选择商品弹窗
      openGoodsChoose () {
        var that = this
        that.modalShadow = true
        that.$('#choose_goods').modal({'show': true, 'backdrop': false})
        that.goods_query_item.condition = ''
       that.goods_query_item.dealerId = JSON.parse(sessionStorage.getItem('mUser')).dealerId
        that.goods_query_item.pageNum = 1
        that.goods_query_item.rows = 10
        that.goodsSelect()
      },
      // 打开规格选择弹框
      chooseSpecification (goods, index) {
        let that = this
        that.modalShadow = true
        that.$('#goods_sku_dialog').modal({'hide': true, 'backdrop': false})
        that.goodsInfo = goods
        for (var i = 0; i < that.goodsInfo.goodsSkuList.length; i++) {
          if (that.goodsInfo.goodsSkuList[i].goodsSkuInventory <= 0) {
            // 库存不能小于等于0   checkbox &input  设置 disable属性
            that.goodsInfo.goodsSkuList[i].disabled = true
          }
          if (that.goodsInfo.isChoosed == 0) {
            that.goodsInfo.isChooseSpecification = '编辑规格数量'
            that.goodsInfo.goodsSkuList[i].isCheck = false
            that.goodsInfo.goodsSkuList[i].goodsSkuNum = 0
          } else {
            that.goodsInfo.isChooseSpecification = '已选规格数量'
            if (that.goodsInfo.skuFlag == 0) {
              that.goodsInfo.goodsSkuList[i].isCheck = true
              that.goodsInfo.goodsSkuList[i].goodsSkuNum = that.goodsInfo.goodsSkuList[i].goodsSkuInventory
            } else {
              that.goodsInfo.goodsSkuList[i].isCheck = false
              that.goodsInfo.goodsSkuList[i].goodsSkuNum = 0
              for (var g = 0; g < that.chooseSkuList.length; g++) {
                if (that.goodsInfo.goodsSkuList[i].goodsSkuId === that.chooseSkuList[g].skuId && that.goodsInfo.goodsId === that.chooseSkuList[g].goodsId) {
                  that.goodsInfo.goodsSkuList[i].isCheck = true
                  that.goodsInfo.goodsSkuList[i].goodsSkuNum = that.chooseSkuList[g].skuNum
                }
              }
            }
          }
        }
      },
      // 点击选择规格 确定按钮
      goodsSkuChoose (goodsInfo, skuFlag) {
        // skuFlag 是否全规格全库存，0：是，1：不是
        let that = this
        if (skuFlag == 0) {
          if (goodsInfo.isChoosed == 1) { // 已选中的商品被取消
            goodsInfo.isChoosed = 0
            goodsInfo.skuFlag = 0
            goodsInfo.isChooseSpecification = '编辑规格数量'
            goodsInfo.chooseSkuList = []
            for (var g = 0; g < goodsInfo.goodsSkuList.length; g++) {
              goodsInfo.isCheck = false
              goodsInfo.goodsSkuNum = 0
              for (var i = 0; i < that.chooseSkuList.length; i++) {
                if (that.chooseSkuList[i].goodsId === goodsInfo.goodsId) {
                  that.chooseSkuList.splice(i, 1)
                }
              }
            }
          } else if (goodsInfo.isChoosed == 0) { // 未选中的商品被选中
            goodsInfo.isChoosed = 1
            goodsInfo.skuFlag = 0
            goodsInfo.isChooseSpecification = '已选规格数量'
            goodsInfo.chooseSkuList = []
          }
        }
        if (skuFlag == 1) {
          var chooseSkuList = []
          for (var i = 0; i < goodsInfo.goodsSkuList.length; i++) {
            if (goodsInfo.goodsSkuList[i].goodsSkuNum > goodsInfo.goodsSkuList[i].goodsSkuInventory) {
              that.show_tip('参与满减库存应不大于现有库存')
              goodsInfo.goodsSkuList[i].isCheck = false
              goodsInfo.goodsSkuList[i].goodsSkuNum = ''
            }
            if (goodsInfo.goodsSkuList[i].isCheck === true && goodsInfo.goodsSkuList[i].goodsSkuNum > 0) {
              console.log('goodsSkuNum:' + goodsInfo.goodsSkuList[i].goodsSkuNum)
              var chooseSku = {}
              chooseSku.skuId = goodsInfo.goodsSkuList[i].goodsSkuId
              chooseSku.skuNum = goodsInfo.goodsSkuList[i].goodsSkuNum
              chooseSku.goodsId = goodsInfo.goodsId
              chooseSkuList.push(chooseSku)
            }
          }
          if (chooseSkuList.length > 0) {
            goodsInfo.isChoosed = 1
            goodsInfo.skuFlag = 1
            goodsInfo.isChooseSpecification = '已选规格数量'
          } else {
            goodsInfo.isChoosed = 0
            goodsInfo.skuFlag = 0
            goodsInfo.isChooseSpecification = '编辑规格数量'
          }
          goodsInfo.chooseSkuList = chooseSkuList
        }
        var flag = true
        for (var i = 0; i < that.chooseGoodsList.length; i++) {
          if (that.chooseGoodsList[i].goodsId === goodsInfo.goodsId) {
            if (goodsInfo.isChoosed == 0) {
              that.chooseGoodsList.splice(i, 1)
              for (var j = 0; j < that.chooseSkuList.length; j++) {
                if (that.chooseSkuList.goodsId === goodsInfo.goodsId) {
                  that.chooseSkuList.splice(j, 1)
                }
              }
            } else if (goodsInfo.isChoosed == 1) {
              that.chooseGoodsList[i].goodsName = goodsInfo.goodsName
              that.chooseGoodsList[i].skuFlag = goodsInfo.skuFlag
              that.chooseGoodsList[i].chooseSkuList = goodsInfo.chooseSkuList
              for (var a = 0; a < that.chooseSkuList.length; a++) {
                if (that.chooseSkuList[a].goodsId === goodsInfo.goodsId) {
                  that.chooseSkuList.splice(a, 1)
                }
              }
              for (var b = 0; b < goodsInfo.chooseSkuList.length; b++) {
                that.chooseSkuList.push(goodsInfo.chooseSkuList[b])
              }
            }
            flag = false
          }
        }
        console.log('flag:' + flag)
        if (flag == true && goodsInfo.isChoosed == 1) {
          var chooseGoods = {}
          chooseGoods.goodsId = goodsInfo.goodsId
          chooseGoods.goodsName = goodsInfo.goodsName
          chooseGoods.skuFlag = goodsInfo.skuFlag
          chooseGoods.chooseSkuList = goodsInfo.chooseSkuList
          that.chooseGoodsList.push(chooseGoods)
          for (var j = 0; j < goodsInfo.chooseSkuList.length; j++) {
            that.chooseSkuList.push(goodsInfo.chooseSkuList[j])
          }
        }
        console.log('that.chooseGoodsList:' + JSON.stringify(that.chooseGoodsList))
        console.log('that.chooseSkuList:' + JSON.stringify(that.chooseSkuList))
        that.modalShadow = false
        that.$('#goods_sku_dialog').modal('hide')
      },
      cancleGoodsSkuChoose (goodsInfo) {
        // 从数组中清空（被选中状态 和数量）改变样式
        goodsInfo.isChoosed = 0
        goodsInfo.skuFlag = 0
        goodsInfo.isChooseSpecification = '编辑规格数量'
        for (var j = 0; j < goodsInfo.goodsSkuList.length; j++) {
          goodsInfo.goodsSkuList[j].isCheck = false
          goodsInfo.goodsSkuList[j].goodsSkuNum = ''
        }
      },
      // 拼接选中商品IDs
      makeGoodsIds () {
        var that = this
        console.log('chooseGoodsList:' + JSON.stringify(that.chooseGoodsList))
        console.log('chooseSkuList:' + JSON.stringify(that.chooseSkuList))
        that.$('#choose_goods').modal('hide')
        that.modalShadow = false
      },
      cancleMakeGoodsIds () {
        // 从数组中清空（被选中状态 和数量）改变样式
        let that = this
        // 清空选择商品数组
        that.chooseGoodsList = []
        // 清空选择商品规格数组
        that.chooseSkuList = []
        // 遍历弹框的 改变状态
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          that.goodsResult.content[i].isChoosed = 0
          that.goodsResult.content[i].skuFlag = 0
          that.goodsResult.content[i].chooseSkuList = []
          that.goodsResult.content[i].isChooseSpecification = '编辑规格数量'
          for (var j = 0; j < that.goodsResult.content[i].goodsSkuList.length; ++j) {
            that.goodsResult.content[i].goodsSkuList[j].isCheck = false
            that.goodsResult.content[i].goodsSkuList[j].goodsSkuNum = ''
          }
        }
        // 控制模态框
        that.$('#choose_goods').modal('hide')
        that.modalShadow = false
      },
      deleteGoods (index, goods) {
        var that = this
        that.chooseGoodsList.splice(index, 1)
        for (var i = 0; i<that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[index].goodsId === goods.goodsId) {
            that.goodsResult.content[index].isChoosed = 0
            that.goodsResult.content[index].skuFlag = 0
            that.goodsResult.content[index].chooseSkuList = []
            for (var g = 0; g < that.goodsResult.content[i].goodsSkuList.length; g++) {
              that.goodsResult.content[i].goodsSkuList[g].isCheck = false
              that.goodsResult.content[i].goodsSkuList[g].goodsSkuNum = 0
            }
          }
        }
        for (var j = 0; j < that.chooseSkuList.length; j++){
          if (that.chooseSkuList[j].goodsId === goods.goodsId) {
            that.chooseSkuList.splice(j, 1)
          }
        }
      },
      // 作用范围   (获取到面板上的数据 并初始化)
      goodsSelect () {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/goods/choice',
          data: {
            goodsClassifyId: that.goods_query_item.goodsClassifyId,
            condition: that.goods_query_item.condition,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            pageNum: that.goods_query_item.pageNum,
            rows: that.goods_query_item.rows
          },
          success: function (result) {
            // 初始化状态
            for (var i = 0; i < result.content.length; i++) {
              result.content[i].isChoosed = 0
              result.content[i].isRemoved = 0
              result.content[i].skuFlag = 0
              result.content[i].chooseSkuList = []
              result.content[i].isChooseSpecification = '编辑规格数量'
              // 循环 移除范畴列表(没有选择规格的功能)
              for (var k = 0; k < that.removeGoodsList.length; k++) {
                if (result.content[i].goodsId === that.removeGoodsList[k].goodsId) {
                    result.content[i].isRemoved = 1
                }
              }
              // 循环 选择(适用)范畴列表  
              for (var j = 0; j < that.chooseGoodsList.length; j++) {
                if (result.content[i].goodsId === that.chooseGoodsList[j].goodsId) {
                  result.content[i].isChoosed = 1
                  result.content[i].skuFlag = that.chooseGoodsList[j].skuFlag
                  result.content[i].isChooseSpecification = '已选规格数量'
                  result.content[i].chooseSkuList = that.chooseGoodsList[j].chooseSkuList
                }
              }
            }
            that.goodsResult = result
          }
        })
      },
      addRemoveGoods (goods) {
        let that = this
        //点击选中 取消
        if (goods.isRemoved == 0) {
          goods.isRemoved = 1
        } else if (goods.isRemoved == 1) {
          goods.isRemoved = 0
        }
        // 
        var flag = true
        for (var i = 0; i < that.removeGoodsList.length; i++) {
          if (that.removeGoodsList[i].goodsId === goods.goodsId) {
            if (goods.isRemoved == 0) {
              that.removeGoodsList.splice(i, 1)
            }
            flag = false
          }
        }
        if (flag == true && goods.isRemoved == 1) {
          var removeGoods = {}
          removeGoods.goodsId = goods.goodsId
          removeGoods.goodsName = goods.goodsName
          that.removeGoodsList.push(removeGoods)
        }
        console.log('removeGoodsList:', JSON.stringify(that.removeGoodsList))
      },
      addChooseGoods(goods) {
        let that = this
        //点击选中 取消
        if (goods.isChoosed == 0) {
          goods.isChoosed = 1
          goods.isChooseSpecification='已选规格数量'
          goods.skuFlag = 0
        } else if (goods.isChoosed == 1) {
          goods.isChoosed = 0
           goods.isChooseSpecification='编辑规格数量'
           goods.skuFlag = 1
        }
        // 
        var flag = true
        for (var i = 0; i < that.chooseGoodsList.length; i++) {
          if (that.chooseGoodsList[i].goodsId === goods.goodsId) {
            if (goods.isChoosed == 0) {
              that.chooseGoodsList.splice(i, 1)
            }
            flag = false
          }
        }
        if (flag == true && goods.isChoosed == 1) {
          var chooseGoods = {}
          chooseGoods.goodsId = goods.goodsId
          chooseGoods.goodsName = goods.goodsName
          that.chooseGoodsList.push(chooseGoods)
        }
        console.log('chooseGoodsList:', JSON.stringify(that.chooseGoodsList))
      },
      // 取消功能  清除掉全部已经选中的移除商品
      cancelRemove () {
        let that = this
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          that.goodsResult.content[i].isRemoved = 0
        }
        that.removeGoodsList = []
        that.modalShadow = false
        that.$('#full_range_dialog').modal({'hide': true, 'backdrop': false})
      },
      makeRemoveIds () {
        let that = this
        that.modalShadow = false
        that.$('#full_range_dialog').modal('hide');
        console.log('removeGoodsList:', JSON.stringify(that.removeGoodsList))
      },
      deleteRemoveGoods (index, goods) {
        let that = this
        // console.log('---that.item.removeRangeList-',that.item.removeRangeList);
        that.removeGoodsList.splice(index, 1)
        //  遍历刚获得的结果  把isRemoved 变为0  (但是最开始的时候已经初始化过了  不明 )
        if (that.goodsResult != '') {
          for (var i = 0; i < that.goodsResult.content.length; i++) {
            if (that.goodsResult.content[i].goodsId === goods.goodsId) {
              that.goodsResult.content[i].isRemoved = 0
            }
          }
        }
      }
    },
    mounted () {
      let that = this
      that.$.ajax({
//        url: 'http://localhost:8080/m2c.market/fullcut/detail/' + sessionStorage.getItem('full_cut_id'),
        url: that.base + 'm2c.market/fullcut/detail/' + sessionStorage.getItem('full_cut_id'),
        data: {
        },
        success: function (result) {
          console.log('满减详情:', result.content)
          that.item = result.content
          that.params.full_cut_id = that.item.fullCutId
          that.params.full_cut_name = that.item.fullCutName
          that.params.total_num = that.item.totalNum
          that.params.range_type = that.item.rangeType
          if (that.item.rangeType == 0) {
            for (var i = 0; i < that.item.removeRangeList.length; i++) {
              if (that.item.removeRangeList[i].type == 2) {
                var removeGoods = {}
                removeGoods.goodsId = that.item.removeRangeList[i].id
                removeGoods.goodsName = that.item.removeRangeList[i].name
                that.removeGoodsList.push(removeGoods)
              }
            }
            console.log('removeGoodsList:', JSON.stringify(that.removeGoodsList))
          }
          if (that.item.rangeType == 2) {
            for (var i = 0; i < that.item.suitableRangeList.length; i++) {
              var goods = {}
              goods.goodsId = that.item.suitableRangeList[i].id
              goods.goodsName = that.item.suitableRangeList[i].name
              goods.skuFlag = that.item.suitableRangeList[i].skuFlag
              goods.chooseSkuList = that.item.suitableRangeList[i].skuList
              for (var j = 0; j < that.item.suitableRangeList[i].skuList.length; j++) {
                var sku = {}
                sku.goodsId = that.item.suitableRangeList[i].id
                sku.skuId = that.item.suitableRangeList[i].skuList[j].skuId
                sku.skuNum = that.item.suitableRangeList[i].skuList[j].skuNum
                that.chooseSkuList.push(sku)
              }
              that.chooseGoodsList.push(goods)
            }
            console.log('chooseGoodsList:', JSON.stringify(that.chooseGoodsList))
            console.log('chooseSkuList:', JSON.stringify(that.chooseSkuList))
          }
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
//  商户名称显示两行 超出部分省略
.dealerName{
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
}
.frame_layer{
  display:none;
}

.goodsInfoText{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    font-size: 12px;
}
.pickSpecificationsStyle{
    width: 80px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    color:green;
    border:1px  #BBD2F1  solid;
    box-shadow: 1px 1px 1px #ccc;
    background:withe;
    border-radius:5px;
    position: absolute;
    right: 1px;
    top:73%;
    z-index: 100;
    }
  .content{
    //   background: red;
    margin-left:20px;
    margin-top:10px;
    .info-content{
      padding:10px 0 30px 30px ;
      background: #fff;
      margin-bottom:10px;
      font-size: 12px;
      a{
        color: #0086FF;
      }
      h4{
        line-height: 32px;
        font-size: 12px;
        font-weight: bold;
        color:#333;
        margin-bottom:10px;
      }
      textarea{
        width:480px;
        height: 140px;
        outline: none;
        resize : none;
      }
      .tier{
        background:rgba( 0,134,255,.1);
        padding:0 10px;
        width:433px;
        color:#0C6DFF;
        p{
          margin: 0;
          line-height:30px;
          flex:1;
          span{
            color: blueviolet;
          }
        }
      }
      .sale{
        line-height: 30px;
        padding: 10px 0;
        span{
          margin-right: 30px;
        }
      }
      .base{
        width:480px;
        display: flex;
        div.intr{
          width:480px;
        }
        /*.range{
            flex:1;
            .goods{
                width:520px;
                height: 210px;
                padding:25px 45px;
                background: #F5F5F5;
                position: relative;
                z-index: -1;
                ul{
                    list-style: none;
                    display: flex;
                    margin:0;
                    padding:0;
                    justify-content:space-between;
                    // flex-direction: row-reverse ;
                    // color:red;

                    li{
                       width:100px;
                       p{
                           width:100%;
                           height:40px;
                           font-size: 12px;
                           padding:6px 6px 12px 8px ;
                           overflow: hidden;
                           text-overflow: ellipsis;
                       }
                    }
                 }
                 .control{
                    width: 22px;
                    height: 22px;
                    position: absolute;
                    top:50%;
                    transform: translateY(-50%);
                    border-radius: 50%;
                    background-color: #BFC1CB;
                    color:#fff;
                    // font-size:
                    text-align: center;
                    line-height: 22px;
                }
                .more{
                    text-align: right;
                }
                .left{
                    left:12px;
                }
                .right{
                    right:12px;
                }
            }
        }*/
        .range {
          flex: 1;
          line-height: 24px;
          .range_of_action {
            width: 160px;
            height: 24px;
            border-radius: 2px;
            margin-right: 20px;
            padding: 0px
          }
          .goods, .shop ,.classify,.all{
            border: 1px solid #e5e5e5;
            overflow: hidden;
            width: 530px;
            min-height: 210px;
            padding: 20px 20px;
            background: rgba(245, 245, 245, 1);
            margin-top: 20px;
            position: relative;
            /*z-index: 99;*/
            ul {
              list-style: none;
              /*display: flex;*/
              margin: 0;
              padding: 0;
              /*justify-content:space-between;*/
              // flex-direction: row-reverse ;
              // color:red;

              li {
                width: 160px;
                background: #fff;
                border-radius: 5px;
                margin-right: 10px;
                border: 1px solid #E5E5E5;
                display: inline-block;
                position: relative;
                div {
                  width: 160px;
                  padding-left: 5px;
                  padding-right: 5px;
                  height: 30px;
                  line-height: 30px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  font-size: 12px;
                  padding-bottom: 0px;
                }
                .icon_dele {
                  width: 13px;
                  height: 13px;
                  display: inline-block;
                  position: absolute;
                  right: -5px;
                  top: -5px;
                  background: url(../../../assets/images/icon-delet.png) no-repeat center;
                }
              }
            }
            .control {
              width: 22px;
              height: 22px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              border-radius: 50%;
              background-color: #BFC1CB;
              color: #fff;
              // font-size:
              text-align: center;
              line-height: 22px;
            }
            .more {
              text-align: right;
            }
            .left {
              left: 12px;
            }
            .right {
              right: 12px;
            }
          }
        }
      }
      .wrap{
        flex-wrap: wrap;
        div{
          flex: 50%;
        }
      }
      .rule{
        width:100%;
      }
    }
    .back{
      text-align: left;
      padding-top: 27px;
      padding-bottom: 27px;
      button{
        width:110px;
        height:40px;
        background:rgba(17,210,235,1);
        border-radius: 2px ;
        font-size:14px;
        color:rgba(255,255,255,1);
        line-height:20px;
        border: none;
      }
    }
  }
  /*选择品类*/
  .category_layer, .goods_category_layer {
    .category_goodchoose {
      width: 480px;
      height: 480px;
      background: #fff;
      .modal-header {
        width: 100%;
        height: 40px;
        text-align: center;
        background: #F5F5F5;
        font-size: 10px;
        position: relative;
        span {
          line-height: 40px;
          display: inline-block;
        }
        .guanb {
          width: 40px !important;
          height: 40px !important;
          position: absolute;
          background: url(../../../assets/images/icon-close.png);
          right: 0px;
          top: 0px;
          z-index: 999;
        }
      }
      .modal-body {
        padding-left: 80px;
        padding-top: 20px;
        max-height: 360px;
        overflow-y: auto;
        .wrapper {
          position: relative;
          .triangle {
            width: 0;
            height: 0;
            border-width: 10px 8px 0;
            border-style: solid;
            border-color: #D8D8D8 transparent transparent; /*灰 透明 透明 */
            position: absolute;
            left: -20px;
            top: 3px;
            /*margin:40px auto;*/
          }
          display: inline-block;
          .input_check {
            position: absolute;
            width: 20px;
            height: 20px;
            visibility: hidden;
          }
          span {
            position: relative;
          }
          .input_check + label {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 2px;
            border: 1px solid #BFC1CB;
          }
          .input_check:checked + label {
            display: inline-block;
            width: 15px;
            height: 15px;
            background: url(../../../assets/images/icon-selected.png) no-repeat center;
          }
        }
        .tit {
          font-size: 15px;
        }
      }
      .footer {
        width: 480px;
        height: 80px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        border-top: 1px solid #e5e5e5;
        .btn {
          width: 110px !important;
          height: 40px;
          border-radius: 2px;
          color: #fff;
          width: 28px;
          font-size: 14px;
          text-align: center;
          line-height: 40px;
          display: inline-block;
          padding: 0px;
          margin-right: 20px;
          margin-top: 10px;
        }
        .gravity {
          background: #F5BD23 100%;
          margin-left: 110px;
        }
        .confirm {
          background: #11D2EB 100%;
        }
      }
    }
  }
  /*全店*/
  .frame_layer01 {
    .frame {
      width: 890px;
      height: 714px;
      padding-left: 20px;
      padding-right: 20px;
      .frame_total {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .tc_shop {
        font-size: 9px;
        width: 100%;
        min-height: 155px;
        border-bottom: 2px solid #E5E5E5;
        .tc_shop_box {
          margin-top: 20px;
          .tc_shop_span {
            margin-right: 10px;
            text-align: center;
            width: 180px;
            height: 30px;
            line-height: 30px;
            background: #F5F5F5;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            .i_delet {
              display: inline-block;
              width: 15px;
              height: 15px;
              position: absolute;
              top: 8px;
              right: 10px;
              background: url(../../../assets/images/icon-delet.png) no-repeat center;
            }
          }
        }
      }
      .modal-header {
        border-bottom: none;
        background: rgba(245, 245, 245, 1);
        .close {
          position: absolute;
          top: 0px;
          right: -20px;
          width: 40px;
          height: 40px;
          background: rgba(216, 216, 216, 1);
        }
        .modal-title {
          position: relative;
          background: #fff;
          ul {
            display: flex;
            width: 300px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid #ccc;
            li {
              flex: 1;
              height: 30px;
              text-align: center;
              line-height: 30px;
              box-sizing: border-box;
            }
            li.active {
              background-color: #000;
              color: #fff;
              // border:1px solid #ccc;
            }
          }
        }
      }
      .search {
        height: 30px;
        line-height: 30px;
        margin-left: 0px;
        position: relative;
        .sort {
          width: 60px;
          height: 24px;
          background: rgba(0, 134, 255, 1);
          border-radius: 2px;
          margin-left: 10px;
          font-size: 11px;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
          border: none;
        }
        .search_tit {
          margin-top: 10px;
        }
        .input {
          width: 228px;
          height: 24px;
          background: rgba(255, 255, 255, 1);
          border-radius: 2px;
          font-size: 9px;
        }
        .a_btn {
          padding: 0 10px;
        }
        .right {
          position: absolute;
          right: 0px;
          top: 20px;
        }
      }
      .goods_body {
        margin-top: 40px;
        max-height: 255px;
        .goods {
          width: 47%;
          height: 120px;
          // background-color: red;
          border: 1px solid #ccc;
          h6 {
            padding-left: 10px;
            line-height: 30px;
            margin: 0;
            border-bottom: 1px solid #ccc;
          }
          .media {
            .media-left {
              margin-left: 10px;
              img {
                margin-left: 10px;
              }
            }

          }
        }
        .goods:nth-child(2n+1) {
          margin-right: 20px;
        }
        .page {
          position: absolute;
          right: 0px;
          text-align: right;
          overflow: hidden;
          clear: both;
          bottom: 110px;
          button {
            border: 1px solid #979797;
            width: 52px;
            height: 20px;
            font-size: 9px;
            background: #fff;
          }
        }
          .merchant:hover{
              background-color:rgba(0, 134, 255, .1);
            }
        .merchant {
          width: 160px;
          height: 120px;
          // background-color: red;
          border: 1px solid #ccc;
          margin: 0 10px 10px 0;
          font-size: 10px;
          position: relative;
          h6 {
            padding-left: 10px;
            line-height: 30px;
            margin: 0;
            width: 100%;
            font-size: 8px;
            background: rgba(245, 245, 245, 1);
            border-bottom: 1px solid #ccc;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img {
            width: 70px;
            height: 70px;
            margin-left: 5px;
            margin-right: 5px;
          }
        }
      }
      .footer {
        // width:890px;
        height: 80px;
        border-top: 1px solid #E5E5E5;
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding-top: 20px;
        padding-left: 50%;
        .btn {
          width: 110px;
          height: 40px;
          border: none;
          border-radius: 2px;
          color: #fff;
        }
        .save {
          margin-left: -110px;
          background: rgba(183, 201, 225, 1);
        }
        .cancel {
          margin-left: 40px;
          background: rgba(17, 210, 235, 1);
        }
      }
    }
  }
  .shop_goodchoose {
    width: 740px;
    height: 500px;
    background: #fff;
    position: relative;
    .tit {
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(245, 245, 245, 1);
      font-size: 9px;
      width: 90px;
    }
    .modal-header {
      background: rgba(245, 245, 245, 1);
      padding: 0px;
      position: relative;
      .modal-title {
        height: 40px;
        line-height: 40px;

      }
      a {
        font-style: normal;
      }
      .active {
        background: rgba(225, 238, 246, 1);
        a {
          display: inline-block;
          height: 100%;
          border-bottom: 3px solid #0078E4;
        }
      }
    }
    .close {
      width: 50px;
      height: 50px;
      position: absolute;
      right: 0px;
      top: 0px;
      background: rgba(216, 216, 216, 1);
      color: #fff;
    }
    .shop_choose_sort {
      margin-top: 20px;
      padding-left: 20px;
      .sort_input {
        width: 228px;
        height: 24px;
        border-radius: 2px;
        font-size: 9px;
      }
      .sort {
        width: 60px;
        height: 24px;
        background: rgba(0, 134, 255, 1);
        border-radius: 2px;
        color: #fff;
        border: none;
        margin-left: 20px;
      }
      .sort_select {
        width: 100px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        padding: 0px;
        padding-left: 5px;
        margin-left: 10px;
      }
      .ml28 {
        margin-left: 28px;
        label {
          font-weight: normal;
          color: rgba(119, 119, 119, 1);

        }
      }
    }
    .shop_body {
      height: 340px;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      overflow: auto;
      .shop_choose {
        height: 255px;
        .shop_choosebox {
          width: 90px;
          height: 120px;
          // background:rgba(245,245,245,1);
          border: 1px solid #e7e7e7;
          margin-right: 11px;
          margin-bottom: 10px;
          .tit {
            background: rgba(245, 245, 245, 1);
            font-size: 9px;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
          }
          .img {
            padding: 10px;
            img {
              width: 70px;
              height: 70px;
            }
          }

        }
      }
      .good_choose {
        height: 255px;
         .merchant:hover{
              background-color:rgba(0, 134, 255, .1);
            }
        .merchant {
          width: 160px;
          height: 120px;
          // background-color: red;
          border: 1px solid #ccc;
          margin: 0 10px 10px 0;
          position: relative;
          h6 {
            padding-left: 10px;
            line-height: 30px;
            margin: 0;
            width: 100%;
            font-size: 8px;
            background: rgba(245, 245, 245, 1);
            border-bottom: 1px solid #ccc;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img {
            width: 70px;
            height: 70px;
            margin-left: 10px;
            margin-right: 5px;
          }
        }
      }
      .page {
        .page_g {
          margin-right: 20px;
          margin-top: 20px;
        }
        .rb{
          width:24px;
          height:24px;
          display: inline-block;
          font-size:9px;
        }
      }
    }
    .footer {
      // width:890px;
      height: 80px;
      border-top: 1px solid #E5E5E5;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 110px;
        height: 40px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: rgba(183, 201, 225, 1);
      }
      .cancel {
        margin-left: 40px;
        background: rgba(17, 210, 235, 1);
      }

    }

  }
  /*规格*/
  .specification_container {
    min-height: 280px;
    width: 500px;
    background: #fff;
    .specification_cen {
      width: 500px;
      height: 200px;
      padding-top: 20px;
      padding-left: 20px;
      .specification_img {
        .shop_choosebox {
          width: 90px;
          height: 120px;
          // background:rgba(245,245,245,1);
          border: 1px solid #e7e7e7;
          margin-right: 11px;
          margin-bottom: 10px;
          .tit {
            background: rgba(245, 245, 245, 1);
            font-size: 9px;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
          }
          .img {
            padding: 10px;
            img {
              width: 70px;
              height: 70px;
            }
          }

        }
      }
      .specification_tab {
        margin-left: 20px;
        .tit {
          font-size: 10px;
          color: rgba(119, 119, 119, 1);
          line-height: 14px;
        }
        .spec_table {
          margin-top: 20px;
          tr {
            width: 330px;
          }
          td {
            height: 37px;
            width: 85px;
            font-size: 9px;
            text-align: center;
            border: 1px solid #E5E5E5;
          }
        }
      }
    }
    .specification_footer {
      // width:890px;
      height: 80px;
      border-top: 1px solid #E5E5E5;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 110px;
        height: 40px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: rgba(183, 201, 225, 1);
      }
      .cancel {
        margin-left: 40px;
        background: rgba(17, 210, 235, 1);
      }

    }
  }
  .shopchoose {
    width: 630px;
    height: 500px;
    background: #fff;
    position: relative;
    .tit {
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(245, 245, 245, 1);
      font-size: 9px;
      width: 90px;
    }
    .modal-header {
      background: rgba(245, 245, 245, 1);
      height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    .close {
      width: 35px;
      height: 35px;
      position: absolute;
      right: 0px;
      top: -2px;
      background: #ccc;
      color: #fff;
    }

    .shop_choose_sort {
      margin-top: 20px;
      padding-left: 20px;
      .sort_input {
        width: 228px;
        height: 24px;
        border-radius: 2px;
        font-size: 9px;
      }
      .sort {
        width: 60px;
        height: 24px;
        background: rgba(0, 134, 255, 1);
        border-radius: 2px;
        color: #fff;
        border: none;
        margin-left: 20px;
      }
      .sort_select {
        width: 100px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        padding: 0px;
        padding-left: 5px;
        margin-left: 10px;
      }
      .ml28 {
        margin-left: 28px;
        label {
          font-weight: normal;
          color: rgba(119, 119, 119, 1);

        }
      }
    }
    .shop_body {
      height: 340px;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-left: 20px;
      .shop_choose {
        height: 255px;
        .shop_choosebox {
          width: 90px;
          height: 120px;
          // background:rgba(245,245,245,1);
          border: 1px solid #e7e7e7;
          margin-right: 11px;
          margin-bottom: 10px;
          .set_cd{
            width: 140px;
            height: 40px;
            background: #fff;
            border: 1px solid #e5e5e5;
            font-size: 10px;
            position: absolute;
            right: -50px;
            top: -44px;
            z-index: 9;
            padding-top: 8px;
            padding-left: 10px;
          }
          .showhover {
            position: absolute;
            width: 180px;
            height: 50px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid #BFC1CB;
            padding-left: 25px;
            padding-top: 5px;
            font-size: 9px;
            border-radius: 2px;
            left: 20px;
            top: -40px;
            z-index: 9
          }
          .tit {
            background: rgba(245, 245, 245, 1);
            font-size: 9px;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
          }
          .img {
            padding: 10px;
            img {
              width: 70px;
              height: 70px;
            }
          }
        }
      }
      .page {
        position: absolute;
        right: 0px;
        text-align: right;
        overflow: hidden;
        clear: both;
        bottom: 110px;
        button {
          border: 1px solid #979797;
          width: 52px;
          height: 20px;
          font-size: 9px;
          background: #fff;
        }
        .rb{
          width:24px;
          height:24px;
          display: inline-block;
          font-size:9px;
        }
      }
    }
    .footer {
      // width:890px;
      height: 80px;
      border-top: 1px solid #E5E5E5;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 110px;
        height: 40px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -220px;
        background: rgba(183, 201, 225, 1);
      }
      .cancel {
        margin-left: 40px;
        background: rgba(17, 210, 235, 1);
      }

    }

  }
  .separate_cost {
    width: 500px;
    height: 260px;
    background: #fff;
    .modal-header {
      background: rgba(245, 245, 245, 1);
      font-size: 10px;
      color: rgba(119, 119, 119, 1);
      h5{
        height: 40px;
        line-height: 40px
      }
    }
    .modal-body {
      padding-left: 80px;
      .separate_tit {
        margin-top: 20px;
      }
      .separate_input {
        margin-top: 25px;
        .wid150 {
          width: 180px;
          display: inline-block;
        }
        .ml10 {
          margin-left: 10px;
        }
        label {
          font-size: 10px;
          color: rgba(119, 119, 119, 1);
          line-height: 20px;
        }
        .set_num {
          width: 90px;
          height: 24px;
          border-radius: 2px;

        }

      }
    }
    .footer {
      // width:890px;
      height: 80px;
      border-top: 1px solid #E5E5E5;
      position: absolute;
      bottom: 0px;
      width: 100%;
      padding-top: 20px;
      padding-left: 50%;
      .btn {
        width: 110px;
        height: 40px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: rgba(183, 201, 225, 1);
      }
      .cancel {
        margin-left: 40px;
        background: rgba(17, 210, 235, 1);
      }
    }
  }
  .page {
    position: absolute;
    right: 0px;
    text-align: right;
    overflow: hidden;
    clear: both;
    bottom: 110px;
    button {
      border: 1px solid #979797;
      width: 52px;
      height: 20px;
      font-size: 9px;
      background: #fff;
    }
    .rb{
      width:24px;
      height:24px;
      display: inline-block;
      font-size:9px;
    }
  }
  /*公用样式*/
  .ml10{
    margin-left: 10px;
  }
  .ml20{
    margin-left: 20px;
  }
  .wid50{width: 50%;}
  .clear{clear: both;overflow: hidden;}
  .fl{float: left;}
  .fr{float: right;}
  .wid70{width: 70px;display: inline-block;}
  .color_g{
    color:rgba(119,119,119,1);
  }
  .fc{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;top: 0px;
    background:#6C83BC;
    opacity:0.5;
    display:block
  }
  .fcimg{
    background: url(../../../assets/images/icon-selected3.png) no-repeat center;
    display: block;
    position: absolute;
    right: 5%;
    top: 5%;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    // margin-left: -17px;
    // margin-top: -17px;
  }
  .fcimg02{
    background: url(../../../assets/images/icon-unselected2.png) no-repeat center;
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 34px;
    height: 34px;
    margin-left: -17px;
    margin-top: -17px;
  }
  .fcimg03{
    width:60px;
    height:20px;
    background:rgba(255,255,255,1);
    border-radius: 4px ;
    border: 1px solid #0078E4;
    line-height: 20px;
    text-align: center;
    font-size:10px;
    color: #0078E4;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -10px;
    margin-left: -30px;
  }
  .guanb {
    width: 40px !important;
    height: 40px !important;
    position: absolute;
    background: url(../../../assets/images/icon-close.png);
    right: 0px;
    top: 0px;
    z-index: 999;
  }

</style>

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
              <span>发放方式：<span v-text="item.receiveType===0?'自动领取':'手动领取'"></span></span>
              <span>每人优惠<b v-text="item.numPerOne"></b>次，每天仅可优惠<b v-text="item.numPerDay"></b>次</span>
            </div>
          </div>
          <div class="range">
            <p>作用范围：
              <span v-text="item.rangeType === 0? '全店' : item.rangeType === 1 ? '商家' : item.rangeType === 2 ? '商品' : item.rangeType === 3 ? '品类' : ''"></span>
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
            <div class="shop" v-if="item.rangeType === 1" >
              <p>已选<span>{{chooseShopList.length}}</span>件商家</p>
              <ul>
                <li v-for="(shop, index) in chooseShopList">
                  <div>{{shop.shopName}}</div>
                  <i class="icon_dele" @click="deleteShop(index, shop)"></i>
                </li>
              </ul>
              <div class="more" v-show="chooseShopList.length > 8">
                <a @click="shop_all_show = true">查看全部商家</a>
              </div>
            </div>
            <div class="classify" v-if="item.rangeType === 3" >
              <p>已选<span>{{rangeClassifyList.length}}</span>个品类</p>
              <ul>
                <li v-for="(classify, index) in params.goods_classifys">
                  <div>{{classify.classifyName}}</div>
                  <i class="icon_dele" @click="deleteClassify(index, classify)"></i>
                </li>
              </ul>
              <div class="more" v-show="rangeClassifyList.length > 0">
                <a @click="classify_all_show = true">查看全部品类></a>
              </div>
            </div>
            <div class="all" v-if="item.rangeType == 0" >
              <div>
                <p>已排除<span>{{item.removeRangeList.length}}</span>商品</p>
                <ul>
                  <li v-for="(goods, index) in item.removeRangeList">
                    <div>{{goods.name}}</div>
                    <i class="icon_dele" @click="deleteRemoveGoods(index, goods)"></i>
                  </li>
                </ul>
                <div class="more" v-show="item.removeRangeList.length > 8">
                  <a @click="goods_remove_all_show = true">查看全部商品></a>
                </div>
              </div>
              <div>
                <!-- <p>已排除<span>{{removeShopList.length}}</span>商家</p> -->
                <ul>
                  <li v-for="(shop, index) in removeShopList">
                    <div>{{shop.shopName}}</div>
                    <i class="icon_dele" @click="deleteRemoveShop(index, shop)"></i>
                  </li>
                </ul>
                <div class="more" v-show="removeShopList.length > 8">
                  <a @click="shop_remove_all_show = true">查看全部商家></a>
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
        <button @click="postfrom">完成</button>
        <button style="margin-left: 100px;" @click="itemback">返回</button>
      </p>
    </div>
    <!--作用范围为全店的商品商家筛选弹窗s-->
    <div class="modal fade frame_layer01" id="full_range_dialog"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog shop_goodchoose" style="margin:10% 35%;">
        <div class="frame_total ">
          <div class="modal-header">
            <div class="modal-title text-center wid100 "  @click="changeTab('goods')">
             <span>选择商品</span>
            </div>
            <div  class="guanb"  @click.stop="closeBox1($event)"  aria-hidden="true"></div>
          </div>
          <!--商品条件-->
          <div class="shop_choose_sort clear" :style="tab_flag == 'goods' ? '' : 'display:none;'">
            <div class="fl">
              <input placeholder="请输入商品名称进行搜索" class="form-control sort_input fl" v-model="goods_query_item.condition"/>
              <button class="sort" @click="goodsSelect()">搜索</button>
            </div>
          </div>
          <!--商家条件-->
          <div class="shop_choose_sort clear" :style="tab_flag == 'shop' ? '' : 'display:none;'">
            <div class="fl">
              <input placeholder="请输入商家名称进行搜索" class="form-control sort_input fl" v-model="shop_query_item.dealerName"/>
              <button class="sort" @click="shopSelect()">搜索</button>
            </div>
            <div class="ml28 fl">
              <label class="fl">商家分类列表</label>
              <select class="form-control sort_select fl" v-model="shop_query_item.dealerClassify">
                <option value="">全部</option>
                <option v-for="shopClassify in shopClassifyList" :value="shopClassify.dealerClassifyId">
                  {{shopClassify.dealerClassifyName}}
                </option>
              </select>
            </div>
          </div>
          <!--商品-->
          <div class="shop_body" :style="tab_flag == 'goods' ? '' : 'display:none;'">
            <div class="good_choose">
              <div class="merchant fl" style="position: relative;" v-for="(goods, index) in goodsResult.content" @click="addRemoveGoods(goods)">
                <h6>{{goods.goodsName}}</h6>
                <img class="fl" :src="goods.goodsImageUrl"/>
                <div>
                  <div class="goodsInfoText">{{goods.dealerName}}</div>
                  <div>{{goods.goodsPrice/100}}元</div>
                   <div class="pickSpecificationsStyle" :vaule='goods.isChooseSpecification'     @click.stop="ChooseSpecification(goods,index)">{{goods.isChooseSpecification}}</div>
                </div>  
                <div class="fc" v-show="goods.isRemoved">
                </div>
                <div class="fcimg" v-show="goods.isRemoved"></div>
              </div>
            </div>
            <!-- <div class="page">
              <button>上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
              <span>页</span>
            </div> -->
          </div>
          <!--商家-->
          <div class="shop_body" :style="tab_flag == 'shop' ? '' : 'display:none;'">
            <div class="shop_choose">
              <div class="shop_choosebox fl" style="position: relative;" v-for="(shop, index) in shopResult.content" @click="addRemoveShop(shop)">
                <div class="tit">{{shop.dealerName}}</div>
                <div class="img"><img :src="shop.shopIcon"/></div>
                <div class="fc" v-show="shop.isRemoved">
                </div>
                <div class="fcimg" v-show="shop.isRemoved"></div>
              </div>
            </div>
            <!-- <div class="page">
              <button>上一页</button>
              <span>{{shopResult.pageNumber}}</span>/
              <span>{{shopResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="shop_query_item.pageNum"/>
              <span>页</span>
            </div> -->
          </div>
          <div class="footer">
            <button type="button" class="btn save" data-dismiss="modal" @click="cancelRemove()">取消</button>
            <button type="button" class="btn cancel" @click="makeRemoveIds()">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--作用范围为全店的商品商家筛选弹窗e-->
    <!--作用范围商家筛选弹框s-->
    <div class="modal fade frame_layer01" id="choose_shop" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog frame" style="background:#fff;">
        <div class="guanb" data-dismiss="modal" aria-hidden="true"></div>
        <div class="frame_total ">
          <div class="modal-header">
            <h5 class="modal-title text-center">
            </h5>
          </div>
          <div class="search">
            <div class="search_tit">选择商家：</div>
            <div class="clear">
              <input class="input form-control fl" type="text" placeholder="请输入商家标题或者编号进行搜索" v-model="shop_query_item.dealerName"/>
              <button class="sort fl" @click="shopSelect()">搜索</button>
            </div>
          </div>
          <div class="goods_body">
            <div class="merchant fl" v-for="(shop, index) in shopResult.content">
              <div @click="checkShop(shop)">
                <h6>{{shop.shopName}}</h6>
                <img class="fl" :src="shop.shopIcon"/>
              </div>
              <div class="fc" v-show="shop.isChoosed">
              </div>
              <div class="fcimg" v-show="shop.isChoosed"></div>
            </div>
            <div class="page">
              <button @click="pageShop(shopResult.pageNumber - 1, shopResult.pageCount)">上一页</button>
              <span>{{shopResult.pageNumber}}</span>/
              <span>{{shopResult.pageCount}}</span>
              <button @click="pageShop(shopResult.pageNumber + 1, shopResult.pageCount)">下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" v-model="shop_query_item.pageNum"/>
              <span>页</span>
            </div>
          </div>
          <div class="footer">
            <button type="button" class="btn save " data-dismiss="modal">取消</button>
            <button type="button" class="btn cancel" @click="makeDealerIds()">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--作用范围商家筛选弹框e-->
    <!--作用范围商品筛选弹框s-->
    <div class="modal fade frame_layer01" v-if="item.rangeType===2" id="choose_goods"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog frame" style="background:#fff;">
        <div class="frame_total ">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              <div type="button" class="guanb"  @click.stop="closeBox($event)"   data-dismiss="modal" aria-hidden="true" style="right:-20px;"></div>
            </h5>
          </div>
          <div class="search">
            <div class="search_tit">选择商品：</div>
            <div class="clear">
              <input class="input form-control fl" type="text" placeholder="请输入商品标题或者编号进行搜索" />
              <button class="sort fl" @click="goodsSelect()">搜索</button>
              <div class="right">
              </div>
            </div>
          </div>
          <div class="goods_body">
            <div class="merchant fl" v-for="(goods, index) in goodsResult.content">
              <div @click="openGoodsSku(goods)">
                <div>
                  <h6>{{goods.goodsName}}</h6>
                  <img class="fl" :src="goods.goodsImageUrl"/>
                  <div>
                    <!-- <div>供应商</div> -->
                    <div class="goodsInfoText" >{{goods.dealerName}}</div>
                    <div>价格<b>{{goods.goodsPrice/100}}元</b></div>
                     <div class="pickSpecificationsStyle" :vaule='goods.isChooseSpecification'     @click.stop="ChooseSpecification(goods,index)">{{goods.isChooseSpecification}}</div>
                  </div>
                </div>
                <div class="fc" v-show="goods.isChoosed == 1">
                </div>
                <div class="fcimg" v-show="goods.isChoosed == 1"></div>
              </div>
            </div>
            <!-- <div class="page">
              <button>上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
              <span>页</span>
            </div> -->
          </div>
          <div class="footer">
            <button type="button" class="btn save" @click="closeBox($event)" >取消</button>
            <button type="button" class="btn cancel" @click="makeGoodsIds()">保存</button>
          </div>
        </div>
      </div>
    </div>
    <!--作用范围商品筛选弹框e-->
    <!--商品商家筛选按钮弹窗s-->
    <div :class='["frame_layer",goods_shop_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              商家筛选
              <div type="button" class="guanb"  @click="goods_shop_show=false"  ></div>
            </h5>
          </div>
          <div class="modal-body">
            <div class="shop_choose_sort">
              <div>
                <input placeholder="请输入商家名称进行搜索" class="form-control sort_input fl" v-model="shop_query_item.dealerName" />
                <button class="sort" @click="shopSelect()">搜索</button>
              </div>
            </div>
            <div class="shop_choose_total" >
              <div class="shop_choose_s" >
                    <span v-for="shop in shopResult.content">
                    <span class="shop_choose_tit" :class="goods_query_item.dealerId == shop.dealerId ? 'active' : ''">
                        <span @click="goodsShopClick(shop.dealerId)">{{shop.shopName}}</span>
                    </span>
                    </span>
              </div>
            </div>
          </div>
          <div class="modal-footer s_c_footer" style="padding: 15px; border-top: 1px solid #e5e5e5;">
            <button type="button" class="btn cancel" @click="goods_shop_show=false">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--点击商品商家筛选按钮弹窗e-->
    <!--作用范围商品规格选择弹窗s-->
    <div :class='["frame_layer",goods_sku_show?"frame_layer_show":""]' v-if="item.rangeType===2" style="z-index:99999;" >
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
                  {{sku.goodsSkuName}}
                </td>
                <td>{{sku.goodsSkuInventory}}</td>
                <td><input class="form-control set_num fl " v-model="sku.goodsSkuNum" @blur="chcekSkuNum()"/></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="specification_footer">
          <button type="button" class="btn save" @click="goods_sku_show=false" >取消</button>
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
    <!--商家筛选已选商家全部弹窗s-->
    <div :class='["frame_layer",shop_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已选择商家
              <div  class="guanb"  @click="shop_all_show=false"   ></div>
            </h5>
          </div>
          <div class="modal-body">
            <div class="shop_choose_total" >
              <div class="shop_choose_s" >
                    <span v-for="shop in chooseShopList">
                    <span class="shop_choose_tit">
                        <span>{{shop.shopName}}</span>
                    </span>
                    </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--商家筛选已选商家全部弹窗e-->
    <!--全店排除已排除的商品全部弹窗s-->
    <div :class='["frame_layer",goods_remove_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已排除商品
              <div class="guanb"  @click="goods_remove_all_show=false"   ></div>
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
    <div   v-show="modalShadow"   class="modal-backdrop fade in" style="z-index:1;"></div> 
    <!-- 遮罩层e -->
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        modalShadow : false ,
        item: '',
        goodsIds: '',
        tab_flag: 'goods',
        exchangeGoodsList: [],
        chooseGoodsList: [],
        chooseShopList: [],
        removeGoodsList: [],
        removeShopList: [],
        rangeClassifyList: [],
        goodsClassifyList: [],
        shopClassifyList: [],
        goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
        goodsResult: '',
        shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 查询商家条件
        shopResult: '',
        classifyList: [],
        goodsInfo: '',
        goods_shop_show: false,
        goods_sku_show: false,
        goods_classify_show: false,
        goods_all_show: false,
        shop_all_show: false,
        classify_all_show: false,
        goods_remove_all_show: false,
        shop_remove_all_show: false,
        shop_cost_show: false,
        costJson: {platform: '', dealer: ''},
        shopCost: {dealerId: '', platform: '', dealer: ''},
        dealerCostList: [], // 商家单独成本设置
        params: {
          full_cut_id: '',
          full_cut_name: '',
          total_num: '',
          range_type: '',
          goods_classifys: []
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
         closeBox1 ($event) {
          var that = this
          let el=$event.target
          that.$(el).parents('#full_range_dialog').modal("hide")
          that.modalShadow =false
      },
       closeBox ($event) {
          var that = this
          let el=$event.target
          that.$(el).parents('#choose_goods').modal("hide")
          that.modalShadow =false
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
        // flag 1:名称，2：总数, 3:通用成本平台比例，4:通用成本商家比例
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
        if (flag == 0 || flag == 3) {
          if (that.costJson.platform === '' || parseInt(that.costJson.platform) < 0 || parseInt(that.costJson.platform) > 100) {
            that.costJson.platform = ''
          }
          if (!/^(0|[1-9][0-9]?|100)$/.test(that.costJson.platform)) {
            that.costJson.platform = ''
          }
          if (that.costJson.platform != '' && 0 <= parseInt(that.costJson.platform) <= 100) {
            that.costJson.dealer = 100 - that.costJson.platform
          }
        }
        if (flag == 0 || flag == 4) {
          if (that.costJson.dealer === '' || parseInt(that.costJson.dealer) < 0 || parseInt(that.costJson.dealer) > 100) {
            that.costJson.dealer = ''
          }
          if (!/^(0|[1-9][0-9]?|100)$/.test(that.costJson.dealer)) {
            that.costJson.dealer = ''
          }
          if (that.costJson.dealer != '' && 0 <= parseInt(that.costJson.dealer) <= 100) {
            that.costJson.platform = 100 - that.costJson.dealer
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
          if (that.params.range_type == 3 && (that.rangeClassifyList.length <= 0 || that.params.goods_classifys.length <= 0)) {
            alert('作用范围为品类时已选品类不能为空')
            return false
          }
          if (that.dealerCostList.length > 0) {
            if (that.costJson.platform === '' || that.costJson.dealer === '') {
              alert('请填写通用成本设置')
              return false
            }
            console.log('dealerCostList:' + JSON.stringify(that.dealerCostList))
            for (var i = 0; i < that.dealerCostList.length; i++) {
              if (that.dealerCostList[i].platform === '' || parseInt(that.dealerCostList[i].platform) < 0 || parseInt(that.dealerCostList[i].platform) > 100 || that.dealerCostList[i].dealer === '' || parseInt(that.dealerCostList[i].dealer) < 0 || parseInt(that.dealerCostList[i].dealer) > 100) {
                that.dealerCostList.splice(i, 1)
                return false
              }
              if (that.dealerCostList[i].platform != '' && that.dealerCostList[i].dealer != '' && 100 - that.dealerCostList[i].platform != that.dealerCostList[i].dealer) {
                alert('平台承担成本和商家承担成本之和必须为100')
                that.dealerCostList.splice(i, 1)
                return false
              }
            }
          }
        }
        return true
      },
      //  发送修改请求
      postfrom () {
        let that = this
        var flag = that.formValidator(0)
        if (flag) {
          var rebody = {
            full_cut_id: that.params.full_cut_id,
            full_cut_name: that.params.full_cut_name,
            total_num: that.params.total_num,
            range_type: that.params.range_type,
            dealer_ids: JSON.stringify(that.chooseShopList),
            goods_ids: JSON.stringify(that.chooseGoodsList),
            goods_classifys: JSON.stringify(that.params.goods_classifys),
            remove_goods_ids: JSON.stringify(that.removeGoodsList),
            remove_dealer_ids: JSON.stringify(that.removeShopList),
            cost_json: JSON.stringify(that.costJson),
            dealer_cost_list: JSON.stringify(that.dealerCostList)
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
      dealerCostBlur (flag) {
        var that = this
        if (flag === 'platform') {
          if (that.shopCost.platform === '' || !/^(0|[1-9][0-9]?|100)$/.test(that.shopCost.platform)) {
            that.shopCost.platform = ''
          } else {
            that.shopCost.dealer = 100 - that.shopCost.platform
          }
        }
        if (flag === 'dealer') {
          if (that.shopCost.dealer === '' || !/^(0|[1-9][0-9]?|100)$/.test(that.shopCost.dealer)){
            that.shopCost.dealer = ''
          } else {
            that.shopCost.platform = 100 - that.shopCost.dealer
          }
        }
      },
      addDealerCost (dealerId, platform, dealer) {
        var that = this
        for (var i = 0; i < that.dealerCostList.length; i++) {
          if (that.dealerCostList[i].dealerId === dealerId) {
            that.dealerCostList.splice(i, 1)
          }
        }
        var cost = {}
        cost.dealerId = dealerId
        cost.platform = platform
        cost.dealer = dealer
        that.dealerCostList.push(cost)
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if (that.shopResult.content[i].dealerId === that.shopCost.dealerId) {
            that.shopResult.content[i].isCost = true
            that.shopResult.content[i].cost.platform = that.shopCost.platform
            that.shopResult.content[i].cost.dealer = that.shopCost.dealer
          }
        }
        that.shop_cost_show = false
        console.log('dealerCostList:' + JSON.stringify(that.dealerCostList))
      },
      // 点击选择全店
      openFullRange () {
        var that = this
        that.modalShadow = true
        that.$('#full_range_dialog').modal({'show':true ,'backdrop':false})
        that.goods_query_item.goodsClassifyId = ''
        that.goods_query_item.condition = ''
        that.goods_query_item.dealerId = ''
        that.goods_query_item.pageNum = 1
        that.shop_query_item.dealerName = ''
        that.shop_query_item.dealerClassify = ''
        that.shop_query_item.dealerId = ''
        that.shop_query_item.pageNum = 1
        that.goodsSelect()
        that.shopSelect()
        that.shopClassifySelect()
      },
      // 打开作用范围商家筛选弹窗
      openShopChoose () {
        var that = this
        that.$('#choose_shop').modal('show')
        that.shop_query_item.dealerName = ''
        that.shop_query_item.dealerClassify = ''
        that.shop_query_item.dealerId = ''
        that.shop_query_item.pageNum = 1
        that.shopSelect()
      },
      // 打开 作用范围 选择商品弹窗
      openGoodsChoose () {
        var that = this
        that.modalShadow =true
        that.$('#choose_goods').modal({'show':true ,'backdrop':false})
        that.goods_query_item.goodsClassifyId = ''
        that.goods_query_item.condition = ''
        that.goods_query_item.dealerId = ''
        that.goods_query_item.pageNum = 1
        that.goodsSelect()
      },
      openClassifyChoose () {
        var that = this
        that.$('#classify_dialog').modal('show')
        that.classifySelect('-1')
      },
      // 打开商品筛选品类选择弹窗
      openGoodsClassifyChoose () {
        let that = this
        that.goods_classify_show = true
        that.classifySelect('-1')
      },
        // 打开规格选择弹框
      ChooseSpecification (goods,index) {
        var that = this
        // 模态框弹出
        that.$('#specificationChoose').modal({'show':true ,'backdrop':false})
        // 库存不能小于等于0   checkbox &input  设置 disable属性
       for (var i = 0; i < goods.goodsSkuList.length; i++){
            if(goods.goodsSkuList[i].goodsSkuInventory<=0){
                goods.goodsSkuList[i].disabled = true;
            }
       }
          // 点击到 只有取消商品的功能
        if(that.goodsResult.content[index].isChooseSpecification == '已选规格数量'){
             for(var i = 0; i<that.chooseGoodsList.length;i++){
            if(that.goodsResult.content[index].goodsId == that.chooseGoodsList[i].goodsId){
              that.deleteGoods(i,goods)
            //  break;
            }
          }
          that.goodsResult.content[index].isCheck =false
        }
        // 旧逻辑
        // console.log('that.goodsResult.content=============>',that.goodsResult.content[index])
        // if(that.goodsResult.content[index].isChooseSpecification ='已选规格数量'){
        //   that.chooseGoodsList.push(that.goodsResult.content[index])
        // }else{
        //      for(var i = 0; i<that.chooseGoodsList.length;i++){
        //     if(that.goodsResult.content[index].goodsId == that.chooseGoodsList[i].goodsId){
        //       that.deleteGoods(i,goods)
        //      break;
        //     }
        //   }
        //   that.goodsResult.content[index].isCheck =false
        // }
       that.goodsInfo = goods
      },

      // 打开作用范围商品的商家筛选弹窗
      openGoodsShopChoose () {
        var that = this
        that.goods_shop_show = true
        that.shop_query_item.dealerName = ''
        that.shop_query_item.dealerClassify = ''
        that.shop_query_item.dealerId = ''
        that.shop_query_item.pageNum = 1
        that.shopSelect()
      },
      openGoodsSku (goods,index,$event) {
        var that = this
        that.goods_sku_show = true
        that.goodsResult.content[index].isCheck = true
        that.chooseGoodsList.push(that.goodsResult.content[index])
        for (var i = 0; i < goods.goodsSkuList.length; i++) {
          if (goods.isChoosed == 0) {
            goods.goodsSkuList[i].isCheck = true
            goods.goodsSkuList[i].goodsSkuNum = 0
          } else {
            if (goods.skuFlag == 0) {
              goods.goodsSkuList[i].isCheck = true
              goods.goodsSkuList[i].goodsSkuNum = goods.goodsSkuList[i].goodsSkuInventory
            } else {
              goods.goodsSkuList[i].isCheck = true
              goods.goodsSkuList[i].goodsSkuNum = 0
              for (var g = 0; g < goods.chooseSkuList.length; g++) {
                if (goods.goodsSkuList[i].goodsSkuId == goods.chooseSkuList[g].skuId) {
                  goods.goodsSkuList[i].isCheck = true
                  goods.goodsSkuList[i].goodsSkuNum = goods.chooseSkuList[g].skuNum
                }
              }
            }
          }
        }
        that.goodsInfo = goods
      },
      goodsSkuChoose (goodsInfo, skuFlag) {
        // skuFlag 是否全规格全库存，0：是，1：不是
        let that = this
        if (skuFlag == 0) {
          for (var i = 0; i < that.goodsResult.content.length; i++) {
            if (that.goodsResult.content[i].goodsId === goodsInfo.goodsId) {
              that.goodsResult.content[i].isChoosed = 1
              that.goodsResult.content[i].skuFlag = 0
              that.goodsResult.content[i].goodsSkuList = goodsInfo.goodsSkuList
              that.goodsResult.content[i].chooseSkuList = []
            }
          }
        }
        if (skuFlag == 1) {
          var chooseSkuList = []
          for (var i = 0; i < goodsInfo.goodsSkuList.length; i++) {
            if (goodsInfo.goodsSkuList[i].isCheck === true && goodsInfo.goodsSkuList[i].goodsSkuNum > 0) {
              var chooseSku = {}
              chooseSku.skuId = goodsInfo.goodsSkuList[i].goodsSkuId
              chooseSku.skuNum = goodsInfo.goodsSkuList[i].goodsSkuNum
              chooseSkuList.push(chooseSku)
            }
          }
          for (var i = 0; i < that.goodsResult.content.length; i++) {
            if (that.goodsResult.content[i].goodsId === goodsInfo.goodsId) {
              if (chooseSkuList.length > 0) {
                that.goodsResult.content[i].isChoosed = 1
                that.goodsResult.content[i].skuFlag = 1
              } else {
                that.goodsResult.content[i].isChoosed = 0
                that.goodsResult.content[i].skuFlag = 0
              }
              that.goodsResult.content[i].goodsSkuList = goodsInfo.goodsSkuList
              that.goodsResult.content[i].chooseSkuList = chooseSkuList
            }
          }
          that.goods_sku_show = false
        }
        that.chooseGoodsList = []
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].isChoosed == 1) {
            var chooseGoods = {}
            chooseGoods.goodsId = that.goodsResult.content[i].goodsId
            chooseGoods.goodsName = that.goodsResult.content[i].goodsName
            chooseGoods.skuFlag = that.goodsResult.content[i].skuFlag
            chooseGoods.chooseSkuList = that.goodsResult.content[i].chooseSkuList
            that.chooseGoodsList.push(chooseGoods)
          }
        }
        console.log('chooseGoodsList:' + JSON.stringify(that.chooseGoodsList))
      },
      // 查询商品分类列表
      classifySelect (parentClassifyId) {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/goods/classify/tree',
          data: {
            parentClassifyId: '-1'
          },
          success: function (result) {
            that.classifyList = result.content
          }
        })
      },
      shopClassifySelect () {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/dealerclassify/sys/firstClassify',
          success: function (result) {
            that.shopClassifyList = result.content
          }
        })
      },
      // 展开商品分类
      expandClassify () {
        let that = this
        let target = event.target
        let classifyId = target.getAttribute('classifyId')
        that.$(`[forClassifyId="${classifyId}"]`).slideToggle(200)
      },
      // 作用范围选择商品分类
      setClassify (classifyId) {
        let that = this
        console.log('that.rangeClassifyList:' + JSON.stringify(that.rangeClassifyList))
      },
      // 商品筛选选择商品分类
      setGoodsClassify (classifyId) {
        let that = this
        that.goodsClassifyList = []
        that.goodsClassifyList.push(classifyId)
      },
      //重置商品筛选商品分类
      resetGoodsClassify () {
        let that = this
        that.goodsClassifyList = []
      },
      // 重置商品分类
      resetClassify () {
        let that = this
        that.rangeClassifyList = []
        that.params.goods_classifys = []
      },
      //设置商品筛选分类条件
      makeGoodsClassify () {
        var that = this
        for (var j = 0; j < that.goodsClassifyList.length; j++) {
          that.goods_query_item.goodsClassifyId = that.goodsClassifyList[j]
        }
        that.goods_classify_show = false
      },
      makeClassifyIds () {
        let that = this
        that.params.goods_classifys = []
        for (var i = 0; i < that.rangeClassifyList.length; i++) {
          for (var a = 0; a < that.classifyList.length; a++) {
            if (that.rangeClassifyList[i] === that.classifyList[a].classifyId) {
              var classify1 = {}
              classify1.classifyId = that.classifyList[a].classifyId
              classify1.classifyName = that.classifyList[a].classifyName
              that.params.goods_classifys.push(classify1)
            }
            if (that.classifyList[a].subClassify != null && that.classifyList[a].subClassify.length > 0) {
              for (var b = 0; b < that.classifyList[a].subClassify.length; b++) {
                if (that.rangeClassifyList[i] === that.classifyList[a].subClassify[b].classifyId) {
                  var classify2 = {}
                  classify2.classifyId = that.classifyList[a].subClassify[b].classifyId
                  classify2.classifyName = that.classifyList[a].subClassify[b].classifyName
                  that.params.goods_classifys.push(classify2)
                }
                if (that.classifyList[a].subClassify[b].subClassify != null && that.classifyList[a].subClassify[b].subClassify.length > 0) {
                  for (var c = 0; c < that.classifyList[a].subClassify[b].subClassify.length; c++) {
                    if (that.rangeClassifyList[i] === that.classifyList[a].subClassify[b].subClassify[c].classifyId){
                      var classify3 = {}
                      classify3.classifyId = that.classifyList[a].subClassify[b].subClassify[c].classifyId
                      classify3.classifyName = that.classifyList[a].subClassify[b].subClassify[c].classifyName
                      that.params.goods_classifys.push(classify3)
                    }
                  }
                }
              }
            }
          }
        }
         that.$('#classify_dialog').modal({'show':true ,'backdrop':false})
         that.modalShadow =false
        console.log('that.rangeClassifyList:' + JSON.stringify(that.rangeClassifyList))
        console.log('that.params.goods_classifys:' + JSON.stringify(that.params.goods_classifys))
      },
      // 添加商品筛选商家条件
      goodsShopClick (shopId) {
        var that = this
        that.goods_query_item.dealerId = shopId
        that.goods_shop_show = false
      },
      // 重置商品筛选商家条件
      resetGoodsShop () {
        var that = this
        that.goods_query_item.dealerId = ''
      },
      //拼接选中商品IDs
      makeGoodsIds () {
        var that = this
        console.log('chooseGoodsList:' + JSON.stringify(that.chooseGoodsList))
        that.$('#choose_goods').modal('hide')
        that.modalShadow =false
        
      },
      // 作用范围 选择商品
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
            that.removeGoodsList.splice(0, that.removeGoodsList.length);
            for (var i = 0; i < result.content.length; i++) {
                result.content[i].isChooseSpecification ='编辑规格数量'
            //result.content[i].isRemoved = 0
          // 通过for循环  将removeRangeList匹配到id的数组都设置为 isRemoved = 1(修改样式)
              for(var k = 0;k < that.item.removeRangeList.length;++k){
                result.content[i].isChoosed = 0
                result.content[i].skuFlag = 0
                result.content[i].chooseSkuList = []
                  if(result.content[i].goodsId == that.item.removeRangeList[k].id){
                    result.content[i].isRemoved = 1
                    that.removeGoodsList.push(result.content[i])
                    console.log("--------------------------->",result.content[i].goodsId )
                  }
                }
              for (var j = 0; j < that.chooseGoodsList.length; j++) {
                if (result.content[i].goodsId === that.chooseGoodsList[j].goodsId) {
                  result.content[i].isChoosed = 1
                  result.content[i].skuFlag = that.chooseGoodsList[j].skuFlag
                  result.content[i].chooseSkuList = that.chooseGoodsList[j].chooseSkuList
                }
              }
              for (var j = 0; j < that.removeGoodsList.length; j++) {
                if (result.content[i].goodsId === that.removeGoodsList[j].goodsId) {
                  result.content[i].isRemoved = 1
                }
              }
               for (var j = 0; j < that.exchangeGoodsList.length; j++) {
                if (result.content[i].goodsId == that.exchangeGoodsList[j].goodsId) {
                  result.content[i].isExchange = 1
                }
              }
            }
            that.goodsResult = result
          }
        })
      },
      // 商家筛选
      shopSelect () {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/shop/sys/shop',
          data: {
            dealerName: that.shop_query_item.dealerName,
            dealerClassify: that.shop_query_item.dealerClassify,
            dealerId: that.shop_query_item.dealerId,
            rows: that.shop_query_item.rows,
            pageNum: that.shop_query_item.pageNum
          },
          success: function (result) {
            for (var i = 0; i < result.content.length; i++) {
              result.content[i].isChoosed = 0
              result.content[i].isRemoved = 0
              result.content[i].isCost = false
              result.content[i].isCostShow = false
              result.content[i].cost = {platform: '', dealer: ''}
              for (var j = 0; j < that.chooseShopList.length; j++) {
                if (result.content[i].dealerId === that.chooseShopList[j].dealerId) {
                  result.content[i].isChoosed = 1
                }
              }
              for (var j = 0; j < that.removeShopList.length; j++) {
                if (result.content[i].dealerId === that.removeShopList[j].dealerId) {
                  result.content[i].isRemoved = 1
                }
              }
              for (var j = 0; j < that.dealerCostList.length; j++) {
                if (result.content[i].dealerId === that.dealerCostList[j].dealerId) {
                  result.content[i].isCost = true
                  result.content[i].cost.platform = that.dealerCostList[j].platform
                  result.content[i].cost.dealer = that.dealerCostList[j].dealer
                }
              }
            }
            that.shopResult = result
          }
        })
      },
      // 作用范围商家筛选商家选择
      checkShop (shop) {
        var that = this
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if (that.shopResult.content[i].dealerId == shop.dealerId) {
            that.shopResult.content[i].isChoosed = 1
          }
        }
        that.chooseShopList = []
        for (var j = 0; j < that.shopResult.content.length; j++) {
          if (that.shopResult.content[j].isChoosed == 1) {
            var chooseShop = {}
            chooseShop.dealerId = that.shopResult.content[j].dealerId
            chooseShop.shopName = that.shopResult.content[j].shopName
            that.chooseShopList.push(chooseShop)
          }
        }
      },
      // 拼装作用范围商家参数
      makeDealerIds () {
        var that = this
        that.$('#choose_shop').modal('hide')
        console.log('chooseShopList:' + JSON.stringify(that.chooseShopList))
      },
      addRemoveGoods (goods,$event) {
        let that = this
        console.log("goods",goods)
        // console.log('that.goodsResult.content===========',that.goodsResult.content)
        //  console.log('----- goods.isRemoved---------' ,goods.isRemoved )
        // for (var i = 0; i < that.goodsResult.content.length; i++) {
        //   if (that.goodsResult.content[i].goodsId == goods.goodsId) {
        //     that.goodsResult.content[i].isRemoved = 1
        //   }
        // }
        //that.removeGoodsList = []
        // for (var i = 0; i < that.goodsResult.content.length; i++) {
        //   if (that.goodsResult.content[i].isRemoved == 1) {
        //      that.removeGoodsList.push(that.goodsResult.content[i])
           
        //   }
        // }

        if (goods.isRemoved !=1) {
          goods.isRemoved = 1;
          that.removeGoodsList.push(goods);
        }
        else {
          goods.isRemoved = 0;
          for (var i = 0; i < that.removeGoodsList.length; i++) {
           if (that.removeGoodsList[i].goodsId == goods.goodsId) {
              that.removeGoodsList.splice(i, 1);
              break;
           }
          }
        }
        
         console.log('removeGoodsList:', JSON.stringify(that.removeGoodsList))
      },
      cancelRemove(){
        let that = this
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          that.goodsResult.content[i].isRemoved = 0
        }
        for (var i = 0; i < that.shopResult.content.length; i++) {
          that.shopResult.content[i].isRemoved = 0
        }
        that.removeGoodsList = []
        that.removeShopList = []
        that.modalShadow =false
        that.$('#choose_goods').modal({'hide':true ,'backdrop':false})
      
      },
      makeRemoveIds () {
        let that = this
        that.modalShadow =false
        that.$('#full_range_dialog').modal('hide');
        // that.item.removeRangeList 跟 removeGoodsList 数据结构不一样 导致（template 部分渲染不到）
        that.item.removeRangeList.splice(0, that.item.removeRangeList.length);
        for(var i=0; i< that.removeGoodsList.length; i++) {
          var _goods = {};
          _goods.id = that.removeGoodsList[i].goodsId;
          _goods.isChoosed = that.removeGoodsList[i].isChoosed;
          _goods.name = that.removeGoodsList[i].goodsName;
          _goods.rangeType = that.removeGoodsList[i].rangeType;
          _goods.skuFlag = that.removeGoodsList[i].skuFlag;
          _goods.skuList = that.removeGoodsList[i].skuList;
          _goods.type = that.removeGoodsList[i].type;
          that.item.removeRangeList.push(_goods);
        }
        console.log('removeRangeList:', JSON.stringify(that.item.removeRangeList))
        //console.log('removeGoodsList:', JSON.stringify(that.removeGoodsList))
      },
      deleteGoods (index, goods) {
        var that = this
        that.chooseGoodsList.splice(index, 1)
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId === goods.goodsId) {
            that.goodsResult.content[i].isChoosed = 0
            that.goodsResult.content[i].skuFlag = 0
            that.goodsResult.content[i].chooseSkuList = []
            for (var g = 0; g < that.goodsResult[i].goodsSkuList.length; g++) {
              that.goodsResult[i].goodsSkuList[g].isCheck = false
              that.goodsResult[i].goodsSkuList[g].goodsSkuNum = 0
            }
          }
        }
      },
      // 作用范围商家筛选商家选择删除
      deleteShop (index, shop) {
        var that = this
        that.chooseShopList.splice(index, 1)
        if (that.shopResult != '') {
          for (var i = 0; i < that.shopResult.content.length; i++) {
            if (that.shopResult.content[i].dealerId === shop.dealerId) {
              that.shopResult.content[i].isChoosed = 0
            }
          }
        }
      },
      deleteRemoveGoods (index, goods) {
        console.log('我获取goods',goods)
        let that = this
        that.item.removeRangeList.splice(index, 1)
        if (that.goodsResult != '') {
          for (var i = 0; i < that.goodsResult.content.length; i++) {
            if (that.goodsResult.content[i].goodsId === goods.goodsId) {
              that.goodsResult.content[i].isRemoved = 0
            }
          }
        }
      },
      deleteRemoveShop (index, shop) {
        let that = this
        that.removeShopList.splice(index, 1)
        if (that.shopResult != '') {
          for (var i = 0; i < that.shopResult.content.length; i++) {
            if (that.shopResult.content[i].dealerId === shop.dealerId) {
              that.shopResult.content[i].isRemoved = 0
            }
          }
        }
      },
      deleteClassify (index, classify) {
        var that = this
        that.params.goods_classifys.splice(index, 1)
        for (var c = 0; c < that.rangeClassifyList.length; c++) {
          if (that.rangeClassifyList[c] === classify.classifyId) {
            that.rangeClassifyList.splice(c, 1)
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
          console.log('costList:', JSON.stringify(that.item.costList))
          if (that.item.costList != null && that.item.costList.length > 0) {
            for (var i = 0; i < that.item.costList.length; i++) {
              if (that.item.costList[i].dealerId === 'ALL') {
                that.costJson.platform = that.item.costList[i].platformPercent
                that.costJson.dealer = that.item.costList[i].dealerPercent
              } else {
                var cost = {}
                cost.dealerId = that.item.costList[i].dealerId
                cost.platform = that.item.costList[i].platformPercent
                cost.dealer = that.item.costList[i].dealerPercent
                that.dealerCostList.push(cost)
              }
            }
          }
          if (that.item.rangeType == 0) {
            for (var i = 0; i < that.item.suitableRangeList.length; i++) {
              if (that.item.suitableRangeList[i].type == 1) {
                var removeShop = {}
                removeShop.dealerId = that.item.suitableRangeList[i].id
                removeShop.shopName = that.item.suitableRangeList[i].name
                that.removeShopList.push(removeShop)
              }
              if (that.item.suitableRangeList[i].type == 2) {
                var removeGoods = {}
                removeGoods.goodsId = that.item.suitableRangeList[i].id
                removeGoods.goodsName = that.item.suitableRangeList[i].name
                that.removeGoodsList.push(removeGoods)
              }
            }
            console.log('removeShopList:', JSON.stringify(that.removeShopList))
            console.log('removeGoodsList:', JSON.stringify(that.removeGoodsList))
          }
          if (that.item.rangeType == 1) {
            for (var i = 0; i < that.item.suitableRangeList.length; i++) {
              var shop = {}
              shop.dealerId = that.item.suitableRangeList[i].id
              shop.shopName = that.item.suitableRangeList[i].name
              that.chooseShopList.push(shop)
            }
            console.log('chooseShopList:', JSON.stringify(that.chooseShopList))
          }
          if (that.item.rangeType == 2) {
            console.log('suitableRangeList:', JSON.stringify(that.item.suitableRangeList))
            for (var i = 0; i < that.item.suitableRangeList.length; i++) {
              var goods = {}
              goods.goodsId = that.item.suitableRangeList[i].id
              goods.goodsName = that.item.suitableRangeList[i].name
              goods.skuFlag = that.item.suitableRangeList[i].skuFlag
              goods.chooseSkuList = that.item.suitableRangeList[i].skuList
              that.chooseGoodsList.push(goods)
            }
            console.log('chooseGoodsList:', JSON.stringify(that.chooseGoodsList))
          }
          if (that.item.rangeType == 3) {
            for (var i = 0; i < that.item.suitableRangeList.length; i++) {
              if (that.item.suitableRangeList[i].isChoosed == 1) {
                var classify = {}
                classify.classifyId = that.item.suitableRangeList[i].id
                classify.classifyName = that.item.suitableRangeList[i].name
                that.rangeClassifyList.push(that.item.suitableRangeList[i].id)
                that.params.goods_classifys.push(classify)
              }
            }
            console.log('rangeClassifyList:', JSON.stringify(that.rangeClassifyList))
            console.log('goods_classifys:', JSON.stringify(that.params.goods_classifys))
          }
          if (that.item.fullCutType == 3) {
            that.goodsIds = that.item.itemList[0].goodsIds
            that.$.ajax({
              url: that.base + 'm2c.scm/goods/detail/multiple',
              data: {
                goodsIds: that.goodsIds
              },
              success: function (result) {
                console.log('换购商品:', JSON.stringify(result.content))
                that.exchangeGoodsList = result.content
              }
            })
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
            margin-left: 10px;
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
    left: 50%;
    top: 50%;
    width: 34px;
    height: 34px;
    margin-left: -17px;
    margin-top: -17px;
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

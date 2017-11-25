<template>
  <div class="marketingFullCutbox">
    <div class="content">
      <div class="info-content">
        <h4>基础信息</h4>
        <div class="base wrap">
          <div class="set">
            <span class="wid70">满减名称：</span>
            <input type="text" id='fullCutName' class="form-control set_name" placeholder="1-11个字符" maxlength="11" v-model="params.full_cut_name" @blur="formValidator(1)">
            <div class="set_bz" style="color: red;" v-show="tip_show.name">名称为最多11位汉字数字英文,不能为空</div>
          </div>
          <div class="set">
            <span class="wid70">有效期：</span>
            <input type="date" id='todayDate' class="form-control expiry_date" v-model="params.expiration_time_start" :min="todayDate" :max="params.expiration_time_end" @blur="formValidator(3)"/>
            <span class="">&nbsp;&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <input type="date" id='exactlyToday'  class="form-control expiry_date" v-model="params.expiration_time_end" :min="params.expiration_time_start" @blur="formValidator(4)"/>
            <div class="set_bz" style="color: red;" v-show="tip_show.time">有效期不能为空</div>
          </div>
          <div class="set">
            <span class="wid70">数量（张）</span>
            <input class="small-input form-control set_name" type="number" placeholder="请输入数量" v-model="params.total_num" oninput="if(value > 99999){value = 0}" @blur="formValidator(2)">
            <div class="set_bz"><span style="color: red;" v-show="tip_show.total_num">满减数量最多5位正整数</span>注：填0即为不限制数量</div>
          </div>
        </div>
      </div>
      <div class="info-content">
        <h4>条件设置</h4>
        <div class="base rule clear">
          <div class="intr col-xs-6">
            <p>门槛及内容</p>
            <div class="set clear" >
              <span class="wid70 color_g fl">形式</span>
              <select class="form-control set_xs fl" v-model="params.full_cut_type" @change="selectlevel(params.full_cut_type,params.threshold_type)">
                <option value="1">减钱</option>
                <option value="2">打折</option>
                <option value="3">换购</option>
              </select>
              <!-- 换购加上点击选择商品 -->
              <span class="fl" style="margin-left:10px;" v-show="showlevel5 || showlevel6">
                <a @click="openGoodsExcahnge()">点击选择换购商品</a>
              </span>
            </div>
            <div class="set clear" >
              <span class="wid70 color_g fl">门槛</span>
              <select class="form-control set_xs" v-model="params.threshold_type" @change="selectlevel(params.full_cut_type,params.threshold_type)">
                <option value="1">金额</option>
                <option value="2">件数</option>
              </select>
            </div>
            <!--满元减钱-->
            <div class="sale clear" v-show="showlevel1" v-for="(fullCut, index) in fullCutList">
              <b class="fl " style="margin-left:20px;margin-right:10px;">层级<span>{{index + 1}}</span></b>
              <span>
                <input type="hidden" v-model="fullCut.level" />
                <span class="fl">满</span>
                <input class="form-control fl money_i" v-model="fullCut.threshold" />
                <span class="fl">元</span>
                <span class="fl">减</span>
                <input class="form-control fl money_i" v-model="fullCut.money" />
                <span class="fl">元</span>
              </span>
              <a @click="addDiscount(index + 1, 1)" :style="index == fullCutList.length - 1 ? '' : 'display:none;'">增加一级优惠</a>
              <i class="icon_dele" @click="deleteDiscount(index)"></i>
            </div>
            <!--满件减钱-->
            <div class="sale clear" v-show="showlevel2" v-for="(fullCut, index) in fullCutList">
              <b class="fl " style="margin-left:20px;margin-right:10px;">层级<span>{{index + 1}}</span></b>
              <span>
                <span class="fl">满</span>
                <input class="form-control fl money_i" v-model="fullCut.threshold" />
                <span class="fl">件</span>
                <span class="fl">减</span>
                <input class="form-control fl money_i" v-model="fullCut.money" />
                <span class="fl">元</span>
              </span>
              <a @click="addDiscount(index + 1, 2)" v-show="index == fullCutList.length - 1">增加一级优惠</a>
              <i class="icon_dele" @click="deleteDiscount(index)"></i>
            </div>
            <!--满元打折-->
            <div class="sale clear" v-show="showlevel3" v-for="(fullCut, index) in fullCutList" >
              <b class="fl " style="margin-left:20px;margin-right:10px;">层级<span>{{index + 1}}</span></b>
              <span>
                <span class="fl">满</span>
                <input class="form-control fl money_i" v-model="fullCut.threshold" />
                <span class="fl">元</span>
                <span class="fl">打</span>
                <input class="form-control fl money_i" v-model="fullCut.discount"  />
                <span class="fl">折</span>
              </span>
              <a @click="addDiscount(index + 1, 3)" v-show="index == fullCutList.length - 1">增加一级优惠</a>
              <i class="icon_dele" @click="deleteDiscount(index)"></i>
            </div>
            <!--满件打折-->
            <div class="sale clear" v-show="showlevel4" v-for="(fullCut, index) in fullCutList">
              <b class="fl " style="margin-left:20px;margin-right:10px;">层级<span>{{index + 1}}</span></b>
              <span>
                <span class="fl">满</span>
                <input class="form-control fl money_i" v-model="fullCut.threshold" />
                <span class="fl">件</span>
                <span class="fl">打</span>
                <input class="form-control fl money_i" v-model="fullCut.discount" />
                <span class="fl">折</span>
              </span>
              <a @click="addDiscount(index + 1, 4)" v-show="index == fullCutList.length - 1">增加一级优惠</a>
              <i class="icon_dele" @click="deleteDiscount(index)"></i>
            </div>
            <!--满元换购-->
            <div class="sale clear" style="padding-left:20px;" v-show="showlevel5" v-for="(fullCut, index) in fullCutList">
              <span>
                <span class="fl">满</span>
                <input class="form-control fl money_i" v-model="fullCut.threshold" />
                <span class="fl">元</span>
                <span class="fl">加</span>
                <input class="form-control fl money_i" v-model="fullCut.buyingPrice" />
                <span class="fl">元换购</span>
              </span>
            </div>
            <!--满件换购-->
            <div class="sale clear"  style="padding-left:20px;" v-show="showlevel6" v-for="(fullCut, index) in fullCutList">
              <span>
                <span class="fl">满</span>
                <input class="form-control fl money_i" v-model="fullCut.threshold" />
                <span class="fl">件</span>
                <span class="fl">加</span>
                <input class="form-control fl money_i" v-model="fullCut.buyingPrice" />
                <span class="fl">元换购</span>
              </span>
            </div>
            <!-- 展示已选择换购的商品 -->
            <div class="goods" v-show="showlevel5 || showlevel6" >
              <p>已选<span>{{exchangeGoodsList.length}}</span>件商品</p>
              <ul>
                <li v-for="(exchange, index) in exchangeGoodsList">
                  <div>{{exchange.goodsName}}</div>
                  <i class="icon_dele" @click="deleteExchangeGoods(index, exchange)"></i>
                </li>
              </ul>
            </div>
            <div class="set">
              <span>
                <span>发放方式：</span>
                <span>无需发放</span>
              </span>
              <span>
                <span class="color_g">每人优惠</span>
                <input class="form-control wid70" style="height:24px;" v-model="params.num_per_one" type="number" oninput="if(value.length > 5){value=value.slice(0,5)}" @blur="formValidator(5)"/>
                <span>次</span>
              </span>
              <span v-if="params.num_per_one > 1">
                <span class="color_g">每天优惠</span>
                <input class="form-control wid70" style="height:24px;" v-model="params.num_per_day" type="number" oninput="if(value.length > 5){value=value.slice(0,5)}" @blur="formValidator(6)"/>
                <span>次</span>
              </span>
              <div class="set_bz" style="color: red;" v-show="tip_show.num_per_one">每人优惠次数必须大于0且小于满减总次数</div>
              <div class="set_bz" style="color: red;" v-show="tip_show.num_per_day">每人每天优惠次数必须大于0且小于每人优惠次数</div>
            </div>
          </div>
          <div class="range col-xs-6">
            <div>
              <span class="wid70 fl">作用范围</span>
              <select class="form-control range_of_action fl" v-model="params.range_type" @change="rangeSelect(params.range_type)">
                <option value="0">全店</option>
                <option value="2">商品</option>
              </select>
              <a v-show="rang_type_show.goods" @click="openGoodsChoose">点我选择商品</a>
              <a v-show="rang_type_show.all" @click="openFullRange">设置需要单独排除，不参与这次满减的商品</a>
            </div>
            <div class="goods" v-show="rang_type_show.goods" >
              <p>已选<span>{{chooseGoodsList.length}}</span>件商品</p>
              <ul>
                <li v-for="(choose, index) in chooseGoodsList">
                  <div>{{choose.goodsName}}</div>
                  <i class="icon_dele" @click="deleteGoods(index, choose)"></i>
                </li>
              </ul>
            </div>
            <div class="shop" v-show="rang_type_show.shop" >
              <p>已选<span>{{chooseShopList.length}}</span>商家</p>
              <ul>
                <li v-for="(choose, index) in chooseShopList">
                  <div>{{choose.shopName}}</div>
                  <i class="icon_dele" @click="deleteShop(index, choose)"></i>
                </li>
              </ul>
              <div class="more">
                <a @click="openshopAll()" v-show="chooseShopList.length > 0">查看全部商家</a>
              </div>
            </div>
            <div class="all" v-show="rang_type_show.all" >
              <div>
                <p>已排除<span>{{removeGoodsList.length}}</span>商品</p>
                <ul>
                  <li v-for="(goods, index) in removeGoodsList">
                    <div>{{goods.goodsName}}</div>
                    <i class="icon_dele" @click="deleteRemoveGoods(index, goods)"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-content info-content_bz">
        <h4>备注</h4>
        <textarea placeholder="请输入备注内容，备注中的内容不会展示给用户哦~" class="form-control" v-model="params.remark" maxlength="255"></textarea>
      </div>

      <p class="back">
        <button @click="postfrom">完成</button>
      </p>
    </div>
    <!--弹框-->
    <!-- 弹框背景遮罩层s -->
    <div   v-show="modalShadow"   class="modal-backdrop fade in" style="z-index:1;"></div>
    <!-- 弹框背景遮罩层e -->
    <!--作用范围  商品筛选弹框s-->
    <div class="modal fade frame_layer01" id="choose_goods"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog frame" style="background:#fff;">
        <div class="frame_total ">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              <div type="button" class="guanb"    @click.stop="closeBox($event)"    aria-hidden="true" style="right:-20px;"></div>
            </h5>
          </div>
          <div class="search">
            <div class="search_tit">选择商品：</div>
            <div class="clear">
              <input class="input form-control fl" type="text" placeholder="请输入商品名称" v-model="goods_query_item.condition" />
              <button class="sort fl" @click="goodsChoose">搜索</button>
              <div class="right">
              </div>
            </div>
          </div>
          <!--问题点 -->
          <div class="goods_body">
            <div class="merchant fl" v-for="(goods, index) in goodsResult.content" :key="index" >
              <div @click.prevent="openGoodsSku(goods, index,$event)">
                <div>
                  <h6>{{goods.goodsName}}</h6>
                  <img class="fl" :src="goods.goodsImageUrl" />
                  <div>
                    <div class="goodsInfoText" >{{goods.dealerName}}</div>
                    <div><b>{{goods.goodsPrice/100}}元</b></div>
                    <div class="pickSpecificationsStyle" :vaule='goods.isChooseSpecification'     @click.stop="ChooseSpecification(goods,index)">{{goods.isChooseSpecification}}</div>
                  </div>
                </div>
                <div class="fc" v-show="goods.isCheck"></div>
                <div class="fcimg" v-show="goods.isCheck"></div>
              </div>
            </div>
            <div class="page">
              <button @click="pageGoods(goodsResult.pageNumber - 1, goodsResult.pageCount)">上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button @click="pageGoods(goodsResult.pageNumber + 1, goodsResult.pageCount)">下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
              <span>页</span>
               <button @click="pageGoods(goods_query_item.pageNum, goodsResult.pageCount)">GO</button>
            </div>
          </div>
          <div class="footer">
            <button type="button" class="btn save" @click="cancleMakeGoodsIds($event)" >取消</button>
            <button type="button" class="btn cancel" @click="makeGoodsIds()">保存</button>
          </div>
        </div>
      </div>
    </div>
    <!--作用范围 商品筛选弹框e-->
    <!--作用范围 商品规格选择弹窗s-->
    <div :class='["frame_layer",goods_sku_show?"frame_layer_show":""]'    class="modal fade frame_layer01"  id="specificationChoose"  style="z-index:99999;" role="dialog" aria-labelledby="myModalLabel" aira-hidden= "true">
      <div class="specification_container ">
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
                  <input type="checkbox" v-model="sku.isCheck" :disabled="sku.disabled"/>
                  <input type="hidden" name="goodsSkuId" v-model="sku.goodsSkuId"/>
                </td>
                <td>
                  <input type="hidden" name="goodsSkuName" v-model="sku.goodsSkuName"/>
                  {{sku.goodsSkuName}}
                </td>
                <td>{{sku.goodsSkuInventory}}</td>
                <td><input class="form-control set_num fl ml10  goodsSkuNum"   min="0"  v-model="sku.goodsSkuNum" :disabled="sku.disabled"/></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="specification_footer">
          <button type="button" class="btn save"  data-dismiss="modal"  @click="cancleGoodsSkuChoose(goodsInfo,$event)" >取消</button>
          <button type="button" class="btn cancel" @click="goodsSkuChoose(goodsInfo,$event)">确认</button>
        </div>  
      </div>
    </div>
    <!--作用范围商品规格选择弹窗e-->
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
            <!-- <button type="button" class="btn cancel" data-dismiss="modal" @click="resetGoodsShop()">重置</button> -->
            <button type="button" class="btn cancel" @click="goods_shop_show=false">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--点击商品商家筛选按钮弹窗e-->
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
    <!--商品筛选已选商品全部弹窗s-->
    <div :class='["frame_layer",goods_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已选择商品
              <div class="guanb"  @click="goods_all_show=false"   ></div>
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
    <!--单独成本设置选择商家s-->
    <div class="modal fade" id="shop_cost_choose"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog shopchoose"  style="margin:20px 0px;">
        <div class="">
          <div class="modal-content frame_total">
            <div class="modal-header">
              <h5 class="modal-title text-center ">
                选择商家</h5>
              <div class="guanb" data-dismiss="modal" aria-hidden="true"></div>
            </div>
            <div class="modal-body">
              <div class="shop_choose_sort clear">
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
              <div class="shop_body">
                <div class="shop_choose">
                  <div class="shop_choosebox fl" v-for="shop in shopResult.content" style="position:relative;" @mouseenter="shop.isCostShow = true" @mouseleave="shop.isCostShow = false">
                    <div @click="openShopCost(shop.dealerId, shop.cost.platform, shop.cost.dealer)">
                      <div class="tit">{{shop.shopName}}</div>
                      <div class="img"><img :src="shop.shopIcon" /></div>
                    </div>
                    <div class="set_cd" v-show="shop.isCost&&shop.isCostShow">
                      <span>平台承担:</span>
                      <span>{{shop.cost.platform}}% </span>
                      <span>商家承担:</span>
                      <span>{{shop.cost.dealer}}%</span>
                    </div>
                    <div class="fc" v-show="shop.isCost">
                    </div>
                    <div class="fcimg" v-show="shop.isCost"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="page">
              <button >上一页</button>
              <span>{{shopResult.pageNumber}}</span>/
              <span>{{shopResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" v-model="shop_query_item.pageNum"/>
              <span>页</span>
            </div>
            <div class="modal-footer footer">
              <button type="button" class="btn save" data-dismiss="modal">取消</button>
              <button type="button" class="btn cancel" data-dismiss="modal">确认</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--单独成本设置选择商家e-->
    <!--作用范围为全店的商品商家筛选弹窗s-->
    <div class="modal fade frame_layer01" id="full_range_dialog"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog shop_goodchoose"    style="margin:10% 30%;">
        <div class="frame_total ">
          <div class="modal-header">
            <div class="modal-title text-center wid100 " >
            <span>选择商品</span>
            </div>
            <div  class="guanb" data-dismiss="modal"  @click="closeBox($event)" aria-hidden="true"></div>
          </div>
          <!--商品条件-->
          <div class="shop_choose_sort clear" :style="tab_flag == 'goods' ? '' : 'display:none;'">
            <div class="fl">
              <input placeholder="请输入商品名称进行搜索" class="form-control sort_input fl" v-model="goods_query_item.condition"/>
              <button class="sort" @click="goodsChoose()">搜索</button>
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
              <div class="merchant fl" style="position: relative;" v-for="(goods, index) in goodsResult.content" @click="addRemoveGoods(goods,index,$event)">
                <h6>{{goods.goodsName}}</h6>
                <img  class="fl " :src="goods.goodsImageUrl"/>
                <div>
                  <div class='goodsInfoText'>{{goods.dealerName}}</div>
                  <div>{{goods.goodsPrice/100}}元</div>
                  <!-- <div class="pickSpecificationsStyle"   :vaule='goods.isChooseSpecification'     @click.stop="ChooseSpecification(goods,index)">{{goods.isChooseSpecification}}</div> -->
                </div>
                <div class="fc" v-show='goods.isRemoved===1'>
                </div>
                <div class="fcimg" v-show='goods.isRemoved===1'></div>
              </div>
            </div>
            <div class="page">
                  <button @click="pageGoods(goodsResult.pageNumber - 1, goodsResult.pageCount)">上一页</button>
                  <span>{{goodsResult.pageNumber}}</span>/
                  <span>{{goodsResult.pageCount}}</span>
                  <button @click="pageGoods(goodsResult.pageNumber + 1, goodsResult.pageCount)">下一页</button>
                  <span>到</span>
                  <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
                  <span>页</span>
                  <button @click="pageGoods(goods_query_item.pageNum, goodsResult.pageCount)">GO</button>
            </div>
          </div>
          <!--商家-->
          <div class="shop_body" :style="tab_flag == 'shop' ? '' : 'display:none;'">
            <div class="shop_choose">
              <div class="shop_choosebox fl" style="position: relative;" v-for="(shop, index) in shopResult.content" @click="addRemoveShop(shop)">
                <div class="tit">{{shop.dealerName}}</div>
                <div class="img"><img :src="shop.shopIcon"/></div>
                <div class="fc" v-show="shop.isRemoved"></div>
                <div class="fcimg" v-show="shop.isRemoved"></div>
              </div>
            </div>
            <div class="page">
             <button @click="pageGoods(goodsResult.pageNumber - 1, goodsResult.pageCount)">上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button @click="pageGoods(goodsResult.pageNumber + 1, goodsResult.pageCount)">下一页</button>
              <span>到</span>
              <input style="width:24px;height:24px;display: inline-block;font-size:9px;" class="" v-model="goods_query_item.pageNum"/>
              <span>页</span>
               <button @click="pageGoods(goods_query_item.pageNum, goodsResult.pageCount)">GO</button>
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
    <!--换购商品筛选弹窗s-->
    <div class="modal fade frame_layer01" id="goods_exchange_dialog"   role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051; ">
      <div class="modal-dialog shop_goodchoose" style="margin:10% 30%;">
        <div class="frame_total ">
          <div class="modal-header">
            <div class="modal-title text-center">
              选择换购商品
            </div>
            <div  class="guanb" @click="closeBox($event)"   data-dismiss="modal" aria-hidden="true"></div>
          </div>
          <!--商品条件-->
          <div class="shop_choose_sort clear">
            <div class="fl">
              <input placeholder="请输入商品名称进行搜索" class="form-control sort_input fl" v-model="goods_query_item.condition"/>
              <button class="sort" @click="goodsChoose()">搜索</button>
            </div>
          </div>
          <!--商品-->
          <div class="shop_body" style="overflow:auto;">
            <div class="good_choose">
              <div class="merchant fl" style="position: relative;" v-for="(goods, index) in goodsResult.content" @click="addExchangeGoods(goods,index)">
                <h6>{{goods.goodsName}}</h6>
                <img  class="fl" :src="goods.goodsImageUrl"/>
                <div>
                  <div class='goodsInfoText'>{{goods.dealerName}}</div>
                  <div>{{goods.goodsPrice/100}}</div>
                  <!-- <div class="pickSpecificationsStyle"   :vaule='goods.isChooseSpecification'   @click.stop="ChooseSpecification(goods,index)">{{goods.isChooseSpecification}}</div> -->
                </div>
                <div class="fc" v-show="goods.isExchange">
                </div>
                <div class="fcimg" v-show="goods.isExchange"></div>
              </div>
            </div>
            <div class="page">
              <button>上一页</button>
              <span>{{goodsResult.pageNumber}}</span>/
              <span>{{goodsResult.pageCount}}</span>
              <button>下一页</button>
              <span>到</span>
              <input style="" class="rb" v-model="goods_query_item.pageNum"/>
              <span>页</span>
            </div>
          </div>
          <div class="footer">
            <button type="button" class="btn save" data-dismiss="modal" @click="cancelExchange()">取消</button>
            <button type="button" class="btn cancel" @click="makeExchangeIds()">确认</button>
          </div>
        </div>
      </div>
    </div>
    <!--换购商品筛选弹窗e-->
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
    <!--全店排除已排除的商家全部弹窗s-->
    <div :class='["frame_layer",shop_remove_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已选择品类
              <div class="guanb"  @click="shop_remove_all_show=false"   ></div>
            </h5>
          </div>
          <div class="modal-body">
            <div class="shop_choose_total" >
              <div class="shop_choose_s" >
                    <span v-for="shop in removeShopList">
                    <span class="shop_choose_tit">
                        <span>{{shop.dealerName}}</span>
                    </span>
                    </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--全店排除已排除的商家全部弹窗e-->
    <!--换购商品全部弹窗s-->
    <div :class='["frame_layer",goods_exchange_all_show?"frame_layer_show":""]' style="z-index:9999;" >
      <div class="modal-dialog frame shop_choose_container">
        <div class="shop_choose_center">
          <div class="modal-header">
            <h5 class="modal-title text-center">
              已选择换购商品
              <div  class="guanb"  @click="goods_exchange_all_show=false" ></div>
            </h5>
          </div>
          <div class="modal-body">
            <div class="shop_choose_total" >
              <div class="shop_choose_s" >
                    <span v-for="exchange in exchangeGoodsList">
                    <span class="shop_choose_tit">
                        <span>{{exchange.goodsName}}</span>
                    </span>
                    </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--换购商品全部弹窗e-->
  </div>
</template>

<script>  
  export default {
    name: '',
    data () {
      return {
        // 标记打开的是哪个面板
        panelFlag:'',
        modalShadow:false,
        showlevel1: true,
        showlevel2: false,
        showlevel3: false,
        showlevel4: false,
        showlevel5: false,
        showlevel6: false,
        tip_show: {name: false, total_num: false, time: false, num_per_one: false, num_per_day: false},
        todayDate: '',
        rang_type_show: {goods: true, shop: false, classify: false, all: false},
        goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
        goodsResult: '',
        shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 作用商家
        shopResult: '',
        goods_shop_show: false,
        goods_all_show: false,
        shop_cost_show: false,
        shop_cost_falg: false,
        shop_all_show: false,
        classify_all_show: false,
        goods_remove_all_show: false,
        shop_remove_all_show: false,
        goods_exchange_all_show: false,
        goods_sku_show: false,
        goods_classify_show: false,
        hasSpecificationsStyle:true, //没有规则选择时不显示
        goodsInfo: '',
        rangeClassifyList: [],
        goodsClassifyList: [],
        exchangeGoodsList: [],
        classifyList: [],
        chooseGoodsList: [],
        chooseShopList: [],
        removeGoodsList: [],
        removeShopList: [],
        tab_flag: 'goods',
        shopClassifyList: [],
        dealerCostList: [], // 商家单独成本设置
        shopCost: {dealerId: '', platform: '', dealer: ''},
        // 商家单独成本设置json,dealer_id：商家ID，platform:平台承担优惠成本,dealer:商家承担优惠成本
        fullCutList: [{threshold: '', discount: '', money: '', level: '', buyingPrice: '', goodsIds: ''}],
        // threshold:门槛金额/件数，discount:优惠折扣，money:优惠金额，level:层级,buyingPrice: 换购价,goodsIds:换购商品ids
        params: {
          full_cut_id: '', // 满减业务ID
          full_cut_name: '', // 满减名称
          total_num: '', // 满减总数
          expiration_time_start: '', // 有效期开始时间
          expiration_time_end: '', // 有效期结束世间
          full_cut_type: 1, // 满减形式，1：减钱，2：打折，3：换购
          threshold_type: 1, // 门槛类型，1：金额，2：件数
          range_type: 2, // 作用范围，0：全店，1：商家，2：商品，3：品类
          dealer_ids: [], // 商家ID列表
          goods_ids: [], // 商品ID列表
          goods_classifys: [], // 商品品类列表
          remove_goods_ids: [], // 全店排除的商品IDs
          remove_dealer_ids: [], // 全店排除的商家IDs
          num_per_one: 1, // 每人次数
          num_per_day: 1, // 每天次数
          is_effect: 1, // 是否生效，0：未生效，1：已生效
          cost_json: {platform: '', dealer: ''}, // 成本设置
          receive_type: 0, // 领取方式，0：自动领取，1：手动领取
          remark: '', // 备注
          creator_type: '2', // 生成者类型1：平台，2：商家
          creator: JSON.parse(sessionStorage.getItem('mUser')).dealerId,// 生成者
          sku_list: [],
        }
      }
    },
    created: function () {
      var that = this
      that.params.full_cut_id = that.guid()
      var date = new Date()
      that.todayDate = that.formatDate(date, 'yyyy-MM-dd')
      that.params.expiration_time_start = that.todayDate
      // console.log(that.params.creator)
    },
    methods: {
      formatDate (date, fmt) {
        var that = this
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        }
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : that.padLeftZero(str))
          }
        }
        return fmt
      },
      padLeftZero (str) {
        return ('00' + str).substr(str.length)
      },
      goto (path) {},
      // 用于生成uuid
      S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      },
      guid () {
        return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
      },
      //  发送添加请求
      postfrom () {
        let that = this
        var flag = that.formValidator(0)
        if (flag) {
          for (var i = 0; i < that.fullCutList.length; i++) {
            that.fullCutList[i].level = i + 1
          }
          var rebody = {
            full_cut_id: that.params.full_cut_id,
            full_cut_name: that.params.full_cut_name,
            total_num: that.params.total_num,
            expiration_time_start: that.params.expiration_time_start,
            expiration_time_end: that.params.expiration_time_end,
            full_cut_type: that.params.full_cut_type,
            threshold_type: that.params.threshold_type,
            full_cut_json: JSON.stringify(that.fullCutList),
            range_type: that.params.range_type,
            dealer_ids: JSON.stringify(that.params.dealer_ids),
            goods_ids: JSON.stringify(that.params.goods_ids),
            goods_classifys: JSON.stringify(that.params.goods_classifys),
            remove_goods_ids: JSON.stringify(that.params.remove_goods_ids),
            remove_dealer_ids: JSON.stringify(that.params.remove_dealer_ids),
            num_per_one: that.params.num_per_one,
            num_per_day: that.params.num_per_day,
            is_effect: that.params.is_effect,
            cost_json: JSON.stringify(that.params.cost_json),
            dealer_cost_list: JSON.stringify(that.dealerCostList),
            receive_type: that.params.receive_type,
            remark: that.params.remark,
            creator_type: that.params.creator_type,
            creator: that.params.creator,
            sku_list: that.params.sku_list
          }
          that.$.ajax({
            url: that.base + 'm2c.market/fullcut/creation',
                //  url: 'http://10.0.40.28:8080/m2c.market/web/fullcut/creation',
            contentType: 'application/json', // 必须有
            type: 'post',
            data: JSON.stringify(rebody),
            success: function (result) {
              if (result.status === 200) {
                  that.$router.push({path: '/s/marketing'})
              }
            }
          })
        }
      },
      formValidator (flag) {
        let that = this
        // falg--1:名称，2：总数，3：时间,4:形式，5：每人次数,6:每天次数,7:平台成本,8:商家成本
        if (flag == 0 || flag == 1) {
          if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,11}$/.test(that.params.full_cut_name)) {
            that.tip_show.name = true
            //输入NG的情况  定位到该处
            that.$("#fullCutName").focus().select();
            return false
          } else{
            that.tip_show.name = false
          }
        }
        if (flag == 0 || flag == 2) {
          if (that.params.total_num == '') {
            that.params.total_num = 0
          }
          if (!/^[0-9]{1,5}$/.test(that.params.total_num)) {
            that.params.total_num = 0
            that.tip_show.total_num = true
            return false
          } else{
            that.tip_show.total_num = false
          }
        }
        if (flag == 0 || flag == 3) {
          if (that.params.expiration_time_start == '') {
            that.tip_show.time = true
            return false
          } else{
            that.tip_show.time = false
          }
        }
        if (flag == 0 || flag == 4) {
          if (that.params.expiration_time_end == '') {
            that.tip_show.time = true
             that.$("#fullCutName").select();
             that.$("#exactlyToday").focus();
            return false
          } else{
            that.tip_show.time = false
          }
        }
        if (flag == 0 || flag == 5) {
          if (!/^[0-9]{1,5}$/.test(that.params.num_per_one) || parseInt(that.params.num_per_one) < 1 || parseInt(that.params.total_num) > 0 && parseInt(that.params.num_per_one) > parseInt(that.params.total_num)){
            that.tip_show.num_per_one = true
            that.params.num_per_one = 1
            return false
          } else{
            that.tip_show.num_per_one = false
          }

        }
        if (flag == 0 || flag == 6) {
          if (!/^[0-9]{1,5}$/.test(that.params.num_per_day) || parseInt(that.params.num_per_day) < 1 || parseInt(that.params.num_per_day) > parseInt(that.params.num_per_one)){
            that.tip_show.num_per_day = true
            that.params.num_per_day = 1
            return false
          } else{
            that.tip_show.num_per_day = false
          }
        }
        if (flag == 0 || flag == 7) {
          if (that.params.cost_json.platform == '' || parseInt(that.params.cost_json.platform) < 0 || parseInt(that.params.cost_json.platform) > 100) {
            that.params.cost_json.platform = ''
          }
          if (!/^(0|[1-9][0-9]?|100)$/.test(that.params.cost_json.platform)) {
            that.params.cost_json.platform = ''
          }
          if (that.params.cost_json.platform != '' && 0 <= parseInt(that.params.cost_json.platform) <= 100) {
            that.params.cost_json.dealer = 100 - that.params.cost_json.platform
          }
        }
        if (flag == 0 || flag == 8) {
          if (that.params.cost_json.dealer == '' || parseInt(that.params.cost_json.dealer) < 0 || parseInt(that.params.cost_json.dealer) > 100) {
            that.params.cost_json.dealer = ''
          }
          if (!/^(0|[1-9][0-9]?|100)$/.test(that.params.cost_json.dealer)) {
            that.params.cost_json.dealer = ''
          }
          if (that.params.cost_json.dealer != '' && 0 <= parseInt(that.params.cost_json.dealer) <= 100) {
            that.params.cost_json.platform = 100 - that.params.cost_json.dealer
          }
        }
        if (flag == 0) {
          for (var i = 0; i < that.fullCutList.length; i++) {
            if (that.params.full_cut_type == 1) {
              if (that.fullCutList[i].threshold == '' || that.fullCutList[i].money == '') {
                alert('满减门槛金额/件数和优惠金额不能为空')
                return false
              }
              if (!/^[1-9][0-9]*$/.test(that.fullCutList[i].threshold) || !/^[1-9][0-9]*$/.test(that.fullCutList[i].money)) {
                alert('满减门槛金额/件数和优惠金额必须为正整数')
                return false
              }
              if (that.params.threshold_type == 1 && parseInt(that.fullCutList[i].threshold) < parseInt(that.fullCutList[i].money)) {
                alert('满减优惠金额不能大于门槛金额')
                return false
              }
              for (var g = i + 1; g < that.fullCutList.length; g++) {
                if (parseInt(that.fullCutList[g].threshold) <= parseInt(that.fullCutList[i].threshold) || parseInt(that.fullCutList[g].money) <= parseInt(that.fullCutList[i].money)) {
                  alert('满减门槛金额/件数和优惠金额必须逐级递增')
                  that.fullCutList[g].threshold = ''
                  that.fullCutList[g].money = ''
                  return false
                }
              }
            }
            if (that.params.full_cut_type == 2) {
              if (that.fullCutList[i].threshold == '' || that.fullCutList[i].discount == '') {
                alert('满减门槛金额/件数和优惠折扣不能为空')
                return false
              }
              if (!/^[1-9][0-9]*$/.test(that.fullCutList[i].threshold)) {
                alert('满减门槛金额/件数必须为正整数')
                return false
              }
              if (!/^[0-9]{1}(.[0-9]{0,2})?$/.test(that.fullCutList[i].discount)) {
                alert('优惠折扣必须为0-10之间的最多两位小数')
                return false
              }
              for (var g = i + 1; g < that.fullCutList.length; g++) {
                if (parseInt(that.fullCutList[g].threshold) <= parseInt(that.fullCutList[i].threshold)) {
                  alert('满减门槛金额/件数必须逐级递增')
                  that.fullCutList[g].threshold = ''
                  return false
                }
                if (parseFloat(that.fullCutList[g].discount) >= parseFloat(that.fullCutList[i].discount)) {
                  alert('满减优惠折扣必须逐级递减')
                  that.fullCutList[g].discount = ''
                  return false
                }
              }
            }
            if (that.params.full_cut_type == 3) {
              if (that.fullCutList[i].threshold == '' || that.fullCutList[i].buyingPrice == '' || that.fullCutList[i].goodsIds == '') {
                alert('满减门槛金额/件数，换购价和换购商品不能为空')
                return false
              }
              if (!/^[1-9][0-9]*$/.test(that.fullCutList[i].buyingPrice)) {
                alert('满减换购金额必须为正整数')
                return false
              }
            }
          }
          if (that.params.full_cut_typ == 3 && that.exchangeGoodsList.length <= 0) {
            alert('满减形式为换购时已选换购商品不能为空')
            return false
          }
          if (that.params.range_type == 1 && (that.chooseShopList.length <= 0 || that.params.dealer_ids.length <= 0)) {
            alert('作用范围为商家时已选商家不能为空')
            return false
          }
          if (that.params.range_type == 2 && (that.chooseGoodsList.length <= 0 || that.params.goods_ids.length <= 0)) {
            alert('作用范围为商品时已选商品不能为空')
            return false
          }
        }
        return true
      },
      closeBox ($event) {
          var that = this
          let el=$event.target
          that.$(el).parents('#choose_goods').modal("hide")
          that.modalShadow =false
      },
      // 页码  
       pageGoods (pageNum, pageCount) {
        var that = this
        if (pageNum <= 1) {
          pageNum = 1
        }
        if (pageNum >= pageCount) {
          pageNum = pageCount
        }
        that.goods_query_item.pageNum = pageNum
        that.goodsChoose()
      },
      // 打开 作用范围 选择商品弹窗
      openGoodsChoose () {
        var that = this
        that.modalShadow =true
        that.$('#choose_goods').modal({'show':true ,'backdrop':false})
        // console.dir('---choose_goods------',that.$('#choose_goods'))
           // 1.把保存的數據遍历一遍  將狀態放到弹框中
          // console.log('我是that.params.goods_ids',that.params.goods_ids.length)  
          if(that.params.goods_ids.length >0 ){
           for(var h =0 ; h < that.goodsResult.content.length;h++){
              for(var k =0 ;k < that.goodsResult.content.length;k++ ){
                  if(that.goodsResult.content[h].goodsId == that.params.goods_ids[k].goodsId){
                that.goodsResult.content[h].isCheck = true
                that.goodsResult.content[h].isChoosed = 1
             }else{
               return;
                }
              }
             }
          }
        that.goods_query_item.goodsClassifyId = ''
        that.goods_query_item.condition = ''
        that.goods_query_item.dealerId = JSON.parse(sessionStorage.getItem('mUser')).dealerId;
        that.goods_query_item.pageNum = 1
        that.panelFlag =2
        that.goodsChoose()

      },
      // 作用范围 选择商品
      goodsChoose () {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.localbase + 'm2c.scm/goods/choice',
           //    url: that.localbase + 'm2c.scm/goods/choice',
          data: {
            goodsClassifyId: that.goods_query_item.goodsClassifyId,
            condition: that.goods_query_item.condition,
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
            pageNum: that.goods_query_item.pageNum,
            rows: that.goods_query_item.rows
          },
          success: function (result) {
            console.log("goodesChoose选择商品范围 ------",result);
            for (var i = 0; i < result.content.length; i++) {
              //遍历获取到的数据 result.content(result.content外包含页码) 绑定属性
              result.content[i].isRemoved = 0
              result.content[i].isChoosed = 0 
              result.content[i].isExchange = 0
              result.content[i].chooseSkuList = []
              result.content[i].isChooseSpecification ='编辑  '
       //遍历选择商品列表 同 result.content 的goodsId 匹配  匹配到就将isChoosed 设置为1 并将  chooseGoodsList里的chooseSkuList 赋值给  result.content 的chooseSkuList(选择规格列表)
              for (var j = 0; j < that.chooseGoodsList.length; j++) {
                if (result.content[i].goodsId == that.chooseGoodsList[j].goodsId) {
                  result.content[i].isChoosed = 1
                  result.content[i].chooseSkuList = that.chooseGoodsList[j].chooseSkuList
                }
              }
              // 遍历移除商品列表  同 result.content 的goodsId 匹配  有匹配到就将isRemoved设置为1
              for (var j = 0; j < that.removeGoodsList.length; j++) {
                if (result.content[i].goodsId == that.removeGoodsList[j].goodsId) {
                  result.content[i].isRemoved = 1
                  result.content[i].chooseSkuList = that.removeGoodsList[j].chooseSkuList
                  console.log('that.removeGoodsList', that.removeGoodsList)

                }
              }
              //遍历exchangeGoodsList  同上
              for (var j = 0; j < that.exchangeGoodsList.length; j++) {
                if (result.content[i].goodsId == that.exchangeGoodsList[j].goodsId) {
                  result.content[i].isExchange = 1
                }
              }
            }
            that.goodsResult = result
          }
        })
        that.modalShadow = true
      },
        //商品规格全选/全不选
      openGoodsSku (goods,index,$event) {
        var that = this
        var  choose_sku_list = []
        console.log('that.goodsResult.content=============>',that.goodsResult.content[index])
          //  点击选中  
          // 全选将选项放入chooseGoodsList
        if(that.goodsResult.content[index].isCheck == undefined || that.goodsResult.content[index].isCheck == false){
      // 数据存入 应该连同 goodsSkulist   也一并存入 
        for(var j = 0;j<that.goodsResult.content[index].goodsSkuList.length;++j){
                    // checkbox 的选中状态
                that.goodsResult.content[index].goodsSkuList[j].isCheck = true
                that.goodsResult.content[index].skuFlag = 0
                    // 商品规格列表的满减数量=库存数量
                that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum = that.goodsResult.content[index].goodsSkuList[j].goodsSkuInventory
                console.log('选中商品规格', that.goodsResult.content[index].goodsSkuList[j])
              // 定义一个空对象    将 选择规格列表传给服务器数据收集起来
                var choose_sku = {}
                //goodsSkuId :规格id
                choose_sku.goodsSkuId = that.goodsResult.content[index].goodsSkuList[j].goodsSkuId
                // goodsSkuName :规格名称
                choose_sku.goodsSkuName =that.goodsResult.content[index].goodsSkuList[j].goodsSkuName
                // goodsSkuNum :商家输入的满减数量
                choose_sku.goodsSkuNum = that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum
                choose_sku_list.push(choose_sku)
                that.goodsResult.content[index].chooseSkuList = choose_sku_list
              }
            that.chooseGoodsList.push(that.goodsResult.content[index])
            console.log("that.chooseGoodsList", that.chooseGoodsList)
            // 样式变动
           that.goodsResult.content[index].isCheck = true
            that.goodsResult.content[index].isChooseSpecification ='已选  '
        }else{
          // 再次点击取消  
          // 遍历选择商品列表同商品结果比对  如果一致就删除该商品
          for(var i = 0; i<that.chooseGoodsList.length;i++){
            if(that.goodsResult.content[index].goodsId == that.chooseGoodsList[i].goodsId){
              that.deleteGoods(i,goods)
             break;
            }
              // 清空商品规格列表 里面checkbox样式 和填写数量
                for(var j = 0;j<that.goodsResult.content[index].goodsSkuList.length;++j){
                      // 取消checkbox 的选中状态
                  that.goodsResult.content[index].goodsSkuList[j].isCheck = false
                      // 清空商品规格列表的满减数量
                  that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum = ''
                  console.log('清空商品规格', that.goodsResult.content[index].goodsSkuList[j])
                }
          }
           // isCheck控制的是 fc 和fcimg样式
          that.goodsResult.content[index].isCheck =false
          that.goodsResult.content[index].isChooseSpecification ='编辑  '
        }
        that.goodsInfo = goods
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
        if(that.goodsResult.content[index].isChooseSpecification == '已选  '){
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
          // if(that.goodsResult.content[index].isChooseSpecification ='已选  '){
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
         //  点击 规格选择弹框确认 后将数据保存起来（部分选择商品SKU）
       goodsSkuChoose (goodsInfo,$event) {
        var that = this
        var el =$event.target
        // 定义空数组  遍历弹框里的规格列表（条件为checkbox被选中且现有库存数量大于0）
        console.log('goodsInfo.goodsSkuList',goodsInfo.goodsSkuList)
        var choose_sku_list = []
        for (var i = 0; i < goodsInfo.goodsSkuList.length; i++){
          if(goodsInfo.goodsSkuList[i].goodsSkuNum>goodsInfo.goodsSkuList[i].goodsSkuInventory){
                   that.show_tip("参与满减库存应不大于现有库存")
                     goodsInfo.goodsSkuList[i].isCheck = false;
          }
          // if(goodsInfo.goodsSkuList[i].goodsSkuNum < 0){
          //          that.show_tip("参与满减库存应不小于0")
          //          goodsInfo.isChooseSpecification ='编辑  '
          //          return;  
          // }
          if (goodsInfo.goodsSkuList[i].isCheck == true && goodsInfo.goodsSkuList[i].goodsSkuNum > 0) {
           // 定义一个空对象    将 选择规格列表传给服务器数据收集起来
            var choose_sku = {}
            // goodsSkuId :规格id
            choose_sku.goodsSkuId = goodsInfo.goodsSkuList[i].goodsSkuId
            // goodsSkuName :规格名称
            choose_sku.goodsSkuName = goodsInfo.goodsSkuList[i].goodsSkuName
            // goodsSkuNum :商家输入的满减数量
            choose_sku.goodsSkuNum = goodsInfo.goodsSkuList[i].goodsSkuNum
            choose_sku_list.push(choose_sku)
          }
        }
        // 遍历是否被选中
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId == goodsInfo.goodsId) {
            if (choose_sku_list.length > 0) {
              that.goodsResult.content[i].isChoosed = 1
              that.goodsResult.content[i].skuFlag = 1;
              that.goodsResult.content[i].isCheck = true;
              that.goodsResult.content[i].isRemoved =1;
              that.goodsResult.content[i].isExchange=1;
              goodsInfo.isChooseSpecification ='已选  '
            }
            else {
              that.goodsResult.content[i].isChoosed = 0
              that.goodsResult.content[i].skuFlag = 0;
              that.goodsResult.content[i].isCheck = false;
              that.goodsResult.content[i].isRemoved =0
               that.goodsResult.content[i].isExchange=0;
              that.goodsResult.content[i].isChooseSpecification ='编辑  '
            }
            console.log('==that.goodsResult.content[i]================>', that.goodsResult.content[i])
             console.log('===goodsInfo===============>', goodsInfo)
            that.goodsResult.content[i].chooseSkuList = choose_sku_list
          }
        }
                
        // console.log("that.range 打印",that.params.range_type)    
        // console.log("that.range 打印",that.params.full_cut_type)
        // console.log("that.range 打印",that.params.full_cut_type)

            // 清空全店移除商品列表   removeGoodsList
          if(that.panelFlag===3){
           that.removeGoodsList = []
             // 将遍历到匹配到的goodsInfo goodsResult.content[i].isRemoved设为1
           for (var i = 0; i < that.goodsResult.content.length; i++) {
             if (that.goodsResult.content[i].goodsId == goodsInfo.goodsId) {
               that.goodsResult.content[i].isRemoved = 1
             }
             if (that.goodsResult.content[i].isRemoved == 1) {
               that.removeGoodsList.push(that.goodsResult.content[i])
             }
           }
          // 选择商品列表  在遍历的时候进入了该循环
          }else if(that.panelFlag===2){
           that.chooseGoodsList =[];
          for (var j = 0; j < that.goodsResult.content.length; j++) {
              if (that.goodsResult.content[j].isCheck == true) {
              var choose_goods = {}
              choose_goods.goodsId = that.goodsResult.content[j].goodsId
              choose_goods.goodsName = that.goodsResult.content[j].goodsName
              choose_goods.chooseSkuList = that.goodsResult.content[j].chooseSkuList
              choose_goods.skuFlag = that.goodsResult.content[j].skuFlag;
              that.chooseGoodsList.push(choose_goods)
              that.goodsResult.content[j].isChooseSpecification ='已选  '
              that.goodsResult.content[j].isCheck =true
              that.goodsResult.content[j].isChoosed =1
            }
          }
         // 换购商品列表
        }
        // else if(that.panelFlag===1){
        //      that.exchangeGoodsList =[];
        //         for (var j = 0; j < that.goodsResult.content.length; j++) {
        //           if (that.goodsResult.content[j].isExchange == 1) {
        //           var choose_goods = {}
        //           choose_goods.goodsId = that.goodsResult.content[j].goodsId
        //           choose_goods.goodsName = that.goodsResult.content[j].goodsName
        //           choose_goods.chooseSkuList = that.goodsResult.content[j].chooseSkuList
        //           choose_goods.skuFlag = that.goodsResult.content[j].skuFlag;
        //           that.exchangeGoodsList.push(choose_goods)
        //           that.goodsResult.content[j].isChooseSpecification ='已选  '
        //           // that.goodsResult.content[j].isCheck = true  
        //           that.goodsResult.content[j].isExchange =1
        //         }
        //       }
        //   }
        console.log('点击之后的选择商品列表',that.chooseGoodsList)  
        // console.log("点击之后的换购商品列表",that.exchangeGoodsList)
       console.log("点击之后的移除商品列表",that.removeGoodsList)
        that.goods_sku_show = false
        // let el=$event.target
        that.$(el).parents('#specificationChoose').modal("hide")
      },
      cancleGoodsSkuChoose (goodsInfo,$event) {
         //从数组中清空（被选中状态 和数量）改变样式
        let that = this
        let el=$event.target
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId == goodsInfo.goodsId) {
            for(var j= 0;j< goodsInfo.goodsSkuList.length;j++){
                goodsInfo.goodsSkuList[j].goodsSkuNum= ''
                goodsInfo.goodsSkuList[j].isCheck= false
            }
            // 控制是否选中样式
            that.goodsResult.content[i].isRemoved= 0
             that.goodsResult.content[i].isExchange= 0
          }
         
        }
         goodsInfo.isChooseSpecification = '编辑  '
        console.log('删除后的goodsInfo.goodsSkuList',goodsInfo.goodsSkuList)
      },
      deleteGoods (index, goods) {
         var that = this
        console.log('deleteGoods that.goodsResult.content[index]====>', that.goodsResult.content[index])
        that.chooseGoodsList.splice(index, 1)
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId == goods.goodsId) {
            that.goodsResult.content[i].isChoosed = 0
            that.goodsResult.content[i].chooseSkuList = []
            that.goodsResult.content[i].goodsSkuNum = 0           
          }
        }
        for (var j = 0; j < that.params.goods_ids.length; j++) {
          console.log('--參數222----',that.params.goods_ids[j].goodsId)
          if (that.params.goods_ids[j].goodsId == goods.goodsId) {
            that.params.goods_ids.splice(j, 1)
          }
        }
      },
      openGoodsAll () {
        var that = this
        that.goods_all_show = true
      },
      openshopAll () {
        var that = this
        that.shop_all_show = true
      },
      // 打开作用范围商品的商家筛选弹窗
      openGoodsShopChoose () {
        var that = this
        that.goods_shop_show = true
        that.shop_query_item.dealerName = ''
        that.shop_query_item.dealerClassify = ''
        that.shop_query_item.dealerId = JSON.parse(sessionStorage.getItem('mUser')).dealerId;
        that.shop_query_item.pageNum = 1
        that.shopSelect()
      },
      // 添加商品筛选商家条件
      goodsShopClick () {
        var that = this
        that.goods_query_item.dealerId = that.params.creator
        that.goods_shop_show = false
      },
      //取消选中商品
      cancleMakeGoodsIds ($event)  {
   //从数组中清空（被选中状态 和数量）改变样式
        let that = this
        let el=$event.target
            // 遍历弹框的 改变状态
          // for(var i = 0; i<that.goodsResult.content.length;i++) {
          //     for (var j = 0; j < that.goodsResult.content[i].goodsSkuList.length; ++j) {
          //       that.goodsResult.content[i].goodsSkuList[j].isCheck = false
          //       that.goodsResult.content[i].goodsSkuList[j].goodsSkuNum = ''
          //       that.goodsResult.content[i].isCheck =false
          //       that.goodsResult.content[i].isChoosed =false 
          //       that.goodsResult.content[i].isChooseSpecification ='编辑  '
          //       console.log('清空商品规格', that.goodsResult.content[i].goodsSkuList[j])
          //     }
          //   }
        // 清空选择商品数组
          // that.chooseGoodsList =[]
        //控制模态框
        that.$('#choose_goods').modal('hide')
        that.modalShadow =false
      },
      //拼接选中商品IDs
      makeGoodsIds () {
        var that = this
        that.params.goods_ids = []
        that.params.sku_list = []
        for (var i = 0; i < that.chooseGoodsList.length; i++) {
          var goods_item = {}
          var goods_item_sku_list = []
          for(var g = 0; g < that.chooseGoodsList[i].chooseSkuList.length; g++){
             console.log('------that.chooseGoodsList[i].chooseSkuList.length',that.chooseGoodsList[i].chooseSkuList)
            var goods_item_sku = {}
            var goodsSku_item = {}
            goods_item_sku.skuId = that.chooseGoodsList[i].chooseSkuList[g].goodsSkuId
            goods_item_sku.skuNum = that.chooseGoodsList[i].chooseSkuList[g].goodsSkuNum
            goods_item_sku_list.push(goods_item_sku)

            goodsSku_item.skuId = that.chooseGoodsList[i].chooseSkuList[g].goodsSkuId
            goodsSku_item.skuNum = that.chooseGoodsList[i].chooseSkuList[g].goodsSkuNum
            goodsSku_item.goodsId = that.chooseGoodsList[i].goodsId;
            goodsSku_item.skuFlag = that.chooseGoodsList[i].skuFlag;
            that.params.sku_list.push(goodsSku_item)
          }
          goods_item.goodsId = that.chooseGoodsList[i].goodsId
          goods_item.goodsName = that.chooseGoodsList[i].goodsName
          goods_item.skuFlag = that.chooseGoodsList[i].skuFlag;
          goods_item.skuList = goods_item_sku_list
          that.params.goods_ids.push(goods_item)
        }
        console.log("goods_ids:"+JSON.stringify(that.params.goods_ids))
        that.$('#choose_goods').modal('hide')
        that.modalShadow =false
      },
      //打开商品筛选品类选择弹窗
      openGoodsClassifyChoose () {
        var that = this
        that.goods_classify_show = true
        that.classifySelect('-1')
      },
      // 打开品类筛选弹窗
      openClassifyChoose () {
        var that = this
        that.$('#classify_dialog').modal('show')
        that.classifySelect('-1')
      },
      // 查询商品分类列表
      classifySelect (parentClassifyId) {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/goods/classify/tree',
      //     url: that.localbase + 'm2c.scm/goods/classify/tree',
          data: {
            parentClassifyId: '-1'
          },
          success: function (result) {
            that.classifyList = result.content
          }
        })
      },
      // 展开商品分类
      expandClassify () {
        var that = this
        var target = event.target
        var classifyId = target.getAttribute('classifyId')
        that.$(`[forClassifyId="${classifyId}"]`).slideToggle(200)
      },
      // 作用范围选择商品分类
      setClassify (classifyId) {
        var that = this
        console.log("that.rangeClassifyList:"+JSON.stringify(that.rangeClassifyList))
      },
      // 商品筛选选择商品分类
      setGoodsClassify (classifyId) {
        var that = this
        that.goodsClassifyList = []
        that.goodsClassifyList.push(classifyId)
      },
      //重置商品筛选商品分类
      resetGoodsClassify () {
        var that = this
        that.goodsClassifyList = []
      },
      // 重置商品分类
      resetClassify () {
        var that = this
        that.rangeClassifyList = []
        that.params.goods_classifys = []
      },
      //设置商品筛选分类条件
      makeGoodsClassify () {
        var that = this
        for(var j = 0; j < that.goodsClassifyList.length; j++) {
          that.goods_query_item.goodsClassifyId = that.goodsClassifyList[j]
        }
        that.goods_classify_show = false
      },
      makeClassifyIds () {
        var that = this
        that.params.goods_classifys = []
        for(var i = 0; i < that.rangeClassifyList.length; i++) {
          for (var a = 0; a < that.classifyList.length; a++) {
            if (that.rangeClassifyList[i] === that.classifyList[a].classifyId){
              var classify1 = {}
              classify1.classifyId = that.classifyList[a].classifyId
              classify1.classifyName = that.classifyList[a].classifyName
              that.params.goods_classifys.push(classify1)
            }
            if(that.classifyList[a].subClassify != null && that.classifyList[a].subClassify.length > 0){
              for (var b = 0; b < that.classifyList[a].subClassify.length; b++) {
                if (that.rangeClassifyList[i] === that.classifyList[a].subClassify[b].classifyId){
                  var classify2 = {}
                  classify2.classifyId = that.classifyList[a].subClassify[b].classifyId
                  classify2.classifyName = that.classifyList[a].subClassify[b].classifyName
                  that.params.goods_classifys.push(classify2)
                }
                if(that.classifyList[a].subClassify[b].subClassify != null && that.classifyList[a].subClassify[b].subClassify.length > 0){
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
        that.$('#classify_dialog').modal('hide')
        // console.log("that.params.goods_classifys:"+JSON.stringify(that.params.goods_classifys))
      },
      deleteClassify (index, classify) {
        var that = this
        that.params.goods_classifys.splice(index, 1)
        for (var c = 0; c < that.rangeClassifyList.length; c++) {
          if (that.rangeClassifyList[c] === classify.classifyId){
            that.rangeClassifyList.splice(c, 1)
          }
        }
      },
      openClassifyAll () {
        var that = this
        that.classify_all_show = true
      },
      // 打开作用范围商家筛选弹窗
      openShopChoose () {
        var that = this
        that.$('#choose_shop').modal('show')
        that.shop_query_item.dealerName = ''
        that.shop_query_item.dealerClassify = ''
        that.shop_query_item.dealerId = JSON.parse(sessionStorage.getItem('mUser')).dealerId;
        that.shop_query_item.pageNum = 1
        that.shopSelect()
      },
      // 商家筛选
      shopSelect () {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/shop/sys/shop',
          //    url: that.localbase + 'm2c.scm/shop/sys/shop',
          data: {
             dealerName: that.shop_query_item.dealerName,
             dealerClassify: that.shop_query_item.dealerClassify,
             dealerId:that.shop_query_item.dealerId,
             rows:that.shop_query_item.rows,
             pageNum:that.shop_query_item.pageNum
          },
          success: function (result) {
            for (var i = 0; i < result.content.length; i++) {
              result.content[i].isChoosed = 0
              result.content[i].isRemoved = 0
              result.content[i].isCost = false
              result.content[i].isCostShow = false
              result.content[i].cost = {platform: '', dealer: ''}
              for (var j = 0; j < that.chooseShopList.length; j++) {
                if (result.content[i].dealerId == that.chooseShopList[j].dealerId) {
                  result.content[i].isChoosed = 1
                }
              }
              for (var j = 0; j < that.removeShopList.length; j++) {
                if (result.content[i].dealerId == that.removeShopList[j].dealerId) {
                  result.content[i].isRemoved = 1
                }
              }
              for (var j = 0; j < that.dealerCostList.length; j++) {
                if (result.content[i].dealerId == that.dealerCostList[j].dealerId) {
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
      //作用范围商家筛选商家选择
      checkShop (shop) {
        var that = this
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if (that.shopResult.content[i].dealerId == shop.dealerId) {
            that.shopResult.content[i].isChoosed = 1
          }
        }
        that.chooseShopList = []
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if (that.shopResult.content[i].isChoosed == 1) {
            that.chooseShopList.push(that.shopResult.content[i])
          }
        }
      },
      //作用范围商家筛选商家选择删除
      deleteShop(index, shop){
        var that = this
        this.chooseShopList.splice(index,1)
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if (that.shopResult.content[i].dealerId == shop.dealerId) {
            that.shopResult.content[i].isChoosed = 0
          }
        }
        for (var j = 0; j < that.params.dealer_ids.length; j++) {
          if (that.params.dealer_ids[i].dealerId == shop.dealerId) {
            that.params.dealer_ids.splice(j, 1)
          }
        }
      },
      //拼装作用范围商家参数
      makeDealerIds () {
        var that = this
        that.params.dealer_ids = []
        var dealer = {}
        for (var i = 0; i < that.chooseShopList.length; i++) {
          dealer.dealerId = that.chooseShopList[i].dealerId
          dealer.shopName = that.chooseShopList[i].shopName
          that.params.dealer_ids.push(dealer)
        }
        that.$('#choose_shop').modal('hide')
      },
      changeTab (str) {
        var that = this
        that.tab_flag = str
      },
      // 单独商家成本设置商家选择弹窗
      // openShopCostChoose () {
      //   var that = this
      //   that.$('#shop_cost_choose').modal('show')
      //   that.shop_query_item.dealerName = ''
      //   that.shop_query_item.dealerClassify = ''
      //   that.shop_query_item.dealerId = ''
      //   that.shop_query_item.pageNum = 1
      //   that.shopSelect()
      //   that.shopClassifySelect()
      // },
      // 单独商家成本设置弹窗
      // openShopCost (dealerId, platform, dealer) {
      //   var that = this
      //   that.shop_cost_show = true
      //   that.shopCost.dealerId = dealerId
      //   that.shopCost.platform = platform
      //   that.shopCost.dealer = dealer
      // },
      // dealerCostBlur(flag){
      //   var that = this
      //   if(flag == 'platform'){
      //     if(that.shopCost.platform == '' || !/^(0|[1-9][0-9]?|100)$/.test(that.shopCost.platform)){
      //       that.shopCost.platform = ''
      //     }
      //     else{
      //       that.shopCost.dealer = 100 - that.shopCost.platform
      //     }
      //   }
      //   if(flag == 'dealer'){
      //     if(that.shopCost.dealer == '' || !/^(0|[1-9][0-9]?|100)$/.test(that.shopCost.dealer)){
      //       that.shopCost.dealer = ''
      //     }
      //     else{
      //       that.shopCost.platform = 100 - that.shopCost.dealer
      //     }
      //   }
      // },
      addDealerCost (dealerId, platform, dealer) {
        var that = this
        var cost = {}
        cost.dealerId = dealerId
        cost.platform = platform
        cost.dealer = dealer
        that.dealerCostList.push(cost)
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if(that.shopResult.content[i].dealerId == that.shopCost.dealerId){
            that.shopResult.content[i].isCost = true
            that.shopResult.content[i].cost.platform = that.shopCost.platform
            that.shopResult.content[i].cost.dealer = that.shopCost.dealer
          }
        }
        that.shop_cost_show = false
      },
      // 点击选择全店
      openFullRange () {
        var that = this
        that.modalShadow = true
        that.$('#full_range_dialog').modal({'show':true ,'backdrop':false})
        that.goods_query_item.goodsClassifyId = ''
        that.goods_query_item.condition = ''
        that.goods_query_item.dealerId = that.params.creator
        that.goods_query_item.pageNum = 1
        that.shop_query_item.dealerName = ''
        that.shop_query_item.dealerClassify = ''
        that.panelFlag = 3
        that.goodsChoose() //搜索商品
        that.shopSelect() //商家的选择
        that.shopClassifySelect()
      },
      shopClassifySelect () {
        var that = this
        that.$.ajax({
          type: 'get',
          url: that.base + 'm2c.scm/dealerclassify/sys/firstClassify',
//          url: that.localbase + 'm2c.scm/dealerclassify/sys/firstClassify',
          success: function (result) {
            that.shopClassifyList = result.content
          }
        })
      },
      //将数据存储到排除商品列表 
      addRemoveGoods (goods,index,$event) {
        let that = this
        //  for(var i = 0; i<that.removeGoodsList.length;i++){
        //     if(that.goodsResult.content[index].goodsId == goods.goodsId){

        //       // that.goodsResult.content[index].goodsSkuList[j].disabled =false
        //       // that.goodsResult.content[index].goodsSkuList[j].isCheck =false
        //       // that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum = ''
        //       console.log(that.goodsResult.content[index].goodsSkuList);
        //       for(var i = 0; i<that.goodsResult.content[index].goodsSkuList.length;i++) {
        //         that.goodsResult.content[index].goodsSkuList[i].disabled = false
        //         that.goodsResult.content[index].goodsSkuList[i].isCheck = false
        //         that.goodsResult.content[index].goodsSkuList[i].goodsSkuNum = ''
        //       }

        //       that.deleteRemoveGoods(i,goods)
        //       console.log('removeGoodsList',that.removeGoodsList)
        //      break;
        //     }
        //   }
         
        //   that.goodsResult.content[index].isRemoved =false
        //   that.goodsResult.content[index].isChooseSpecification ='编辑  '
        
        if(that.goodsResult.content[index].isRemoved === undefined || that.goodsResult.content[index].isRemoved === 0){
            that.goodsResult.content[index].isRemoved = 1
            that.goodsResult.content[index].isChooseSpecification ='已选  '
            // 数据存入 goodsSkulist  存入
        for(var j = 0;j<that.goodsResult.content[index].goodsSkuList.length;j++){
                    // checkbox 的选中状态  //  只显示了存入了一组数据
                that.goodsResult.content[index].goodsSkuList[j].isCheck = true
                    // 商品规格列表的满减数量=库存数量
                that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum = that.goodsResult.content[index].goodsSkuList[j].goodsSkuInventory
              //  // 定义一个空对象    将 选择规格列表传给服务器数据收集起来
              //   var choose_sku = {}
              //   //goodsSkuId :规格id
              //   choose_sku.goodsSkuId = that.goodsResult.content[index].goodsSkuList[j].goodsSkuId
              //   // goodsSkuName :规格名称
              //   choose_sku.goodsSkuName =that.goodsResult.content[index].goodsSkuList[j].goodsSkuName
              //   // goodsSkuNum :商家输入的满减数量
              //   choose_sku.goodsSkuNum = that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum
              //   choose_sku_list.push(choose_sku)
              //   that.goodsResult.content[index].chooseSkuList = choose_sku_list
              // that.removeGoodsList[index].chooseSkuList =that.goodsResult.content[index].goodsSkuList[j]
             that.removeGoodsList.push(that.goodsResult.content[index].goodsSkuList[j])
              }
            console.log("that.removeGoodsList", that.removeGoodsList)
        }else{
          for(var i = 0; i<that.removeGoodsList.length;i++){
            if(that.goodsResult.content[index].goodsId == goods.goodsId){
              console.log(that.goodsResult.content[index].goodsSkuList);
              for(var i = 0; i<that.goodsResult.content[index].goodsSkuList.length;i++) {
                that.goodsResult.content[index].goodsSkuList[i].disabled = false
                that.goodsResult.content[index].goodsSkuList[i].isCheck = false
                that.goodsResult.content[index].goodsSkuList[i].goodsSkuNum = ''
              }
              that. deleteRemoveGoods(i,goods)
              console.log('removeGoodsList',that.removeGoodsList)
             break;
            }
          }
           that.goodsResult.content[index].isRemoved = 0
           that.goodsResult.content[index].isChooseSpecification ='编辑  '
        }
    //  选中产品被移除
        that.removeGoodsList = []

        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].isRemoved == 1) {
            that.removeGoodsList.push(that.goodsResult.content[i])
          }
        }
       console.log('移除商品列表',that.removeGoodsList) 
      },
        addProductsItems (goods) {
        var that = this
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId == goods.goodsId) {
            that.goodsResult.content[i].isRemoved = 1
          }
        }
        that.removeGoodsList = []
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].isRemoved == 1) {
            that.removeGoodsList.push(that.goodsResult.content[i])
          }
        }
      },
      cancelRemove(){
        var that = this
        // for (var i = 0; i < that.goodsResult.content.length; i++) {
        //  console.log('that.chooseGoodsList---',that.chooseGoodsList  )
        //   that.goodsResult.content[i].isRemoved = 0
        //   // added by fanjc
        //   that.goodsResult.content[i].isCheck = false;
        //   that.goodsResult.content[i].goodsSkuNum = '';
        //   that.goodsResult.content[i].isChooseSpecification ='编辑  '
        //   // end added
        // }
        // for (var i = 0; i < that.shopResult.content.length; i++) {
        //   that.shopResult.content[i].isRemoved = 0
        // }
        
        // that.removeGoodsList = []
        // that.chooseGoodsList = [];
        // that.removeShopList = []
        // 
        that.$('#full_range_dialog').modal('hide')
        that.modalShadow = false
      },
      // 拼接排除商品的ID
      makeRemoveIds () {
        var that = this
        that.params.remove_goods_ids = []
        that.params.remove_dealer_ids = []
        var remove_dealer = []
        //拿到的移除商品列表push到 要传递的参数中
        for (var i = 0; i < that.removeGoodsList.length; i++){
              that.params.remove_goods_ids.push(that.removeGoodsList[i])
            }
        for (var i = 0; i < that.removeShopList.length; i++) {
          remove_dealer.dealerId = that.removeShopList[i].dealerId
          remove_dealer.shopName = that.removeShopList[i].shopName
          that.params.remove_dealer_ids.push(remove_dealer)
        }
        console.log(' that.params.remove_goods_ids', that.params.remove_goods_ids)
        //模态框控制
        that.$('#full_range_dialog').modal('hide')
        that.modalShadow = false
      },
      deleteRemoveGoods(index, goods){
        var that = this
        that.removeGoodsList.splice(index,1)
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId == goods.goodsId) {
            that.goodsResult.content[i].isRemoved = 0
          }
        }
      },
      deleteRemoveShop(index, shop){
        var that = this
        that.removeShopList.splice(index,1)
        for (var i = 0; i < that.shopResult.content.length; i++) {
          if (that.shopResult.content[i].dealerId == shop.dealerId) {
            that.shopResult.content[i].isRemoved = 0
          }
        }
      },
      // 打开换购商品弹窗
      openGoodsExcahnge () {
        var that = this
        that.$('#goods_exchange_dialog').modal({'show':true ,'backdrop':false})
        that.goods_query_item.goodsClassifyId = ''
        that.goods_query_item.condition = ''
        that.goods_query_item.dealerId = ''
        that.goods_query_item.pageNum = 1
        that.panelFlag = 1
        that.goodsChoose()
      },
      //添加换购商品
      addExchangeGoods (goods,index) {
        var that = this
        var  choose_sku_list = []
          //  点击选中  
          // 全选将选项放入exchangeGoodsList
        if(that.goodsResult.content[index].isExchange == undefined || that.goodsResult.content[index].isExchange == 0){
      // 数据存入 应该连同 goodsSkulist   也一并存入 
        for(var j = 0;j<that.goodsResult.content[index].goodsSkuList.length;++j){
                    // checkbox 的选中状态
                that.goodsResult.content[index].goodsSkuList[j].isCheck = true
                    // 商品规格列表的满减数量=库存数量
                that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum = that.goodsResult.content[index].goodsSkuList[j].goodsSkuInventory
                console.log('选中商品规格', that.goodsResult.content[index].goodsSkuList[j])
              // 定义一个空对象    将 选择规格列表传给服务器数据收集起来
                var choose_sku = {}
                //goodsSkuId :规格id
                choose_sku.goodsSkuId = that.goodsResult.content[index].goodsSkuList[j].goodsSkuId
                // goodsSkuName :规格名称
                choose_sku.goodsSkuName =that.goodsResult.content[index].goodsSkuList[j].goodsSkuName
                // goodsSkuNum :商家输入的满减数量
                choose_sku.goodsSkuNum = that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum
                choose_sku_list.push(choose_sku)
                that.goodsResult.content[index].chooseSkuList = choose_sku_list
              }
            that.exchangeGoodsList.push(that.goodsResult.content[index])
            console.log("that.chooseGoodsList", that.chooseGoodsList)
            // 样式变动
             that.goodsResult.content[index].isExchange = 1
            that.goodsResult.content[index].isChooseSpecification ='已选  '
        }else{
          // 再次点击取消  
          // 遍历选择商品列表同商品结果比对  如果一致就删除该商品
          for(var i = 0; i<that.exchangeGoodsList.length;i++){
            if(that.goodsResult.content[index].goodsId == that.exchangeGoodsList[i].goodsId){
              that.deleteExchangeGoods(i,goods)
             break;
            }
              // 清空商品规格列表 里面checkbox样式 和填写数量
                for(var j = 0;j<that.goodsResult.content[index].goodsSkuList.length;++j){
                      // 取消checkbox 的选中状态
                  that.goodsResult.content[index].goodsSkuList[j].isCheck = false
                      // 清空商品规格列表的满减数量
                  that.goodsResult.content[index].goodsSkuList[j].goodsSkuNum = ''
                  console.log('清空商品规格', that.goodsResult.content[index].goodsSkuList[j])
                }
          }
           // 改变样式
          that.goodsResult.content[index].isExchange =0
          that.goodsResult.content[index].isChooseSpecification ='编辑  '
        }
        that.goodsInfo = goods

      },
      // 删除换购商品
      deleteExchangeGoods (index, exchange) {
        var that = this
        that.exchangeGoodsList.splice(index, 1)
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          if (that.goodsResult.content[i].goodsId == exchange.goodsId) {
            that.goodsResult.content[i].isExchange = 0
          }
        }
      },
      
      cancelExchange(){
        var that = this
        for (var i = 0; i < that.goodsResult.content.length; i++) {
          that.goodsResult.content[i].isExchange = 0
        }
        that.exchangeGoodsList = []
        that.$('#goods_exchange_dialog').modal('hide')
        that.modalShadow=false
      },
      makeExchangeIds(){
        var that = this
        var exchangeGoodsIds = []
        for (var i = 0; i < that.exchangeGoodsList.length; i++) {
          exchangeGoodsIds.push(that.exchangeGoodsList[i].goodsId)
        }
        that.fullCutList[0].goodsIds = exchangeGoodsIds.join(',')
        that.$('#goods_exchange_dialog').modal('hide')
        that.modalShadow =false
      },
      addDiscount (level, flag) {
        // flag--1:滿元減元,2:满件减元，3：满元打折，4：满件打折
        var that = this
        for (var i = 0; i < that.fullCutList.length; i++) {
          that.fullCutList[i].threshold = parseInt(that.fullCutList[i].threshold) < 0 ? 0 - that.fullCutList[i].threshold : that.fullCutList[i].threshold
          that.fullCutList[i].money = parseInt(that.fullCutList[i].money) < 0 ? 0 - that.fullCutList[i].money : that.fullCutList[i].money
          that.fullCutList[i].discount = parseInt(that.fullCutList[i].discount) < 0 ? 0 - that.params.discount : that.fullCutList[i].discount
          if (flag == 1 || flag == 2) {
            if (that.fullCutList[i].threshold == '' || that.fullCutList[i].money == '') {
              alert('满减门槛金额/件数和优惠金额不能为空')
              return
            }
            if (flag == 1 && parseInt(that.fullCutList[i].threshold) < parseInt(that.fullCutList[i].money)) {
              alert('满减优惠金额不能大于门槛金额')
              return
            }
          }
          if (flag == 3 || flag == 4) {
            if (that.fullCutList[i].threshold == '' || that.fullCutList[i].discount == '') {
              alert('满减门槛金额/件数和优惠折扣不能为空')
              return
            }
            if (parseInt(that.fullCutList[i].discount) > 10) {
              alert('满减优惠折扣必须为0-10')
              return
            }
          }
        }
        if (that.fullCutList.length > 1) {
          for (var i = 0; i < that.fullCutList.length; i++) {
            for (var g = i + 1; g < that.fullCutList.length; g++) {
              if (flag == 1 || flag == 2) {
                if (parseInt(that.fullCutList[g].threshold) <= parseInt(that.fullCutList[i].threshold) || parseInt(that.fullCutList[g].money) <= parseInt(that.fullCutList[i].money)) {
                  alert('满减门槛金额/件数和优惠金额必须逐级递增')
                  that.fullCutList[g].threshold = ''
                  that.fullCutList[g].money = ''
                  return
                }
              }
              if (flag == 3 || flag == 4) {
                if (parseInt(that.fullCutList[g].threshold) <= parseInt(that.fullCutList[i].threshold)) {
                  alert('满减门槛金额/件数必须逐级递增')
                  that.fullCutList[g].threshold = ''
                  return
                }
                if (parseFloat(that.fullCutList[g].discount) >= parseFloat(that.fullCutList[i].discount)) {
                  alert('满减优惠折扣必须逐级递减')
                  that.fullCutList[g].threshold = ''
                  that.fullCutList[g].discount = ''
                  return
                }
              }
            }
          }
        }
        if (level < 3) {
          var fullcut = {threshold: '', discount: '', money: '', level: '', buyingPrice: '', goodsIds: ''}
          that.fullCutList.push(fullcut)
        } else {
          alert('最多添加3个层级')
        }
      },
      deleteDiscount (index) {
        var that = this
        if(index > 0){
          that.fullCutList.splice(index, 1)
        }
      },
      //   层级level
      selectlevel (situation, threshold) {
        var that = this
        that.exchangeGoodsList = []
        that.fullCutList = [{threshold: '', discount: '', money: '', level: '', buyingPrice: '', goodsIds: ''}]
        //满多少减多少
        if (situation == 1 && threshold == 1) {
          that.showlevel1 = true
          that.showlevel2 = false
          that.showlevel3 = false
          that.showlevel4 = false
          that.showlevel5 = false
          that.showlevel6 = false
        } else if (situation == 1 && threshold == 2) {
          that.showlevel2 = true
          that.showlevel1 = false
          that.showlevel3 = false
          that.showlevel4 = false
          that.showlevel5 = false
          that.showlevel6 = false
        } else if (situation == 2 && threshold == 1) {
          that.showlevel3 = true
          that.showlevel2 = false
          that.showlevel1 = false
          that.showlevel4 = false
          that.showlevel5 = false
          that.showlevel6 = false
        } else if (situation == 2 && threshold == 2) {
          that.showlevel4 = true
          that.showlevel2 = false
          that.showlevel3 = false
          that.showlevel1 = false
          that.showlevel5 = false
          that.showlevel6 = false
        } else if (situation == 3 && threshold == 1) {
          that.showlevel5 = true
          that.showlevel2 = false
          that.showlevel3 = false
          that.showlevel4 = false
          that.showlevel1 = false
          that.showlevel6 = false
        } else if (situation == 3 && threshold == 2) {
          that.showlevel6 = true
          that.showlevel2 = false
          that.showlevel3 = false
          that.showlevel4 = false
          that.showlevel5 = false
          that.showlevel1 = false
        }
      },
      rangeSelect (rangeType) {
        var that = this
        that.params.dealer_ids = []
        that.chooseShopList = []

        that.params.goods_ids = []
        that.chooseGoodsList = []

        that.params.goods_classifys = []
        that.rangeClassifyList = []

        that.params.remove_goods_ids = []
        that.removeGoodsList = []
        that.params.remove_dealer_ids =[]
        that.removeShopList = []

        if (rangeType == "0") {
          that.rang_type_show.goods = false
          that.rang_type_show.shop = false
          that.rang_type_show.classify = false
          that.rang_type_show.all = true
        }
        else if (rangeType == "1") {
          that.rang_type_show.goods = false
          that.rang_type_show.shop = true
          that.rang_type_show.classify = false
          that.rang_type_show.all = false
        }
        else if (rangeType == "2") {
          that.rang_type_show.goods = true
          that.rang_type_show.shop = false
          that.rang_type_show.classify = false
          that.rang_type_show.all = false
        }
        else if (rangeType == "3") {
          that.rang_type_show.goods = false
          that.rang_type_show.shop = false
          that.rang_type_show.classify = true
          that.rang_type_show.all = false
        }
        else {
          that.rang_type_show.goods = false
          that.rang_type_show.shop = false
          that.rang_type_show.classify = false
          that.rang_type_show.all = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.frame{
      margin-top: 100px;
}

  .frame_layer{
  display: none;
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
    width: 60px;
    height: 30px; 
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    color:green;
    border:1px  #BBD2F1  solid;
    box-shadow: 1px 1px 1px #ccc;
    background-color:#fff;
    border-radius:5px;
    position: absolute;
    right: 3px;
    top:73%;
    z-index: 100;
    }
  .wid50{width: 50%}
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
  .marketingFullCutbox {
    .content {
      margin-left: 20px;
      margin-top: 10px;
      .info-content_bz {
        min-height: 320px;
      }
      .info-content {
        mix-width: 1100px;
        background: rgba(255, 255, 255, 1);
        padding: 10px 0 30px 30px;
      //  background: #ccc;
        margin-bottom: 10px;
        font-size: 10px;
        a {
          color: #0086FF;
        }
        h4 {
          line-height: 32px;
          font-size: 12px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        textarea {
          width: 480px;
          height: 140px;
          outline: none;
          resize: none;
        }
        .tier {
          background: rgba(0, 134, 255, .1);
          padding: 0 10px;
          width: 433px;
          color: #0C6DFF;
          p {
            margin: 0;
            line-height: 30px;
            flex: 1;
          }
        }
        .form-cd {
          height: 24px;
          border-radius: 2px;
        }
        .sale {
          .icon_dele {
            width: 13px;
            height: 13px;
            display: inline-block;
            background: url(../../../assets/images/icon-delet.png) no-repeat center;
            margin-left: 10px;
          }
          line-height: 40px;
          max-width: 420px;
          height: 40px;
          background: rgba(245, 245, 245, 1);
          border-radius: 2px;
          margin-bottom: 10px;
          .money_i {
            width: 70px;
            height: 24px;
            border-radius: 2px;
            margin: 10px;

          }
          a {
            margin-left: 10px;
            text-decoration: none;
          }
        }
        .base {
          /*width: 480px;
          display: flex;*/
          div.intr {
            /*width:480px;*/
            /*width: 50%;*/
            .goods{
              border: 1px solid #e5e5e5;
              overflow: hidden;
              width: 420px;
              min-height: 130px;
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
                    font-size: 9px;
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
                a {
                  display: block;
                  width: 160px;
                  padding-left: 5px;
                  padding-right: 5px;
                  height: 30px;
                  line-height: 30px;
                  font-size: 9px;
                  padding-bottom: 0px;
                  background: #fff;
                  border-radius: 5px;
                  border: 1px solid #E5E5E5;
                  text-align: center;
                }
              }
              .left {
                left: 12px;
              }
              .right {
                right: 12px;
              }
            }
          }
          .set {
            /*flex:1;*/
            margin-bottom: 20px;
            line-height: 24px;
            margin-top: 20px;
          }
          .set_name {
            width: 360px;
            height: 24px;
            border-radius: 2px;
            font-size: 9px;
            display: inline-block!important;
          }
          .set_xs {
            width: 160px;
            height: 24px;
            border-radius: 2px;
            padding: 0px;

          }
          .set_bz {
            font-size: 9px;
            color: rgba(191, 193, 203, 1);
            line-height: 13px;
            margin-left: 70px;
            margin-top: 10px;
          }
          .expiry_date {
            width: 160px;
            /*height:24px;*/
            border-radius: 2px;
            display: inline-block!important;
          }
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
                    font-size: 9px;
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
                a {
                  display: block;
                  width: 160px;
                  padding-left: 5px;
                  padding-right: 5px;
                  height: 30px;
                  line-height: 30px;
                  font-size: 9px;
                  padding-bottom: 0px;
                  background: #fff;
                  border-radius: 5px;
                  border: 1px solid #E5E5E5;
                  text-align: center;
                }
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
        .wrap {
          flex-wrap: wrap;
          div {
            flex: 50%;
          }
        }
        .rule {
          width: 100%;
        }
      }
      .back {
        text-align: left;
        padding-top: 27px;
        padding-bottom: 27px;
        button {
          width: 110px;
          height: 40px;
          background: rgba(17, 210, 235, 1);
          border-radius: 2px;
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
          border: none;
        }
      }
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    /*// 模态框样式*/
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
    .shop_choose_container {
      height: 440px;
      width: 640px;
      background: #fff;
      .modal-header {
        position: relative;
        background: rgba(245, 245, 245, 1);
        .close {
          width: 50px;
          height: 50px;
          position: absolute;
          right: 0px;
          top: 0px;
          background: rgba(216, 216, 216, 1);
          color: #fff;
        }
      }
      .shop_choose_center {
        width: 100%;
        height: 360px;
        .modal-title{
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
        .shop_choose_total {
          width: 100%;
          height: 235px;
          padding-left: 20px;
          padding-right: 20px;
          padding-top: 20px;
          overflow-y: auto;
          .shop_choose_tit {
            width: 160px;
            height: 30px;
            background: rgba(245, 245, 245, 1);
            padding-left: 5px;
            padding-right: 5px;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 30px;
            margin-bottom: 10px;
            margin-right: 35px;
          }
          .active {
            color: #fff !important;
            background: #BBD2F1 !important;
          }
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
        }
      }
      .s_c_footer {
        width: 100%;
        height: 80px;
        padding-right: 50%;
        position: absolute;
        bottom: 0px;
        .btn {
          width: 110px;
          height: 40px;
          color: #fff;
          text-align: center;
          font-size: 14px;
          border: none;
          border-radius: 2px;
        }
        .save {
          background: rgba(245, 189, 35, 1);
        }
        .cancel {
          /*margin-right: -110px;*/
          background: rgba(17, 210, 235, 1);
        }
      }
    }
    .specification_container {
      min-height: 280px;
      width: 500px;
      border:1px solid #BFC1CB;
      background: #fff;
      position: absolute;
      left:40%;
      top:40%;
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
            font-size:12px;
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
          .wrapper {
            position: relative;
            .triangle {
              width: 0;
              height: 0;
              border-width: 6px 6px 0;
              border-style: solid;
              border-color: #D8D8D8 transparent transparent; /*灰 透明 透明 */
              position: absolute;
              left: -25px;
              top: 8px;
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
              width: 10px;
              height: 10px;
              border-radius: 2px;
              border: 1px solid #BFC1CB;
            }
            .input_check:checked + label {
              display: inline-block;
              width: 10px;
              height: 10px;
              background: url(../../../assets/images/icon-selected.png) no-repeat center;
            }
          }
          .tit {
            font-size: 9px;
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
  }
  .cb-set {
    width: 420px;
    /*height:50px;*/
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    margin-top: 20px;
    padding: 10px;
    position: relative;
    .tit {
      color: #000;
      font-size: 10px;
      margin-bottom: 10px;
    }
    .set {
      font-size: 10px;
      color: rgba(119, 119, 119, 1);
    }
    .icon_dele {
      width: 13px;
      height: 13px;
      display: inline-block;
      background: url(../../../assets/images/icon-delet.png) no-repeat center;
      position: absolute;
      right: 10px;
      top: 25px;
    }
  }
  .platform {
    margin-top: 20px;
  }
  .modal-open {
    #add_modify, #delete {
      display: flex
    }
    #myModal.in, #myModal2.in {
      z-index: 2000
    }
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
  /*.setdateimg{
    display: inline-block;
    position: relative;
    .icon_date{
      background:url(../../../assets/images/ico_calendar.png) no-repeat center;
      width: 20px;
      height: 15px;
      display: block;
      position: absolute;
      right: 5px;
      top: 9px;
    }
  }*/
  /*公用样式*/
  select {

    /*很关键：将默认的select选择框样式清除*/
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;

    /*在选择框的最右侧中间显示小箭头图片*/
    background: url(../../../assets/images/icon-pull.png) no-repeat right center transparent;
    width: 10px;

    /*为下拉小箭头留出一点位置，避免被文字覆盖*/
    padding-right: 14px !important;
    padding-left: 10px !important;
  }

  /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
  select::-ms-expand {
    display: none;
  }
/*::-webkit-datetime-edit { padding: 1px; background: url(); }*/
/*::-webkit-datetime-edit-fields-wrapper { background-color: #eee; }*/
/*::-webkit-datetime-edit-text { color: #4D90FE; padding: 0 .3em; }*/
/*::-webkit-datetime-edit-year-field { color: #000; }
::-webkit-datetime-edit-month-field { color:#000; }
::-webkit-datetime-edit-day-field { color: #000; }
::-webkit-inner-spin-button { visibility: hidden; }*/
/*::-webkit-calendar-picker-indicator {
   background:url(../../../assets/images/ico_calendar.png) no-repeat center;
   width: 0px;
   height:0px;
   display: inline-block;
   z-index: 2;
   border: 0;
   position: relative;
   white-space: nowrap;
   overflow: hidden;
   background: transparent;
   appearance: none;
   -moz-appearance: none;
   -webkit-appearance: none;
}*/
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
</style>

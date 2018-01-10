<template>
  <div class="yhxz_container">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" class="demo-form-inline">
          <!--基础信息-->
          <div class="BasicinFormation clear">
            <div class="Basicinbt">基础信息</div>
            <div class="mt10">
              <el-form-item label="优惠券名称">
                <el-input style="width: 350px;" v-model="couponParams.coupon_name" placeholder="不超过11个字" :maxlength="11" @blur="formValidator(1)"></el-input>
              </el-form-item>
              <el-form-item label="折扣" class="ml64">
                <el-input  v-model="couponParams.coupon_json.discount" placeholder="1~9.9" :maxlength="5" @blur="formValidator(4)">
                  <i slot="suffix" class="el-input__icon fontstyle">折</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="pl28">
              <el-form-item label="有效期">
                <el-date-picker
                  v-model="couponParams.expiration_time"
                  type="daterange"
                  clearable
                  align="left"
                  :editable="false"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="发行量" class="ml50">
                <el-input  v-model="couponParams.total_num" :maxlength="5" @blur="formValidator(2)">
                  <i slot="suffix" class="el-input__icon fontstyle">张</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="clear">
              <div class="fl tit ml80">
                有效期未开始时，用户可领取但不可使用；修改时，只能延后结束时间不能提前，请谨慎设置。
              </div>
              <div class="fl tit ml190">
                填0即为不限制数量，修改发行量只能增加不能减少，请谨慎设置。
              </div>
            </div>
          </div>
          <!--条件设置-->
          <div class="BasicinFormation clear">
            <div class="Basicinbt">条件设置</div>
            <div class="mt10">
              <el-form-item label="门槛选择">
                <el-radio v-model="couponParams.threshold_type" label="1" class="ml10">金额</el-radio>
                <el-radio v-model="couponParams.threshold_type" label="2">件数</el-radio>
                <el-radio v-model="couponParams.threshold_type" label="3">无条件</el-radio>
              </el-form-item>
            </div>
            <div class="tit01" v-if="couponParams.threshold_type == 1 || couponParams.threshold_type == 2">
              <span class="ml60 mr10">满</span>
              <el-form-item>
                <el-input  v-model="couponParams.coupon_json.threshold" placeholder="最大9999" :maxlength="4" @blur="formValidator(9)">
                  <i slot="suffix" class="el-input__icon fontstyle" v-if="couponParams.threshold_type == 1">元</i>
                  <i slot="suffix" class="el-input__icon fontstyle" v-if="couponParams.threshold_type == 2">件</i>
                </el-input>
              </el-form-item>
              <span>可使用该优惠券</span>
            </div>
            <div>
              <el-form-item label="作用范围">
                <el-radio-group v-model="couponParams.range_type" size="small" @change="changeRangeType(couponParams.range_type)">
                  <el-radio label="2" class="ml10">商品</el-radio>
                  <el-radio label="0">全店</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!--作用范围为商品-->
            <div v-if="couponParams.range_type == 2">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top clear">
                    <el-col :span="5">
                      <el-input placeholder="请输入内容" v-model="goods_query_item.condition">
                        <el-button slot="append" icon="el-icon-search" @click="goodsSelect()">搜索</el-button>
                      </el-input>
                    </el-col>
                    <span  class="limitTips" >最多选择30个商品</span>
                  </div>
                  <div class="shopbox_cen clear">
                    <!-- 请判断有商品的时候显示 -->
                    <div class="shopbox_have clear" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                      <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                      <div v-for="(goods, index) in goodsResult.content" @click="chooseGoods(goods)">
                        <el-tooltip :content="goods.goodsName" placement="right-start" effect="light">
                          <div :class="['shopbox_have_box', 'fl', goods.isChoosed == 1 ? 'b_active' : '']">
                            <div class="wose shopbox_have_tit clear">{{goods.goodsName}}</div>
                            <div class="shopbox_have_img">
                              <div class="img fl mr10">
                                <img :src="goods.goodsImageUrl"/>
                              </div>
                              <div class="tit03 fl">价格:<span>¥{{goods.goodsPrice}}元</span></div>
                            </div>
                            <i :class="goods.isChoosed == 1 ? 'icon_selected' : ''"></i>
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                    <!-- 请判断没有商品的时候显示 -->
                    <div class="shopbox_no" v-else>
                      <div class="shopboxbg"></div>
                      <div class="shopboxcen">暂时还没有商品可供选择哦</div>
                    </div>
                    <el-pagination v-if="goodsResult.content != null && goodsResult.content.length > 0"
                      @current-change="changeGoodsPageNo"
                      :current-page="goodsResult.pageNumber"
                      :page-size="10"
                      layout="total, prev, pager, next, jumper"
                      :total="goodsResult.totalCount">
                    </el-pagination>
                  </div>
                </div>
                <div class="Alreadychosen">
                  <div class="Alreadychosen_t">
                    已选 <span class="bluecolor02">{{chooseGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Alreadychosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="Alreadychosen_c_have clear" v-if="chooseGoodsList.length > 0 && goods_all_show == true">
                      <div v-for="(chooseGoods,index) in chooseGoodsList" class="fl mb10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="chooseGoodsList.length > 10" @click="goods_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="Alreadychosen_c_have clear" v-if="chooseGoodsList.length > 0 && goods_all_show == false">
                      <div v-for="(chooseGoods,index) in chooseGoodsList" class="fl mb10" v-if="index < 10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="chooseGoodsList.length > 10" @click="goods_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="Alreadychosen_c_none" v-if="chooseGoodsList.length == 0">
                      还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为全店-->
            <div v-if="couponParams.range_type == 0">
              <el-col :span="20">
                <div class="Full-court_container">
                  <div class="Full-court01">
                    <span>已设置该优惠券作用于全店商品，如需排除其中个别的商品，点击</span>
                    <span class="button" @click="openRangeDailog()">排除商品</span>
                  </div>
                  <div class="Alreadychosen">
                    <div class="Alreadychosen_t">
                      已排除 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
                    </div>
                    <div class="Alreadychosen_c">
                      <!-- 选择商品的时候 -->
                      <div class="Alreadychosen_c_have clear" v-if="removeGoodsList.length > 0 && remove_goods_all_show == true">
                        <div v-for="(removeGoods, index) in removeGoodsList">
                          <el-tooltip :content="removeGoods.goodsName" placement="bottom" effect="light">
                            <div class="img fl poi1">
                              <img :src="removeGoods.goodsImageUrl"/>
                              <div class="poi2 del_info" @click="deleteRemoveGoods(index, removeGoods)">X</div>
                            </div>
                          </el-tooltip>
                        </div>
                        <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                        <div class="img02 fl poi1" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = false">
                          <div>收起全部</div>
                          <div><i class="icon_open02"></i></div>
                        </div>
                      </div>
                      <div class="Alreadychosen_c_have" v-if="removeGoodsList.length > 0 && remove_goods_all_show == false">
                        <div v-for="(removeGoods, index) in removeGoodsList"  v-if="index < 10">
                          <el-tooltip :content="removeGoods.goodsName" placement="bottom" effect="light">
                            <div class="img fl poi1">
                              <img :src="removeGoods.goodsImageUrl"/>
                              <div class="poi2 del_info" @click="deleteRemoveGoods(index, removeGoods)">X</div>
                            </div>
                          </el-tooltip>
                        </div>
                        <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                        <div class="img02 fl poi1" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = true">
                          <div>展开全部</div>
                          <div><i class="icon_open"></i></div>
                        </div>
                      </div>
                      <!-- 没有选择任何商品的时候 -->
                      <div class="Alreadychosen_c_none" v-if="removeGoodsList.length == 0">
                        还没有选择任何商品哦!
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
          </div>
          <!--领取方式-->
          <div class="BasicinFormation clear">
            <div class="Basicinbt">
              <span class="linh35">领取方式</span>
              <el-form-item>
                <el-radio v-model="couponParams.receive_type" label="1" class="ml10">用户主动领取</el-radio>
                <el-radio v-model="couponParams.receive_type" label="2">后台派发</el-radio>
              </el-form-item>
              <div class="title02">设置为主动领取后，该优惠券将不可以通过后台进 行发放，用户可在客户端或其他渠道领取该优惠券。</div>
            </div>
          </div>
          <!--成本控制-->
          <div class="BasicinFormation clear">
            <div class="Basicinbt">
              	成本控制
            </div>
            <div class="mt10">
              <span class="fl mt10">
                领取限制
              </span>
              <el-form-item label="每人限领" class="ml20 coupon_input">
                <el-input  v-model="couponParams.num_per_one" :maxlength="5" @blur="formValidator(5)">
                  <i slot="prefix" class="fontstyle">共</i>
                  <i slot="suffix" class="el-input__icon fontstyle">次</i>
                </el-input>
              </el-form-item>
              <el-form-item label="每人每天限领" v-if="couponParams.num_per_one > 1" class="coupon_input">
                <el-input  v-model="couponParams.num_per_day" :maxlength="5" @blur="formValidator(6)">
                  <i slot="suffix" class="el-input__icon fontstyle">次</i>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <!--其他规则-->
          <div class="BasicinFormation clear mb100">
            <div class="Basicinbt">
              <span class="linh35">发放授权</span>
              <el-form-item>
                <el-checkbox v-model="couponParams.is_access" label="1" class="ml10">允许平台发放</el-checkbox>
              </el-form-item>
              <i class="icon-intro02"></i>
            </div>
            <div class="Basicinbt">
              <span class="linh35">其他规则</span>
              <el-form-item>
                <el-checkbox v-model="couponParams.is_share" label="1" class="ml10">可与其他营销活动共同使用</el-checkbox>
              </el-form-item>
              <i class="icon-intro02"></i>
            </div>
          </div>
          <!--确定提交-->
          <div class="b_button">
          	<div class="marauto wid180">
          	<el-form-item>
    					<el-button type="primary" size="medium" @click="postfrom()">创建</el-button>
    					<el-button size="medium" @click="back()">返回</el-button>
  					</el-form-item>
  					</div>
  				</div>
        </el-form>
        <!--作用范围全场弹框-->
        <el-dialog title="排除商品或店铺" :visible.sync="rangeDialogVisible" width="980px" center :modal-append-to-body="false" :close-on-click-modal="false"	>
          <span slot="title" class="Full-court-title">
            <span class="fl">排除商品</span>
            <span class="fr c_yx">
  					  已选 <span class="bluecolor02">{{removeGoodsList.length}}</span> 个商品，
  				  </span>
          </span>
          <!--商品-->
          <div class="Full-court-b_box">
            <div class="shopbox04">
              <div class="shopbox_top clear">
                <el-input placeholder="请输入内容" v-model="goods_query_item.condition" style="width: 32%;">
                   <el-button slot="append" icon="el-icon-search" @click="goodsSelect()">搜索</el-button>
                </el-input>
              </div>
              <div class="shopbox_cen clear">
                <!-- 请判断有商品的时候显示 -->
                <div class="shopbox_have clear" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                  <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                  <div v-for="(goods, index) in goodsResult.content" @click="removeGoods(goods)">
                    <el-tooltip :content="goods.goodsName" placement="right-start" effect="light">
                      <div :class="['shopbox_have_box', 'fl', goods.isRemoved == 1 ? 'b_active' : '']">
                        <div class="wose shopbox_have_tit clear">{{goods.goodsName}}</div>
                        <div class="shopbox_have_img">
                          <div class="img fl mr10">
                            <img :src="goods.goodsImageUrl"/>
                          </div>
                          <div class="tit03 fl">店铺:
                            <span v-if="goods.shopName.length > 6">{{goods.shopName.substring(0,6).concat('...')}}</span>
                            <span v-else>{{goods.shopName}}</span>
                          </div>
                          <div class="tit03 fl">价格:<span>¥{{goods.goodsPrice}}元</span></div>
                        </div>
                        <i :class="goods.isRemoved == 1 ? 'icon_selected' : ''"></i>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
                <!-- 请判断没有商品的时候显示 -->
                <div class="shopbox_no" v-else>
                  <div class="shopboxbg"></div>
                  <div class="shopboxcen">暂时还没有商品可供选择哦</div>
                </div>
                <el-pagination v-if="goodsResult.content != null && goodsResult.content.length > 0"
                  @current-change="changeGoodsPageNo"
                  :current-page="goodsResult.pageNumber"
                  :page-size="8"
                  layout="total, prev, pager, next, jumper"
                  :total="goodsResult.totalCount">
                </el-pagination>
              </div>
            </div>
            <div class="Alreadychosen">
              <div class="Alreadychosen_t">
                已排除 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
              </div>
              <div class="Alreadychosen_c overflowy">
                <!-- 没有选择任何商品的时候 -->
                <div class="Alreadychosen_c_none" v-if="removeGoodsList.length == 0">
                  还没有选择任何商品哦
                </div>
                <!-- 选择商品的时候 -->
                <div class="Alreadychosen_c_have" v-if="removeGoodsList.length > 0">
                  <div v-for="(removeGoods,index) in removeGoodsList">
                    <el-tooltip :content="removeGoods.goodsName" placement="top" effect="light">
                      <div class="img fl poi1">
                        <img :src="removeGoods.goodsImageUrl"/>
                        <div class="poi2 del_info" @click="deleteRemoveGoods(index, removeGoods)">X</div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="rangeDialogVisible = false">确 定</el-button>
            <el-button size="medium" @click="rangeDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-col>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods_all_show: false,
      remove_goods_all_show: false,
      rangeDialogVisible: false,
      goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
      goodsResult: '',
      chooseGoodsList: [],
      removeGoodsList: [],
      couponParams: {
        coupon_id: '', // 优惠券业务ID
        coupon_name: '', // 优惠券名称
        expiration_time: [], // 有效期时间
        expiration_time_start: '', // 有效期开始时间
        expiration_time_end: '', // 有效期结束时间
        total_num: '', // 优惠券总数
        coupon_type: '2', // 优惠券类型，1：代金券，2：折扣券，3：分享券
        coupon_form: '2', // 优惠券形式，1：减钱，2：打折
        threshold_type: '1', // 门槛类型，1：金额，2：件数，3：无条件
        coupon_json: {threshold: '', discount: ''}, // threshold:门槛金额/件数 // discount:优惠券面值
        range_type: '2', // 作用范围，0：全店，2：商品
        goods_ids: [],
        remove_goods_ids: [],
        receive_type: '1',
        num_per_one: '1', // 每人限领总次数
        num_per_day: '1', // 每人每天限领次数
        cost_json: {platform: 0, dealer: 100}, // 成本设置
        is_share: '0',
        is_access: '0',
        is_effect: 1,
        creator_type: 2, // 生成者类型，1：平台，2：商家
        creator: JSON.parse(sessionStorage.getItem('mUser')).dealerId // 生成者，平台或者商家ID
      },
      pickerOptions: {
        disabledDate (time) {
          let myDate = new Date()
          let year = myDate.getFullYear()
          let month = myDate.getMonth()
          let date = myDate.getDate()
          return time.getTime() < new Date(year, month, date).getTime()
        }
      }
    }
  },
  mounted () {
    let _this = this
    _this.changeRangeType('2')
  },
  created: function () {
    let _this = this
    _this.couponParams.coupon_id = _this.guid()
  },
  watch: {
    'couponParams.expiration_time': {
      handler (val, oldVal) {
        let _this = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          _this.couponParams.expiration_time_start = ''
          _this.couponParams.expiration_time_end = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 用于生成uuid
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid () {
      let _this = this
      return (_this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4())
    },
    formatDate (date, fmt) {
      let that = this
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
    // 打开全场弹框
    openRangeDailog () {
      let _this = this
      _this.rangeDialogVisible = true
    },
    // 切换作用范围
    changeRangeType (rangeType) {
      let _this = this

      _this.chooseGoodsList = []
      _this.removeGoodsList = []

      if (rangeType === '0') { // 作用范围为全场
        _this.goods_query_item = {goodsClassifyId: '', condition: '', dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, pageNum: 1, rows: 8}
        _this.goodsSelect()
      } else if (rangeType === '2') { // 作用范围为商品
        _this.goods_query_item = {goodsClassifyId: '', condition: '', dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, pageNum: 1, rows: 10}
        _this.goodsSelect()
      }
    },
    // 商品搜索
    goodsSelect () {
      let that = this
      that.$.ajax({
        type: 'get',
        url: that.base + 'm2c.scm/goods/choice',
        data: {
          goodsClassifyId: that.goods_query_item.goodsClassifyId,
          condition: that.goods_query_item.condition,
          dealerId: that.goods_query_item.dealerId,
          pageNum: that.goods_query_item.pageNum,
          rows: that.goods_query_item.rows
        },
        success: function (result) {
          for (let i = 0; i < result.content.length; i++) {
            result.content[i].isRemoved = 0
            result.content[i].isChoosed = 0
            for (let j = 0; j < that.chooseGoodsList.length; j++) {
              if (result.content[i].goodsId === that.chooseGoodsList[j].goodsId) {
                result.content[i].isChoosed = 1
              }
            }
            for (let j = 0; j < that.removeGoodsList.length; j++) {
              if (result.content[i].goodsId === that.removeGoodsList[j].goodsId) {
                result.content[i].isRemoved = 1
              }
            }
          }
          that.goodsResult = result
        }
      })
    },
    // 商品查询改变分页页码
    changeGoodsPageNo (pageNo) {
      let _this = this
      _this.goods_query_item.pageNum = pageNo
      _this.goodsSelect()
    },
    // 作用范围为商品,选择商品
    chooseGoods (goodsInfo) {
      let _this = this
      if (goodsInfo.isChoosed == 0) { // 未选中的商品被选中
        if (_this.chooseGoodsList.length < 30) {
          _this.chooseGoodsList.push(goodsInfo)
          goodsInfo.isChoosed = 1
        } else {
          _this.$message({
            message: '作用商品最多添加30个',
            type: 'warning'
          })
        }
      } else if (goodsInfo.isChoosed == 1) { // 已选中的商品被取消
        goodsInfo.isChoosed = 0
        for (let i = 0; i < _this.chooseGoodsList.length; i++) {
          if (_this.chooseGoodsList[i].goodsId == goodsInfo.goodsId) { // 该商品已在被选中商品列表中
            // 该商品是被取消的，需要从被选中商品列表删除
            _this.chooseGoodsList.splice(i, 1)
          }
        }
      }
//      console.log('chooseGoodsList:' + JSON.stringify(_this.chooseGoodsList))
    },
    // 作用范围为商品,删除商品
    deleteGoods (index, chooseGoods) {
      let _this = this
      _this.chooseGoodsList.splice(index, 1)
      for (let i = 0; i < _this.goodsResult.content.length; i++) {
        if (_this.goodsResult.content[i].goodsId === chooseGoods.goodsId) {
          _this.goodsResult.content[i].isChoosed = 0
        }
      }
    },
    // 作用范围为全场，添加被排除商品
    removeGoods (goodsInfo) {
      let _this = this
      if (goodsInfo.isRemoved == 0) { // 未选中的商品被排除
          _this.removeGoodsList.push(goodsInfo)
          goodsInfo.isRemoved = 1
      } else if (goodsInfo.isRemoved == 1) { // 已排除的商品被取消
        goodsInfo.isRemoved = 0
        for (let i = 0; i < _this.removeGoodsList.length; i++) {
          if (_this.removeGoodsList[i].goodsId == goodsInfo.goodsId) { // 该商品已在被排除商品列表中
            // 该商品是被取消的，需要从被选中商品列表删除
            _this.removeGoodsList.splice(i, 1)
          }
        }
      }
    },
    // 作用范围为全场,删除已排除商品
    deleteRemoveGoods (index, removeGoods) {
      let _this = this
      _this.removeGoodsList.splice(index, 1)
      for (let i = 0; i < _this.goodsResult.content.length; i++) {
        if (_this.goodsResult.content[i].goodsId === removeGoods.goodsId) {
          _this.goodsResult.content[i].isRemoved = 0
        }
      }
    },
    // 拼接选中商品IDs
    makeGoodsIds () {
      let _this = this
      _this.couponParams.goods_ids = []
      for (let i = 0; i < _this.chooseGoodsList.length; i++) {
        let goodsItem = {}
        goodsItem.goodsId = _this.chooseGoodsList[i].goodsId
        goodsItem.entityName = _this.chooseGoodsList[i].goodsName
        _this.couponParams.goods_ids.push(goodsItem)
      }
//      console.log('goods_ids:' + JSON.stringify(_this.couponParams.goods_ids))
    },
    // 拼装作用范围全场参数
    makeRemoveIds () {
      let _this = this
      _this.couponParams.remove_goods_ids = []
      for (let i = 0; i < _this.removeGoodsList.length; i++) {
        let removeGoods = {}
        removeGoods.goodsId = _this.removeGoodsList[i].goodsId
        removeGoods.entityName = _this.removeGoodsList[i].goodsName
        _this.couponParams.remove_goods_ids.push(removeGoods)
      }
    },
    // 发送添加请求
    postfrom () {
      let _this = this
      let flag = _this.formValidator(0)
      if (flag) {
        _this.makeGoodsIds()
        _this.makeRemoveIds()
        let rebody = {
          coupon_id: _this.couponParams.coupon_id,
          coupon_type: _this.couponParams.coupon_type,
          coupon_name: _this.couponParams.coupon_name,
          coupon_total: _this.couponParams.total_num,
          expiration_time_start: _this.couponParams.expiration_time_start,
          expiration_time_end: _this.couponParams.expiration_time_end,
          coupon_form: _this.couponParams.coupon_form,
          threshold_type: _this.couponParams.threshold_type,
          coupon_json: JSON.stringify(_this.couponParams.coupon_json),
          range_type: _this.couponParams.range_type,
          goods_ids: JSON.stringify(_this.couponParams.goods_ids),
          remove_goodsIds: JSON.stringify(_this.couponParams.remove_goods_ids),
          num_per_one: _this.couponParams.num_per_one,
          num_per_day: _this.couponParams.num_per_day,
          is_effect: _this.couponParams.is_effect,
          with_other_cut: _this.couponParams.is_share,
          access_of_platform: _this.couponParams.is_access,
          cost_json: JSON.stringify(_this.couponParams.cost_json),
          receive_type: _this.couponParams.receive_type,
          creator_type: _this.couponParams.creator_type,
          creator: _this.couponParams.creator
        }
        console.log('rebody:', JSON.stringify(rebody))
        _this.$.ajax({
         url: _this.localbase + 'm2c.market/web/coupon/creation',
          // url: 'http://localhost:8080/m2c.market/coupon/creation',
          contentType: 'application/json', // 必须有
          type: 'post',
          data: JSON.stringify(rebody),
          success: function (result) {
            if (result.status == 200) {
              console.log('status:', result.status)
              _this.$router.push({path: 'coupon_list'})
            }
          }
        })
      }
    },
    // 提交验证
    formValidator (flag) {
      let _this = this
      // flag--1:名称，2：总数，3：时间,4:折扣，5：每人次数,6:每天次数,7:平台成本,8:商家成本，9：门槛
      if (flag == 0 || flag == 1) {
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,11}$/.test(_this.couponParams.coupon_name)) {
          _this.warning('名称为最多11位汉字数字英文,不能为空')
          return false
        }
      }
      if (flag == 0 || flag == 2) {
        if (_this.couponParams.total_num == '') {
          _this.couponParams.total_num = 0
        }
        if (!/^[0-9]{1,5}$/.test(_this.couponParams.total_num)) {
          _this.couponParams.total_num = 0
          _this.warning('优惠券数量最多5位正整数，填0为不限制数量')
          return false
        }
      }
      if (flag == 0 || flag == 3) {
        if (_this.couponParams.expiration_time != null && _this.couponParams.expiration_time.length > 0) {
          _this.couponParams.expiration_time_start = _this.formatDate(_this.couponParams.expiration_time[0], 'yyyy-MM-dd')
          _this.couponParams.expiration_time_end = _this.formatDate(_this.couponParams.expiration_time[1], 'yyyy-MM-dd')
//          console.log('start_time:' + _this.couponParams.expiration_time_start + ',end_time:' + _this.couponParams.expiration_time_end)
        }
        if (_this.couponParams.expiration_time_start == '' || _this.couponParams.expiration_time_end == '') {
          _this.warning('有效期时间不能为空')
          return false
        }
      }
      if (flag == 0 || flag == 4) {
        if (!/^[1-9]([.][0-9])?$/.test(_this.couponParams.coupon_json.discount)) {
          _this.couponParams.coupon_json.discount = ''
          _this.warning('优惠券折扣为1-9.9间一位小数')
          return false
        }
      }
      if (flag == 0 || flag == 9) {
        if (_this.couponParams.threshold_type === '1' || _this.couponParams.threshold_type === '2') {
          if (!/^[1-9]\d{0,3}$/.test(_this.couponParams.coupon_json.threshold)) {
            _this.couponParams.coupon_json.threshold = ''
            _this.warning('优惠券门槛为最多9999正整数')
            return false
          }
        } else {
          _this.couponParams.coupon_json.threshold = 0
        }
      }
      if (flag == 0 || flag == 5) {
        if (!/^[0-9]{1,5}$/.test(_this.couponParams.num_per_one) ||
          parseInt(_this.couponParams.num_per_one) < 1 ||
          (parseInt(_this.couponParams.total_num) > 0 && parseInt(_this.couponParams.num_per_one) > parseInt(_this.couponParams.total_num))) {
          _this.warning('每人领取优惠券次数必须大于0且小于优惠券发行张数')
          _this.couponParams.num_per_one = 1
          return false
        }
      }
      if (flag == 0 || flag == 6) {
        if (!/^[0-9]{1,5}$/.test(_this.couponParams.num_per_day) ||
          parseInt(_this.couponParams.num_per_day) < 1 ||
          parseInt(_this.couponParams.num_per_day) > parseInt(_this.couponParams.num_per_one)) {
          _this.warning('每人每天领取优惠券次数必须大于0且小于每人领取优惠券次数')
          _this.couponParams.num_per_day = 1
          return false
        }
      }
      if (flag == 0) {
        if (_this.couponParams.range_type == 2 && (_this.chooseGoodsList.length <= 0)) {
          _this.warning('作用范围为商品时已选商品不能为空')
          return false
        }
      }
      return true
    },
    // 验证提示
    warning (msg) {
      let _this = this
      _this.$message.error(msg)
    },
    back () {
      let _this = this
      _this.$goRoute({path: 'coupon_list'})
    }
  }
}
</script>

<style lang="scss" scoped>
 .limitTips {
    margin-left:10px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #999999;
    line-height: 40px;
    display: inline-block;
  }
  .border_top{
    border-top: 1px solid #E5E5E5;
  }
  .marauto{
    margin: auto;
  }
  .wid180{
    width: 180px;
  }
  .poi1{
    position: relative;
  }
  .overflowy{
    overflow-y: auto;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .poi2{
    position: absolute;
  }
  .poi3{
    position: fixed;
  }
  .wose{
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wose02{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .bluecolor{
    background: #0086FF;
    color: #FFFFFF;
  }
  .bluecolor02{
    color: #0086FF;

  }
  .yhxz_container{
    padding: 15px 26px;
    .img02{
      width: 60px;
      height: 60px;
      border: 1px solid #E6E8F2;
      font-size:12px;
      font-family:PingFangSC-Regular;
      color:rgba(0,134,255,1);
      text-align: center;
      padding-top: 15px;
      cursor: pointer;
    }
    .icon_open{
      width: 15px;
      height: 7px;
      display: inline-block;
      background: url(../../../assets/images/icon_open.png) no-repeat center;
    }
    .icon_open02{
      width: 15px;
      height: 7px;
      display: inline-block;
      background: url(../../../assets/images/icon_open02.png) no-repeat center;
    }
    .c_yx{
      padding-right: 40px;
      font-size: 14px;
      color: #777777;
    }
    .Full-court-b_box{
      width: 100%;
      /*height: 350px;*/
      .shopbox04{
        height: 350px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        .shopbox_top{
          height: 50px;
          line-height: 50px;
          background:rgba(249,250,254,1);
          padding-left: 10px;
          padding-right: 20px;
          border-bottom: 1px solid #E6E8F2;
          /*padding-top: 10px;*/
          .title{
            width:99px;
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(136,186,244,1);
            display: inline-block;
            line-height: 32px;
          }
          .b_input-with{
            width: 100%!important;
            height: 32px!important;
            line-height: 32px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .b_select{
            width: 150px!important;
            height: 32px!important;
            margin-left: 10px;
          }
          .sort{
            width:60px;
            height:32px;
            background:rgba(255,255,255,1);
            border-radius: 0px 2px 2px 0px ;
            line-height: 32px;
            color:rgba(0,134,255,1);
            font-size: 14px;
            display: inline-block;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #d8dce5;
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius:0px;
          }
        }
        .shopbox_cen{
          height: 305px;
          overflow-y: auto;
          padding: 10px;
          .shopbox_no{
            width: 100%;
            height: 90%;
            .shopboxbg{
              width: 100%;
              height: 50%;
              background: url(../../../assets/images/icon_none.png) no-repeat center bottom;
            }
            .shopboxcen{
              text-align: center;
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:rgba(204,204,204,1);
              margin-top: 20px;
            }
          }
          .shopbox_have{
            width: 100%;
            height: 88%;
            overflow-y: auto;
            .shopbox_have_box{
              width: 200px;
              /*height: 100px;*/
              border:1px solid #E6E8F2;
              margin-right:10px;
              margin-bottom:10px;
              cursor: pointer;
              .shopbox_have_tit{
                padding-left: 5px;
                width: 100%;
                height: 28px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                border-bottom: 1px solid #E6E8F2;
                line-height: 28px;
              }
              .shopbox_have_img{
                width: 100%;
                height: 78px;
                padding: 5px;
                .img{
                  width:60px;
                  height:60px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                .tit03{
                  width: 60%;
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  color:rgba(0,0,0,1);
                  line-height:17px;
                }
              }
            }
          }
        }
      }
      .Alreadychosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 0px;
        min-height: 115px;
        .Alreadychosen_t{
          width: 100%;
          height: 32px;
          line-height: 32px;
          border-bottom: 1px solid #E6E8F2;
          padding-left: 20px;
          color: #878787;
          font-size: 14px;
          .bluecolor{
            color: #006FFF;
          }
        }
        .Alreadychosen_c{
          height: 83px;
          padding-top: 10px;
          padding-left: 10px;
          .Alreadychosen_c_none{
            line-height: 83px;
            color: #ccc;
            font-size: 14px;
          }
          .Alreadychosen_c_have{
            width: 100%;
            height: 100%;
            .Alreadychosen_c_h_shop{
              width: 200px;
              height: 28px;
              line-height: 28px;
              font-size: 12px;
              padding-left: 5px;
              background: #F5F5F5;
              margin-right: 10px;
              margin-bottom: 10px;
            }
            .allshop{
              width:80px;
              height:28px;
              line-height: 28px;
              background:rgba(245,245,245,1);
              border-radius: 2px ;
              color: #0086FF;
              font-size: 12px;
              text-align: center;
              cursor: pointer;
              .icon_open{
                width: 15px;
                height: 7px;
                display: inline-block;
                background: url(../../../assets/images/icon_open.png) no-repeat center;
              }
            }
            .img{
              width: 60px;
              height: 60px;
              margin-right:10px;
              margin-bottom: 10px;
              img{
                width: 60px;
                height: 60px;
                margin-right: 10px;
                cursor: pointer;
              }
            }
            .img:hover .del_info{
              display: block;
            }
            .img:hover .alt1{
              display: block;
            }
            .del_info{
              width: 58px;
              display: none;
              height: 14px;
              line-height: 14px;
              font-size: 10px;
              color: #F5BD23;
              text-align: center;
              bottom: 1px;
              left: 1px;
              background: #fff;
              border-top:1px solid #E5E5E5;
              cursor: pointer;
            }
          }
        }
      }
    }
    .Full-court-title{
      font-size:16px;
      font-family:PingFangSC-Medium;
      color:rgba(119,119,119,1);
      line-height:32px;
      span{
        line-height: 32px;
        display: inline-block;
      }
      ._bt{
        /*	width: 120px;*/
        height: 32px;
        display: inline-block;
        line-height: 32px;
        border: 1px solid #E6E8F2;
      }
      .goods{
        width: 60px;
        display: inline-block;
        text-align: center;
        border-right: 1px solid #E6E8F2;
        cursor: pointer;
      }
      .shop{
        width: 60px;
        display: inline-block;
        text-align: center;
        border-right: 1px solid #E6E8F2;
        cursor: pointer;
      }
    }
    .sigle_set{
      width: 100%;
      height: 625px;
      .sigle_set_left{
        width: 450px;
        height: 600px;
        border: 1px solid #E6E8F2;
        cursor: pointer;
        .sigle_set_left_t{
          width: 100%;
          height: 50px;
          background:rgba(249,250,254,1);
          border-radius: 3px 3px 0px 0px;
          border-bottom:1px solid #E6E8F2;
          padding-top:10px;
          padding-left:5px;
          .single_input-with{
            width: 192px!important;
            height: 32px!important;
            line-height: 32px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .sort{
            width:60px;
            height:32px;
            background:rgba(255,255,255,1);
            border-radius: 0px 2px 2px 0px ;
            line-height: 32px;
            color:rgba(0,134,255,1);
            font-size: 14px;
            display: inline-block;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #d8dce5;
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius:0px;
          }
          .b_select{
            width: 150px!important;
            height: 32px!important;
            margin-left: 10px;
          }
        }
        .sigle_set_left_b{
          padding: 10px;
          overflow-y: auto;
          width: 100%;
          height: 550px;
          .sigle_set_leftbox{
            width: 90px;
            height: 140px;
            border: 1px solid #E6E8F2;
            margin-right: 10px;
            margin-bottom: 10px;
            .tit06{
              font-size:12px;
              font-family:PingFangSC-Regular;
              color:rgba(0,0,0,1);
              line-height:24px;
              padding-left: 5px;
              border-bottom: 1px solid #E6E8F2;
              height: 48px;
              width: 100%;
            }
            .s_img{
              padding-top: 15px;
              padding-left: 15px;
              img{
                width: 60px;
                height: 60px;
              }

            }
          }
        }
      }
      .sigle_set_right{
        width: 450px;
        height: 600px;
        border: 1px solid #E6E8F2;
        .sigle_set_right_t{
          width: 100%;
          height: 50px;
          background: #f9fafe;
          line-height: 50px;
          padding-left: 10px;
          color: #999999;
          font-size: 14px;
          border-bottom: 1px solid #E6E8F2;
        }
        .sigle_set_right_b{
          padding: 10px;
          overflow-y: auto;
          width: 100%;
          height: 550px;
          .sigle_set_right_b_box{
            width: 100%;
            /*height: 50px;*/
            padding: 10px;
            border: 1px solid #F5F5F5;
            background:rgba(245,245,245,1);
            border-radius: 2px;
            text-align: left;
            margin-bottom: 10px;
            .sigle_set_right_b_box_t{
              font-size: 12px;
              width: 80%;
              .tit04{
                color: #000000;
              }
              .tit05{
                color: #777777;
                .perce{
                  width:55px!important ;
                  height: 30px!important;
                }
              }
            }
            .icon_delet02{
              width: 16px;
              height: 20px;
              display: inline-block;
              background: url(../../../assets/images/icon_delet02.png) no-repeat center;
              margin-top: 20px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .b_button{
      padding-top: 20px;
      padding-bottom: 20px;
      margin-top: 10px;
      background: #fff;
      position: fixed;
      z-index: 99;
      bottom: 0px;
      width: 100%;
      left: 200px;
      border-top:1px solid #E6E8F2;
    }
    .b_active{
        border: 1px solid #0086FF!important;
        position: relative;
        .icon_selected{
          position: absolute;
          background: url(../../../assets/images/icon_selected.png) no-repeat center;
          width:18px;
          height:18px;
          right: 0px;
          bottom: 0px;
        }
      }
    .BasicinFormation{
      background-color: #fff;
      padding: 20px 34px;
      /*padding-: 28px;*/
      margin-bottom: 10px;
      .Basicinbt{
        font-size:16px;
        font-family:PingFangSC-Medium;
        color:rgba(0,0,0,1);
      }
      .icon-intro02{
        width: 15px;
        height: 15px;
        background: url(../../../assets/images/icon-intro02.png) no-repeat center;
        display: inline-block;
        margin-top: 12px;
      }
      .tit{
        display: inline-block;
        width:280px;
        height:34px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(204,204,204,1);
        line-height:17px;
        /*padding-left:80px;*/
      }
      .tit01{
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(153,153,153,1);
        line-height:40px;
        display: inline-block;
      }
      .Alreadychosenshop{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 75px;
        height: 220px;
        .Alreadychosenshop_t{
          width: 100%;
          height: 32px;
          line-height: 32px;
          border-bottom: 1px solid #E6E8F2;
          padding-left: 20px;
          color: #878787;
          font-size: 14px;
          .bluecolor{
            color: #006FFF;
          }
        }
        .Alreadychosenshop_c{
          height: 168px;
          text-align: center;
          padding: 10px;
          .Alreadychosenshop_c_none{
            line-height: 168px;
            color: #ccc;
            font-size: 14px;
          }
          .Alreadychosenshop_c_have{
            height: 168px;
            overflow-y: auto;
            .Alreadychosenshop_box{
              width: 390px;
              /*height: 50px;*/
              padding: 10px;
              border: 1px solid #F5F5F5;
              background:rgba(245,245,245,1);
              border-radius: 2px;
              text-align: left;
              margin-right: 10px;
              .Alreadychosenshop_box_t{
                font-size: 12px;
                width: 80%;
                .tit04{
                  color: #000000;
                }
                .tit05{
                  color: #777777;
                }
              }
              .icon_delet02{
                width: 16px;
                height: 20px;
                display: inline-block;
                background: url(../../../assets/images/icon_delet02.png) no-repeat center;
                margin-top: 10px;
                cursor: pointer;
              }
            }
          }
        }
      }
      .shopbox{
        /*width: 980px;*/
        height: 350px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 75px;
        .shopbox_top{
          height: 50px;
          line-height: 50px;
          background:rgba(249,250,254,1);
          padding-left: 10px;
          padding-right: 20px;
          border-bottom: 1px solid #E6E8F2;
          /*padding-top: 10px;*/
          .title{
            width:99px;
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(136,186,244,1);
            display: inline-block;
            line-height: 32px;
          }
          .b_input-with{
            width: 100%!important;
            height: 32px!important;
            line-height: 32px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .b_select{
            width: 150px!important;
            height: 32px!important;
            margin-left: 10px;
          }
          .sort{
            width:60px;
            height:32px;
            background:rgba(255,255,255,1);
            border-radius: 0px 2px 2px 0px ;
            line-height: 32px;
            color:rgba(0,134,255,1);
            font-size: 14px;
            display: inline-block;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #d8dce5;
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius:0px;
          }
        }
        .shopbox_cen{
          height: 300px;
          /*overflow-y: auto;*/
          padding: 10px;
          .shopbox_no{
            width: 100%;
            height: 90%;
            .shopboxbg{
              width: 100%;
              height: 50%;
              background: url(../../../assets/images/icon_none.png) no-repeat center bottom;
            }
            .shopboxcen{
              text-align: center;
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:rgba(204,204,204,1);
              margin-top: 20px;
            }
          }
          .shopbox_have{
            width: 100%;
            height: 88%;
            overflow-y: auto;
            .shopbox_have_box{
              width: 230px;
              /*height: 100px;*/
              border:1px solid #E6E8F2;
              margin-right:10px;
              margin-bottom:10px;
              cursor: pointer;
              .shopbox_have_tit{
                padding-left: 5px;
                width: 100%;
                height: 28px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                border-bottom: 1px solid #E6E8F2;
                line-height: 28px;
              }
              .shopbox_have_img{
                width: 100%;
                height: 78px;
                padding: 5px;
                .img{
                  width:60px;
                  height:60px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                .tit03{
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                line-height:17px;
                }
              }
            }
          }
        }
      }
      .Full-court_container{
        margin-left: 75px;
        .img02{
          width: 60px;
          height: 60px;
          border: 1px solid #E6E8F2;
          font-size:12px;
          font-family:PingFangSC-Regular;
          color:rgba(0,134,255,1);
          text-align: center;
          padding-top: 15px;
          cursor: pointer;
        }
        .icon_open{
          width: 15px;
          height: 7px;
          display: inline-block;
          background: url(../../../assets/images/icon_open.png) no-repeat center;
        }
        .Full-court01{
          height: 50px;
          border: 1px solid #E6E8F2;
          background: #F9FAFE;
          line-height: 50px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          color:rgba(153,153,153,1);
          padding-left: 17px;
          .button{
            width:120px;
            height:30px;
            background:rgba(255,255,255,1);
            border-radius: 2px ;
            text-align: center;
            border: 1px solid #E6E8F2;
            color:#73A9E8 ;
            display: inline-block;
            line-height: 30px;
            cursor: pointer;
          }

        }
        .Alreadychosen{
          margin-left: initial;
        }
      }
      .category_container{
        padding-left: 80px;
        .category_container_l{
          width: 430px;
          height: 380px;
          border: 1px solid #E6E8F2;
          margin-right: 20px;
          .category_container_l_t{
            width: 100%;
            height: 32px;
            line-height: 32px;
            padding-left: 15px;
            color: #999;
            font-size: 14px;
            border-bottom:1px solid #E6E8F2;
            background:rgba(249,250,254,1);
            border-radius: 3px 3px 0px 0px ;
            .tit07{
              font-size:12px;
              font-family:PingFangSC-Regular;
              color:rgba(136,186,244,1);
            }
          }
          .category_container_l_b{
            width: 100%;
            height: 345px;
            overflow-y: auto;
            padding: 10px 20px;
          }
        }
        .category_container_r{
          width: 250px;
          height: 380px;
          border: 1px solid #E6E8F2;
          .category_container_r_t{
            width: 100%;
            height: 32px;
            line-height: 32px;
            padding-left: 15px;
            color: #999;
            font-size: 14px;
            border-bottom:1px solid #E6E8F2;
            background:rgba(249,250,254,1);
            border-radius: 3px 3px 0px 0px ;
            .tit08{
              color: #006FFF;
            }
          }
          .category_container_r_b{
            width: 100%;
            height: 348px;
            overflow-y: auto;
            padding: 10px;
            .category_container_r_box:hover .tit09{
              display: block;
            }
            .category_container_r_box{
              width:100%;
              height:28px;
              background:rgba(245,245,245,1);
              border-radius: 2px ;
              font-size:12px;
              font-family:PingFangSC-Medium;
              color:rgba(0,0,0,1);
              line-height:28px;
              padding-left: 5px;
              padding-right: 5px;
              margin-bottom: 5px;
              .tit09{
                display: none;
                color: #73A9E8;
                cursor: pointer;
              }
            }
          }
        }
      }
      .Alreadychosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 75px;
        min-height: 115px;
        .Alreadychosen_t{
          width: 100%;
          height: 32px;
          line-height: 32px;
          border-bottom: 1px solid #E6E8F2;
          padding-left: 20px;
          color: #878787;
          font-size: 14px;
          .bluecolor{
            color: #006FFF;
          }
        }
        .Alreadychosen_c{
          min-height: 83px;
          padding-top: 10px;
          padding-left: 10px;
          .Alreadychosen_c_none{
            line-height: 83px;
            color: #ccc;
            font-size: 14px;
          }
          .Alreadychosen_c_have{
            width: 100%;
            height: 100%;
            .Alreadychosen_c_h_shop{
              width: 200px;
              height: 28px;
              line-height: 28px;
              font-size: 12px;
              padding-left: 5px;
              background: #F5F5F5;
              margin-right: 10px;
              margin-bottom: 10px;
            }
            .allshop{
              width:80px;
              height:28px;
              line-height: 28px;
              background:rgba(245,245,245,1);
              border-radius: 2px ;
              color: #0086FF;
              font-size: 12px;
              text-align: center;
              cursor: pointer;
              .icon_open{
                width: 15px;
                height: 7px;
                display: inline-block;
                background: url(../../../assets/images/icon_open.png) no-repeat center;
              }
              .icon_open02{
                width: 15px;
                height: 7px;
                display: inline-block;
                background: url(../../../assets/images/icon_open02.png) no-repeat center;
              }
            }
            .img{
              width: 60px;
              height: 60px;
              margin-right:10px;
              margin-bottom: 10px;
              img{
                width: 60px;
                height: 60px;
                margin-right: 10px;
                cursor: pointer;
              }
            }
            .img:hover .del_info{
              display: block;
            }
            .img:hover .alt1{
              display: block;
            }
            /*.alt1{
              right: -10px;
              top: -20px;
              padding-left: 5px;
              padding-right: 5px;
              border: 1px solid #979797;
              color:#979797;
              line-height: 20px;
              font-size: 12px;
              display: none;
            }*/
            .del_info{
              width: 58px;
              display: none;
              height: 14px;
              line-height: 14px;
              font-size: 10px;
              color: #F5BD23;
              text-align: center;
              bottom: 1px;
              left: 1px;
              background: #fff;
              border-top:1px solid #E5E5E5;
              cursor: pointer;
            }
          }
        }
      }
      .title02{
        width:322px;
        height:40px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(153,153,153,1);
        line-height:20px;
        margin-left: 75px;
      }
      .pl28{
        padding-left: 28px;
      }
      .ml66{
        margin-left: 66px;
      }
    }
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  .mt2{
    margin-top: 2px;
  }
  .mt5{
    margin-top: 6px;
  }
  .mt10{
    margin-top: 10px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mt20{
    margin-top: 20px;
  }
  .ml10{
    margin-left: 10px;
  }
  .ml15{
    margin-left: 15px;
  }
  .ml20{
    margin-left: 20px;
  }
  .ml29{
    margin-left: 29px;
  }
  .ml100{
    margin-left: 100px;
  }
  .ml50{
    margin-left: 50px;
  }
  .ml64{
    margin-left: 64px;
  }
  .linh35{
    line-height: 35px;
    display: inline-block;
  }
  .ml60{
    margin-left: 60px;
  }
  .ml80{
    margin-left: 80px;
  }
  .ml190{
    margin-left: 190px;
  }
  .mr10{
    margin-right: 10px;
  }
  .fontstyle{
    font-style: normal;
  }
  .mb100{
    margin-bottom: 100px!important;
  }
  .w200{
    width: 200px;
  }
</style>

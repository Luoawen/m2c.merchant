<template>
  <div class="yhxz_container">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" class="demo-form-inline">
          <div class="BasicinFormation clear">
            <div class="Basicinbt">基础信息</div>
            <div class="mt10">
              <el-form-item label="优惠券名称">
                <el-input  v-model="couponParams.coupon_name" placeholder="不超过11个字" :maxlength="11" @blur="formValidator(1)"></el-input>
              </el-form-item>
              <el-form-item label="面值" class="ml200">
                <span v-if="couponInfo.couponForm == 1" class="ml10">{{couponInfo.couponItem.faceValue}} 元</span>
                <span v-if="couponInfo.couponForm == 2" class="ml10">{{couponInfo.couponItem.faceValue}} 折</span>
              </el-form-item>
            </div>
            <div class="pl28">
              <el-form-item label="有效期">
                <span>{{couponInfo.expirtationTimeStart}} 至 </span>
                <el-date-picker
                  v-model="couponParams.expiration_time_end"
                  type="date"
                  clearable
                  :editable="false"
                  :default-value="couponInfo.expirtationTimeEnd"
                  placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="发行量" class="ml66 coupon_input">
                <div class="mt6" v-if="couponInfo.couponTotal == 0">
                  <span class="ml10">不限制</span>
                </div>
                <el-input v-if="couponInfo.couponTotal > 0" v-model="couponParams.total_num" :maxlength="5" @blur="formValidator(2)">
                  <i slot="suffix" class="el-input__icon fontstyle">张</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="clear">
                <div class="fl tit">
                 		有效期只能延后不能提前
                </div>
                <div class="fl tit ml180">
                  	发行量只能增加不能减少
                </div>
            </div>
          </div>
          <div class="BasicinFormation clear">
            <div class="Basicinbt">条件设置</div>
            <div class="mt10 ml13">
              <el-form-item label="使用门槛">
                <span v-if="couponInfo.thresholdType == 1" class="ml10">满{{couponInfo.couponItem.threshold}}元可使用该优惠券</span>
                <span v-if="couponInfo.thresholdType == 2" class="ml10">满{{couponInfo.couponItem.threshold}}件可使用该优惠券</span>
                <span v-if="couponInfo.thresholdType == 3" class="ml10">全场通用</span>
              </el-form-item>
            </div>
            <div class="ml13">
              <el-form-item label="作用范围">
                <el-radio v-if="couponInfo.rangeType == 0" label="0" value="0" class="ml10 mr10">全店</el-radio>
                <el-radio v-if="couponInfo.rangeType == 2" label="2" value="2" class="ml10 mr10">商品</el-radio>
                <span class="greycolor" v-if="couponInfo.rangeType == 2">不可对之前已选择的商品做删除；仅可额外再增加商品。</span>
              </el-form-item>
            </div>
            <div v-if="couponInfo.rangeType == 0" class="ml13">
              <el-col :span="20">
                <div class="Full-court_container">
                  <div class="Full-court01">
                    <span>已设置该优惠券作用于全店商品，只能删除已排除的商品，不能新增</span>
                  </div>
                  <div class="Alreadychosen">
                    <div class="Alreadychosen_t">
                      <!-- <pre>{{removeGoodsList.length}}</pre> -->
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
            <div v-if="couponInfo.rangeType == 2" class="ml13">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top clear">
                    <el-col :span="5">
                      <el-input placeholder="请输入内容" v-model="goods_query_item.condition">
                        <el-button slot="append" icon="el-icon-search" @click="goodsSelect(1)">搜索</el-button>
                      </el-input>
                    </el-col>
                    <span class="limitTips">最多选择30个商品</span>
                  </div>
                  <div class="shopbox_cen clear">
                    <!-- 请判断有商品的时候显示 -->
                    <div class="shopbox_have clear" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                      <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                      <div v-for="(goods, index) in goodsResult.content" @click="chooseGoods(goods)">
                          <div :class="['shopbox_have_box', 'fl', (goods.isOld == 1 || goods.isChoosed == 1) ? 'b_active' : '']">
                             <div class="wose shopbox_have_tit clear02">
                            <el-tooltip :content="goods.goodsName" placement="top-start" effect="light" v-if="goods.goodsName.length > 15">
                              <span>{{goods.goodsName.substring(0,15).concat('...')}}</span>
                            </el-tooltip>
                            <span v-if="goods.goodsName.length <= 15">{{goods.goodsName}}</span>
                          </div>
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
                            <i :class="(goods.isOld == 1 || goods.isChoosed == 1) ? 'icon_selected' : ''"></i>
                          </div>
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
                    已选 <span class="bluecolor02">{{oldChooseGoodsList.length + chooseGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Alreadychosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="Alreadychosen_c_have clear" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 0 && goods_all_show == true">
                      <div v-for="(chooseGoods,index) in oldChooseGoodsList" class="fl mb10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <div v-for="(chooseGoods,index) in chooseGoodsList" class="fl mb10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 10" @click="goods_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="Alreadychosen_c_have clear" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 0 && goods_all_show == false">
                      <div v-for="(chooseGoods,index) in oldChooseGoodsList" class="fl mb10" v-if="index < 10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <div v-for="(chooseGoods,index) in chooseGoodsList" class="fl mb10" v-if="index < 10 - oldChooseGoodsList.length">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 10" @click="goods_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="Alreadychosen_c_none" v-if="oldChooseGoodsList.length + chooseGoodsList.length == 0">
                      还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
          </div>
          <div class="BasicinFormation clear">
            <div class="Basicinbt">
              <span class="linh35">领取方式</span>
              <el-form-item class="ml13">
                <span>{{couponInfo.receiveType == 1 ? '用户主动领取' : couponInfo.receiveType == 2 ? '后台派发' : ''}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="BasicinFormation clear">
            <div class="Basicinbt">成本控制</div>
            <div class="mt10 ml13" v-if="couponInfo.couponType == 1 || couponInfo.couponType == 2">
              <el-form-item label="领取限制">
                <span>
                  每人限领<span class="bluecolor02">{{couponInfo.numPerOne}}</span>次
                </span>
                <span class="ml10" v-if="couponInfo.numPerOne">
                  每人每天限领<span class="bluecolor02">{{couponInfo.numPerDay}}</span>次
                </span>
              </el-form-item>
            </div>
          </div>
          <div class="BasicinFormation clear mb75">
            <div class="Basicinbt">
              <span class="linh35">发放授权</span>
              <el-form-item class="ml13">
                <span v-if="couponInfo.isAccess == 1">允许平台发放</span>
                <span v-if="couponInfo.isAccess == 0">不允许平台发放</span>
              </el-form-item>
            </div>
            <div class="Basicinbt">
              <span class="linh35">其他规则</span>
              <el-form-item class="ml13">
                <span v-if="couponInfo.withOtherCut == 1">可与其他营销活动共同使用</span>
                <span v-if="couponInfo.withOtherCut == 0">不可与其他营销活动共同使用</span>
              </el-form-item>
            </div>
          </div>
          <div class="b_button">
          	<div class="marauto wid180">
          	<el-form-item class="">
    					<el-button type="primary" size="medium" @click="postfrom()">完成</el-button>
    					<el-button size="medium" @click="back()">返回</el-button>
  					</el-form-item>
  					</div>
  				</div>
        </el-form>
      </el-col>
  </div>
</template>

<script>
export default {
  data () {
    const self = this
    return {
      goods_all_show: false,
      remove_goods_all_show: false,
      rangeDialogVisible: false,
      couponInfo: '',
      goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
      goodsResult: '',
      oldChooseGoodsList: [],
      chooseGoodsList: [],
      removeGoodsList: [], // 当前已排除的商品
      couponParams: {
        coupon_id: '', // 优惠券业务ID
        coupon_name: '', // 优惠券名称
        expiration_time: '', // 有效期时间
        expiration_time_end: '', // 有效期结束时间
        total_num: '', // 优惠券总数
        goods_ids: [],
        remove_goods_ids: []
      },
      pickerOptions: {
        disabledDate (time) {
          let _this = self
          let myDate = new Date(_this.couponParams.expiration_time)
          let year = myDate.getFullYear()
          let month = myDate.getMonth()
          let date = myDate.getDate()
          return time.getTime() < new Date(year, month, date).getTime()
        }
      }
    }
  },
  methods: {
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
    // 切换作用范围
    changeRangeType (rangeType) {
      let _this = this

      _this.chooseGoodsList = []
      _this.removeGoodsList = []

      if (rangeType === '2') { // 作用范围为商品
        _this.goods_query_item = {goodsClassifyId: '', condition: '', dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, pageNum: 1, rows: 10}
        _this.goodsSelect()
      }
    },
    // 商品搜索
    goodsSelect (flag) {
      let that = this
      that.$.ajax({
        type: 'get',
        url: that.base + 'm2c.scm/goods/choice',
        data: {
          goodsClassifyId: that.goods_query_item.goodsClassifyId,
          condition: that.goods_query_item.condition,
          dealerId: that.goods_query_item.dealerId,
          pageNum: flag==1?1:that.goods_query_item.pageNum,
          rows: that.goods_query_item.rows
        },
        success: function (result) {
          for (let i = 0; i < result.content.length; i++) {
            result.content[i].isRemoved = 0
            result.content[i].isChoosed = 0
            result.content[i].isOld = 0
            for (let j = 0; j < that.oldChooseGoodsList.length; j++) {
              if (result.content[i].goodsId === that.oldChooseGoodsList[j].goodsId) {
                result.content[i].isOld = 1
              }
            }
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
      if (goodsInfo.isOld == 0) {
        if (goodsInfo.isChoosed == 0) { // 未选中的商品被选中
          if (_this.chooseGoodsList.length < 30 - _this.oldChooseGoodsList.length) {
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
      }
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
      for (let i = 0; i < _this.oldChooseGoodsList.length; i++) {
        let goodsItem = {}
        goodsItem.goodsId = _this.oldChooseGoodsList[i].goodsId
        goodsItem.entityName = _this.oldChooseGoodsList[i].goodsName
        _this.couponParams.goods_ids.push(goodsItem)
      }
      for (let i = 0; i < _this.chooseGoodsList.length; i++) {
        let goodsItem = {}
        goodsItem.goodsId = _this.chooseGoodsList[i].goodsId
        goodsItem.entityName = _this.chooseGoodsList[i].goodsName
        _this.couponParams.goods_ids.push(goodsItem)
      }
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
          coupon_name: _this.couponParams.coupon_name,
          coupon_total: _this.couponParams.total_num,
          expiration_time_end: _this.couponParams.expiration_time_end,
          goods_ids: JSON.stringify(_this.couponParams.goods_ids),
          remove_goodsIds: JSON.stringify(_this.couponParams.remove_goods_ids)
        }
        console.log('rebody:', JSON.stringify(rebody))
        _this.$.ajax({
         url: _this.localbase + 'm2c.market/web/coupon/modify',
          // url: 'http://localhost:8080/m2c.market/coupon/modify',
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
      // flag--1:名称，2：总数，3：时间，7:平台成本,8:商家成本，
       if (flag == 0 || flag == 1) {
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{1,22}$/.test(_this.couponParams.coupon_name)) {
          _this.warning('名称只能为汉字数字英文特殊字符,不能为空')
          return false
        }
        let realLength = _this.getStrLength(_this.couponParams.coupon_name)
        if (realLength > 11) {
          _this.warning('优惠券名称不能超过11个字')
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
        if (parseInt(_this.couponParams.total_num) > 0 && parseInt(_this.couponParams.total_num) < parseInt(_this.couponInfo.couponTotal)) {
          _this.warning('优惠券数量只能增加不能减少')
          return false
        }
      }
      if (flag == 0 || flag == 3) {
        if (_this.couponParams.expiration_time_end == '') {
          _this.warning('有效期结束时间不能为空')
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
    },
    getStrLength (str) {
      let realLength = 0
      if (str && str.trim().length > 0) {
        str = str.trim()
        for (let i = 0; i < str.length; i++) {
          let charCode = str.charCodeAt(i)
          if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
            realLength += 0.5
          } else {
            realLength += 1
          }
        }
        return realLength
      }
    }
  },
  mounted () {
    let _this = this
    _this.$.ajax({
     url: _this.localbase + 'm2c.market/web/coupon/detail/' + sessionStorage.getItem('coupon_id'),
      // url: 'http://localhost:8080/m2c.market/coupon/detail/' + sessionStorage.getItem('coupon_id'),
      data: {},
      success: function (result) {
        _this.couponInfo = result.content
        _this.couponParams.coupon_id = _this.couponInfo.couponId
        _this.couponParams.coupon_name = _this.couponInfo.couponName
        _this.couponParams.expiration_time = _this.couponInfo.expirtationTimeEnd
        _this.couponParams.expiration_time_end = _this.couponInfo.expirtationTimeEnd
        _this.couponParams.total_num = _this.couponInfo.couponTotal
        if (_this.couponInfo.rangeType === 0) {
          for (let i = 0; i < _this.couponInfo.removeRangeList.length; i++) {
              let removeGoods = {}
              removeGoods.goodsId = _this.couponInfo.removeRangeList[i].goodsId
              removeGoods.goodsName = _this.couponInfo.removeRangeList[i].entityName
              removeGoods.goodsImageUrl = _this.couponInfo.removeRangeList[i].goodsPicUrl
              _this.removeGoodsList.push(removeGoods)
          }
        }
        if (_this.couponInfo.rangeType === 2) {
          _this.changeRangeType('2')
          for (let i = 0; i < _this.couponInfo.suitableRangeList.length; i++) {
            let goods = {}
            goods.goodsId = _this.couponInfo.suitableRangeList[i].goodsId
            goods.goodsName = _this.couponInfo.suitableRangeList[i].entityName
            goods.goodsImageUrl = _this.couponInfo.suitableRangeList[i].goodsPicUrl
            _this.oldChooseGoodsList.push(goods)
          }
        }
      }
    })
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
        height: 300px;
        overflow-y: auto;
        padding: 10px;
        .shopbox_no{
          width: 100%;
          height: 100%;
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
      min-height: 115px;
      .Alreadychosen_t{
        width: 100%;
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #E6E8F2;
        padding-left: 20px;
        color: #878787;
        font-size: 14px;
        .bluecolor02{
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
      	}
        	.img{
        		width: 60px;
        		height: 60px;
        		margin-right:10px;
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
				padding-top:7px;
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
    padding-bottom: 5px;
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
    	margin-top: 22px;
    }
    .tit{
      display: inline-block;
      width:280px;
      /*height:34px;*/
      font-size:12px;
      font-family:PingFangSC-Regular;
      color:rgba(204,204,204,1);
      line-height:17px;
      padding-left:80px;
    }
    .greycolor{
    	font-size:12px;
      font-family:PingFangSC-Regular;
      color:rgba(204,204,204,1);
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
        		width: 395px;
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
    .shopbox,.shopbox03{
      /*width: 980px;*/
      min-width: 980px;
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
        overflow-y: auto;
        padding: 10px;
        .shopbox_no{
          width: 100%;
          height: 100%;
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
      	}
        	.img{
        		width: 60px;
        		height: 60px;
        		margin-right:10px;
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
.ml13{
  margin-left: 13px;
}
.ml100{
  margin-left: 100px;
}
.ml200{
  margin-left: 200px;
}
.ml75{
  margin-left: 75px;
}
.ml180{
  margin-left: 180px;
}
.linh35{
  line-height: 35px;
  display: inline-block;
}
.ml60{
  margin-left: 60px;
}
.mr10{
  margin-right: 10px;
}
.fontstyle{
  font-style: normal;
}
.mb75{
  margin-bottom: 75px!important;
}
</style>

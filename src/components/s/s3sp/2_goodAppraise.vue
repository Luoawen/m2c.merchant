<template>
  <div class="sp">
    <div class="dropdown">
      <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">{{replyStatusName}}
        <span class="caret"></span>
      </div>
      <ul class="dropdown-menu" aria-labelledby="dLabel1">
        <li @click="replyStatus('')">全部</li>
        <li v-for="(cell,index) in replyStatuses" @click="replyStatus(cell.replyStatus)">
          {{cell.replyStatus==2?"已回复":cell.replyStatus==1?"未回复":"全部"}}
        </li>
      </ul>
    </div>
    <div class="dropdown">
      <div id="dLabel2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="state">{{levelName}}
        <span class="caret"></span>
      </div>
      <ul class="dropdown-menu" aria-labelledby="dLabel1">
        <li @click="level(0)">全部</li>
        <li v-for="(cell,index) in leveles" @click="level(cell.level)">
          {{cell.level==5?"5星":cell.level==4?"4星":cell.level==3?"3星":cell.level==2?"2星":cell.level==1?"1星":"全部"}}
        </li>
      </ul>
    </div>
    <div class="search_cell">
      <span class="zIndex2" @click="is_Success=!is_Success">评论时间<i class="icon timeIcon"></i></span>
      <div class="time" v-if="is_Success">
        <el-date-picker v-model="search_params.startTime"   type="date"  placeholder="选择日期"   format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker v-model="search_params.endTime" type="date"  placeholder="选择日期"  format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd" @change="get_comment_info()">
        </el-date-picker>
      </div>
    </div>
    <div class="search">
      <input type="text" class="inp" placeholder="输入商品名称 / 订单号 / 顾客姓名/ 顾客手机号" v-model="search_params.condition"><i class="icon searchIcon" @click="get_comment_info()"></i>
    </div>
    <span class="ml10 gjsort" @click="advancedSearch">高级搜索</span>
    <div class="poi2 Advanced_s" v-show="advancedShow">
      <div class="">
        <div class="titbt">高级搜索</div>
        <div class="clear">
          <div class="col-sm-6 left">
            <div class="clear mt10 mb20">
              <span class="bt fl ">关键词</span>
              <input class="form-control fl " placeholder="输入商品名称 / 订单号 / 顾客姓名/ 顾客手机号" v-model="search_params.condition"/>
            </div>
            <div class="clear mt10 mb20">
              <span class="bt fl ">回复状态</span>
              <select class="form-control fl " v-model="search_params.replyStatus">
                <option value="" selected>全部</option>
                <option value="2">已回复</option>
                <option value="1">未回复</option>
              </select>
            </div>
            <div class="clear mt10 mb20">
              <span class="bt fl ">图片情况</span>
              <select class="form-control fl " v-model="search_params.imageStatus">
                <option value="" selected>全部</option>
                <option value="2">有图</option>
                <option value="1">无图</option>
              </select>
            </div>
          </div>
          <div class="col-sm-6 right">
            <div class="clear mt10 mb20">
              <span class="bt fl ">评价时间</span>
              <span class="clear">
                  <span class="fl"><input class="form-control time" type="date" v-model="search_params.startTime"/></span>
                  <span class="fl mr10" style="display:inline-block;line-height:40px;">~</span>
                  <span class="fl"><input class="form-control time" type="date" v-model="search_params.endTime"/></span>
                </span>
            </div>
            <div class="clear mt10 mb20">
              <span class="bt fl ">评价星级</span>
              <select class="form-control fl " v-model="search_params.starLevel">
                <option value="" selected>全部</option>
                <option value="1">1星</option>
                <option value="2">2星</option>
                <option value="3">3星</option>
                <option value="4">4星</option>
                <option value="5">5星</option>
              </select>
            </div>
          </div>
        </div>
        <div class="footer clear">
          <button class="footerbtn sort" @click="get_comment_info()">搜索</button>
          <button class="footerbtn ml20 czt" @click="clearAll()">重置</button>
        </div>
      </div>
    </div>
    <div class="comment_info  clear" style="background:#fff;">
      <table class="comment_table col-sm-12" id="table" style="table-layout:fixed">
        <thead>
          <tr>
            <td class="a1">评论内容</td>
            <td class="a2">评价星级</td>
            <td class="a3">商品信息</td>
            <td class="a4">订单号</td>
            <td class="a5">顾客信息</td>
            <td class="a6">评价时间</td>
            <td class="a7">操作</td>
          </tr>
        </thead>
        <tbody v-for="comment in datacomment">
          <tr>
            <td class="a1">
              <!--<div>{{comment.commentContent}}</div>-->
              <a class="ellipsis3" :title="comment.commentContent">{{comment.commentContent}}</a><br/><br/>
              <div class="mt10" v-for="img in comment.commentImages">
                <img class="conimg mr10 fl" :src="img" />
              </div>
            </td>
            <td class="a2">
              <span>{{comment.starLevel}}</span>星
            </td>
            <td class="a3">
              <a class="ellipsis2" :title="comment.goodsName">{{comment.goodsName}}</a><br/><br/>
              <div class="tdcolor mt10">&nbsp;&nbsp;&nbsp;规格：{{comment.skuName}}</div>
            </td>
            <td class="a4">
              {{comment.orderId}}
            </td>
            <td class="a5">
              <div>{{comment.buyerName}}</div>
              <div>{{comment.buyerPhoneNumber}}</div>
            </td>
            <td class="a6">
              <div>{{comment.commentTime}}</div>
            </td>
            <td class="a7" v-if='!comment.replyCommentContent '>
              <div @click="showtchp(comment.commentId)">
              <i class="icon_hp"></i>
              <span>回评</span>
              </div>
            </td>
          </tr>
          <tr v-if='comment.replyCommentContent '>
            <td colspan="7">
              <div class="tdhf">
                <div class="nr">
                  回复内容:
                </div>
                <div class="tit">{{comment.replyCommentContent}}</div>
                <div class="time">{{comment.replyTime}}回复</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="block" style="margin: 20px;float: right">
        <el-pagination
          @size-change="goodsCommentHandleSizeChange"
          @current-change="goodsCommentHandleCurrentChange"
          :current-page="goodsCommentCurrentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="goodsCommentPageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsCommentTotalCount">
        </el-pagination>
      </div>
    </div>
      <!-- 回评弹出框 hptc-->
    <div class="hptczp" v-show="showhptc===true"  style="">

    </div>
    <div class="hptczp_content"  v-show="showhptc===true">
        <div class="hptczp_header">
          <span>回评内容</span>
          <span class="fr" @click="showhptc=false">X</span>
        </div>
        <div class="hptczp_body">
            <textarea placeholder="请填写" maxlength="" v-model="reply_params.replyContent" maxlength="100"></textarea>
        </div>
        <div class="hptczp_footer">
          <button type="button" class="btn save" @click="reply()" >确认</button>
          <button type="button" class="btn cancel" @click="cancel()" >取消</button>
        </div>
    </div>
  </div>


</template>
<script>
  export default {
    name: '',
    data () {
      return {
        is_Success: false,
        // 搜索参数
        search_params: {condition: '', replyStatus: '', starLevel: '', startTime: '', endTime: '', imageStatus: ''},
        reply_params: {commentId: '', replyContent: ''},
        replyStatuses: [{replyStatus: 1}, {replyStatus: 2}], // 回复状态
        leveles: [{level: 1}, {level: 2}, {level: 3}, {level: 4}, {level: 5}], // 评价星级
        datacomment: '',
        showhptc: false,
        commentId: '',
        goodsCommentCurrentPage: 1,
        goodsCommentPageRows: 5,
        goodsCommentTotalCount: 0,
        replyStatusName: '回复状态',
        levelName: '评价星级',
        advancedShow: false
      }
    },
    methods: {
      clearAll () {
        let that = this
        that.advancedShow = false
        that.search_params.condition = ''
        that.search_params.replyStatus = ''
        that.search_params.starLevel = ''
        that.search_params.endTime = ''
        that.search_params.startTime = ''
        that.search_params.imageStatus = ''
      },
      advancedSearch () {
        let that = this
        that.advancedShow = true
      },
      goodsCommentHandleSizeChange (val) {
        let that = this
        that.goodsCommentPageRows = val
        that.get_comment_info()
      },
      goodsCommentHandleCurrentChange (val) {
        let that = this
        that.goodsCommentCurrentPage = val
        that.get_comment_info()
      },
      cancel () {
        let that = this
        that.showhptc = false
        that.reply_params.replyContent = ''
      },
      reply () {
        let that = this
        that.$.ajax({
          url: that.base + 'm2c.scm/goods/comment/reply',
          type: 'put',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            commentId: that.commentId,
            replyContent: that.reply_params.replyContent
          },
          success: function (result) {
            if (result.status === 200) {
              console.log(result)
              that.get_comment_info()
              that.showhptc = false
            }
          }
        })
      },
      // 回复状态
      replyStatus (n) {
        let that = this
        if (n === '' || n === undefined) {
          that.replyStatusName = '回复状态'
        } else if (n === 0) {
          that.replyStatusName = '全部'
          n = ''
        } else if (n === 1) {
          that.replyStatusName = '未回复'
        } else {
          that.replyStatusName = '已回复'
        }
        that.search_params.replyStatus = n
        that.get_comment_info()
      },
      // 评价星级
      level (n) {
        let that = this
        if (n === '' || n === undefined) {
          that.levelName = '评价星级'
        } else if (n === 0) {
          that.levelName = '全部'
        } else if (n === 1) {
          that.levelName = '1星'
        } else if (n === 2) {
          that.levelName = '2星'
        } else if (n === 3) {
          that.levelName = '3星'
        } else if (n === 4) {
          that.levelName = '4星'
        } else if (n === 5) {
          that.levelName = '5星'
        }
        that.search_params.starLevel = n
        that.get_comment_info()
      },
      // 获取结算单列表
      get_comment_info () {
        let that = this
        if (that.search_params.startTime > that.search_params.endTime) {
          that.show_tip('开始时间不能大于结束时间')
          return
        }
        that.is_Success = false
        that.$.ajax({
          url: that.base + 'm2c.scm/goods/comment',
          cache: false,
          pagination: true,
          data: {
            token: sessionStorage.getItem('mToken'),
            dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId, // 商户ID
            replyStatus: that.search_params.replyStatus,
            starLevel: that.search_params.starLevel,
            startTime: that.search_params.startTime,
            endTime: that.search_params.endTime,
            condition: that.search_params.condition.replace(/\s+/g,""),
            imageStatus: that.search_params.imageStatus,
            rows: that.goodsCommentPageRows,                          // 每页多少条数据
            pageNum: that.goodsCommentCurrentPage     // 请求第几页
          },
          success: function (result) {
            if (result.status === 200) {
              console.log(result)
              if(result.content.length ==0){
                that.show_tip("没有匹配的记录")
              }
              that.datacomment = result.content
              that.goodsCommentTotalCount = result.totalCount
            }
          }
        })
      },
      showtchp (n) {
        var that = this
          // that.$('#hptc').modal('show')
        that.showhptc = true
        that.commentId = n
      },
      timeBox () {
        this.is_Success = true
      }
    },
    mounted () {
      let that = this
      window.handle = {
        'click [handle]': function (event, value, row, index) {
          let target = event.target
          let toggle = target.getAttribute('replyComment') ? 'replyComment' : ''
          that.td_click(toggle, row, index)
        }
      }
      this.get_comment_info()
    }
  }
</script>
<style lang="scss" scoped>
/*公用样式*/
.clear{
  clear: both;
  overflow: hidden;
}
.mt5{
  margin-top: 5px;
}
.wid50{
  width: 50px;
  display: inline-block;
}
.mt10{
  margin-top: 10px;
}
.mr10{
  margin-right: 10px;
}
.mr{margin-right: 20px;}
.fl{
  float: left;
}
.fr{
  float: right;
}
.hptczp{
  width: 100%;
  height: 100%;
  display: block;
  position: fixed;
  left: 0px;
  top: 0px;
  background: #000;
  z-index: 999;
  opacity: 0.5;

}
.hptczp_content{
  width: 400px;
  height: 280px;
  background: #fff;
  z-index: 9999;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: 140px;
  background: #FFFFFF;
  border-radius: 4px;
  .hptczp_header{
    width:100%;
    height: 50px;
    background: #DFE9F6;
    padding-left: 20px;
    padding-right: 20px;
    span{
      display: inline-block;
      line-height: 50px;
    }
  }
  .hptczp_body{
    padding-left: 20px;
    padding-right: 20px;
    background: #FFFFFF;
    margin-top: 10px;
    textarea{
      width: 100%;
      height: 100%;
      border: 1px solid #E5E5E5;
      width: 360px;
      height: 140px;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
  .hptczp_footer{
      height: 80px;
      padding-top: 10px;
      padding-left: 50%;
      .btn {
        width: 80px;
        height: 30px;
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .save {
        margin-left: -110px;
        background: #0086FF;
      }
      .cancel {
        margin-left: 40px;
        background: #FFF;
        border: 1px solid #CCCCCC;
        color: #444;
      }

  }
}
.comment_table{
  /*width: 1160px;*/
  border: 1px solid #DFE9F6;
  .a1{
    /*width: 344px; */
      width: 25%;
  }
  .a2{
    /*width: 155px;*/
    width: 18%;
  }
  .a3{
    /*width: 205px;*/
    width: 20%;
  }
  .a4{
    /*width: 145px;*/
      width: 15%;
  }
  .a5{
    /*width: 145px;*/
      width: 15%;
  }
  .a6{
    /*width: 145px;*/
      width: 15%;
  }
  .a7{
    /*width: 145px;*/
      width: 15%;
  }
  thead{
    tr{
      min-height: 40px;
      line-height: 40px;
      background: #DFE9F6;
      td{
        padding-left: 20px;
      }
    }
  }
    tbody{
      background: #fff;
      border-bottom:1px solid #DFE9F6;
      tr{
        td{
          padding-left: 20px;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-right: 20px;
          background: #fff;
          min-height: 80px;
        }
        .td_img{
          width: 50px;
          height: 50px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .conimg{
          width: 50px;
          height: 50px;
        }
        .tdcolor{
          color: #999999;
        }
        a.ellipsis2{
    width:180px;
    height: 40px;
    line-height:20px;
    color:#5a5e66;
    margin-left:10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    position: relative;
    float:left;
  }
  a.ellipsis2:hover{ text-decoration:none;}
 a.ellipsis3{
          width:90%;
          height: 60px;
          line-height:20px;
          color:#5a5e66;
          margin-left:10px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          position: relative;
          float:left;
        }
 a.ellipsis3:hover{ text-decoration:none;}
        .tdhf{
          /*width: 1120px;*/
          min-height: 100px;
          background: #F4F5FA;
          border-radius: 4px;
          padding-left: 20px;
          padding-right: 20px;
          line-height: 30px;
          .nr{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #0086FF;
          }
          .tit{
            ont-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
          }
          .time{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #999999;
          }

        }
        .icon_hp{
          width: 16px;
          height: 17px;
          display: inline-block;
          margin-right: 10px;
          background: url(../../../assets/images/ico_compile_thick.png) no-repeat center;
        }
      }
    }
}
.page{
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 40px;
  margin-right: 20px;
  .tdpade{
    width: 31px;
    height: 31px;
    display: inline-block;
    background: url(../../../assets/images/ico_latter_disabled.png) no-repeat center;
  }
  .bg1{
      background: url(../../../assets/images/ico_latter_disabled.png) no-repeat center;
  }
  .bg2{
      background: url(../../../assets/images/ico_headmost_disabled.png) no-repeat center;
  }
  .bg3{
      background: url(../../../assets/images/ico_front_default.png) no-repeat center;
  }
  .bg4{
      background: url(../../../assets/images/ico_finally_hover.png) no-repeat center;
  }

}
.sp{
    /*width: 1583px;*/
    height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .dropdown{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
      }
      .dropdown-menu {
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
    }
    .search_cell{
      display: inline-block;
      position: relative;
      span{
        font-size: 16px;
        margin-right: 25px;
        i{
          font-size: 20px;
          padding-left: 10px;
        }
      }
      .time{
        width: 600px;
        height: 61px;
        position: absolute;
        left: 0px;
        top: 50px;
        z-index: 10;
        .form-control{
          width: 139px;
          height: 31px;
          position: absolute;
          top: 12px;
        }
        .start{
          left: 20px;
        }
        .separator{
          position: absolute;
          left: 162px;
          top: 12px;
        }
        .end{
          right: 20px;
        }
      }
    }
    .search{
      display: inline-block;
      position: relative;
      .inp{
        width: 500px;
        height: 39px;
        color: #444;
      }
      i{
        width: 50px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: rgba(242, 242, 242, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    span{
      cursor: pointer;
    }
    .add{
      margin-top: 31px;
      margin-right: 15px;
    }
    .operation{
      margin-top: 31px;
      margin-right: 15px;
    }
    .good_info {
        background: #fff;
        margin-top: 10px;
        padding: 10px;
        position: relative;
        .bootstrap-table {
          margin: 0;
        }
        [tableexport-id] {
          width: 120px;
          height: 25px;
          color: #fff;
          line-height: 25px;
          border-radius: 2px;
          border: none;
          margin-bottom: 12px;
          position: absolute;
          top: 10px;
          left: 134px;
          background: #F56C6C;
        }
        .public_button {
          width: 120px;
          height: 25px;
          color: #fff;
          border-radius: 2px;
          border: none;
        }
        .print_order {
          background: #18DCF6;
        }
        /*//表格样式*/
        table {
          td {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
    }
}
.modal-open{
  #add_modify,#modify_status,#bind_img,#delete{display:flex}
  #add_modify.in,#modify_status.in,#bind_img.in,#hptc.in{z-index:2000}
}
.zIndex2{z-index:21;}
.icon{width:40px;height:40px;z-index:11;display:inline-block;}
.timeIcon{background:url(../../../assets/images/ico_calendar@2x.png) no-repeat center bottom;background-size:19px 20px;}
.searchIcon{background:url(../../../assets/images/ico_search.png) no-repeat center center;background-size:20px 20px;}
.Advanced_s{
  width: 90%;
  min-height: 430px;
  background: #fff;
  z-index: 99;
  top: 0px;
  left: 200px;
  padding:20px;
  .left,.right{
    .bt{
      display: inline-block;
      width: 80px;
      line-height: 40px;
      text-align: right;
      padding-right: 10px;
    }
    input,select{
      width: 75%;
      height: 40px;
      line-height: 40px;
    }
    .time{
      width: 165px;
      margin-right: 10px;

    }
  }
  .titbt{
    font-size: 18px;
    color: #333333;
  }
  .footer{
    padding-left: 30px;
    .footerbtn{
      border: 1px solid #CCCCCC;
      border-radius: 2px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #333333;
      text-align: center;
    }
    .sort{
      background: #0086FF;
      border-radius: 2px;
      color: #FFFFFF;
    }
    .czt{
      background: #fff;
    }
  }
}
.poi2{
  position: absolute;
}
.mb20{
  margin-bottom: 20px;
}
</style>

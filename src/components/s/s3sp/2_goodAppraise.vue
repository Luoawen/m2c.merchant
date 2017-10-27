<template>
  <div class="sp">
    <div class="dropdown">
      <div id="dLabel1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="sort">回复状态
        <span class="caret"></span>
      </div>
      <ul class="dropdown-menu" aria-labelledby="dLabel1">
        <li @click="replyStatus()">全部<i class="glyphicon glyphicon-menu-right"></i></li>
        <li v-for="(cell,index) in replyStatuses" @click="replyStatus(cell.replyStatus)">
          {{cell.replyStatus==2?"已回复":cell.replyStatus==1?"未回复":"全部"}}
          <i class="glyphicon glyphicon-menu-right"></i>
        </li>
      </ul>
    </div>
    <div class="dropdown">
      <div id="dLabel2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="state">评级星级
        <span class="caret"></span>
      </div>
      <ul class="dropdown-menu" aria-labelledby="dLabel2">
        <li @click="level()">全部<i class="glyphicon glyphicon-menu-right"></i></li>
        <li v-for="(cell,index) in leveles" @click="level(cell.level)">
          {{cell.level==5?"5星":cell.level==4?"4星":cell.level==3?"3星":cell.level==2?"2星":cell.level==1?"1星":"全部"}}
          <i class="glyphicon glyphicon-menu-right"></i>
        </li>
      </ul>
    </div>
    <div class="search_cell">
        <span>评论时间<i class="glyphicon glyphicon-calendar" @click="timeBox()"></i></span>
        <div class="time" v-show="is_Success">
          <input type="date" class="form-control search_input search_input_date_l start" v-model="search_params.startTime"><span class="separator">-</span><input type="date" class="form-control search_input search_input_date_r end" v-model="search_params.endTime">
        </div>
    </div>
    <div class="search">
      <input type="text" class="inp" placeholder="输入商品名称 / 订单号 / 顾客姓名/ 顾客手机号 / 商家名称 / 商家ID" v-model="search_params.condition"><i class="glyphicon glyphicon-search" @click="get_comment_info"></i>
    </div>
    <span >高级搜索</span>
    <div class="comment_info clear" style="background:#fff;">
      <table class="comment_table" id="table" style="table-layout:fixed">
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
              <div>{{comment.commentContent}}</div>
              <div class="mt10" v-for="img in comment.commentImages">
                <img class="conimg mr10 fl" :src="img" />
              </div>
            </td>
            <td class="a2">
              <span>{{comment.starLevel}}</span>星
            </td>
            <td class="a3">
              <div class="tdtit">{{comment.goodsName}}</div>
              <div class="tdcolor mt10">{{comment.skuName}}</div>
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
                  回复内容: <br>
                  {{comment.replyCommentContent}} <br>
                  {{comment.replyTime}}回复
                </div>
                <div class="tit"></div>
                <div class="time"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="page fr">
        <span class="mr10">
        共<span></span>条，每页<input class="form-control wid50" />条
        <input class="form-control wid50" /><span>/<span></span>页</span>
        </span>
        <span class="fr mt5">
        <span class="tdpade bg1 ml20 "></span>
        <span class="tdpade bg2 ml20"></span>
        <span class="tdpade bg3 ml20"></span>
        <span class="tdpade bg4 ml20"></span>
        </span>
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
            <textarea placeholder="请填写" v-model="reply_params.replyContent"></textarea>
        </div>
        <div class="hptczp_footer">
          <button type="button" class="btn save" @click="reply()" >确认</button>
          <button type="button" class="btn cancel" @click="showhptc=false" >取消</button>
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
        search_params: {condition: '', replyStatus: '', starLevel: '', startTime: '', endTime: ''},
        reply_params: {commentId: '', replyContent: ''},
        replyStatuses: [{replyStatus: 1}, {replyStatus: 2}], // 回复状态
        leveles: [{level: 1}, {level: 2}, {level: 3}, {level: 4}, {level: 5}], // 评价星级
        datacomment: '',
        showhptc: false,
        commentId: ''
      }
    },
    methods: {
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
        that.search_params.replyStatus = n
        that.get_comment_info()
      },
      // 评价星级
      level (n) {
        let that = this
        that.search_params.starLevel = n
        that.get_comment_info()
      },
      // 获取结算单列表
      get_comment_info () {
        let that = this
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
            condition: that.search_params.condition,
            rows: 5,                          // 每页多少条数据
            pageNum: 1    // 请求第几页
          },
          success: function (result) {
            if (result.status === 200) {
              console.log(result)
              that.datacomment = result.content
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
  width: 1160px;
  border: 1px solid #DFE9F6;
  .a1{width: 344px;}
  .a2{width: 155px;}
  .a3{width: 205px;}
  .a4{width: 145px;}
  .a5{width: 145px;}
  .a6{width: 145px;}
  .a7{width: 145px;}
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
        .tdtit{
          width: 180px;
          height: 40px;
        }
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
    width: 1583px;
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
        width: 330px;
        height: 61px;
        position: absolute;
        left: -123px;
        top: 19px;
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
        color: #ccc;
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
</style>

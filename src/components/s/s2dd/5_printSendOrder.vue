<template>
  <div>这里是打印发货单页面（预览）</div>
</template>
<script>
</script>
<style lang="scss" scoped>
.mt20{
  margin-top: 20px;
}
.redcolor{
  color: red;
}
.ml20{
  margin-left: 20px;
}
.mt20{
  margin-top: 20px;
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
.pad0{
	padding:0px;
}
.detail{
    width:95%;
    min-height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .deliver{
    	background: #fff;
    	height: 358px;
      top: 0px;
      left: 0px;
      padding-top: 21px;
      padding-left: 23px;
      .ico_close02{
        width: 24px;
        height: 24px;
        display: inline-block;
        background: url(../../../assets/images/ico_close02.png);
        top: 0px;
        right: 0px;
      }
      .deliver_tit{
        font-size: 18px;
        color: #333333;
      }
      .deliver_type01{
        padding-left: 20px;
        .bz{
          font-size: 12px;
        }
        .btn01{
          border-radius: 2px;
          line-height: 30px;
          height: 30px;
          padding-left: 30px;
          padding-right: 30px;
          border: none;
        }
        .deliversure{
          background: #0086FF;
          color: #fff;
        }
        .deliverdel{
          background: #fff;
          border: 1px solid #CCCCCC;
          border-radius: 2px;
          color: #444;
        }
        .tit01{
          /*display: inline-block;*/
          width: 120px;
          display: inline-block;
          line-height: 30px;
          text-align: right;
        }
        .tit02{
          span{
            display: inline-block;
            line-height: 30px;
          }
        }
        .tit03{
          font-size: 12px;
          color: #999999;
          margin-left: 80px;
          }
          .deliver_input{
            width: 30%;
            height: 40px;
          }
      }

    }
    .fah{
    		background: #0086FF;
				border-radius: 2px;
				width: 80px;
				height: 30px;
				color: #fff;
				text-align: center;
				line-height: 30px;
				border: none;
				margin-top: 5px;
    	}
    .nav{
    	.ico_print{
    		width: 16px;
    		height: 16px;
    		display: inline-block;
    		margin-right: 5px;
    		background: url(../../../assets/images/ico_print.png);
    	}
    	.fah{
    		background: #0086FF;
				border-radius: 2px;
				width: 80px;
				height: 30px;
				color: #fff;
				text-align: center;
				line-height: 30px;
				border: none;
				margin-top: 5px;
    	}
    	.dy{
    		padding-left: 0px;
    		line-height: 38px;
    	}
      .active{
        border-bottom:1px solid #0086FF;
      }
      height: 38px;
      line-height: 38px;
      border-bottom:1px solid #e7e7e7 ;
      span{
        display: inline-block;
        padding-left: 30px;
        padding-right: 30px;
        line-height: 35px;
      }
    }
    .customerdetail_container{
      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        margin-top: 20px;
        .fh{
    		background: #fff;
    	 }
       .deliver_tb{
         background: #fff;
         .tit_tb{
           display: inline-block;
           width: 80px;
           text-align: right;
         }
       }
        td{
          padding-left: 20px;
        }
        .a1_img{
            img{
              width: 50px;
              height: 50px;
              margin-top: 20px;
              margin-bottom: 20px;
            }
          }
        .a1{
          width: 22%;
          .a1tab{
          	padding-left: 50px;
          }
        }
        .a2{
          width:11%;
        }
        .a3{
          width:7%;
        }
        .a4{
          width:7.5%;
        }
        .a5{
          width:8%;
        }
        .a6{
          width:10%;
        }
        .a7{
          width:7.5%;
        }
        .a6_input{
        	border: 1px solid #E6E8F2;
        	width: 100px;
        	height: 40px;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
        tbody{
        	border-bottom: 1px solid #E5E5E5;
        	background: #F4F5FA;
        }
        .js_num{
        	background: #fff;
        	padding-top: 20px;
        	padding-bottom: 20px;
        	td{
        		padding-top: 20px;
        		padding-bottom: 20px;
        		line-height: 30px;
        		text-align: right;
        	}
        }
      }
      /*width: 1583px;*/
      min-height: 670px;
      .detail_tit{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FFF9EE;
        font-size: 18px;
        color: #F5A623;
      }
      .detail_tit02{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FBF5EF;
        font-size: 18px;
        color: #FD3242;
      }
      .detail_top{
        .detail_cen{
          .tit01{
            display: inline-block;
            width: 90px;
            height: 40px;
            line-height:40px;
            text-align: right;
          }
          .bj_select{
          	width: 120px;
          	height: 40px;
          	line-height: 40px;
          option{
          	height: 40px;
          	line-height: 40px;
          }
          }
          .bj02_select{
          	width: 350px;
          	height: 40px;
          	line-height: 40px;
          }
        }
      }
    }
    .ico_compile{
     	width: 16px;
      height: 16px;
      background: url(../../../assets/images/ico_compile.png);
      display: inline-block;
      margin-left: 10px;
    }
}
 /*公用样式*/
  .mt5{
    margin-top: 5px;
  }
  .mt10{
    margin-top: 10px;
  }
  .ml10{
    margin-left: 10px;
  }
  .ml20{
    margin-left: 20px;
  }
  .mr20{
    margin-right: 20px;
  }
  .pr20{
  	padding-right: 20px;
  }
  .pr40{
  	padding-right: 40px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .ml30{
    margin-left: 30px;
  }
  .poi1{
    position: relative;
  }
  .poi2{
    position: absolute;
  }
  .poi3{
    position: fixed;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .wose{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .blue{
  	font-size: 12px;
		color: #999;
  }
  .clear{
    clear: both;
    overflow: hidden;
  }
  .border_r{
    border-right: 1px solid #e5e5e5;
  }
  .input_check {
    position: absolute;
    width: 17px;
    height: 17px;
    visibility: hidden;
  }
  .input_check + label {
    display: inline-block;
    width: 17px;
    height: 17px;
    border-radius: 2px;
    background:url(../../../assets/images/ico_radio_default.png) no-repeat center;
  }
  .input_check:checked + label {
    display: inline-block;
    width: 17px;
    height: 17px;
    background:url(../../../assets/images/ico_radio_select.png) no-repeat center;
  }

</style>

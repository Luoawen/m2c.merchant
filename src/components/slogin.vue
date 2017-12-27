<template>
	<div class="slogin">
			<div class="header">
				<div class="logo"></div>
				<span>拍获 </span>
				<span class="logo_right"> | 商家平台</span>
			</div>
				<div class="login_form_s" id="login_form_slogin">
					<span>商家登录</span>
					<div class="username">
						<i class="username_i public_i"></i>
						<input type="number"  oninput="if(value.length !== 11) value=value.slice(0,11)" placeholder="11位数手机号" v-model.number="login_params.mobile" @keydown.enter="login">
					</div>
					<div class="password">
						<i class="password_i public_i"></i>
						<input type="password" class="mima_dd" placeholder="6-16位密码"  :minlength="6" :maxlength="16"  v-model="login_params.password" @keydown.enter="login">
						<input type="text" class="mima_wz" placeholder="6-16位密码" :minlength="6" :maxlength="16"   v-model="login_params.password" @keydown.enter="login" style="display:none;">
						<a @click="get_password" class="eyes_box " data-show="1" href="javascript:void(0);"><i class="icon iconfont" >&#xe624;</i></a>
					</div>
					<div class="login_s">
						<button type="submit"  @click="login"   ref='submitButton' >登&nbsp;&nbsp; 录</button> 
					</div>
					<div class="lost">
						<a @click="get_forget_passwrod">忘记登录密码？</a>
					</div>
					<!-- <div class="register">
						注册商家
					</div> -->
				</div>
			<div class="footer">
				<p><a href="http://www.m2c2017.com" target="_blank">拍获</a> | <a href="http://b.m2c2017.com" target="_blank">商家平台</a> | <a  href="http://m.m2c2017.com" target="_blank">媒体平台</a></p>
				<p class="finfo">Copyright © 2017 深圳市美图溪信息技术有限公司 &nbsp;|&nbsp; 粤ICP 备17077016号
				</p>
			</div>
		<div class="modal_password" v-show="forget_password">
			<p>忘记密码</p>
			<div class="modal_refund_close"  @click="close_tip">登录 &nbsp;></div>
			<input  type="number"  placeholder="请输入注册的手机号码"  oninput="if(value.length !== 11)value=value.slice(0,11)"  class="public_input_phone"  v-model.number="mobile"  :length="11"  @input="get_phone" >
			<input placeholder="4位数验证码" class="hone_code public_input_code" onkeyup="this.value=this.value.replace(/\s+/g,'')"  v-model.number="verifyCode" maxlength="4" minlength="4" >
			<button @click="get_code" v-bind:class="{ phone_right:isActive }" :disabled="disabled">{{ timerCodeMsg }}</button>
			<!-- <input type="password" placeholder="新密码" class="public_input_password" v-model="newPass"> -->
			<input type="password" placeholder="请输入6-16位新密码" :maxlength="16" :minlength="6" class="public_input_password" v-model="confirmPass">
			<button class="complete_button" @click="pass_forget_passwrod" v-bind:class="{ phone_right:isActive_pass }"  ref='confirmButton'   >确认修改</button>
		</div>
	</div>
</template>

<script>
import '../assets/css/iconfont_s/iconfont.css'
export default {
  name: '',
  data () {
    return {
      mobile: '',
      verifyCode: '',
      newPass: '',
      confirmPass: '',
      isActive: false,
      isActive_pass: true,
      timerCodeMsg: '获取验证码',
      forget_password: false,
			login_params: { mobile: '', password: '', appDeviceSn: 111, terminalType: 3 },
			disabled: false
    }
  },
  methods: {
    login () {
			let that = this
			if(that.login_params.mobile=== ''){ 
 					that.show_tip('请输入手机号码')
 					 return ; 
 			} 
			 if(that.login_params.mobile.length < 11){
				 	that.show_tip('请输入11位数的手机号')
 					 return false; 
			 }
			if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(that.login_params.mobile))){ 
 					that.show_tip('请输入11位数的手机号')
 					 return false; 
 			} 
      if (that.login_params.password.length < 6) that.show_tip('请输入6到16位有效密码')
			if (that.login_params.password.length > 16) that.show_tip('请输入6到16位有效密码')
      if (that.login_params.password.length >= 6 && that.login_params.password.length <= 16) {
					that.$refs.submitButton.innerHTML = '登录中，请稍候'
					that.$refs.submitButton.disabled = true
        that.$.ajax({
          method: 'post',
          url: that.base + 'm2c.users/user/dlogin',
          data: Object.assign({}, that.login_params, {password: that.md5(that.login_params.password)}),
          success: function (result) {
						that.$refs.submitButton.innerHTML = '登 录'
						that.$refs.submitButton.disabled = false
            if (result.token) {
							sessionStorage.setItem('mToken', result.token)
							sessionStorage.setItem('token', result.token)
              // console.log('登录信息(处理后): ', result)
							sessionStorage.setItem('mUser', JSON.stringify(result.content))
							console.log(sessionStorage.getItem('mUser'))
							that.$message('登录成功');
              that.$goRoute('/s/home')
            } else {
              // console.log('错误信息: ', result.errorMessage)
							that.show_tip(result.errorMessage)
							console.log(result,"------------")
							// 账号不存在 result.errorMessage
            }
          }
				})
      }
    },
    // 显示隐藏密码
    get_password: function (event) {
      let that = this
      if (that.$('.eyes_box').attr('data-show') === '1') { // 明文
        that.$('.eyes_box').attr('data-show', '2')
        that.$('.eyes_box').children('i').html('&#xe627;')
        that.$('.mima_dd').hide()
        that.$('.mima_wz').show()
        return
      }
      if (that.$('.eyes_box').attr('data-show') === '2') { // 密码
        that.$('.eyes_box').attr('data-show', '1')
        that.$('.eyes_box').children('i').html('&#xe624;')
        that.$('.mima_dd').show()
        that.$('.mima_wz').hide()
        return
      }
    },
    // 忘记密码框
    get_forget_passwrod () {
      let that = this
      that.forget_password = true
    },
    get_phone () {
      let that = this
      if (!((/^1[34578]\d{9}$/).test(that.mobile))) {this.isActive = false}
      else this.isActive = true
    },
    pass_forget_passwrod () {
			let that = this
				if(that.mobile=== ''){ 
 					that.show_tip('请输入手机号码')
 					 return ; 
 			} 
			if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(that.mobile))){ 
 					that.show_tip('请输入11位数的手机号')
 					 return false; 
 			} 
			 	if (that.verifyCode == ''){
				that.show_tip('请输入验证码')
				 	 return ; }
			if (!(/^[a-z0-9]+$/).test(that.confirmPass)){
				that.show_tip('密码格式错误')
				 	 return ; }
      if (that.confirmPass.length < 6){
				that.show_tip('请输入6到16位有效密码')
				 	 return ; } 
      if (that.confirmPass.length > 16){
				 that.show_tip('请输入6到16位有效密码')
				 	 return ; } 
      if (that.confirmPass.length >= 6 && that.confirmPass.length <= 16) {
				that.$refs.confirmButton.innerHTML = '修改中，请稍候'
        that.$.ajax({
          method: 'post',
          url: that.base + 'm2c.users/user/findPassword',
          data: {
            token: '123',
						groupType:'4',
            verifyCode: that.verifyCode,
            mobile: that.mobile,
            newPass: that.md5(that.confirmPass)
          },
          success: function (result) {
						that.$refs.confirmButton.innerHTML = '确认修改'
            // console.log('修改密码: ', result)
            if (result.status === 200) {
							that.$message('修改成功');
              that.close_tip()
							that.timerCodeMsg = '获取验证码'
							that.isActive = true
							that.disabled = false
            } else {
							console.log(result.errorMessage,'result.errorMessage')
							that.show_tip(result.errorMessage)  
            }
          }
        })
      }
    },
    close_tip () {
      let that = this
      that.forget_password = false
      that.mobile = ''
      that.verifyCode = ''
      that.newPass = ''
			that.confirmPass = ''
			that.login_params.password = ''
		
    },
    get_code () {
			let that = this
			that.disabled = false
			if (that.isActive !== true) return
      that.$.ajax({
        method: 'post',
				timeout : 2000, //超时时间设置，单位毫秒
        url: that.base + 'm2c.users/user/sendSms',
        data: {
          token: '123',
          codeType: 2,
          mobile: that.mobile
        },
        success: function (result) {
					console.log('验证码: ', result)
          if (result.status === 200) {
							let sec = 59
							let timerId =	window.setInterval(function(){
							 that.timerCodeMsg = sec + '秒后重新获取'
							sec--;
							that.isActive = false
							that.disabled = true
							if(sec<0){
							timerId=window.clearInterval(timerId) // 清除计时器
								sec = 59 // 重新赋值
								// 恢复状态 按钮可用
							that.timerCodeMsg = '获取验证码'
							that.isActive = true
							that.disabled = false
									}
						},1000)
            // let sec = 60
            // for (let i = 0; i <= 60; i++) {
            //   window.setTimeout(function () {
            //     if (sec !== 0) {
            //       that.timerCodeMsg = sec + '秒后重新获取'
            //       sec--
						// 			that.isActive = false
						// 			that.disabled = true
            //     } else {
            //       sec = 60
            //       that.timerCodeMsg = '获取验证码'
						// 			that.isActive = true
						// 			that.disabled = false
            //     }
						// 		console.log(sec,i)
            //   }, i * 1000)
            // }
          } else {
						that.disabled = false
          }
				},
				complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
	　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
	　　　　　 //ajaxTimeoutTest.abort();
	　　　　　  that.show_tip("请求超时");
							that.disabled = false
	　　　　}
		　　}
      })
    }
  },
  beforeCreate () {
    document.title = '登录-商家平台-拍获'
		document.querySelector('#favicon').href = '/static/favicon_s.ico'
  },
  mounted () {
    if ((this.newPass !== '') & (this.confirmPass !== '')) {
      this.isActive_pass = true
    }
  }
}
</script>

<style lang="scss">
@media screen and (min-width:500px) and (max-width:1200px){
	#login_form_slogin .modal_password{
		left: 50.3%;
	}
}
::-ms-reveal{display: none;}
		// placeholder  字体颜色
		:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
				color: #ccc; opacity:1; 
		}
		::-moz-placeholder { /* Mozilla Firefox 19+ */
				color: #ccc; opacity:1; 
		}

		input:-ms-input-placeholder{
				color: #ccc; opacity:1; 
		}

		input::-webkit-input-placeholder{
				color: #ccc; opacity:1; 
		}
		// 去掉数字类型input 框 右边的加减符号
		input[type='number'] {
    -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
-webkit-appearance: none;
margin: 0;
}
.slogin {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0px;
	left: 0px;
	background: url(../assets/images/img_login.jpg) no-repeat center center/100% 100%;
		.header {
			height: 81px;
			box-shadow: 0 1px 0 0 #EEEEEE;
			position: relative;
			padding-left: 100px;
			line-height: 81px;
			background: #fff;
			.logo {
				position: absolute;
				top: 21px;
				left: 40px;
				width: 40px;
				height: 40px;
				background: url(../assets/images/ico_login_logo.png) no-repeat;
			}
			span {
				font-size: 28px;
				color: #0086FF;
			}
			.logo_right {
				font-size: 18px;
				color: #2A2A2A;
				line-height: 40px;
			}
		}
			.login_form_s {
				background: #FFFFFF;
				border: 1px solid #E6E8F2;
				box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.30);
				border-radius: 8px;
				position: absolute;
				top: 15.6%;
				left: 58.3%;
				width: 400px;
				height: 480px;
				text-align: center;
				span {
					display: block;
					margin: 40px;
					font-size: 28px;
					color: #333333;
				}
				input {
					border: 1px solid #E6E8F2;
					width: 300px;
					height: 40px;
					margin-top: 20px;
					padding-left: 50px;
				}
				.public_i {
					width: 20px;
					height: 20px;
					position: absolute;
					top: 30px;
					left: 60px;
				}
				.username {
					position: relative;
					.username_i {
						background: url(../assets/images/ico_login_user.png) no-repeat;
					}
				}
				.password {
					position: relative;
					.iconfont {
						position: absolute;
						top: 26px;
						right: 66px;
						color: #999999;
						font-size: 20px;
					}
					.password_show {
						cursor: pointer;
						width: 20px;
						height: 20px;
						position: absolute;
						top: 30px;
						right: 60px;
						background: url(../assets/images/ico_login_password.png) no-repeat;
					}
					.password_i {
						background: url(../assets/images/ico_login_password.png) no-repeat;
					}
				}
				.login_s {
					button {
						width: 300px;
						height: 50px;
						background: #0086FF;
						border-radius: 2px;
						border: none;
						margin-top: 80px;
						color: #fff;
					}
				}
				.register {
					// position: absolute;
					// left: 0px;
					// bottom: 0px;
					margin-top: 42px;
					font-size: 14px;
					color: #0086FF;
					cursor: pointer;
				}
				.lost {
					position: absolute;
					top: 246px;
					right: 58px;
					// margin-top: 10px;
					a {
						font-size: 14px;
						// color: #0086FF;
						color: #666666;
						cursor: pointer;
					}
				}
			}
		.footer {
			width: 100%;
			height: 80px;
			background: #F4F5FA;
			padding-top: 20px;
			// line-height: 50px;
			font-size: 12px;
			color: #999999;
			letter-spacing: 0;
			text-align: center;
			position: fixed;
			bottom: 0px;
			a {
				color: #666666;
				margin: 0 17px;
				cursor: pointer;
			}
		}
	.modal_password {
		width: 400px;
		height: 480px;
		background: #FFFFFF;
		border-radius: 8px;
		position: fixed;
		z-index: 99999;
		top: 15.6%;
		left: 58.3%;
		text-align: center;
		.modal_refund_close {
      width: 50px;
      height: 24px;
      cursor: pointer;
      position: absolute;
      top: 56px;
      right: 46px;
			color:#333333 ;
    }
		p {
			font-size: 28px;
			color: #333333;
			margin-top: 40px;
			margin-bottom: 40px;
			line-height: 40px;
			text-align: left;
			padding-left: 50px;
		}
		input {
			width: 300px;
			height: 40px;
			border: 1px solid #E6E8F2;
			margin-bottom: 20px;
			outline: #0086FF;
			padding-left: 50px;
		}
		.public_input_phone {
			background: url(../assets/images/ico_login_phone.png) 13px 10px no-repeat;
		}
		.public_input_code {
			background: url(../assets/images/ico_login_AuthCode.png) 13px 10px no-repeat;
		}
		.public_input_password {
			background: url(../assets/images/ico_login_password.png) 13px 10px no-repeat;
		}
		input:focus {
			outline:none;
			border: 1px solid #0086FF;
		}
		button {
			width: 120px;
			height: 40px;
			background: #BBD3F1;
			border-radius: 2px;
			color: #fff;
			border: none;
			outline: none;
		}
		.complete_button {
			width: 300px;
			height: 50px;
			background: #BBD3F1;
			border-radius: 2px;
			color: #FFFFFF;
			font-size: 16px;
			margin-top: 20px;
		}
		.hone_code {
			width: 170px;
			height: 40px;
			margin-right: 6px;
		}
		.phone_right {
			background: #0086FF;
		}
	}
}
</style>

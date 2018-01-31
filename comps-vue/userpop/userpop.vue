<template>
	<section class="pop">
		<div class="pop_main" :class="{pop_main_show: userpop.isshow}">
			<div class="menu">
				<a href="javascript:;" :class="{active: userpop.type == 'register'}" @click="userpop.type='register'">注册</a>
				<a href="javascript:;" :class="{active: userpop.type == 'login'}" @click="userpop.type='login'">登录</a>
			</div>
			<!-- 注册 { -->
			<div class="register" :class="{none: userpop.type != 'register'}">
				<p><input type="text" placeholder="请输入手机号" maxlength="11" v-model="username_reg"></p> 
				<p>
					<input type="text" placeholder="请输入右侧验证码" maxlength="4" v-model="vcode_reg">
				   	<img class="vcode" :src="rvcode" @click="reloadVcode('register')" alt="图片验证码">
				</p>
				<p>
				    <input type="text" placeholder="请输入短信验证码" maxlength="6" v-model="msg_reg">
					<a href="javascript:;" class="send_btn" @click="senMsg" v-text="btncontent"></a>
				</p>
				<p><input type="password" placeholder="请设置登录密码" maxlength="20" v-model="password_reg"></p>
				<p><a href="javascript:;" class="btn" @click="registerEvent">注册</a></p> 
			</div>
			<!-- } -->
			<!-- 登录 { -->
			<div class="login" :class="{none: userpop.type != 'login'}">
				<p><input type="text" placeholder="请输入用户名" v-model="username_login" v-focus="focusStatus"></p> 
				<p><input type="password" placeholder="请输入登录密码" maxlength="20" v-model="password_login"></p>
				<p>
					<input type="text" placeholder="请输入右侧验证码" maxlength="4" v-model="vcode_login">
					<img class="vcode" :src="lvcode" @click="reloadVcode('login')" alt="图片验证码"> 
				</p>
				<p><a href="javascript:;" class="btn" @click="loginEvent">登录</a></p>
			</div>
			<!-- } -->
			<div class="close" @click="closePop"></div>
			<div class="tips" :class="{tipsshow: tipsshow}" v-text="tips"></div>
		</div>
		<div class="pop_mask"></div>
	</section>
</template>
<script>
	import './style.scss';
	import encrypt from 'pubs/encrypt/encrypt';
	import utils from 'pubs/utils/utils';
	export default{
		/*
		 *组件调用只需要传一个userpop对象（:userpop="object对象"）
		 *userpopo:{
				isshow: true/false	控制用户登录注册弹层显示隐藏（必选）
				type: 'login'/'register'  控制默认显示登录或者注册以及二者切换（必选）
				cb: function(){}  登录或者注册成功之后的回执函数（默认刷新页面，可选）
			}
		*/
		props: { 
			userpop: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data: function(){
			return{
				// 登陆
				username_login: '',
				password_login: '',
				vcode_login: '',
				// 图形验证码
				lvcode: 'http://user.vas.pptv.com/api/vcode.php?type=login&random='+ Math.random().toString(16).substr(2),
				
				// 注册
				username_reg: '',
				password_reg: '',
				vcode_reg: '',
				msg_reg: '',
				// 图形验证码
				rvcode:'http://user.vas.pptv.com/api/vcode.php?type=register&random='+ Math.random().toString(16).substr(2),

				// 错误提示
				tips: '',
				tipsshow: false,

				// 短信验证码发送状态
				sendstatus: false,
				btncontent: '发送验证短信',
				focusStatus: true
				
			}
		},
		methods:{

			// 关闭弹窗
			closePop: function(){
				// this.$emit('p_close', false); //主动触发p_close方法，false为向父组件传递的数据
				this.userpop.isshow = false;
			},

			// 跟新图形验证码
			reloadVcode: function(type){
				switch(type){
					case 'login':
						this.lvcode = 'http://user.vas.pptv.com/api/vcode.php?type=login&random='+ Math.random().toString(16).substr(2);
						break;

					case 'register':
						this.rvcode = 'http://user.vas.pptv.com/api/vcode.php?type=register&random='+ Math.random().toString(16).substr(2);
						break;
				}
			},

			// 登录
			loginEvent: function(){

				if( this.username_login.length == 0 ){
					this.updata('用户名不能为空');
					return;
				};

				if( this.password_login.length < 6 ){
					this.updata('密码为六位以上');
					return;
				};

				if( this.vcode_login.length < 4 ){
					this.updata('图形验证码为四位');
					return;
				};

				//加密字符串参数
                let params = "&username=" + encodeURIComponent(this.username_login);
                    params += "&password=" + encodeURIComponent(this.password_login);
                    params += "&vcode=" + encodeURIComponent(this.vcode_login);
                    params += "&type=ajax";
                let enParams = encrypt.enCode(encodeURIComponent(params), "ppvaslogin");

                // 校验图形验证码
				this.$http.jsonp('http://user.vas.pptv.com/api/vcode.php', { params:{ type: "login", action: "check", vcode: this.vcode_login }, jsonp: 'cb' } ).then((d) => {
					if(d.body && d.body == 1){
						// 请求登录接口
						this.$http.jsonp('http://user.vas.pptv.com/api/login.php', { params:{ params: enParams }, jsonp: 'cb' } ).then((resp)=>{
							let data = JSON.parse(resp.body);
							if( data.status == 1 ){
				                // 回执函数
								if(this.userpop.cb && typeof this.userpop.cb == 'function'){
									this.userpop.cb.apply(null, arguments);
									return;
								};
								window.location.reload();
							}else{
								this.updata(data.message);
							}
						},function(){
							console.log('def');
						});

					}else{
						this.updata('图形验证码输入不正确');
					}
				},function(){
					console.log('def');
				});

			},

			// 发送验证码
			senMsg: function(){
				let repMobile = /^1\d{10}$/;	 // 验证手机号码的正则表达式

				// 已发送
				if( this.sendstatus ){
					return;
				};

				if( this.username_reg.length < 11 || !repMobile.test( this.username_reg ) ){
					this.updata('请输入正确的手机号');
					return;
				};

				if( this.vcode_reg.length < 4 ){
					this.updata('图形验证码为四位');
					return;
				};

				let pkey = utils.roundKey(20),
					time = 60;

				// 校验图形验证码
				this.$http.jsonp('http://user.vas.pptv.com/api/vcode.php', { params:{ type: "register", action: "check", vcode: this.vcode_reg }, jsonp: 'cb' } ).then( d => {
					if( d.body && d.body == 1 ){
						this.$http.jsonp('http://api.user.vas.pptv.com/ajax/sendsms.php', 
							{ params: {
								app: "game",
                                type: "pptvzc",
                                index: pkey,
                                username: this.username_reg,
                                phone: this.username_reg,
                                token: encrypt.enCode(this.username_reg, pkey),
                                vcode: this.vcode_reg
							}, jsonp: 'cb' }).then( resp => {
								let data = JSON.parse(resp.body);
								if( data.status == 1 ){
									this.updata('短信验证码已发送');
									this.sendstatus = true;
									let _this = this;
									let myinterval = setInterval(function(){
										_this.btncontent = time + 's后重新发送';
										time--;
										if( time == 0 ){
											_this.sendstatus = false;
											_this.btncontent = '重新发送';
											clearInterval(myinterval);
										};
										_this.$nextTick(function (){});
									}, 1000);
								}else{
									this.updata( data.message );
								};
							}, function(){
								console.log('def');
							});
					}else{
						this.updata('图形验证码输入不正确');
					}
				},function(){
					console.log('def');
				});
			},

			// 注册
			registerEvent: function(){

				if( this.username_reg.length < 11 ){
					this.updata('请输入正确的手机号');
					return;
				};

				if( this.vcode_reg.length < 4 ){
					this.updata('图形验证码为四位');
					return;
				};

				if( this.msg_reg.length < 6 ){
					this.updata('请输入短信验证码');
					return;
				};

				if( this.password_reg.length < 6 ){
					this.updata('密码至少为六位');
					return;
				};

				// 生成加密字符串参数
                let randomkey = utils.roundKey(32), encode_passwords = encrypt.enCode( this.password_reg, randomkey );
                let params = "&username=" + encodeURIComponent( this.username_reg );
                	params += "&phonecheckcode=" + encodeURIComponent( this.msg_reg );
                	params += "&password=" + encode_passwords;
                	params += "&pkey=" + encodeURIComponent( randomkey );
                let enParams = encrypt.enCode(encodeURIComponent( params ), "ppvasreg");

                // 校验图形验证码
				this.$http.jsonp('http://user.vas.pptv.com/api/vcode.php', { params:{ type: "register", action: "check", vcode: this.vcode_reg }, jsonp: 'cb' } ).then( d => {
					if( d.body && d.body == 1 ){
		                this.$http.jsonp('http://user.vas.pptv.com/api/register_mobile.php', { params:{ params: enParams, vcode: this.vcode_reg }, jsonp: 'cb' } ).then( resp => {
		                		let data = JSON.parse(resp.body);
		                		if( data.status == 1 ){
		                			// 回执函数
									if(this.userpop.cb && typeof this.userpop.cb == 'function'){
										this.userpop.cb.apply(null, arguments);
										return;
									};
									window.location.reload();
		                		}else{
		                			this.updata( data.message );
		                		};
		                }, function(){
							console.log('def');
						});
					}else{
						this.updata('图形验证码输入不正确');
					};
				},function(){
					console.log('def');
				});	
			},

			// 报错
			updata: function(tips){
				let _this = this;
				this.tipsshow = true;
				this.tips = tips;
				setTimeout(function(){
					_this.tipsshow = false;
					// 异步操作数据——手动跟新数据
		      		_this.$nextTick(function () {
		      		});
				},1500);
			}

		},
		directives:{
			focus: {
		        inserted: function (el, {value}) {
		            if( value ){
		                el.focus();	// 暂时无效不知道为毛
		            }
		        }
		    }
		},
		mounted: function(){
			this.$nextTick(function(){
			});
		}
	}
</script>

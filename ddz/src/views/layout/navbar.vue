<style scoped>
	.layout-logo{
        width: 100px;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
        line-height: 30px;
        color: #797979;
    }
    .layout-nav{
        margin: 0 auto;
        text-align: left;
    }
    .layout-nav .ivu-icon{
    	font-size: 16px;
    }
    .f-logo{font-size: 30px;color: #ccc}
</style>
<template>
    <div>
        <Menu mode="horizontal" theme="light" :active-name="current" @on-select="select">
        	<Row type="flex" justify="center" class="flex-header">
				<Col span="4">
					<div class="layout-logo"><span class="iconfont icon-37750 f-logo"></span></div>
				</Col>
				<Col span="16" class="layout-nav">
                    <Submenu name="invite">
                        <template slot="title">
                            <!-- <Icon type="ios-flame"></Icon> -->
                            <span>邀请活动</span>
                        </template>
                        <MenuGroup title="排行榜">
                            <Menu-item name="rank">
                                <Icon type="stats-bars"></Icon>
                                <span>排行榜</span>
                            </Menu-item>
                            <Menu-item name="grant">
                                <Icon type="trophy"></Icon>
                                <span>奖励发放</span>
                            </Menu-item>
                        </MenuGroup>
                        <MenuGroup title="用户">
                            <Menu-item name="user">
                                <Icon type="person-stalker"></Icon>
                                <span>用户管理</span>
                            </Menu-item>
                        </MenuGroup>
                    </Submenu>
                    <Submenu name="exchange">
                        <template slot="title">
                            <!-- <Icon type="ribbon-a"></Icon> -->
                            <span>兑换活动</span>
                        </template>
                        <MenuGroup title="查询">
                            <Menu-item name="history">
                                <Icon type="ios-clock-outline"></Icon>
                                <span>兑换历史</span>
                            </Menu-item>
                            <Menu-item name="list">
                                <Icon type="navicon"></Icon>
                                <span>活动列表</span>
                            </Menu-item>
                            
                            
                        </MenuGroup>
                        <MenuGroup title="创建">
                            <Menu-item name="batch">
                                <Icon type="coffee"></Icon>
                                <span>创建活动</span>
                            </Menu-item>
                        </MenuGroup>
                    </Submenu>
				</Col>
                <Col span="4">
                    <Button type="text" style="color:#2d8cf0" v-if="!islogin" @click="loginModal">登录</Button>
                    <!-- <Button type="text" style="color:#2d8cf0" v-if="islogin" @click="loginModal">{{user}}</Button> -->
                    <!-- <a href="javascript:;" v-show="islogin"><span>{{user}}</span></a> -->
                    <Dropdown v-if="islogin" @on-click="dropdown">
                        <a href="javascript:void(0)"><span>{{user}}</span></a>
                        <Dropdown-menu slot="list">
                            <Dropdown-item name="relogin">重新登录</Dropdown-item>
                            <Dropdown-item name="logout">退出</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                </Col>
        	</Row>
        </Menu>
    </div>
</template>
<script>
    import config from '../../config/config';
    import url from '../../libs/url';
    import md5 from '../../libs/md5';
    import cookie from '../../libs/cookie';
    import jsonp from 'jsonp';
    export default {
        data(){
            return {
                user: '',
                passwd: '',
                islogin: false,
                rules: {
                    user: [
                        {required: true, message: '管理账号不能为空', trigger: 'blur'}
                    ],
                    passwd: [
                        {required: true, message: '管理密码不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        props: {
            current: String
        },
        mounted() {
            var self = this;
            var user = cookie('user');
            var token = cookie('token');
            if(user && token){
                self.user = user;
                self.islogin = true;
            }
            window.onpopstate = function(e){
                var name = e.state.name || 'rank';
                self.$emit('change', name);
            }
        },
    	methods: {
    		select(name){
                if(this.current != name){
                    history.pushState({name:name}, name, name);
                    //this.$Loading.start();
                    //this.$Loading.finish();
                    this.$emit('change', name);
                }
    		},
            dropdown(name){
                var self = this;
                if('relogin' == name){
                    self.loginModal();
                }else if('logout' == name){
                    self.user = '';
                    cookie('user', '');
                    cookie('token', '');
                    self.islogin = false;
                    self.$Message.success('退出登录成功');
                }else{}
            },
            loginModal(){
                var self = this;
                this.$Modal.confirm({
                    //title: '管理账号登录',
                    okText: '立即登录',
                    onOk: () => {
                        if(self.user && self.passwd){
                            const msg = self.$Message.loading({
                                content: '正在登录中...',
                                duration: 0
                            });
                            jsonp(config.host + '/login', {
                                param: url.serialize({
                                    user: self.user,
                                    pwd: md5(self.passwd)
                                }, true),
                            }, function(error, data){
                                msg();
                                if(error){
                                    self.$Message.error('连接服务器失败');
                                }else if(data.status == 1){
                                    self.islogin = true;
                                    self.$Message.success('登录成功');
                                    cookie('token', data.token);
                                    cookie('user', self.user);
                                    console.log(cookie('token'));
                                }else if(data.status == 0){
                                    self.$Message.error('账号或密码错误');
                                }else{}
                            })
                        }else{
                            self.$Message.error('请填写用户名或密码');
                        }
                    },
                    render: (h) => {
                        return [
                            h('div', {
                                style: {
                                    'text-align': 'center',
                                    'font-size': '15px'
                                }
                            }, '管理账号登录'),
                            h('div', {
                                style: {
                                    'margin-top': '1em',
                                    'padding-top': '1em',
                                    //'border-top': '1px solid #f0f0f0',
                                }
                            },[
                                h('Form', {
                                    props: {
                                        'label-width': 60,
                                        //rules: self.rules,
                                    }
                                },[
                                    h('Form-item', {
                                        props: {
                                            label: '账号',
                                            prop: 'user',
                                        }
                                    }, [
                                        h('Input', {
                                            props: {
                                                value: self.user,
                                                autofocus: true,
                                                placeholder: '请输入管理员账号'
                                            },
                                            on: {
                                                input: (val) => {
                                                    self.user = val;
                                                }
                                            }
                                        })
                                    ]),
                                    h('Form-item', {
                                        props: {
                                            label: '密码',
                                            prop: 'passwd',
                                        }
                                    }, [
                                        h('Input', {
                                            props: {
                                                value: self.passwd,
                                                autofocus: true,
                                                type: 'password',
                                                placeholder: '请输入管理员密码'
                                            },
                                            on: {
                                                input: (val) => {
                                                    self.passwd = val;
                                                }
                                            }
                                        })
                                    ]),
                                ])
                            ])
                        ] //结束modal的内容
                    }
                })
            },
    	}
    }
</script>
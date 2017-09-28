<style scope>
	.user{
		padding: 1em 2%;
	}
    .ivu-page{
        padding-top: 1em;
    }
    /*.ivu-table-row .ivu-dropdown{
        display: none;
    }
    .ivu-table-row:hover .ivu-dropdown{
        display: inline-block;
    }*/
    .ivu-dropdown-menu{
        text-align: left;
    }
    .ivu-dropdown-menu .ivu-icon{
        margin: 0 0.2em;
        font-size: 16px;
    }
</style>
<template>
    <div class="user">
        <!-- 搜索栏 -->
		<Form :label-width="80">
			<Row type="flex" justify="center" align="middle">
				<Col span="6">
	                <Form-item label="游戏">
		    			<Select v-model="area_id" placeholder="请选择游戏" @on-change="areaChange">
			                <Option v-for="item in area_list" :value="item.id">{{item.describe}}</Option>
			            </Select>
		    		</Form-item>
	            </Col>

	            <Col span="6">
	                <Form-item label="渠道">
		    			<Select v-model="channel_id" placeholder="请选择区域" @on-change="channelChange">
			                <Option v-for="item in channel_list" :key="area_id + '_' + item.channel_id" :value="item.channel_id">{{item.mark}}</Option>
			            </Select>
		    		</Form-item>
	            </Col>
                <Col span="6">
                    <Form-item label="用户ID">
                        <Input v-model="key" placeholder="用户ID / VIP短号" @on-change="uidChange"></Input>
                    </Form-item>
                </Col>
                <Col span="6">
                    <Form-item label="上级用户">
                        <Input v-model="pid" placeholder="上级用户ID" @on-change="pidChange"></Input>
                    </Form-item>
                </Col>
			</Row>
		</Form>
        <!-- 表格 -->
		<Table highlight-row :columns="columns" :data="items" :height="height()"></Table>
        <Page :total="total" :current="page" v-show="total>0" @on-change="pageChange"></Page>
        <!-- 模态框 -->

    </div>
</template>
<script>
	import config from '../../config/config';
	import url from '../../libs/url';
    import cookie from '../../libs/cookie';
	import jsonp from 'jsonp';
    import expand from './expand.vue';
    import axios from 'axios';
    export default {
    	data(){
            var self = this;
    		return {
    			area_id: 1,
    			area_list: [],
    			channel_id: 0,
    			channel_list: [],
    			items: [],
    			page: 1,
    			pagesize: 10,
                total: 0,
                key: '',
                pid: '',
                code: '',
                height(){
                    return window.screen.availHeight - 360
                },
    			columns: [
                    // {type: 'index', width: 60, align: 'center'},
                    {type: 'selection',width: 60,align: 'center'},
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expand, {
                                props: {
                                    user: params.row
                                }
                            })
                        }
                    },
                    {title: '用户', key: 'nickname'},
                    {title: '用户ID', key: 'uid', align: 'center'},
                    {title: '渠道号', key: 'channel_id', align: 'center'},
                    {title: 'VIP短号', key: 'vip_short', align: 'center'},
                    //{title: '绑定手机', key: 'phone'},
                    //{title: '注册时间', key: 'registdatetime', width: 160, align: 'center'},
                    {title: '上级用户', key: 'pid', align: 'center'},
                    {title: '总积分', key: 'point', align: 'center'},
                    {title: '活跃状态', render: (h, params) => {
                        var user = self.items[params.index];
                        //return h('span', user.status == 1 ? '正常' : '封冻')
                        var color = user.active == 1 ? 'green' : (user.active == 2 ? 'yellow' : 'red');
                        var text = user.active == 1 ? '活跃' : (user.active == 2 ? '新用户' : '不活跃');

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }},
                    {title: '状态', align: 'center', render: (h, params) => {
                        var user = self.items[params.index];
                        return h('span', user.status == 1 ? '正常' : '封冻')
                    }},
                    {
                        title: '操作',
                        key: 'action',
                        //fixed: 'right',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            var user = self.items[params.index];
                            return h('div', [
                                h('Dropdown',{
                                    props:{
                                        trigger: 'click',
                                        placement: 'bottom-end'
                                    },
                                    on: {
                                        'on-click': function(name){
                                            self.dropdown(name, params)
                                        }
                                    }
                                },[
                                    //下拉按钮
                                    h('a',{
                                        attrs: {
                                            href: 'javascript:;'
                                        }
                                    }, [
                                        h('span', {}, '更多'),
                                        h('Icon', {props: {type: 'arrow-down-b'}})
                                    ]),
                                    //下拉列表
                                    h('Dropdown-menu', {
                                        slot: 'list',
                                    }, [
                                        h('Dropdown-item', {props: {name: 'short-random'}}, [
                                            h('span', {}, '设置随机VIP短号'),
                                        ]),
                                        h('Dropdown-item', {props: {name: 'short-appoint'}}, [
                                            h('span', {}, '设置指定VIP短号'),
                                        ]),
                                        user.vip_short > 0 ? h('Dropdown-item', {props: {name: 'short-clear'}}, [
                                            h('span', {}, '清除VIP短号'),
                                        ]) : null,
                                        user.pid > 0 ? h('Dropdown-item', {props: {name: 'unbind'}}, [
                                            h('span', {}, '解除上级用户绑定'),
                                        ]) : null,
                                        h('Dropdown-item', {props: {name: 'mail'}}, [
                                            h('span', {}, '发送游戏邮件'),
                                        ]),
                                        /*h('Dropdown-item', {props: {name: 'prop'}}, [
                                            h('span', {}, '发放游戏道具'),
                                        ]),*/
                                        user.status == 1 ? h('Dropdown-item', {props: {name: 'freeze'}}, [
                                            h('span', {}, '封冻账号'),
                                        ]) : h('Dropdown-item', {props: {name: 'unfreeze'}}, [
                                            h('span', {}, '解除封冻'),
                                        ]),
                                    ])
                                ]),
                            ]);
                        }
                    },
                ],
    		}
    	},
    	mounted() {
            axios.defaults.baseURL = config['host'];   //配置接口地址
    		this.$Loading.start();
    		this.loadArea();
        },
        methods: {
        	loadArea(){
        		var self = this;
        		jsonp(config.host + '/user/area', null, function(error, data){
                    if(data){
                    	self.area_list = data;
                    	self.loadChannel();
                    }
                })

                axios.post('/user/area',{
                    
                })
                .then(function(response){
                    var data = response.data;
                    if(data){
                        self.area_list = data;
                        self.loadChannel();
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        	},
        	areaChange(value){
        		this.$Loading.start();
        		this.area_id = value;
                this.page = 1;
                //this.channel_id = 0;
        		this.loadChannel();
        	},
        	loadChannel(){
        		var self = this;
        		
                axios.post('/user/channel',{
                    aid: self.area_id
                })
                .then(function(response){
                    var data = response.data;
                    if(data){
                        var item = {
                            channel_id: 0,
                            mark: '请选择'
                        };
                        self.channel_list = data;
                        self.channel_list.splice(0, 0, item);
                        self.channel_id = 0;
                        self.loadList();
                    }
                })
                .catch(function(error){
                    console.log(error);
                })
        	},
        	channelChange(value){
        		this.$Loading.start();
        		this.channel_id = value;
        		this.loadList();
        	},
        	loadList(){
        		var self = this;
        		
                axios.post('/user',{
                    aid: self.area_id,
                    cid: self.channel_id,
                    p: self.page,
                    pid: self.pid,
                    key: self.key
                })
                .then(function(response){
                    var data = response.data;
                    if(data){
                        console.log(data);
                        self.items = data.list;
                        self.total = data.total;
                    }
                    self.$Loading.finish();
                })
                .catch(function(error){
                    console.log(error);
                })
        	},
            pageChange(page){
                this.page = page;
                this.loadList();
            },
            uidChange(){
                this.page = 1;
                this.loadList();
            },
            pidChange(){
                this.page = 1;
                this.loadList();
            },
            dropdown(name, params){
                var self = this;
                var user = this.items[params.index];
                if('short-random' == name){
                    this.$Modal.confirm({
                        //title: '确认',
                        okText: '设置',
                        onOk: () => {
                            axios.post('/short/random',{
                                uid: user.uid,
                                token: cookie('token')
                            })
                            .then(function(response){
                                var data = response.data;
                                if(data.status == 1){
                                    console.log(data);
                                    self.$Message.success('设置VIP短码成功');
                                    self.loadList();
                                }else if(data.status == 0){
                                    self.$Message.error(data.message);
                                }else{}
                            })
                            .catch(function(error){
                                self.$Message.error('连接服务器失败');
                            })
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        //'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '确认'),
                                h('div', {
                                    style: {
                                        'margin-top': '1em',
                                        'padding-top': '1em',
                                        //'text-align': 'center',
                                        //'border-top': '1px solid #f0f0f0',
                                    }
                                }, [
                                    h('span', '随机设置'),
                                    h('span', {
                                        style: {
                                            color: '#2d8cf0',
                                            margin: '0 0.5em',
                                        }
                                    }, user.nickname + '（' + user.uid + '）'),
                                    h('span', '的VIP短码？'),
                                ])
                            ]
                        }
                    })
                }else if('short-appoint' == name){
                    this.$Modal.confirm({
                        //title: '管理账号登录',
                        okText: '设置',
                        onOk: () => {
                            if(self.code){
                                const msg = self.$Message.loading({
                                    content: '请稍等...',
                                    duration: 0
                                });
                                
                                 axios.post('/short/random',{
                                    uid: user.uid,
                                    code: self.code,
                                    token: cookie('token')
                                })
                                .then(function(response){
                                    msg();
                                    var data = response.data;
                                    if(data.status == 1){
                                        self.$Message.success('设置VIP短码成功');
                                        self.loadList();
                                    }else if(data.status == 0){
                                        self.$Message.error(data.message);
                                    }else{}
                                })
                                .catch(function(error){
                                    self.$Message.error('连接服务器失败');
                                })

                            }else{
                                self.$Message.error('请填写VIP短码');
                            }
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '设置VIP短码'),
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
                                                label: '用户',
                                                prop: 'code',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: user.nickname,
                                                    disabled: true,
                                                },
                                            })
                                        ]),
                                        h('Form-item', {
                                            props: {
                                                label: '用户ID',
                                                prop: 'code',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: user.uid,
                                                    disabled: true,
                                                },
                                            })
                                        ]),
                                        h('Form-item', {
                                            props: {
                                                label: 'VIP短码',
                                                prop: 'code',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: self.code,
                                                    autofocus: true,
                                                    placeholder: '请输入VIP短码'
                                                },
                                                on: {
                                                    input: (val) => {
                                                        self.code = val;
                                                    }
                                                }
                                            })
                                        ]),
                                    ])
                                ])
                            ] //结束modal的内容
                        }
                    })
                }else if('short-clear' == name){
                    this.$Modal.confirm({
                        //title: '确认',
                        okText: '清除',
                        onOk: () => {
                            
                            axios.post('/short/clear',{
                                    uid: user.uid,
                                    token: cookie('token')
                                })
                                .then(function(response){
                                   var data = response.data;
                                    if(data.status == 1){
                                        console.log(data);
                                        self.$Message.success('清除VIP短码成功');
                                        self.loadList();
                                    }else if(data.status == 0){
                                        self.$Message.error(data.message);
                                    }else{}
                                    })
                                .catch(function(error){
                                    self.$Message.error('连接服务器失败');
                                })
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        //'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '确认'),
                                h('div', {
                                    style: {
                                        'margin-top': '1em',
                                        'padding-top': '1em',
                                        //'text-align': 'center',
                                        //'border-top': '1px solid #f0f0f0',
                                    }
                                }, [
                                    h('span', '确定要清除'),
                                    h('span', {
                                        style: {
                                            color: '#2d8cf0',
                                            margin: '0 0.5em',
                                        }
                                    }, user.nickname + '（' + user.uid + '）'),
                                    h('span', '的VIP短码吗？'),
                                ])
                            ]
                        }
                    })
                }else if('mail' == name){
                    var title = '';
                    var message = '';
                    this.$Modal.confirm({
                        //title: '管理账号登录',
                        okText: '立即发送',
                        width: 600,
                        onOk: () => {
                            if(title && message){
                                const msg = self.$Message.loading({
                                    content: '邮件发送中...',
                                    duration: 0
                                });
                                
                                axios.post('/mail',{
                                    uid: user.uid,
                                    title: title,
                                    message: message,
                                    token: cookie('token')
                                })
                                .then(function(response){
                                    msg();
                                    var data = response.data;
                                   if(data.status == 1){
                                        self.$Message.success(data.message);
                                    }else if(data.status == 0){
                                        self.$Message.error(data.message);
                                    }else{}
                                })
                                .catch(function(error){
                                    self.$Message.error('连接服务器失败');
                                })
                            }else{
                                self.$Message.error('请将邮件信息填写完整');
                            }
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '发送邮件'),
                                h('div', {
                                    style: {
                                        'margin-top': '1em',
                                        'padding-top': '1em',
                                        //'border-top': '1px solid #f0f0f0',
                                    }
                                },[
                                    h('Form', {
                                        props: {
                                            'label-width': 80,
                                            //rules: self.rules,
                                        },
                                    },[
                                        h('Form-item', {
                                            props: {
                                                label: '用户',
                                                prop: 'code',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: user.nickname,
                                                    disabled: true,
                                                },
                                            })
                                        ]),
                                        h('Form-item', {
                                            props: {
                                                label: '用户ID',
                                                prop: 'code',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: user.uid,
                                                    disabled: true,
                                                },
                                            })
                                        ]),
                                        h('Form-item', {
                                            props: {
                                                label: '邮件标题',
                                                prop: 'title',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: title,
                                                    autofocus: true,
                                                    placeholder: '请输入邮件标题'
                                                },
                                                on: {
                                                    input: (val) => {
                                                        title = val;
                                                    }
                                                }
                                            })
                                        ]),
                                        h('Form-item', {
                                            props: {
                                                label: '邮件内容',
                                                prop: 'message',
                                            }
                                        }, [
                                            h('Input', {
                                                props: {
                                                    value: message,
                                                    autofocus: true,
                                                    type: 'textarea',
                                                    placeholder: '请输入邮件内容'
                                                },
                                                on: {
                                                    input: (val) => {
                                                        message = val;
                                                    }
                                                }
                                            })
                                        ]),
                                    ])
                                ])
                            ] //结束modal的内容
                        }
                    })
                }else if('prop' == name){
                    console.log('grant prop');
                }else if('freeze' == name){
                    this.$Modal.confirm({
                        //title: '确认',
                        okText: '开始封冻',
                        onOk: () => {
                            

                            axios.post('/user/channel',{
                                uid: user.uid,
                                token: cookie('token')
                            })
                            .then(function(response){
                                var data = response.data;
                                if(data.status == 1){
                                    console.log(data);
                                    self.$Message.success(data.message);
                                    self.loadList();
                                }else if(data.status == 0){
                                    self.$Message.error(data.message);
                                }else{}
                            })
                            .catch(function(error){
                                self.$Message.error('连接服务器失败');
                            })
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        //'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '封冻账号'),
                                h('div', {
                                    style: {
                                        'margin-top': '1em',
                                        'padding-top': '1em',
                                        //'text-align': 'center',
                                        //'border-top': '1px solid #f0f0f0',
                                    }
                                }, [
                                    h('span', '确定要封冻账号'),
                                    h('span', {
                                        style: {
                                            color: '#2d8cf0',
                                            margin: '0 0.5em',
                                        }
                                    }, user.nickname + '（' + user.uid + '）'),
                                    h('span', '吗？'),
                                    h('p', {
                                        style: {
                                            color: '#aaa',
                                            'line-height': '3em'
                                        }
                                    }, '此操作仅对邀请活动有效'),
                                ])
                            ]
                        }
                    })
                }else if('unfreeze' == name){
                    this.$Modal.confirm({
                        //title: '确认',
                        okText: '开始解除',
                        onOk: () => {
                           
                            axios.post('/user/unfreeze',{
                                uid: user.uid,
                                token: cookie('token')
                            })
                            .then(function(response){
                                var data = response.data;
                                if(data.status == 1){
                                    self.$Message.success(data.message);
                                    self.loadList();
                                }else if(data.status == 0){
                                    self.$Message.error(data.message);
                                }else{}
                            })
                            .catch(function(error){
                                self.$Message.error('连接服务器失败');
                            })
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        //'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '解除封冻'),
                                h('div', {
                                    style: {
                                        'margin-top': '1em',
                                        'padding-top': '1em',
                                        //'text-align': 'center',
                                        //'border-top': '1px solid #f0f0f0',
                                    }
                                }, [
                                    h('span', '确定要解除账号'),
                                    h('span', {
                                        style: {
                                            color: '#2d8cf0',
                                            margin: '0 0.5em',
                                        }
                                    }, user.nickname + '（' + user.uid + '）'),
                                    h('span', '封冻吗？'),
                                ])
                            ]
                        }
                    })
                }else if('unbind' == name){
                    this.$Modal.confirm({
                        //title: '确认',
                        okText: '开始解除',
                        onOk: () => {
                            axios.post('/user/unbind',{
                                uid: user.uid,
                                token: cookie('token')
                            })
                            .then(function(response){
                                var data = response.data;
                                if(data.status == 1){
                                    self.$Message.success(data.message);
                                    self.loadList();
                                }else if(data.status == 0){
                                    self.$Message.error(data.message);
                                }else{}
                            })
                            .catch(function(error){
                                self.$Message.error('连接服务器失败');
                            })
                        },
                        render: (h) => {
                            return [
                                h('div', {
                                    style: {
                                        //'text-align': 'center',
                                        'font-size': '15px'
                                    }
                                }, '解除绑定'),
                                h('div', {
                                    style: {
                                        'margin-top': '1em',
                                        'padding-top': '1em',
                                        //'text-align': 'center',
                                        //'border-top': '1px solid #f0f0f0',
                                    }
                                }, [
                                    h('span', '确定要解除账号'),
                                    h('span', {
                                        style: {
                                            color: '#2d8cf0',
                                            margin: '0 0.5em',
                                        }
                                    }, user.nickname + '（' + user.uid + '）'),
                                    h('span', '上级用户的绑定吗？'),
                                ])
                            ]
                        }
                    })
                }else{}
            }
        }
    }
</script>
<style scope>
	.list{
		padding: 1em 2%;
	}
	.ivu-select-item{
		text-align: left;
	}
</style>
<template>
	<div class="list">
		<!-- 搜索栏 -->
		<Form :label-width="80">
			<Row type="flex" justify="center" align="middle">
				<Col span="6" >
					<Form-item label="活动名称">
                        <Input v-model="act_detail" placeholder="请输入活动名称" type="text" @on-change="actChange()"></Input>
		    		</Form-item>
				</Col>
				
				<Col span="6">
					<Form-item label="活动状态">
			    		<Select placeholder="请选择活动状态"  v-model="forbidden" @on-change="forbiddenChange(forbidden)">
			    			<Option value="-1">全部</Option>
			    			<Option value="0">允许</Option>
			    			<Option value="1">禁止</Option>
				        </Select>
			    	</Form-item>	
				</Col>
			</Row>
			
		</Form>
		<!-- 表格 -->
		<Table highlight-row :columns="columns" :data="items" :height="height()"></Table>
        <Page :total="total" :current="page" :page-size="10" @on-change="pageChange(page)"></Page>
        
       
	</div>
</template>
<script>
	import config from '../../config/config';
	import url from '../../libs/url';
	import date from '../../libs/date';
    import cookie from '../../libs/cookie';
	import jsonp from 'jsonp';
    import axios from 'axios';
	export default {
		data(){
			var self = this;
			return {
                id:'',
				page:1,
                act_detail:'',
                forbidden:-1,
				items:[],
				modal_state:false,
				state:'',
                total: 0,
				height(){
                    return window.screen.availHeight - 360
                },
                columns: [
                	{title: '批次', key: 'id',align: 'center', width: 60},
                	{title: '活动名称', key: 'act_detail',align: 'center'},
                	{title: '奖品', key: 'gift_detail',align: 'center'},
                	{title: '开始时间', key: 'create_time',align: 'center'},
                	{title: '截止时间', key: 'expire_time',align: 'center'},
                	{title: '已兑换量', key: 'exchanged_num',align: 'center'},
                	{title: '状态', key: 'forbidden',align: 'center'},
                	{
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            //console.log(params)
                            var item = self.items[params.index];
                            var forbidden = item.forbidden;
                         	return h('div',[
                         		h('Dropdown',{
                         			props:{
                         				trigger:'click',
                         				placement:'bottom-end'
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
                             			h('span',{},'更多'),
                             			h('Icon',{props: {type: 'arrow-down-b'}})	
                         		    ]),
                             		//下拉列表
                             		h('Dropdown-menu',{
                             			slot: 'list',
                             		},[
                             			 forbidden == 1?h('Dropdown-item', {props: {name: 'allow'}}, [
                                                h('span', {}, '允许该活动'),
                                         ]):h('Dropdown-item', {props: {name: 'forbid'}}, [
                                                h('span', {}, '禁止该活动'),
                                         ]),
                                         h('Dropdown-item', {props: {name: 'lookup'}}, [
                                                h('span', {}, '查看兑换码'),
                                         ]),
                             		])
                         	    ]),
                         	]);
                        }
                    }	
                	
                ]
                
			}
		},
		mounted() {
    		axios.defaults.baseURL = config['host_exchange'];   //配置接口地址
            this.loadList();
        },
		methods: {
			
            loadList(){
                var self = this;
                axios.get('/activity',{
                    params:{
                        page:self.page,
                        name:self.act_detail,
                        forbidden:self.forbidden
                    }
                })
                .then(function(response){
                    //console.log(response.data);
                    self.total = response.data.total;
                    self.items = response.data.items;
                })
                .catch(function(error){
                    console.log(error);
                })
            },
            changeForbidden(id,forbidden){
                var self = this;
                
                axios.post('/activity/forbidden',{
                    id: id,
                    forbidden: forbidden,
                    token: cookie('token'),
                })
                .then(function(response){
                   
                    self.loadList();
                })
                
                
            },
            /*活动名称查询*/
            actChange(){
                this.page = 1;
                this.loadList();
            },
            /*状态查询*/
            forbiddenChange(forbidden){
                this.forbidden = forbidden;
                this.page = 1;
                this.loadList();
            },
            /*页数改变时*/
            pageChange(page){
                this.page = page;
                this.loadList();
            },
            dropdown(name,params){
                var self = this;
                var item = self.items[params.index];
                var id = item.id;
                if(name=='allow'){
                    var forbidden = 0;
                    this.$Modal.confirm({
                        content:'确定允许该次活动吗？',
                        onOk:function(){
                            
                            self.changeForbidden(id,forbidden,params);
                        }
                    })
                }else if(name == 'forbid'){
                    var forbidden = 1;
                    this.$Modal.confirm({
                        content:'确定禁止该次活动吗？',
                        onOk:function(){

                            self.changeForbidden(id,forbidden);
                        }
                    })
                }else if(name == 'lookup'){
                    window.location.href = '/exchange?id=' + item.id;
                }
                
            }
		}
	}
</script>
<style>
	.exchange{
		padding: 1em 2%;
	}
</style>
<template>
	<div class="exchange">
		<!-- 表格 -->
		<Table highlight-row :columns="columns" :data="items" :height="height()" ref="table"></Table>
		<Button type="primary" size="large" @click="exportData" style="margin-top: 30px;"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button>
	</div>
</template>
<script type="text/javascript">
    import config from '../../config/config';
	import url from '../../libs/url';
	import axios from 'axios';
	export default {
		data(){
			return {
				items:[],
				height(){
                    return window.screen.availHeight - 360
                },
                columns: [
                	{title: '批次', key: 'batch',align: 'center',width:100},
                	{title: '兑换码', key: 'code',align: 'center'},
                	{title: '状态', key: 'status',align: 'center'}]
			}
		},
		mounted(){
			axios.defaults.baseURL = config['host_exchange'];   //配置接口地址
			this.loadCode();
		},
		methods:{
			loadCode(){
				var self = this;
				axios.post('/code',{
					id:url.query('id')
				})
				.then(function(response){
					self.items = response.data;
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			},
			/*导出表格*/
			exportData(){
				this.$refs.table.exportCsv({
                        filename: url.query('id')+'批次兑换码'
                    });
			}
		}
	}
</script>
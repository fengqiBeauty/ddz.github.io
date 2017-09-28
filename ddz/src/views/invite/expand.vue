<style scope>
    .expand-row{
        line-height: 2em;
    }
</style>
<template>
	<div>
        <Row class="expand-row">
            <Col span="1">&nbsp;</Col>
            <Col span="7">
                <span class="expand-key">注册时间：</span>
                <span class="expand-value">{{ user.registdatetime }}</span>
            </Col>
            <Col span="7">
                <span class="expand-key">最后一次登录时间：</span>
                <span class="expand-value">{{ user.lastlogindatetime }}</span>
            </Col>
            <Col span="7">
                <span class="expand-key">游戏时长：</span>
                <span class="expand-value">{{ user.playtime || 0 }}分钟</span>
            </Col>
            <Col span="1">&nbsp;</Col>
        </Row>
        <Row class="expand-row">
            <Col span="1">&nbsp;</Col>
            <Col span="7">
                <span class="expand-key">IP：</span>
                <span class="expand-value">{{ user.ip || '未知' }}</span>
            </Col>
            <Col span="7">
                <span class="expand-key">地址：</span>
                <span class="expand-value">{{ (user.region + user.city + user.county) || '未知' }}</span>
            </Col>
            <Col span="7">
                <span class="expand-key">ISP：</span>
                <span class="expand-value">{{ user.isp || '未知' }}</span>
            </Col>
            <Col span="1">&nbsp;</Col>
        </Row>
        <Row class="expand-row">
            <Col span="1">&nbsp;</Col>
            <Col span="7">
                <span class="expand-key">下级用户数：</span>
                <span class="expand-value">{{ user.num_sub }}个</span>
            </Col>
            <Col span="7">
                <span class="expand-key">手机号码：</span>
                <span class="expand-value">{{ user.phone || '未绑定' }}</span>
            </Col>
            <Col span="1">&nbsp;</Col>
        </Row>
    </div>
</template>
<script>
    export default {
    	props: {
            user: Object
        }
    }
</script>
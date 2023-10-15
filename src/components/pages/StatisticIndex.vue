<template>
    <el-button-group class="button-group-cus">
        <el-button :class="buttonTabBar" @click="handleButtonClick('bar')">条形图</el-button>
        <el-button :class="buttonTabPie" @click="handleButtonClick('pie')">饼状图</el-button>
    </el-button-group>
    <router-view/>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElButtonGroup, ElButton } from 'element-plus'
import router from "../../router/router";
onMounted(()=>{
    router.push({ name: 'barchart' });
});
// 按钮
const buttonTabBar=ref("el-button el-button--success");
const buttonTabPie=ref("el-button el-button--primary");

function handleButtonClick(style :string){
    if("bar"===style){
        buttonTabBar.value="el-button el-button--success";
        buttonTabPie.value="el-button el-button--primary";
        router.push({ name: 'barchart' });
    }
    if("pie"===style){
        buttonTabBar.value="el-button el-button--primary";
        buttonTabPie.value="el-button el-button--success";
        router.push({ name: 'piechart' });
    }
}
</script>

<style scoped>
.button-group-cus {
    margin-bottom: 20px;
}
</style>
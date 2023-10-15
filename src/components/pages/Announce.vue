<template>
    <div v-for="(shadow, i) in shadowGroup" :key="i" class="flex flex-col justify-center items-center" m="auto" w="46">
        <div class="inline-flex" h="30" w="30" m="2" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})`, }" style="padding:50px;">
            <el-table :data="tableData" stripe class="el-table-cus">
                <el-table-column prop="name" label="公告" width="260" />
                <el-table-column prop="date" label="日期" width="3060" />
            </el-table>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
const tableData = [
    {
        name: '这是一条测试公告1',
        date: '2016-05-03',
    },
    {
        name: '这是一条测试公告2',
        date: '2017-08-13',
    },
    {
        name: '这是一条测试公告3',
        date: '2023-09-23',
    },
    {
        name: '这是一条测试公告4',
        date: '2022-03-12',
    },
    {
        name: '这是一条测试公告5',
        date: '2024-06-07',
    },
]

const shadowGroup = ref([
    {
        name: 'Dark Shadow',
        type: 'dark',
    },
])

const getCssVarName = (type: string) => {
    return `--el-box-shadow${type ? '-' : ''}${type}`
}
</script>

<style scoped>
.el-table-cus :hover {
    cursor: pointer;
}
</style>
<template>
    <div ref="main" class="bar-size-cus"></div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
// @ts-ignore
import * as echarts from "echarts";

const main = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

let option: echarts.EChartOption = {
    title: {
        text: '图书类别 统计分析'
    },
    tooltip: {},
    legend: {
        data: ['类别占比']
    },
    xAxis: {
        data: ['文学类', '历史类', '工学类', '法学类', '经济学类', '统计学类']
    },
    yAxis: {},
    series: [
        {
            name: '类别占比',
            type: 'bar',
            data: [66, 20, 80, 60, 80, 90]
        }
    ]
};

onMounted(() => {
    myChart = echarts.init(main.value!);
    myChart.setOption(option);

    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    if (myChart) {
        myChart.dispose();
        myChart = null;
    }
    window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
    if (myChart) {
        const savedOption = JSON.parse(JSON.stringify(option));
        myChart.clear();
        myChart.resize();
        myChart.setOption(savedOption, true); // Set true to preserve animation
    }
};

// 监听窗口大小变化，调整图表大小
watch(() => main.value, () => {
    handleResize();
});
</script>
  
<style scoped>
.bar-size-cus {
    width: 100%;
    height: 400px;
}
</style>
  
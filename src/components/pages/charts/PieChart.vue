<template>
    <div ref="chart" class="pie-size-cus"></div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
// @ts-ignore
import * as echarts from "echarts";

const chart = ref<echarts.ECharts | null>(null);
let option: echarts.EChartOption = {
    series: [
        {
            type: 'pie',
            data: [
                { value: 660, name: '文学类' },
                { value: 200, name: '历史类' },
                { value: 800, name: '工学类' },
                { value: 600, name: '法学类' },
                { value: 800, name: '经济学类' },
                { value: 900, name: '统计学类' }
            ],
            roseType: 'area'
        }
    ]
};

onMounted(() => {
    chart.value = echarts.init(chart.value!);
    chart.value.setOption(option);
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    if (chart.value) {
        chart.value.dispose();
        chart.value = null;
    }
    window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
    if (chart.value) {
        const savedOption = JSON.parse(JSON.stringify(option));
        chart.value.clear();
        chart.value.resize();
        chart.value.setOption(savedOption, true); // Set true to preserve animation
    }
};

// 监听窗口大小变化，调整图表大小
watch(() => chart.value, () => {
    handleResize();
});
</script>
  
<style scoped>
.pie-size-cus {
    width: 100%;
    height: 400px;
}
</style>
  
// history模式
import {
    createRouter,
    createWebHistory,
} from 'vue-router'

import Login from '../components/Login.vue'
import LoginIn from '../components/LoginIn.vue'
import Announce from '../components/pages/Announce.vue'
import LendListIndex from '../components/pages/LendListIndex.vue'
import BookIndex from '../components/pages/BookIndex.vue'
import ReaderIndex from '../components/pages/ReaderIndex.vue'
import TypeIndex from '../components/pages/TypeIndex.vue'
import NoticeIndex from '../components/pages/NoticeIndex.vue'
import AdminIndex from '../components/pages/AdminIndex.vue'
import StatisticIndex from '../components/pages/StatisticIndex.vue'
import BarChart from '../components/pages/charts/BarChart.vue'
import PieChart from '../components/pages/charts/PieChart.vue'

const routes = [
    // 路由的默认路径
    {
        path: '/',
        component: Login
    },
    {
        path: '/loginin',
        component: LoginIn,
        children: [
            {
                name: 'announce',
                path: 'announce',
                component: Announce
            },
            {
                name: 'lendlistindex',
                path: 'lendlistindex',
                component: LendListIndex
            },
            {
                name: 'bookindex',
                path: 'bookindex',
                component: BookIndex
            },
            {
                name: 'readerindex',
                path: 'readerindex',
                component: ReaderIndex
            },
            {
                name: 'typeindex',
                path: 'typeindex',
                component: TypeIndex
            },
            {
                name: 'noticeindex',
                path: 'noticeindex',
                component: NoticeIndex
            },
            {
                name: 'adminindex',
                path: 'adminindex',
                component: AdminIndex
            },
            {
                name: 'statisticindex',
                path: 'statisticindex',
                component: StatisticIndex,
                children: [
                    {
                        name: 'barchart',
                        path: 'barchart',
                        component: BarChart,
                    },
                    {
                        name: 'piechart',
                        path: 'piechart',
                        component: PieChart,
                    }
                ]
            },
        ]
    }
]

// 创建路由对象
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router;
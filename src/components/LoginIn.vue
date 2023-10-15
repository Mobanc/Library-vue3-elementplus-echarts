<template>
    <div class="common-layout">
        <el-container>
            <el-aside style="width: auto;">
                <!-- 左侧栏 -->
                <el-menu style="height: 100vh; border: none" active-text-color="#ffd04b" background-color="#545c64"
                    class="el-menu-vertical-demo" text-color="#fff" @open="handleOpen"
                    @close="handleClose" :collapse="isCollapse" :default-active="currentRouteName">
                    <div class="logo-box-cus" @click="toIndex">
                        <img src="../assets/images/favicon.ico" class="icon-cus" />
                        <h1 class="title-h1" v-show="!isCollapse">{{ title }}</h1>
                    </div>
                    <el-sub-menu index="1" style="margin-left: -1px">
                        <template #title>
                            <el-icon>
                                <Menu />
                            </el-icon>
                            <span>功能管理</span>
                        </template>
                        <el-menu-item index="lendlistindex" @click="navigateToPage('lendListIndex')">
                            <el-icon>
                                <Reading />
                            </el-icon>
                            {{ menuList.lendListIndex.name }}
                        </el-menu-item>
                        <el-menu-item index="bookindex" @click="navigateToPage('bookIndex')">
                            <el-icon>
                                <Collection />
                            </el-icon>
                            {{ menuList.bookIndex.name }}
                        </el-menu-item>
                        <el-menu-item index="readerindex" @click="navigateToPage('readerIndex')">
                            <el-icon>
                                <Postcard />
                            </el-icon>
                            {{ menuList.readerIndex.name }}
                        </el-menu-item>
                        <el-menu-item index="typeindex" @click="navigateToPage('typeIndex')">
                            <el-icon>
                                <Document />
                            </el-icon>
                            {{ menuList.typeIndex.name }}
                        </el-menu-item>
                        <el-menu-item index="noticeindex" @click="navigateToPage('noticeIndex')">
                            <el-icon>
                                <Bell />
                            </el-icon>
                            {{ menuList.noticeIndex.name }}
                        </el-menu-item>
                        <el-menu-item index="adminindex" @click="navigateToPage('adminIndex')">
                            <el-icon>
                                <Avatar />
                            </el-icon>
                            {{ menuList.adminIndex.name }}
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="2" style="margin-left: -1px">
                        <template #title>
                            <el-icon>
                                <Histogram />
                            </el-icon>
                            <span>统计分析</span>
                        </template>
                        <el-menu-item index="statisticindex" @click="navigateToPage('statisticIndex')">
                            <el-icon>
                                <PieChart />
                            </el-icon>
                            {{ menuList.statisticIndex.name }}
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="background-color: #545c64; padding: 0">
                    <!-- 控制开关 -->
                    <el-radio-group v-model="isCollapse" @click="toggleTitle" class="control-btn">
                        <el-radio-button :label="false" v-if="isCollapse">
                            <el-icon size="28" color="#ffffff">
                                <Expand />
                            </el-icon>
                        </el-radio-button>
                        <el-radio-button :label="true" v-if="!isCollapse">
                            <el-icon size="28" color="#ffffff">
                                <Fold />
                            </el-icon>
                        </el-radio-button>
                    </el-radio-group>
                    <!-- 右侧的menu -->
                    <span style="float: right; margin-top: 8px; margin-right: 2%">
                        <el-button type="info" :icon="Refresh" circle color="#545c64" style="margin-top: 5px" />
                        <el-button type="info" :icon="Delete" circle color="#545c64" style="margin-top: 5px" />
                        <el-button type="info" :icon="FullScreen" circle color="#545c64" style="margin-top: 5px" />
                        <!-- 下拉菜单 -->
                        <el-dropdown class="el-dropdown-cus" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
                            <el-button type="primary" style="background-color: #545c64; border: none">
                                {{ username }}
                                <el-icon class="el-icon--right" v-if="!isOpen"><arrow-down /></el-icon>
                                <el-icon class="el-icon--right" v-if="isOpen"><arrow-up /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>修改密码</el-dropdown-item>
                                    <el-dropdown-item>退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </span>
                </el-header>
                <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab"
                    @tab-click="handleTabClick">
                    <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" />
                </el-tabs>
                <!-- main -->
                <el-main class="el-main-cus">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, watchEffect } from "vue";
import router from '../router/router';
import {
    Menu,
    Histogram,
    Expand,
    Fold,
    Reading,
    Collection,
    Postcard,
    Document,
    Bell,
    Avatar,
    PieChart,
    ArrowDown,
    ArrowUp,
    Refresh,
    Delete,
    FullScreen,
} from "@element-plus/icons-vue";
//@ts-ignore
import { RouteLocationNormalizedLoaded } from 'vue-router';
const menuList = ref<Record<string, { name: string; routeName: string }>>({
    announce: {
        name: '首页',
        routeName: 'announce'
    },
    lendListIndex: {
        name: '借阅管理',
        routeName: 'lendlistindex'
    },
    bookIndex: {
        name: '图书管理',
        routeName: 'bookindex'
    },
    readerIndex: {
        name: '读者管理',
        routeName: 'readerindex'
    },
    typeIndex: {
        name: '类型管理',
        routeName: 'typeindex'
    },
    noticeIndex: {
        name: '公告管理',
        routeName: 'noticeindex'
    },
    adminIndex: {
        name: '管理员管理',
        routeName: 'adminindex'
    },
    statisticIndex: {
        name: '统计分析',
        routeName: 'statisticindex'
    },
})
const currentRouteName = ref<string | undefined>('announce');
function getRouteNameByName(tabName: string) {
    const foundPage = Object.values(menuList.value).find(item => item.name === tabName);
    return foundPage ? foundPage.routeName : null;
}
onMounted(() => {
    router.push({ name: 'announce' })
});
const isCollapse = ref(false);
const isOpen = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const title = ref("图书管理");
const username = ref("admin");
const showTitle = ref(true);

watch(showTitle, (val) => {
    if (!val) {
        title.value = "";
    } else {
        title.value = "图书管理";
    }
});

function toggleTitle() {
    showTitle.value = !showTitle.value;
}

function navigateToPage(pageIndex: string) {
    console.log("NTP", pageIndex);
    const pages = menuList.value as {
        [key: string]: { name: string; routeName: string };
    };

    console.log(pages.hasOwnProperty(pageIndex));
    if (pages.hasOwnProperty(pageIndex)) {
        const page = pages[pageIndex];
        addTab(page.name);
        router.push({ name: page.routeName });
    }
}
function toIndex() {
    router.push({ name: 'announce' });
    addTab('首页');
    setActiveTab('首页');
}

// tabs标签
let tabIndex = 2
const editableTabsValue = ref('nihao')
const editableTabs = ref([
    {
        title: '首页',
        name: '1',
    },
])

const addTab = (targetName: string) => {
    // 检查是否存在相同名称的标签页
    const tabExists = editableTabs.value.some((tab) => tab.title === targetName);

    if (!tabExists) {
        const newTabName = `${++tabIndex}`;
        editableTabs.value.push({
            title: targetName,
            name: newTabName,
        });
        editableTabsValue.value = newTabName;
    }
}
const removeTab = (targetName: string) => {
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
        tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    activeName = nextTab.name
                }
            }
        })
    }

    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
// 在路由切换时，根据路由名称激活相应的 tab
router.afterEach((to: RouteLocationNormalizedLoaded) => {
    const tabName = Object.values(menuList.value).find(item => item.routeName === to.name)?.name;
    if (tabName) {
        setActiveTab(tabName);
    }
    currentRouteName.value = tabName;
});

function setActiveTab(tabName: string) {
    // 找到对应的 tab 并激活
    const targetTab = editableTabs.value.find(tab => tab.title === tabName);
    if (targetTab) {
        editableTabsValue.value = targetTab.name;
    } else {
        console.error(`找不到标签 "${tabName}" 对应的tab。`);
    }
}

// 监听路由变化，更新 currentRouteName
watchEffect(() => {
    if (router.currentRoute.value.name) {
        currentRouteName.value = router.currentRoute.value.name as string;
    }
});
//点击对应tab切换路由
function handleTabClick(tab: { props: { label: string } }) {
    const tabName = tab?.props.label; // 获取标签名称
    const routeName = getRouteNameByName(tabName);
    console.log('Tab Name:', tabName);
    console.log('Route Name:', routeName);
    if (routeName) {
        router.push({ name: routeName });
        // 更新当前选中的标签
        editableTabsValue.value = tabName;
        // 更新当前路由名称
        currentRouteName.value= routeName;
        // 更新左侧菜单的激活状态
        const menuItem = document.querySelector(`.el-menu-item[index='${routeName}']`);
        if (menuItem) {
            menuItem.classList.add('is-active');
        }
    }
}

</script>

<style>
.logo-box-cus {
    width: auto;
    height: 60px;
    background-color: #3f4852;
    cursor: pointer;
}

.icon-cus {
    width: 40px;
    height: 40px;
    padding-left: 12.5px;
    padding-top: 10px;
}

.el-main-cus {
    padding: 20px;
}

.el-dropdown-cus {
    margin-top: 5px;
    margin-left: 10px;
}

.el-button:focus-visible {
    outline: 0;
    outline-offset: 1px;
}

.el-dropdown-cus:hover {
    border: none;
}

.example-showcase .el-dropdown+.el-dropdown {
    margin-left: 15px;
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.control-btn {
    padding: 0;
    margin-top: 15px;
    margin-left: 15px;
}

.el-radio-button__inner {
    width: 28px;
    height: 28px;
    padding: 0;
    margin: 0;
    background-color: transparent;
    border: none;
}

.title-h1 {
    display: inline-block;
    color: #ffffff;
    font-weight: 600;
    font-size: 20px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    font-weight: bold;
    margin: 0;
    position: absolute;
    top: 2%;
    left: 35%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-radio-button:first-child:last-child .el-radio-button__inner {
    border: none;
}

.el-radio-button:hover {
    background-color: #394247;
}
</style>

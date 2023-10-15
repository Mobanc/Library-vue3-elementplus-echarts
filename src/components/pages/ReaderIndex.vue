<template>
    <div v-for="(shadow, i) in shadowGroup" :key="i" class="main-box-cus">
        <!-- 搜索栏 -->
        <div class="shadow-box" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }">
            <div class="search-container">
                <div class="input-group">
                    <span class="label">图书卡号</span>
                    <el-input v-model="searchFilters.bCard" class="el-input-cus"></el-input>
                </div>
                <div class="input-group">
                    <span class="label">用户名名</span>
                    <el-input v-model="searchFilters.username" class="el-input-cus"></el-input>
                </div>
                <div class="input-group">
                    <span class="label">电话</span>
                    <el-input v-model="searchFilters.tel" class="el-input-cus"></el-input>
                </div>
                <div>
                    <el-button type="success">搜索</el-button>
                </div>
            </div>
        </div>
        <div style="display: flex; margin-top: 10px; background-color: #f4f4f5; padding: 10px; width:98.5%;">
            <el-button type="primary" class="btn-cus" @click="dialog = true">添加</el-button>
            <el-button type="danger" class="btn-cus">删除</el-button>
            <div style="position: absolute; left :85%; display:flex">
                <el-button :icon="Finished" style="width: 30px;" />
                <el-button :icon="FolderOpened" style="width: 30px;" />
                <el-button :icon="Printer" style="width: 30px;" />
                <el-button :icon="InfoFilled" style="width: 30px;" />
            </div>
        </div>
        <!-- 表格栏 -->
        <el-table :data="displayedTableData" style="width: 100%" class="el-table-cus">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="cId" label="读者卡号" width="150" />
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="realName" label="真实姓名" width="120" />
            <el-table-column prop="sex" label="性别" width="80" />
            <el-table-column prop="tel" label="电话" width="120" />
            <el-table-column prop="createCardTime" label="办卡时间" width="240" />
            <el-table-column prop="email" label="邮箱" width="360" />
            <el-table-column fixed="right" label="操作" width="140">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="handleEdit(row)">修改</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <div class="demo-pagination-block">
            <!-- 此处可将盒子打开以输入文字 -->
            <div class="demonstration" />
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[5, 10, 15, 20, 25, 30]" :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total=totalDataNumber @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
    <!-- 左侧抽屉 -->
    <el-drawer ref="drawerRef" v-model="dialog" title="添加读者" :before-close="handleClose" direction="ltr" class="demo-drawer"
        size="70%" style="padding: 20px;">
        <div class="demo-drawer__content">
            <!-- 表单 -->
            <el-form ref="ruleFormRef" :model="addBookForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                :size="formSize" status-icon>
                <el-form-item label="读者卡号" prop="cId">
                    <el-input v-model="addBookForm.cId" placeholder="请输入图书名称" />
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addBookForm.username" placeholder="请输入图书编号" />
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="addBookForm.realName" placeholder="请输入图书编号" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addBookForm.sex">
                        <el-radio label="男" />
                        <el-radio label="女" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                    <el-date-picker v-model="addBookForm.birth" type="date" style="width: 100%" />
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="addBookForm.tel" />
                </el-form-item>
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="addBookForm.email" />
                </el-form-item>
                <el-form-item>
                    <!-- 按钮 -->
                    <el-button @click="cancelForm">关闭</el-button>
                    <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">{{
                        loading ? '保存中 ...' : '确认保存'
                    }}</el-button>
                    <el-button @click="resetForm(ruleFormRef)">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
    <!-- 右侧抽屉 -->
    <el-drawer ref="rightDrawerRef" v-model="rightDialog" title="修改图书信息" :before-close="onRightDrawerClose" direction="rtl"
        class="demo-drawer" size="70%" style="padding: 20px;">
        <!-- 右侧抽屉内容 -->
        <div class="demo-drawer__content">
            <el-form ref="rightRuleFormRef" :model="rightAddBookForm" :rules="rules" label-width="120px"
                class="demo-ruleForm" :size="formSize" status-icon>
                <el-form-item label="读者卡号" prop="cId">
                    <el-input v-model="rightAddBookForm.cId" placeholder="请输入图书名称" />
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="rightAddBookForm.username" placeholder="请输入图书编号" />
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="rightAddBookForm.realName" placeholder="请输入图书编号" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="rightAddBookForm.sex">
                        <el-radio label="男" />
                        <el-radio label="女" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                    <el-date-picker v-model="rightAddBookForm.birth" type="date" style="width: 100%" />
                </el-form-item>
                <el-form-item label="联系方式" prop="tel">
                    <el-input v-model="rightAddBookForm.tel" />
                </el-form-item>
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="rightAddBookForm.email" />
                </el-form-item>
                <el-form-item>
                    <!-- 按钮 -->
                    <el-button @click="cancelRightForm">关闭</el-button>
                    <el-button type="primary" :loading="rightLoading" @click="submitRightForm(rightRuleFormRef)">{{
                        rightLoading ? '保存中 ...' : '保存' }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>
  
<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { Finished, FolderOpened, InfoFilled, Printer } from "@element-plus/icons-vue";
import { ElTable, ElDrawer, ElMessageBox, FormInstance, FormRules } from 'element-plus'
// 搜索功能
const searchFilters = reactive({
    bCard: '',
    username: '',
    tel: '',
});

// 左侧弹窗
const rules = reactive<FormRules<TableItem>>({
    cId: [
        {
            required: true,
            message: '请输入卡ID',
            trigger: 'blur'
        }
    ],
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        }
    ],
    realName: [
        {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
        }
    ],
    sex: [
        {
            required: true,
            message: '请输入性别',
            trigger: 'blur'
        }
    ],
    birth: [
        {
            required: true,
            message: '请输入生日',
            trigger: 'blur'
        }
    ],
    tel: [
        {
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
        }
    ],
    email: [
        {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
        }
    ],
})
let timer: number | undefined
const dialog = ref(false)
const loading = ref(false)
const drawerRef = ref<InstanceType<typeof ElDrawer>>()
const onClick = () => {
    drawerRef.value!.close()
}

const handleClose = (done: () => void) => {
    if (loading.value) {
        return
    }
    ElMessageBox.confirm('您需要提交吗?')
        .then(() => {
            loading.value = true
            timer = setTimeout(() => {
                done()
                // 动画关闭需要一定的时间
                setTimeout(() => {
                    loading.value = false
                }, 400)
            }, 1000)
        })
        .catch(() => {
            // catch error
        })
}

const cancelForm = () => {
    loading.value = false
    dialog.value = false
    clearTimeout(timer)
}
// 右侧弹窗
// 右侧抽屉特定的数据和函数
const rightDialog = ref(false);
const rightLoading = ref(false);
const rightDrawerRef = ref<InstanceType<typeof ElDrawer>>();

const onRightDrawerClose = (done: () => void) => {
    if (rightLoading.value) {
        return;
    }
    ElMessageBox.confirm('确定要提交吗？')
        .then(() => {
            rightLoading.value = true;
            timer = setTimeout(() => {
                done();
                setTimeout(() => {
                    rightLoading.value = false;
                }, 400);
            }, 1000);
        })
        .catch(() => {
            // 处理错误
        });
};

const cancelRightForm = () => {
    rightLoading.value = false;
    rightDialog.value = false;
    clearTimeout(timer);
};

const submitRightForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('提交成功！');
            rightLoading.value = true;
            setTimeout(() => {
                rightDrawerRef.value!.close();
                rightLoading.value = false;
            }, 1000);
        } else {
            console.log('提交错误！', fields);
        }
    });
};
// 弹窗表单
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const rightRuleFormRef = ref<FormInstance>()
const addBookForm = reactive<TableItem>({
    cId: '',
    username: '',
    realName: '',
    sex: '',
    tel: '',
    createCardTime: '',
    email: '',
    birth: ''
})
const rightAddBookForm = reactive<TableItem>({
    cId: '',
    username: '',
    realName: '',
    sex: '',
    tel: '',
    createCardTime: '',
    email: '',
    birth: ''
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            loading.value = true;
            setTimeout(() => {
                onClick();
                loading.value = false;  // 关闭 loading
            }, 1000);  // 1秒后关闭对话框
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
// 修改按钮
const handleEdit = (row: { cId: string; username: string; realName: string; sex: string; tel: string; createCardTime: string; email: string; birth: string; }) => {
    console.log('Row Data:', row);
    // 将当前行的数据填充到抽屉表单
    rightAddBookForm.cId = row.cId;
    rightAddBookForm.username = row.username;
    rightAddBookForm.realName = row.realName;
    rightAddBookForm.sex = row.sex;
    rightAddBookForm.tel = row.tel; 
    rightAddBookForm.createCardTime = row.createCardTime;
    rightAddBookForm.email = row.email;
    rightAddBookForm.birth = row.birth;

    // 打开抽屉
    rightDialog.value = true;
}

// 分页栏
const currentPage = ref(1)
const pageSize = ref(5)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
interface TableItem {
    cId: string,
    username: string,
    realName: string,
    sex: string,
    tel: string,
    createCardTime: string,
    email: string,
    birth: string
}
const tableData: TableItem[] = [
    {
        cId: '20300126518001',
        username: 'Mobanc',
        realName: '老莫',
        sex: '男',
        tel: '13535163537',
        createCardTime: '2023-09-27 12:00:32',
        email: 'helloMo@hello.com',
        birth: '1999-12-12'
    },
    {
        cId: '20300126518002',
        username: 'xxs',
        realName: '小莫',
        sex: '女',
        tel: '13535163567',
        createCardTime: '2023-09-28 15:03:31',
        email: 'helloxxs@hello.com',
        birth: '2000-06-06'
    },
    {
        cId: '20300126518003',
        username: 'dxs',
        realName: '大莫',
        sex: '男',
        tel: '13535163527',
        createCardTime: '2021-03-34 15:20:12',
        email: 'hellodxs@hello.com',
        birth: '2023-03-01'
    },

]
const totalDataNumber = ref(tableData.length); // 使用tableData的长度作为总数据个数
// 在这里，计算当前页应该显示的数据
const displayedTableData = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return tableData.slice(startIndex, endIndex);
});
//分页栏结束
const shadowGroup = ref([
    {
        name: 'Lighter Shadow',
        type: 'lighter',
    },
]);

const getCssVarName = (type: string) => {
    return `--el-box-shadow${type ? '-' : ''}${type}`;
};
</script>
  
<style scoped>
.el-table-cus {
    max-height: 475px;
    overflow-y: auto;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}

.btn-cus {
    width: 50px;
}

.el-table-cus {
    margin-top: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
}

.search-container {
    display: flex;
    align-items: center;
    gap: 20px;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 5px;
}

.label {
    white-space: nowrap;
}

.el-input-cus {
    width: 150px;
}

.m-2 {
    margin-left: 10px;
}

.main-box-cus {
    border-radius: 6px;
    margin-bottom: 10px;
}

.shadow-box {
    padding: 10px;
}
</style>
  
<template>
    <div v-for="(shadow, i) in shadowGroup" :key="i" class="main-box-cus">
        <!-- 搜索栏 -->
        <div class="shadow-box" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }">
            <div class="search-container">
                <div class="input-group">
                    <span class="label">类型名称</span>
                    <el-input v-model="searchFilters.type" class="el-input-cus"></el-input>
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
            <el-table-column prop="type" label="类型名称" width="240" />
            <el-table-column prop="content" label="备注" width="1000" />
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
    <!-- 添加弹窗 -->
    <el-dialog v-model="dialog" title="添加类型" :before-close="onDialogClose">
        <div>
            <!-- 表单 -->
            <el-form ref="ruleFormRef" :model="addBookForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                :size="formSize" status-icon>
                <el-form-item label="类型名称" prop="type">
                    <el-input v-model="addBookForm.type" placeholder="请输入类型名称" />
                </el-form-item>
                <el-form-item label="备注信息" prop="username">
                    <el-input v-model="addBookForm.content" placeholder="请输入备注信息" type="textarea" />
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
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog v-model="rightDialog" title="修改类型" :before-close="onRightDialogClose">
        <div>
            <el-form ref="rightRuleFormRef" :model="rightAddBookForm" :rules="rules" label-width="120px"
                class="demo-ruleForm" :size="formSize" status-icon>
                <el-form-item label="类型名称" prop="type">
                    <el-input v-model="rightAddBookForm.type" placeholder="请输入类型名称" />
                </el-form-item>
                <el-form-item label="备注信息" prop="username">
                    <el-input v-model="rightAddBookForm.content" placeholder="请输入备注信息" type="textarea" />
                </el-form-item>
                <el-form-item>
                    <!-- 按钮 -->
                    <el-button @click="cancelRightForm">关闭</el-button>
                    <el-button type="primary" :loading="rightLoading" @click="submitRightForm(rightRuleFormRef)">{{
                        rightLoading ? '保存中 ...' : '保存' }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { Finished, FolderOpened, InfoFilled, Printer } from "@element-plus/icons-vue";
import { ElTable, ElDialog, ElMessageBox, FormInstance, FormRules } from 'element-plus'
// 搜索功能
const searchFilters = reactive({
    type: '',
});

// 左侧弹窗
const rules = reactive<FormRules<TableItem>>({
    type: [
        {
            required: true,
            message: '请输入图书类型',
            trigger: 'blur'
        }
    ],
})
let timer: number | undefined
const dialog = ref(false)
const loading = ref(false)


const cancelForm = () => {
    loading.value = false
    dialog.value = false
    clearTimeout(timer)
}
// 右侧弹窗
// 右侧抽屉特定的数据和函数
const rightDialog = ref(false);
const rightLoading = ref(false);
const onDialogClose = (done: () => void) => {
    if (loading.value) {
        return;
    }
    ElMessageBox.confirm('确定要提交吗？')
        .then(() => {
            loading.value = true;
            timer = setTimeout(() => {
                done();
                setTimeout(() => {
                    loading.value = false;
                }, 400);
            }, 1000);
        })
        .catch(() => {
            // 处理错误
        });
};
const onRightDialogClose = (done: () => void) => {
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
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('提交成功！');
            loading.value = true;
            setTimeout(() => {
                loading.value = false;
                dialog.value = false;
            }, 1000);
        } else {
            console.log('提交错误！', fields);
        }
    });
};

const submitRightForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('提交成功！');
            rightLoading.value = true;
            setTimeout(() => {
                rightLoading.value = false;
                rightDialog.value = false;
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
    type: '',
    content: ''
})
const rightAddBookForm = reactive<TableItem>({
    type: '',
    content: ''
})

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
// 修改按钮
const handleEdit = (row: { type: string; content: string; }) => {
    console.log('Row Data:', row);
    // 将当前行的数据填充到抽屉表单
    rightAddBookForm.type = row.type;
    rightAddBookForm.content = row.content;

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
    type: string,
    content: string
}
const tableData: TableItem[] = [
    {
        type: '文学类',
        content: '陶冶情操'
    },
    {
        type: '历史类',
        content: '了解历史文化'
    },
    {
        type: '工学类',
        content: '造火箭'
    },
    {
        type: '法学类',
        content: '学习法律，打官司'
    },
    {
        type: '经济学类',
        content: '搞经济'
    },
    {
        type: '统计学类',
        content: '学习统计，天下无敌'
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
  
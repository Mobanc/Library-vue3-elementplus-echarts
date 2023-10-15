<template>
    <div v-for="(shadow, i) in shadowGroup" :key="i" class="main-box-cus">
        <!-- 搜索栏 -->
        <div class="shadow-box" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }">
            <div class="search-container">
                <div class="input-group">
                    <span class="label">借书卡</span>
                    <el-input v-model="searchFilters.bCard" class="el-input-cus"></el-input>
                </div>
                <div class="input-group">
                    <span class="label">图书名称</span>
                    <el-input v-model="searchFilters.bookName" class="el-input-cus"></el-input>
                </div>
                <div class="input-group">
                    <span class="label">归还类型</span>
                    <el-select v-model="searchFilters.returnType" class="m-2" placeholder="请选择">
                        <el-option v-for="item in returnType" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div class="input-group">
                    <span class="label">图书类型</span>
                    <el-select v-model="searchFilters.bookType" class="m-2" placeholder="请选择">
                        <el-option v-for="item in bookType" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div>
                    <el-button type="success">搜索</el-button>
                </div>
            </div>
        </div>
        <div style="display: flex; margin-top: 10px; background-color: #f4f4f5; padding: 10px; width:98.5%;">
            <el-button type="primary" class="btn-cus" @click="dialog = true">借书</el-button>
            <el-button type="success" class="btn-cus">还书</el-button>
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
            <el-table-column prop="bookName" label="图书名称" width="150">
                <template #default="{ row }">
                    <span style="color: #00b7ee;">{{ row.bookName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="bCard" label="借书卡" width="120" />
            <el-table-column prop="bName" label="借阅人" width="120">
                <template #default="{ row }">
                    <span style="color: #00b7ee;">{{ row.bName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="bTime" label="借阅时间" width="200" />
            <el-table-column prop="rTime" label="还书时间" width="200" />
            <el-table-column prop="rType" label="还书类型" width="600">
                <template #default="{ row }">
                    <el-tag v-if="row.rType === '0'" type="success" class="mx-1" effect="dark" size="small">
                        正常还书
                    </el-tag>
                    <el-tag v-else-if="row.rType === '1'" type="warning" class="mx-1" effect="dark" size="small">
                        延迟还书
                    </el-tag>
                    <el-tag v-else-if="row.rType === '2'" class="info" effect="dark" size="small">
                        破损还书
                    </el-tag>
                    <el-tag v-else-if="row.rType === '3'" type="danger" class="mx-1" effect="dark" size="small">
                        丢失
                    </el-tag>
                    <el-tag v-else-if="row.rType === '4'" type="success" class="mx-1" effect="dark" size="small">
                        在借中
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template #default>
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
    <el-drawer ref="drawerRef" v-model="dialog" title="借书管理" :before-close="handleClose" direction="ltr" class="demo-drawer"
        size="70%" style="padding: 20px;">
        <div class="demo-drawer__content">
            <!-- 表单 -->
            <el-form ref="ruleFormRef" :model="lendListForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                :size="formSize" status-icon>
                <el-form-item label="图书名称" prop="bookName">
                    <el-input v-model="lendListForm.bookName" />
                </el-form-item>
                <el-form-item label="图书列表" prop="bookList">
                    <el-table :data="bookSelectList" border style="width: 100%" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" v-model="selection" />
                        <el-table-column prop="bookId" label="图书编号" width="150" />
                        <el-table-column prop="bookType" label="图书类型" width="150" />
                        <el-table-column prop="bookName" label="图书名称" width="180" />
                        <el-table-column prop="author" label="作者" width="100" />
                        <el-table-column prop="price" label="价格" width="100" />
                        <el-table-column prop="language" label="语言" />
                    </el-table>
                </el-form-item>
                <el-form-item label="借书卡号" prop="cardId">
                    <el-input v-model="lendListForm.cardId" />
                </el-form-item>
                <el-form-item>
                    <!-- 按钮 -->
                    <el-button @click="cancelForm">关闭</el-button>
                    <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)">{{
                        loading ? '保存中 ...' : '保存'
                    }}</el-button>
                    <el-button @click="resetForm(ruleFormRef)">清空</el-button>
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
    bookName: '',
    returnType: '',
    bookType: ''
});

// 左侧弹窗
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
// 弹窗表单
interface LendListForm {
    bookName: string
    bookList: [
        {
            bookId: string,
            bookType: string,
            bookName: string,
            author: string,
            price: string,
            language: string,
        }
    ]
    cardId: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const lendListForm = reactive<LendListForm>({
    bookName: '',
    bookList: [
        {
            bookId: '',
            bookType: '',
            bookName: '',
            author: '',
            price: '',
            language: '',
        }
    ],
    cardId: ''
})

const rules = reactive<FormRules<LendListForm>>({
    bookName: [
        {
            required: true, message: '请输入书名', trigger: 'blur'
        },
        // {
        //     min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'
        // },
    ],
    bookList: [
        {
            type: 'array',
            required: true,
            message: '请选择至少一本书',
            trigger: 'change',
        },
    ],
    cardId: [
        {
            required: true,
            message: '请输入卡号',
            trigger: 'change',
        },
    ],
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
const bookSelectList = [
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
    },
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
    },
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
    },
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
    },
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
    },
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
    },

]
const selection = ref([]); 

const handleSelectionChange = (selectedItems:
    [{
        bookId: string;
        bookType: string;
        bookName: string;
        author: string;
        price: string;
        language: string;
    }]) => {
    lendListForm.bookList = selectedItems; 
};
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
    bookName: string;
    bCard: string;
    bName: string;
    bTime: string;
    rTime: string;
    rType: string;
    bookType: string; 
}
const tableData: TableItem[] = [
    //0 正常还书 1 延迟还书 2 破损还书 3 丢失 4 在借中
    {
        bookName: '三国演义',
        bCard: '1000002201',
        bName: '张三',
        bTime: '2023-10-01 19:00:11',
        rTime: '2023-10-02 19:01:31',
        rType: '0',
        bookType: 'null',
    },
    {
        bookName: '水浒传',
        bCard: '1000002211',
        bName: '张三',
        bTime: '2023-10-01 19:00:11',
        rTime: '2023-10-02 19:01:31',
        rType: '1',
        bookType: 'null',
    },
    {
        bookName: '红楼梦',
        bCard: '1000002203',
        bName: '张三',
        bTime: '2023-10-01 19:00:11',
        rTime: '2023-10-02 19:01:31',
        rType: '2',
        bookType: 'null',
    },
    {
        bookName: '西游记',
        bCard: '1000002206',
        bName: '张三',
        bTime: '2023-10-01 19:00:11',
        rTime: '2023-10-02 19:01:31',
        rType: '3',
        bookType: 'null',
    },
    {
        bookName: '西游记',
        bCard: '1000002206',
        bName: '张三',
        bTime: '2023-10-01 19:00:11',
        rTime: '2023-10-02 19:01:31',
        rType: '4',
        bookType: 'null',
    },
    {
        bookName: '红楼梦3',
        bCard: '1000002203',
        bName: '张三',
        bTime: '2023-10-01 19:00:11',
        rTime: '2023-10-02 19:01:31',
        rType: '2',
        bookType: 'null',
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


const returnType = [
    {
        value: 'Option1',
        label: '全部',
    },
    {
        value: 'Option2',
        label: '延迟还书',
    },
    {
        value: 'Option3',
        label: '延迟还书',
    },
    {
        value: 'Option4',
        label: '破损还书',
    },
    {
        value: 'Option5',
        label: '丢失',
    },
];
const bookType = [
    {
        value: 'Option1',
        label: '全部',
    },
    {
        value: 'Option2',
        label: '未借出',
    },
    {
        value: 'Option3',
        label: '在借中',
    },
];
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
  
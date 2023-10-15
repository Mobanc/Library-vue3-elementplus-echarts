<template>
    <div v-for="(shadow, i) in shadowGroup" :key="i" class="main-box-cus">
        <!-- 搜索栏 -->
        <div class="shadow-box" :style="{ boxShadow: `var(${getCssVarName(shadow.type)})` }">
            <div class="search-container">
                <div class="input-group">
                    <span class="label">图书编号</span>
                    <el-input v-model="searchFilters.bookId" class="el-input-cus"></el-input>
                </div>
                <div class="input-group">
                    <span class="label">书名</span>
                    <el-input v-model="searchFilters.bookName" class="el-input-cus"></el-input>
                </div>
                <div class="input-group">
                    <span class="label">图书分类</span>
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
            <el-table-column prop="bookId" label="图书编号" width="200" />
            <el-table-column prop="bookName" label="图书名称" width="150" />
            <el-table-column prop="bookType" label="图书类型" width="150" />
            <el-table-column prop="author" label="作者" width="150" />
            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column prop="language" label="语言" width="360" />
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
    <el-drawer ref="drawerRef" v-model="dialog" title="添加图书" :before-close="handleClose" direction="ltr" class="demo-drawer"
        size="70%" style="padding: 20px;">
        <div class="demo-drawer__content">
            <!-- 表单 -->
            <el-form ref="ruleFormRef" :model="addBookForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                :size="formSize" status-icon>
                <el-form-item label="图书名称" prop="bookName">
                    <el-input v-model="addBookForm.bookName" placeholder="请输入图书名称" />
                </el-form-item>
                <el-form-item label="图书编号" prop="bookId">
                    <el-input v-model="addBookForm.bookId" placeholder="请输入图书编号" />
                </el-form-item>
                <el-form-item label="图书类别" prop="bookType">
                    <el-input v-model="addBookForm.bookType" placeholder="请选择" />
                </el-form-item>
                <el-form-item label="图书作者" prop="author">
                    <el-input v-model="addBookForm.author" />
                </el-form-item>
                <el-form-item label="图书出版社" prop="publish">
                    <el-input v-model="addBookForm.publish" />
                </el-form-item>
                <el-form-item label="图书语言" prop="language">
                    <el-input v-model="addBookForm.language" />
                </el-form-item>
                <el-form-item label="图书价格" prop="price">
                    <el-input v-model="addBookForm.price" />
                </el-form-item>
                <el-form-item label="出版日期" prop="date">
                    <el-date-picker v-model="addBookForm.date" type="date" />
                </el-form-item>
                <el-form-item label="图书介绍" prop="introduce">
                    <el-input v-model="addBookForm.introduce" type="textarea" placeholder="请输入介绍信息" />
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
    <!-- 右侧抽屉 -->
    <el-drawer ref="rightDrawerRef" v-model="rightDialog" title="添加图书" :before-close="onRightDrawerClose" direction="rtl"
        class="demo-drawer" size="70%" style="padding: 20px;">
        <!-- 右侧抽屉内容 -->
        <div class="demo-drawer__content">
            <el-form ref="rightRuleFormRef" :model="rightAddBookForm" :rules="rules" label-width="120px"
                class="demo-ruleForm" :size="formSize" status-icon>
                <el-form-item label="图书名称" prop="bookName">
                    <el-input v-model="rightAddBookForm.bookName" placeholder="请输入图书名称" />
                </el-form-item>
                <el-form-item label="图书编号" prop="bookId">
                    <el-input v-model="rightAddBookForm.bookId" placeholder="请输入图书编号" />
                </el-form-item>
                <el-form-item label="图书类别" prop="bookType">
                    <el-input v-model="rightAddBookForm.bookType" placeholder="请选择" />
                </el-form-item>
                <el-form-item label="图书作者" prop="author">
                    <el-input v-model="rightAddBookForm.author" />
                </el-form-item>
                <el-form-item label="图书出版社" prop="publish">
                    <el-input v-model="rightAddBookForm.publish" />
                </el-form-item>
                <el-form-item label="图书语言" prop="language">
                    <el-input v-model="rightAddBookForm.language" />
                </el-form-item>
                <el-form-item label="图书价格" prop="price">
                    <el-input v-model="rightAddBookForm.price" />
                </el-form-item>
                <el-form-item label="出版日期" prop="date">
                    <el-date-picker v-model="rightAddBookForm.date" type="date" />
                </el-form-item>
                <el-form-item label="图书介绍" prop="introduce">
                    <el-input v-model="rightAddBookForm.introduce" type="textarea" placeholder="请输入介绍信息" />
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
    bookId: '',
    bookName: '',
    bookType: '',
});

// 左侧弹窗
const rules = reactive<FormRules<TableItem>>({
    bookName: [
        {
            required: true,
            message: '请输入图书名称',
            trigger: 'blur'
        }
    ],
    bookId: [
        {
            required: true,
            message: '请输入图书标号',
            trigger: 'blur'
        }
    ],
    bookType: [
        {
            required: true,
            message: '请输入图书类别',
            trigger: 'blur'
        }
    ],
    author: [
        {
            required: true,
            message: '请输入作者',
            trigger: 'blur'
        }
    ],
    publish: [
        {
            required: true,
            message: '请输入出版社',
            trigger: 'blur'
        }
    ],
    language: [
        {
            required: true,
            message: '请输入图书语言',
            trigger: 'blur'
        }
    ],
    price: [
        {
            required: true,
            message: '请输入价格',
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
    bookName: '',
    bookId: '',
    bookType: '',
    author: '',
    publish: '',
    language: '',
    price: '',
    date: '',
    introduce: ''

})
const rightAddBookForm = reactive<TableItem>({
    bookName: '',
    bookId: '',
    bookType: '',
    author: '',
    publish: '',
    language: '',
    price: '',
    date: '',
    introduce: ''

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
const handleEdit = (row: { bookName: string; bookId: string; bookType: string; author: string; publish: string; language: string; price: string; date: string; introduce: string; }) => {
    console.log('Row Data:', row);
    // 将当前行的数据填充到抽屉表单
    rightAddBookForm.bookName = row.bookName;
    rightAddBookForm.bookId = row.bookId;
    rightAddBookForm.bookType = row.bookType;
    rightAddBookForm.author = row.author;
    rightAddBookForm.publish = row.publish; 
    rightAddBookForm.language = row.language; 
    rightAddBookForm.price = row.price; 
    rightAddBookForm.date = row.date; 
    rightAddBookForm.introduce = row.introduce; 

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
    bookName: string,
    bookId: string,
    bookType: string,
    author: string,
    publish: string,
    language: string,
    price: string,
    date: string,
    introduce: string
}
const tableData: TableItem[] = [
    {
        bookId: '1000001',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
        publish: 'aaa',
        date: '2020-03-01',
        introduce: ''
    },
    {
        bookId: '1000002',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '43',
        language: '中文',
        publish: 'bbb',
        date: '',
        introduce: ''
    },
    {
        bookId: '1000003',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
        publish: 'ccc',
        date: '',
        introduce: ''
    },
    {
        bookId: '1000004',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
        publish: 'ddd',
        date: '',
        introduce: ''
    },
    {
        bookId: '1000005',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
        publish: 'eee',
        date: '',
        introduce: ''
    },
    {
        bookId: '1000006',
        bookType: '文学类',
        bookName: '西游记',
        author: '施耐庵',
        price: '42',
        language: '中文',
        publish: 'fff',
        date: '',
        introduce: ''
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


const bookType = [
    {
        value: 'Option1',
        label: '全部',
    },
    {
        value: 'Option2',
        label: '文学类',
    },
    {
        value: 'Option3',
        label: '历史类',
    },
    {
        value: 'Option4',
        label: '工学类',
    },
    {
        value: 'Option5',
        label: '法学类',
    },
    {
        value: 'Option6',
        label: '经济学类',
    },
    {
        value: 'Option7',
        label: '统计学类',
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
  
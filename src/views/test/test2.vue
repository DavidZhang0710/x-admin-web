<template>
    <div>
        <!-- 搜索栏 -->
        <el-card id="search">
            <el-row>
                <el-input v-model="searchModel.userId" placeholder="用户ID"></el-input>
                <el-input v-model="searchModel.id" placeholder="记录ID"></el-input>
                <el-input v-model="searchModel.fileName" placeholder="图片文件名"></el-input>
                <el-button @click="getRecordList" type="primary" round icon="el-icon-search">搜索</el-button>
            </el-row>
        </el-card>

        <!-- 查询结果 -->
        <el-card id="result">
            <template>
                <el-table :data="recordList" stripe style="width: 100%">
                    <el-table-column label="#" width="80">
                        <template slot-scope="scope">
                            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="记录ID" width="120">
                    </el-table-column>
                    <el-table-column prop="userId" label="用户ID" width="120">
                    </el-table-column>
                    <el-table-column prop="fileName" label="图片文件名" width="120">
                    </el-table-column>
                    <el-table-column prop="time" label="时间" width="180">
                    </el-table-column>
                    <el-table-column prop="result" label="结果">
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button @click="deleteRecord(scope.row)" type="danger" icon="el-icon-delete" size="mini"
                                circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </el-card>

        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

    </div>
</template>

<script>
import recordApi from '@/api/recordManage'
export default {
    data() {
        return {
            formLabelWidth: '100px',
            total: 0,
            searchModel: {
                pageNo: 1,
                pageSize: 10
            },
            recordList: []
        }
    },
    methods: {
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize
            this.getRecordList();
        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo
            this.getRecordList();
        },
        getRecordList() {
            recordApi.getRecordList(this.searchModel).then(response => {
                this.recordList = response.data.rows;
                this.total = response.data.total;
            })
        },
        deleteRecord(record) {
            this.$confirm(`确定删除记录ID为${record.id}的记录?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                recordApi.deleteRecordById(record.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getRecordList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除操作！'
                });
            });
        }
    },
    created() {
        this.getRecordList();
    }
}
</script>

<style>
#search .el-input {
    width: 200px;
    margin-right: 10px;
}

.el-dialog el.input {
    width: 85%;
}
</style>
<template>
    <div>
        <!-- 搜索栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.username" placeholder="用户名"></el-input>
                    <el-input v-model="searchModel.telephone" placeholder="电话"></el-input>
                    <el-button @click="getUserList" type="primary" round icon="el-icon-search">搜索</el-button>
                </el-col>
                <el-col :span="4" align=right>
                    <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" circle></el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 查询结果 -->
        <el-card id="result">
            <template>
                <el-table :data="userList" stripe style="width: 100%">
                    <el-table-column label="#" width="80">
                        <template slot-scope="scope">
                            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="用户ID" width="180">
                    </el-table-column>
                    <el-table-column prop="username" label="用户名" width="180">
                    </el-table-column>
                    <el-table-column prop="telephone" label="电话" width="180">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="180">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status == 1">正常</el-tag>
                            <el-tag v-if="scope.row.status == 0" type="danger">异常</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="电子邮箱">
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"
                                circle></el-button>
                            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini"
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

        <!-- 用户编辑对话框 -->
        <el-dialog @close="closeForm" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="userForm" ref="userFormRef" :rules="rules">
                <el-form-item label="用户名" prop='username' :label-width="formLabelWidth">
                    <el-input v-model="userForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="userForm.id == null || userForm.id == undefined" label="密码" prop='password'
                    :label-width="formLabelWidth">
                    <el-input type=password v-model="userForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop='telephone' :label-width="formLabelWidth">
                    <el-input v-model="userForm.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否异常" :label-width="formLabelWidth">
                    <el-switch v-model="userForm.status" active-value="1" inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="电子邮箱" prop='email' :label-width="formLabelWidth">
                    <el-input v-model="userForm.email" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveUser">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import userApi from '@/api/userManage'
export default {
    data() {
        return {
            formLabelWidth: '100px',
            userForm: {},
            dialogFormVisible: false,
            title: "",
            total: 0,
            searchModel: {
                pageNo: 1,
                pageSize: 10
            },
            userList: [],
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize
            this.getUserList();
        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo
            this.getUserList();
        },
        getUserList() {
            userApi.getUserList(this.searchModel).then(response => {
                this.userList = response.data.rows;
                this.total = response.data.total;
            })
        },
        openEditUI(id) {
            if (id == null) {
                this.title = '新增用户';
            }
            else {
                this.title = '修改用户';
                userApi.getUserById(id).then(response => {
                    this.userForm = response.data;
                })
            }
            this.dialogFormVisible = true;
        },
        closeForm() {
            this.userForm = {};
            this.$refs.userFormRef.clearValidate();
        },
        saveUser() {
            this.$refs.userFormRef.validate((valid) => {
                if (valid) {
                    userApi.saveUser(this.userForm).then(response => {
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.getUserList();
                    })
                }
                else {
                    console.log("error submit!")
                    return false;
                }
            })
        },
        deleteUser(user) {
            this.$confirm(`确定删除用户${user.username}？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                userApi.deleteUserById(user.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                this.getUserList();
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
        this.getUserList();
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
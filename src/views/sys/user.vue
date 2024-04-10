<template>
    <div>
        <!-- 搜索栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.username" placeholder="User Name"></el-input>
                    <el-input v-model="searchModel.telephone" placeholder="Telephone"></el-input>
                    <el-button @click="getUserList" type="primary" round icon="el-icon-search">Search</el-button>
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
                    <el-table-column prop="id" label="User ID" width="180">
                    </el-table-column>
                    <el-table-column prop="username" label="User Name" width="180">
                    </el-table-column>
                    <el-table-column prop="telephone" label="Telephone" width="180">
                    </el-table-column>
                    <el-table-column prop="status" label="Status" width="180">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status == 1">Enabled</el-tag>
                            <el-tag v-if="scope.row.status == 0" type="danger">Disabled</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="E-Mail">
                    </el-table-column>
                    <el-table-column label="Operation" width="180">
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
                <el-form-item label="User Name" prop='username' :label-width="formLabelWidth">
                    <el-input v-model="userForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="userForm.id == null || userForm.id == undefined" label="Password" prop='password'
                    :label-width="formLabelWidth">
                    <el-input type=password v-model="userForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Telephone" prop='telephone' :label-width="formLabelWidth">
                    <el-input v-model="userForm.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Status" :label-width="formLabelWidth">
                    <el-switch v-model="userForm.status" active-value="1" inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="E-Mail" prop='email' :label-width="formLabelWidth">
                    <el-input v-model="userForm.email" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveUser">Enter</el-button>
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
                    { required: true, message: 'Please input username', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: 'Please input telephone', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: 'Please input email', trigger: 'blur' },
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
                this.title = 'Add New User';
            }
            else {
                this.title = 'Update User';
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
            this.$confirm(`Confirm to delete User: ${user.username}?`, 'Tips', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
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
                    message: 'Delete canceled!'
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
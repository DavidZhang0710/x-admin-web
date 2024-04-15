<template>
    <div>
        <div v-if="previewImage">
            <img :src="previewImage" alt="Preview" :style="{ width: '200px', height: '150px' }">
        </div>
        <div>
            <input type="file" @change="handleFileChange">
        </div>
        <div>
            <textarea v-model="formattedJson" rows="25"></textarea>
        </div>
    </div>
</template>

<script>
import recordApi from '@/api/recordManage'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            picdata: '',
            responseData: null,
            previewImage: null,
            recordForm: {}
        }
    },
    methods: {
        handleFileChange(event) {
            const axios = require('axios');
            const file = event.target.files[0];
            this.getBytesFromFile(file)
                .then((bytes) => {
                    this.previewImage = URL.createObjectURL(file);
                    const formData = new FormData();
                    formData.append('image', bytes);
                    axios.post(`${process.env.VUE_APP_FLASK_API}/infer`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            this.responseData = response.data;
                            this.recordForm.userId = this.id;
                            this.recordForm.fileName = file.name;
                            const { pred, values } = response.data;
                            this.recordForm.result = JSON.stringify({ pred, values });
                            console.log(this.recordForm);
                            recordApi.addRecord(this.recordForm).then(response => {
                                this.$message({
                                    message: response.message,
                                    type: 'success'
                                });
                            })
                        })
                        .catch(error => {
                            // 处理错误
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error('获取字节码时发生错误:', error);
                });
        },
        getBytesFromFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const bytes = new Uint8Array(event.target.result);
                    resolve(bytes);
                };

                reader.onerror = (event) => {
                    reject(event.target.error);
                };

                reader.readAsArrayBuffer(file);
            });
        }
    },
    id: '0',
    computed: {
        formattedJson() {
            return JSON.stringify(this.responseData, null, 4);
        },
        ...mapGetters([
            'id'
        ])
    }

}
</script>

<style></style>
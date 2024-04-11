<template>
    <div>
        <div v-if="previewImage">
            <img :src="previewImage" alt="Preview">
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
export default {
    data() {
        return {
            picdata: '',
            responseData: null,
            previewImage: null,
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
                    axios.post('http://localhost:9998/infer', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            this.responseData = response.data
                            console.log(response.data);
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
    computed: {
        formattedJson() {
            return JSON.stringify(this.responseData, null, 4);
        }
    }

}
</script>

<style>
</style>
<template>
    <div>
        <el-form :model="video"  label-width="100px" class="demo-ruleForm">
            <el-col :span="12">
                <el-form-item label="视频上传">
                    <div id="videoContainer" v-if="!isShowProgress">
                        <el-button id="selectVideo" type="primary" @click="pauseUpload">选择视频<i class="el-icon-upload el-icon--right"></i></el-button>

                    </div>
                    <div v-if="isShowProgress">
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="videoProgressValue"></el-progress>
                        <img :src="options.iconsrc" class="myicon" @click="pauseUpload">
                    </div>
                </el-form-item>

                <el-form-item label="测试按钮">
                    <!-- <el-button type="primary" @click="testBtn">测试按钮</el-button> -->
                </el-form-item>
            </el-col>

            <el-col :span="12"></el-col>

        </el-form>
    </div>
</template>
<script>
    //引入组件
    // import InputTag from 'vue-input-tag';
    export default{
        data(){
            return {
                qiniuUploader:null, //七牛云上传对象变量
                videos:[],
                options:{
                    iconsrc:'暂停',
                    uploadpause:'暂停',
                    uploadstart:'上传'
                },
                video:{
                    v_title:'',
                    // v_class:2,
                    v_pic:{name:'',url:'',id:0},
                    v_tags:[],
                },
                isShowPic:false,
                videoProgressValue:0,
                isShowProgress:false,
                key:''
            }
        },
        methods: {
            pauseUpload(){
                if (this.options.iconsrc == this.options.uploadpause){
                    //如果是暂停
                    this.qiniuUploader.stop();

                    this.options.iconsrc = this.options.uploadstart; //修改图片为 开始
                }else{
                    this.qiniuUploader.start();

                    this.options.iconsrc = this.options.uploadpause;
                }
            },
            getKey(){
                let that = this
                that.$.ajax({
                    type: 'get',
                    url: this.base + 'm2c.scm/unit/suibian',
                    data: {
                        // token: sessionStorage.getItem('mToken'),
                    },
                    success: function (result) {
                        if (result.status === 200){
                            that.key = result.content
                            console.log(that.key)
                            that.getToken(that.key)
                        }
                    }
                })
                
                
            },
            getToken(n){
                let that = this
                console.log(0)
                that.$.ajax({
                    url: that.base + "m2c.support/upload/token",
                    type: 'GET',
                    data: {
                        fileKey:n
                    },
                    success: function (result) {
                        if (result.status === 200){
                            let uptoken = result.uptoken
                            console.log(uptoken)
                        }
                    }
                });
            }
        },
        mounted(){
            var that = this
            that.getKey()
            console.log(that.key)
            var qiniuUploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
            // uptoken: getSStorageInfo("uptoken"), //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            // uptoken_url:__webappserverUrl__ + "/third/file/getUploadToken",
            uptoken_func: function (file) {    // 在需要获取 uptoken 时，该方法会被调用
                // do something
                let uptoken = ""
                let url = that.base + "m2c.support/upload/token"
                that.$.ajax({
                    url: url,
                    type: 'GET',
                    data: {
                        fileKey:that.key
                    },
                    success: function (result) {
                        if (result.status === 200){
                            uptoken = result.uptoken
                        }
                    }
                });
                return uptoken
            },
            filters: {
                mime_types: [
                    {title: "视频文件", extensions: "mp4"}, // 限定mp4后缀上传
                ]
            },//文件类型过滤，这里限制为图片类型
            domain: 'http://dl.m2c2017.com',   //bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
            container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '30mb',           //最大文件体积限制
            // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
            max_retries: 3,                   //上传失败最大重试次数
            dragdrop: true,                   //开启可拖曳上传
            drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                //分块上传时，每片的体积
            auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后,处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                        // 每个文件上传前,处理相关的事情
                         that.isShowProgress = true
                },
                'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                },
                'FileUploaded': function(up, file, info) {
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        // var domain = up.getOption('domain');
                        // var res = parseJSON(info.response);
                        // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                },
                'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                },
                'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效

                    var key = "";
                    key = that.key
                    // do something with key here
                    return key
                }
            }
          });
        },
        components:{
            // 'input-tag':InputTag, //注册组件
        }
    }
</script>

<style lang="scss" scoped>
.myicon{width: 40px;cursor: pointer;}
</style>

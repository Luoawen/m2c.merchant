<template>
    <div>
        <el-form label-width="100px" class="demo-ruleForm">
            <el-col :span="12">
                <el-form-item label="视频上传">
                    <div id="videoContainer" v-if="!isShowProgress">
                        <el-button id="selectVideo" type="primary">选择视频<i class="el-icon-upload el-icon--right"></i></el-button>
                    </div>
                    <div v-if="isShowProgress">
                        <!-- <el-progress :text-inside="true" :stroke-width="18" :percentage="videoProgressValue"></el-progress> -->
                        <img :src="options.iconsrc" class="myicon" @click="pauseUpload">
                    </div>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                qiniuUploader:null, //七牛云上传对象变量
                options:{
                    iconsrc:'http://dl.m2c2017.com/1head/20171122/RL8p135114.jpg',
                    uploadpause:'http://dl.m2c2017.com/1head/20171122/RL8p135114.jpg',
                    uploadstart:'http://dl.m2c2017.com/1head/20171123/htAS100043.jpg'
                },
                isShowProgress:false,
                key:''
            }
        },
        methods: {
            pauseUpload(){
                if (this.options.iconsrc == this.options.uploadpause){
                    //如果是暂停
                    this.qiniuUploader.stop()
                    this.options.iconsrc = this.options.uploadstart //修改图片为 开始
                }else{
                    this.qiniuUploader.start()
                    this.options.iconsrc = this.options.uploadpause
                }
            },
            initUpload(){
                let that = this
                that.qiniuUploader = new QiniuJsSDK().uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'selectVideo',       //上传选择的点选按钮，**必需**
                    // uptoken: getSStorageInfo("uptoken"), //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // uptoken_url:__webappserverUrl__ + "/third/file/getUploadToken",
                    uptoken_func: function (file) {    // 在需要获取 uptoken 时，该方法会被调用
                        // do something
                        let uptoken = ""
                        that.$.ajax({
                            type: 'get',
                            async:false,
                            url: that.base + 'm2c.scm/unit/suibian',
                            success: function (result) {
                                if (result.status === 200){
                                    that.key = result.content
                                    that.$.ajax({
                                        url: that.base + "m2c.support/upload/token",
                                        type: 'GET',
                                        async:false,
                                        data: {
                                            fileKey:that.key
                                        },
                                        success: function (result) {
                                            uptoken = result.uptoken
                                        }
                                    })
                                }
                            }
                        })
                        console.log('uptoken',uptoken)
                        return uptoken
                    },
                    filters: {
                        mime_types: [
                            {title: "视频文件", extensions: "mp4"}, // 限定mp4后缀上传
                        ]
                    },//文件类型过滤，这里限制为图片类型
                    domain: 'http://dl.m2c2017.com',   //bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: true,  //设置上传文件的时候是否每次都重新获取新的token
                    container: 'videoContainer',           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '30mb',           //最大文件体积限制
                    //flash_swf_url: '../../../plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: true,                   //开启可拖曳上传
                    drop_element: 'videoContainer',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    unique_names: false ,
                    save_key: false,
                    init: {
                        'FilesAdded': function(up, files) {
                            // plupload.each(files, function(file) {
                            //     // 文件添加进队列后,处理相关的事情
                            // });
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
                                var domain = up.getOption('domain');
                                // console.log(info)
                                // console.log(JSON.parse(info))
                                var res = JSON.parse(info);
                                var sourceLink = domain +'/'+ res.key; //获取上传成功后的文件的Url
                                console.log(sourceLink)
                        },
                        'Error': function(up, err, errTip) {
                                //上传出错时,处理相关的事情
                        },
                        'UploadComplete': function() {
                                //队列文件处理完毕后,处理相关的事情
                                that.isShowProgress = false
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
        },
        mounted(){
            let that = this
            that.$nextTick(()=>{
                that.initUpload()
            })
            // that.initUpload()
        },
        components:{
            // 'input-tag':InputTag, //注册组件
        }
    }
</script>

<style lang="scss" scoped>
.myicon{width: 40px;cursor: pointer;}
</style>

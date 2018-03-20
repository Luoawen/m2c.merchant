<template>
  <div>
    <script id="editor" type="text/plain" style="width:100%;height:400px;"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted () {
      const _this = this
      _this.$nextTick(()=>{
        _this.editor = window.UE.getEditor('editor', _this.config) // 初始化UE
      })
    },
    methods: {
      getUEContent () { // 获取内容方法
        const that = this
        try{
          return that.editor.getContent()
        }catch(err){
          that.$nextTick(()=>{
            that.editor.addListener('ready',()=>{
              return that.editor.getContent()
            })
          })
        }
      },
      setUEContent (Msg) { // 设置内容方法
        const that = this
        try{
          return that.editor.setContent(Msg)
        }catch(err){
          that.$nextTick(()=>{
            that.editor.addListener('ready',()=>{
              return that.editor.setContent(Msg)
            })
          })
        }
        //return this.editor.setContent(Msg)
      },
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>
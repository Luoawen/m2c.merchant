<template>
  <div>
    <script id="editor" type="text/plain"></script>
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
      _this.editor = window.UE.getEditor('editor', _this.config) // 初始化UE
      _this.editor.addListener('ready', function () {
        _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
      })
    },
    methods: {
      getUEContent () { // 获取内容方法
        return this.editor.getContent()
      },
      setUEContent (Msg) { // 设置内容方法
        return this.editor.setContent(Msg)
      },
    },
    destroyed () {
      this.editor.destroy()
    }
  }
</script>
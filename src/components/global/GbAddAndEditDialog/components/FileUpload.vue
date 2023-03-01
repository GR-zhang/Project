<template>
  <div class="file-upload">
    <el-upload
      ref="uploadRef"
      
      :action="uploaderUrl"
      :data="{type: 3}"
      :headers="headers"
      :accept="accept"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :on-success="handleOnSuccess"
    >
      <el-button 
        style="margin-right: 10px;" size="mini" type="primary" :loading="loading">
        {{ syncedFileUrl ? '重新上传' : '点击上传' }}
      </el-button>
      <div slot="tip" class="el-upload__tip" style="line-height: 1.3em;">只能上传{{ accept }}格式文件，文件大小不能超过{{ this.fileSize }}MB!</div>
      
    </el-upload>
    <div v-if="syncedFileUrl" >
      {{ syncedFileUrl.split('/')[syncedFileUrl.split('/').length - 1] }}
      <i class="el-icon-delete" @click="syncedFileUrl = ''" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',

  props: {
    // 文件url
    fileUrl: {
      // type: String,
      required: true
    },
    // 文件类型
    accept: {
      type: String,
      default: '.mtl,.obj'
    },
    // 文件类型
    fileSize: {
      type: [Number, String],
      default: 20
    },
  },
  data() {
    return {
      // 上传器
      loading: false,
      uploaderUrl: `${window.__ENV__.VUE_APP_BASE_API}/api/file/file/uploadObjectOSS`,
      headers: {
        'X-Requested-Token': this.$store.getters.token
      }
    }
  },
  computed: {
    syncedFileUrl: {
      get() {
        return this.fileUrl
      },
      set(newVal) {
        this.$emit('update:fileUrl', newVal);
        this.$emit('verify');//表单主动验证
      }
    }
  },

  methods: {
    /** 上传前 */
    handleBeforeUpload (file) {
      // 限制文件格式类型
      let fileTypes = this.accept.replace(/\./g, '').split(',');
      const passFileLimit = fileTypes.includes(file.name.split('.')[1]);
      if (!passFileLimit) {
        this.$message({
          message: `只能上传${this.accept}格式文件`,
          type: 'error'
        });
        return false;
      }
      // 限制文件上传大小
      const passFileSize = file.size / 1024 / 1024 < Number(this.fileSize)
      if (!passFileSize) {
        this.$message.error(`上传文件大小不能超过${this.fileSize}MB!`);
        return false;
      }
      this.loading = true;
    },
    /** 上传成功*/
    async handleOnSuccess (res, file, fileList) {
      this.loading = false;

      if(res.code == '200') {
        this.syncedFileUrl = res.data;
        this.$message.success('文件上传成功!');
      }else {
        this.$message.error(res.msg);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
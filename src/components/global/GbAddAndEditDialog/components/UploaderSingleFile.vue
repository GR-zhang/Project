<template>
  <div>
    <div 
      class="uploader-single-file"
      :style="uploadAreaSize"
    >
      <el-upload
        v-show="!fileUrl"
        ref="uploaderRef"
        :action="uploaderUrl"
        :data="{type: 3}"
        :headers="headers"
        :accept="limit.accept"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      >
        <div 
          class="uploader-box"
          :style="uploadAreaSize"
        >
          <i class="uploader-box__icon" :class="[iconClass, iconSize]" />
        </div>
      </el-upload>

      <div 
        class="display-box wh_p100"
        v-if="fileUrl"
      >
        <el-image
          v-if="limit.isImg" class="wh_p100"
          :src="fileUrl"
          :preview-src-list="[ syncedFileUrl ]"
          :fit="imgFit" />
        <!-- 视频 -->
        <video 
          v-else class="wh_p100"
          :src="syncedFileUrl"
          controls />

        <div class="display-box__btn">
          <div :class="iconSize" class="display-box__btn--copy"
            @click="handleCopy($event)"
          >复制</div>
          <!-- 触发upload组件内部点击事件，弹出文件选择框 -->
          <div
            v-if="!disabled"
            :class="iconSize" class="display-box__btn--replace"
            @click="handleReplace"
          >替换</div>
          <div 
            v-if="!disabled"
            :class="iconSize" class="display-box__btn--del"
            @click="syncedFileUrl = ''"
          >删除</div>
        </div>
      </div>
    </div>

    <!-- 上传提示信息 -->
    <div class="el-upload__tip" style="line-height: 1.3em">{{ uploaderTip }}</div>
    <div
      v-if="ratio"
      class="el-upload__tip"
      style="line-height: 1.3em"
    >
      建议{{ limit.isImg ? '图片尺寸' : '视频比例'}}{{ ratio }}！
    </div>
  </div>
</template>

<script>
import FmHelper from '../utils/fm-helper'
import handleClipboard from '../utils/clipboard'
import { imgCompress, imgCompress_gif } from '../utils/img-compress'

/**组件说明
 * 单图片和单视频上传
*/
export default {
  name: 'UploaderSingleFile',

  props: {
    // 文件url
    fileUrl: {
      // type: String,
      required: true
    },
    // 文件类型与大小限制
    limit: {
      type: Object,
      default: () => ({
        isImg: true,
        accept: FmHelper.imgFormat,//文件类型
        // size: 2 * (1024*1024) //文件大小默认2MB
        size: 20 * (1024*1024) //文件大小默认20MB
      })
    },

    // ===== 定制上传器 =====
    // 上传区域尺寸
    uploadAreaSize: {
      type: Object,
      default: () => ({width: '298px', height: '200px'})
    },
    // 上传器icon尺寸 可选值 small | 'medium' | large
    iconSize: {
      type: String,
      default: 'medium',
      validator: (val) => {
        return ['small', 'medium', 'large'].includes(val);
      }
    },
    // 文件比例提示( 空值不展示 )
    ratio: {
      type: String,
    },
    // disabled(隐藏【替换】【删除按钮】)
    disabled: {
      type: Boolean,
      default: false,
    },

    // 当上传图片时：fit属性
    imgFit: {
      type: String,
      default: 'contain'
    },

    // ===== 业务相关 =====
    // 是否上传图片缩略图
    uploadImgThumb: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploaderUrl: `${window.__ENV__.VUE_APP_BASE_API}/api/file/file/uploadObjectOSS`,
      headers: {
        'X-Requested-Token': this.$store.getters.token
      },
      uploadLoading: false
    }
  },
  computed: {
    // prop双向数据绑定imgUrl
    syncedFileUrl: {
      get() {
        return this.fileUrl
      },
      set(newVal) {
        this.$emit('update:fileUrl', newVal);
        this.$emit('verify');//表单主动验证
      }
    },
    // 上传器提示信息
    uploaderTip() {
      return FmHelper.generateFileUploaderTip(this.limit);
    },
    // 当前上传器icon
    iconClass() {
      if(this.uploadLoading) {
        return 'el-icon-loading';
      }else {
        return this.limit.isImg ? 'el-icon-picture' : 'el-icon-video-camera-solid';
      }
    }
  },

  methods: {
    /**上传前*/
    beforeUpload(file) {
      let fileTypes = this.limit.accept.replace(/\./g, '').split(',');
      if(!fileTypes.includes(file.type.split('/')[1])) {
        this.$message.error(
          `只能上传${this.limit.accept}格式${this.limit.isImg ? '图片' : '视频'}！`
        );

        return false;
      }
      
      if(file.size > this.limit.size) {
        this.$message.error(
          `${this.limit.isImg ? '图片' : '视频'}大小不能超过${FmHelper.getSizeText(this.limit.size)}！`
        );

        return false;
      }

      this.uploadLoading = true;
    },
    /**上传成功*/
    async handleSuccess(res, file) {
      // console.log(res);
      // console.log('file', file);

      if(res.code == '200') {
        // 保存图片地址
        this.syncedFileUrl = res.data;

        // 图片小于1MB不压缩
        if(file.raw.size < 1 * (1024*1024)) {
          this.$emit('get-img-thumb', res.data);
          return;
        }

        // 上传缩略图
        if(this.uploadImgThumb) {
          let formData = new FormData();
          if(file.raw.type == 'image/gif') {
            formData.append('file', await imgCompress_gif(file.raw));
          }else {
            formData.append('file', await imgCompress(file.raw));
          }
          formData.append('type', 3);//如果还有其他参数复制就行了
          let res2 =  await this.$api.upload_single_file(formData);
          this.$emit('get-img-thumb', res2.data);
        }   
      }else {
        this.$message.error(res.msg);
      }

      await this.$nextTick();
      this.uploadLoading = false;
    },

    // 替换
    handleReplace() {
      this.$refs['uploaderRef'].$refs['upload-inner'].handleClick();
    },
    // 复制地址
    handleCopy(event) {
      handleClipboard(this.syncedFileUrl, event);
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader-single-file {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: hidden;

  .uploader-box {
    display: flex;
    justify-content: center;
    align-items: center;

    &__icon {
      font-size: 35px;
    }
    &__icon.small {
      font-size: 30px;
    }
    &__icon.large {
      font-size: 50px;
    }
  }

  .display-box {
    position: relative;

    &__btn {
      position: absolute;
      right: 0;bottom: -1px;
      border-radius: 5px 0 0 0;
      overflow: hidden;
      line-height: 1.3em; //ps：表单项有line-height属性，会影响，处理做处理

      [class*=display-box__btn--] {
        display: inline-block;
        padding: 0 3px;
        font-size: 15px;//默认15px
        line-height: 1.3em;

        color: #fff;
        cursor: pointer;
      }
      [class*=display-box__btn--].small {
        font-size: 13px;
      }
      [class*=display-box__btn--].large {
        font-size: 17px;
      }

      [class*=display-box__btn--]:hover {
        box-shadow: 0px 2px 3px -2px #000 inset;
      }
      &--copy {
        background-color: #67C23A;
      }
      &--replace {
        background-color: #909399;
      }
      &--del {
        background-color: #F56C6C;
      }
    }
  }
}

.wh_p100 {
  width: 100%;height: 100%;
}
</style>
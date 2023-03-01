<template>
  <div class="multi-tag-display">
    <template v-if="multiTagInfo[value]">
      <el-tag :type="multiTagInfo[value].tagType">
        {{ multiTagInfo[value].tagText }}
      </el-tag>
    </template>
    <template v-else>
      <el-tag type="danger">- -</el-tag>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MultiTagDisplay',
  
  props: {
    // tag字典值
    value: {
      required: true
    },
    // multitagInfo
    multiTagInfo: {
      type: Object,
      required: true
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
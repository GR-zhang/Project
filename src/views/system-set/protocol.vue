<template>
  <div class="auction-set-container">
    <protocol-page :api-func="$api.get_protocol_list" />
  </div>
</template>

<script>
import { ProtocolPage } from '@/components/business'

export default {
  name: 'Protocol',
  components: { ProtocolPage }
}
</script>

<style lang="scss" scoped>

</style>
<script setup lang="ts">
import Danger from './Danger.vue'
import Primary from './Primary.vue'
import Success from './Success.vue'
import Warning from './Warning.vue'
import { AlertType } from '@/components/form/FormAlert.vue'

const props = defineProps(['type'])
</script>

<template>
  <Danger v-if="props.type === AlertType.Danger" />
  <Primary v-else-if="props.type === AlertType.Primary" />
  <Success v-else-if="props.type === AlertType.Success" />
  <Warning v-else-if="props.type === AlertType.Warning" />
  <Primary v-else />
</template>

<style scoped lang="scss">
  .bi {
    width: 1em;
    height: 1em;
    vertical-align: -.125em;
    fill: currentcolor
  }
</style>


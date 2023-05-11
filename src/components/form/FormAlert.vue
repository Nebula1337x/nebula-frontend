<script setup lang=ts>
import { Alert } from 'bootstrap'
import { onMounted, getCurrentInstance } from 'vue'
import Icon from '@/components/form/icon/Icon.vue'

const props = defineProps(['message', 'alertType', 'onClose'])

// prevent alert to be destroyed which is default behavior when dismiss button is clicked
// instead set display to none
onMounted(() => {
  const instance = getCurrentInstance()
  const el: HTMLElement = instance?.proxy?.$el
  el.addEventListener('close.bs.alert', (evt: Event) => {
    evt.preventDefault()
    el.style.display = 'none'
  })
})
</script>

<script lang="ts">
export enum AlertType {
  Success = 'alert-success',
  Danger = 'alert-danger',
  Primary = 'alert-primary',
  Warning = 'alert-warning'
}

</script>

<template>
  <div class="alert alert-dismissible font-size-sm mt-4 mb-0" :class="alertType ? alertType : AlertType.Primary" role="alert">
    <Icon :type="alertType" />
    <div>
      <p class="m-0">{{  message  }}</p>  
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>
</template>


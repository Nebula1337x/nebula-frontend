<script setup lang="ts">
import { ref } from 'vue'
// components
import FormAlert from '@/components/form/FormAlert.vue'
import FormLoading from '@/components/form/FormLoading.vue'
// validation
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useFetch, useHandleAPIError } from '@/composables'
import { API, ErrorKeyword } from '@/const'
// i18n
import { useI18n } from 'vue-i18n'
import type { I18nOptions  } from 'vue-i18n'

const { t } = useI18n<I18nOptions>()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: Yup.object({
    email: Yup.string().required().email().label(t('fields.user.email'))
  })
})

const email = useField('email')

// state
const isFetching = ref(false)
const responseErrorMessage = ref('')
const successMessage = ref('')

function updateIsFetching(state: boolean): void {
  isFetching.value = state
}

function updateResponseErrorMessage(message: string): void {
  responseErrorMessage.value = message
}

function updateSuccessMessage(message: string): void {
  successMessage.value = message
}

const formSubmit = handleSubmit(async () => {
  updateResponseErrorMessage('')
  updateSuccessMessage('')
  updateIsFetching(true)
  
  const payload = {
    email: (email.value.value as string).trim()
  }

  const { error } = await useFetch(API.RESET_PASSWORD, false, {
    onFetchError(ctx) {
      const data = JSON.parse(ctx.data || null) || {}
      const { errorMessage } = useHandleAPIError(ctx.error, ctx.response?.status, data.keyword)
      updateResponseErrorMessage(errorMessage)
     return ctx   
    }
  })
  .post(payload)

  updateIsFetching(false)

  if (error.value) return
  
  updateSuccessMessage(t('messages.success.resetPasswordCompleted'))
})
</script>

<script lang="ts">
import { AlertType } from '@/components/form/FormAlert.vue'
</script>

<template>
  <div class="container vh-100 d-flex align-items-center justify-content-center">
    <form @submit.prevent="formSubmit">
      <h2 class="text-center mb-4">Reset Password</h2>
      <!-- email -->
      <div class="form-group">
        <label class="form-label" for="email">{{ t('fields.user.email') }}</label>
        <input id="email" class="form-control" :class="{ 'is-invalid': email.errorMessage.value }" type="text" v-model="email.value.value" autofocus>
        <span class="invalid-feedback" v-if="email.errorMessage.value">{{ email.errorMessage.value }}</span>
      </div>
      <!-- alert error-->
      <FormAlert :message="responseErrorMessage" :alert-type="AlertType.Danger" v-if="responseErrorMessage" />
      <!-- alert success -->
      <FormAlert :message="successMessage" :alert-type="AlertType.Success" v-if="successMessage" />
      <!-- btn submit -->
      <button class="btn btn-primary mt-4 w-100" :disabled="isFetching">
        {{ t('forms.resetPassword.ctaSubmit') }}
        <FormLoading v-if="isSubmitting" />
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
  form {
    width: 350px;
    max-width: 100%;
  }
</style>

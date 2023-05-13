<script setup lang="ts">
// composables
import { useFetch, useHandleAPIError } from '@/composables'
import { useLocalStorage } from '@vueuse/core'
// const
import { ApiKeyword, API, STORAGE_KEY } from '@/const'
// components
import FormAlert from '@/components/form/FormAlert.vue'
import FormLoading from '@/components/form/FormLoading.vue'
// validation
import { useField, useForm } from 'vee-validate'
import * as Yup from 'yup'
// i18n
import { useI18n } from 'vue-i18n'
import { I18nOptions } from 'vue-i18n'
// vue
import { ref } from 'vue'
// route
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n<I18nOptions>()

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: Yup.object({
    username: Yup.string().required().min(3).max(15).matches(/^[a-zA-Z0-9]+$/, `${t('fields.user.username')} ${t('validation.username')}`).label(t('fields.user.username')),
    password: Yup.string().required().min(6).label(t('fields.user.password')),
    confirmPassword: Yup
      .string()
      .required()
      .test('password-matches', `${t('fields.user.confirmPassword')} doesn't match`, function(value) {
        return this.parent.password === value
      })
      .label(t('fields.user.confirmPassword')),
    email: Yup.string().required().email().label(t('fields.user.email'))
  })
})

const username = useField('username')
const password = useField('password')
const confirmPassword = useField('confirmPassword')
const email = useField('email')

// state
const inputUsername = ref<HTMLElement | null>(null)
const inputEmail = ref<HTMLElement | null>(null)
const responseErrorMessage = ref('')

function updateResponseErrorMessage(message: string): void {
  responseErrorMessage.value = message
}

const formSubmit = handleSubmit(async () => {
  updateResponseErrorMessage('')
  
  const payload = {
    username: (username.value.value as string).trim(),
    password: (password.value.value as string).trim(),
    email: (email.value.value as string).trim() 
  }

  const { error, data } = await useFetch(API.REGISTER, false, {
    onFetchError(ctx) {
      const data = ctx.data || {}
      const { errorMessage } = useHandleAPIError(ctx.error, ctx.response?.status, data.keyword)
      updateResponseErrorMessage(errorMessage)
      if (data.keyword === ApiKeyword.UserNameTaken) inputUsername.value?.focus()
      if (data.keyword === ApiKeyword.UserEmailTaken) inputEmail.value?.focus()
     return ctx   
    }
  })
  .post(payload)
  .json()

  if (error.value) return
  
  // save user data to local storage and data store
  const responseData = data.value as ApiResponse
  
  const user = responseData.data.user
  const auth = responseData.data.auth

  const userDataStore = useUserDataStore()

  userDataStore.setUserData({
    _id: user._id,
    username: user.username,
    auth: {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken
    }
  })
  // save to local storage
  useLocalStorage(STORAGE_KEY, userDataStore.getUserData())

  // redirect to home page
  router.push('/')
})
</script>

<script lang="ts">
import { AlertType } from '@/components/form/FormAlert.vue'
import { useUserDataStore } from '@/stores'

export type ApiResponse = {
  data: {
    auth: {
      accessToken?: string | null,
      refreshToken?: string | null
    },
    user: {
      _id?: string | null,
      username?: string | null,
      email?: string | null,
      status?: boolean | null,
      isVerified?: boolean | null
    }
  }
}
</script>

<template>
  <div class="container vh-100 d-flex align-items-center justify-content-center">
    <form @submit.prevent="formSubmit">
      <h2 class="text-center mb-4">{{ t('forms.register.title') }}</h2>
      <!-- username -->
      <div class="form-group">
        <label class="form-label" for="username">{{ t('fields.user.username') }}</label>
        <input 
          ref="inputUsername"
          id="username" 
          class="form-control" 
          :class="{ 'is-invalid': username.errorMessage.value }" 
          type="text" 
          v-model="username.value.value">
        <span class="invalid-feedback" v-if="username.errorMessage.value">{{ username.errorMessage.value }}</span>
      </div>
      <!-- email -->
      <div class="form-group">
        <label class="form-label" for="email">{{ t('fields.user.email') }}</label>
        <input 
          ref="inputEmail"
          id="email" 
          class="form-control" 
          :class="{ 'is-invalid': email.errorMessage.value }" 
          type="text" 
          v-model="email.value.value">
        <span class="invalid-feedback" v-if="email.errorMessage.value">{{ email.errorMessage.value }}</span>
      </div>
      <!-- password -->
      <div class="form-group">
        <label class="form-label" for="password">{{ t('fields.user.password') }}</label>
        <input id="password" class="form-control" :class="{ 'is-invalid': password.errorMessage.value }" type="password" v-model="password.value.value">
        <span class="invalid-feedback" v-if="password.errorMessage.value">{{ password.errorMessage.value }}</span>
      </div>
      <!-- confirm password -->
      <div class="form-group">
        <label class="form-label">{{ t('fields.user.confirmPassword') }}</label>
        <input id="confirmPassword" class="form-control" :class="{ 'is-invalid': confirmPassword.errorMessage.value }" type="password" v-model="confirmPassword.value.value">
        <span class="invalid-feedback" v-if="confirmPassword.errorMessage.value">{{ confirmPassword.errorMessage.value }}</span>
      </div>
      <!-- error message -->
      <FormAlert :alert-type="AlertType.Danger" :message="responseErrorMessage" v-if="responseErrorMessage" />
      <!-- btn submit -->
      <button class="btn btn-primary w-100 mt-4" :disabled="isSubmitting">
        {{ t('forms.register.ctaSubmit') }}
        <FormLoading v-if="isSubmitting" />
      </button>
      <!-- additional links -->
      <div class="mt-5 text-center">
        <RouterLink class="text-decoration-none" to="/login">{{ t('general.messages.linkLogin') }}</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
form {
  width: 350px;
  max-width: 100%;
}
</style>
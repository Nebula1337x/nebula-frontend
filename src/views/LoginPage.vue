<script setup lang="ts">
// components
import FormAlert, { AlertType } from '@/components/form/FormAlert.vue'
import FormLoading from '@/components/form/FormLoading.vue'
// const
import { API } from '@/const'
// validator
import * as Yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useFetch, useHandleAPIError } from '@/composables'
// assets
import companyIcon from '@/assets/images/nebula-icon.svg'
//
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { handleSubmit } = useForm({
  validationSchema: Yup.object({
    username: Yup.string().required().label('Username'),
    password: Yup.string().required().label('Password')
  })
})

const username = useField('username')
const password = useField('password')

// state
const isFetching = ref<boolean>(false)
const responseErrMessage = ref<string>('')

function updateIsFetching(status: boolean): void {
  isFetching.value = status
}

function updateResponseErrMessage(message: string) {
  responseErrMessage.value = message
}

const formSubmit = handleSubmit(async () => {
  updateResponseErrMessage('')
  updateIsFetching(true)
  const payload = {
    username: (username.value.value as string).trim(),
    password: (password.value.value as string).trim()
  }
  const { error } = await useFetch(API.LOGIN, false, {
    onFetchError(ctx) {
      const data = (ctx.data && JSON.parse(ctx.data)) || {}
      const { errorMessage } = useHandleAPIError(ctx.error, ctx.response?.status, data.keyword)
      updateResponseErrMessage(errorMessage)
      return ctx   
    }
  }).post(payload)

  updateIsFetching(false)

  if (!error) return
  // login success, redirect to home page
  router.push('/')
})

</script> 

<template>
  <div class="bg-secondary">
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <!-- login box -->
      <div class="d-flex p-5 rounded shadow-sm border bg-dark">
        <div class="d-flex align-items-center me-5">
          <img class="mx-5 mw-100" :src="companyIcon" alt="Nebula icon" width="200">
        </div>
        <div class="d-flex flex-column">
          <!-- form -->
          <form @submit.prevent="formSubmit">
            <div class="mb-4">
              <h3 class="fw-bolder">Login</h3>
              <p class="font-size-sm text-muted">Login to your account and start chatting with your lover</p>
            </div>
            <!-- username -->
            <div>
              <label class="form-label" for="username">Username</label>
              <input id="username" 
                class="form-control" :class="{ 'is-invalid': username.errorMessage.value }" 
                name="username" 
                type="text" 
                autofocus 
                v-model="username.value.value"
                @input="username.validate()">
              <span class="invalid-feedback" v-if="username.errorMessage">{{ username.errorMessage.value }}</span>
            </div>
            <!-- password -->
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input id="password" class="form-control" :class="{ 'is-invalid': password.errorMessage.value }" name="password" type="password" v-model="password.value.value">
              <span class="invalid-feedback" v-if="password.errorMessage.value">{{ password.errorMessage.value }}</span>
            </div>
            <!-- alert error -->
            <FormAlert :message="responseErrMessage" :alert-type="AlertType.Danger" v-show="responseErrMessage"  />
            <!-- btn submit -->
            <button class="btn btn-primary mt-4 w-100" :disabled="isFetching">
              Login
              <FormLoading v-if="isFetching" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  form {
    width: 300px;
    max-width: 100%;
  }
</style>
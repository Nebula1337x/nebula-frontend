<script setup lang="ts">
// composables
import { useLocalStorage } from '@vueuse/core'
// components
import FormAlert, { AlertType } from '@/components/form/FormAlert.vue'
import FormLoading from '@/components/form/FormLoading.vue'
// const
import { API, STORAGE_KEY } from '@/const'
// validator
import * as Yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useFetch, useHandleAPIError } from '@/composables'
// assets
import companyIcon from '@/assets/images/nebula-icon.svg'
//
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
// store
import { useUserDataStore } from '@/stores'

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
  const { error, data } = await useFetch(API.LOGIN, false, {
    onFetchError(ctx) {
      const data = (ctx.data && JSON.parse(ctx.data)) || {}
      const { errorMessage } = useHandleAPIError(ctx.error, ctx.response?.status, data.keyword)
      updateResponseErrMessage(errorMessage)
      return ctx   
    }
  }).post(payload)

  updateIsFetching(false)

  if (!error) return

  const userDataStore = useUserDataStore()
  
  // save user data from response to store and local storage
  const responseData: ResponseData = JSON.parse(data.value as string)
  const user = responseData.data.user
  const auth = responseData.data.auth

  userDataStore.setUserData({
    _id: user._id,
    username: user.username,
    auth: {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken
    }
  })

  useLocalStorage(STORAGE_KEY, JSON.stringify(userDataStore.getUserData()))
  // redirect to home page
  router.push('/')
})

</script> 

<script lang="ts">
export enum UserStatus {
  Activated = 'ACTIVATED'
}

export type ResponseData = {
  data: {
    auth: {
      accessToken: string,
      refreshToken: string
    },
    user: {
      _id: string,
      username: string,
      profileUrl: string,
      status: UserStatus,
      isVerified: boolean,
      email: string,
      creationDate: Date
    }
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <!-- login box -->
    <div id="loginBox" class="d-flex flex-column flex-md-row py-0 px-3 px-sm-4 p-md-5 rounded-3 bg-dark">
      <!-- company icon -->
      <div class="d-none d-md-flex align-items-center me-5">
        <img class="mx-5 mw-100" :src="companyIcon" alt="Nebula icon" width="200">
      </div>
      <div class="d-flex flex-column">
        <!-- form -->
        <form @submit.prevent="formSubmit">
          <div class="mb-4">
            <h1 class="text-center text-md-start">Login</h1>
            <p class="subtitle d-none d-md-block text-muted text-start">Login to your account and start chatting with your lover</p>
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
          <!-- reset password -->
          <div class="mt-3">
            <RouterLink class="d-block text-decoration-none" to="/register">
              <span class="font-size-sm">Don't have an account? Register now</span>  
            </RouterLink>
            <RouterLink class="d-block text-decoration-none" to="/forget-password">
              <span class="font-size-sm">Reset password</span>  
            </RouterLink>
          </div>
          <!-- btn submit -->
          <button class="btn btn-primary mt-4 w-100" :disabled="isFetching">
            Login
            <FormLoading v-if="isFetching" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './node_modules/bootstrap/scss/functions';
@import './node_modules/bootstrap/scss/variables';
@import './node_modules/bootstrap/scss/variables-dark';
@import './node_modules/bootstrap/scss/mixins';

$color-mode-type: data;

// dark mode
@include color-mode(dark) {
  #loginBox {
    box-shadow: $box-shadow-sm;

    @include media-breakpoint-down(sm) {
      width: 100%; 
    }

    @include media-breakpoint-up(md) {
      border: $border-width $border-style $border-color-dark;;
    } 
  }

  form {
    width: 100%;
    max-width: 100%;

    @include media-breakpoint-up(md) {
      width: 300px;
    }
  }
}
</style>
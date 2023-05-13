<script setup lang="ts">
import { useFetch } from '@/composables'
import { STORAGE_KEY, API } from '@/const'
import { useUserDataStore } from '@/stores'
import type { useUserDataStoreType } from '@/stores'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

const userDataStore = useUserDataStore()
const localStorage = useLocalStorage<any>(STORAGE_KEY, null)
const router = useRouter()

async function proceedLogout() {
  const userData: useUserDataStoreType = JSON.parse(localStorage.value || null) || {}
  if (!userData || !userData.auth) return router.push('/login')

  const payload = {
    accessToken: userData.auth.accessToken,
    refreshToken: userData.auth.refreshToken
  }

  // ignore error for this request
  await useFetch(API.LOGOUT, false, {
    onFetchError(ctx) {
      return ctx
    }
  })
  .post(payload)

  localStorage.value = null // clear from local storage
  userDataStore.clear() // clear from data store
  router.push('/login') 
}

proceedLogout()
</script>

<template>
  <p>Logging out...</p>
</template>
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export type useUserDataStoreType = {
  _id?: string | null,
  username?: string | null,
  auth: {
    accessToken?: string | null,
    refreshToken?: string | null
  }
}

export const useUserDataStore = defineStore('userData', () => {
  const userData: useUserDataStoreType = reactive({
    _id: null,
    username: null,
    auth: {
      accessToken: null,
      refreshToken: null
    }
  })

  function setUserData(data: useUserDataStoreType): void {
    userData._id = data._id
    userData.username = data.username
    userData.auth = data.auth
  }

  function getUserData() {
    return { ...userData }
  }

  function clear() {
    userData._id = null
    userData.username = null
    userData.auth.accessToken = null
    userData.auth.refreshToken = null

    return { ... userData }
  }

  return { userData, setUserData, getUserData, clear }
})
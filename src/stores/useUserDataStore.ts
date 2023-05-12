import { defineStore } from 'pinia'
import { reactive } from 'vue'

type UserDataType = {
  _id?: string | null,
  username?: string | null,
  auth?: {
    accessToken?: string | null,
    refreshToken?: string | null
  }
}

export const useUserDataStore = defineStore('userData', () => {
  const userData: UserDataType = reactive({
    _id: null,
    username: '',
    auth: {
      accessToken: null,
      refreshToken: null
    }
  })

  function setUserData(data: UserDataType): void {
    userData._id = data._id
    userData.username = data.username
    userData.auth = data.auth
  }

  function getUserData() {
    return { ...userData }
  }

  return { userData, setUserData, getUserData }
})
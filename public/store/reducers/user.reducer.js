import { userService } from '../../services/user.service.js'

export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'
export const SET_USER_ACTIVITIES = 'SET_USER_ACTIVITIES'

const initialValue = {
  user: userService.getLoggedinUser(),
  todos: [],
  isLoading: false
}

export function userReducer(state = initialValue, cmd = {}) {
  switch (cmd.type) {
    case SET_USER:
      return {
        ...state,
        user: cmd.user
      }
    case SET_USER_BALANCE:
      if (!state.user) return state
      return { ...state, user: { ...state.user, balance: cmd.balance } }

    default:
      return state
  }
}

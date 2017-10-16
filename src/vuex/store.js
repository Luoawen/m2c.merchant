import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    // m新角色ID
    m_role_ID: '',
    // m新用户ID
    m_user_ID: '',
    // m添加禁用词ID
    m_forbid_ID: ''
  },
  mutations: {
    // 设置m新角色ID
    set_m_role_ID (state, msg) {
      state.m_role_ID = msg
    },
    // 设置m新用户ID
    set_m_user_ID (state, msg) {
      state.m_user_ID = msg
    },
    // 设置m添加禁用词ID
    set_m_forbid_ID (state, msg) {
      state.m_forbid_ID = msg
    }
  }
})

export default store

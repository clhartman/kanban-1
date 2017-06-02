import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let api = axios.create({
  baseURL: 'https://kanban-delete-me-later.herokuapp.com/api/',
  timeout: 2000,
  withCredentials: true
})
let auth = axios.create({
  baseURL: 'https://kanban-delete-me-later.herokuapp.com/',
  timeout: 2000,
  withCredentials: true
})

// REGISTER ALL DATA HERE
export default new Vuex.Store({
  // ALL DATA LIVES IN THE STATE
  state: {
    boards: [],
    activeBoard: {},
    lists: [],
    tasks: {},
    error: {},
    user: {}
  },
  // Mutations are the only thing allowed to change state
  mutations: {
    setBoards(state, boards) {
      state.boards = boards
    },
    setActiveBoard(state, board) {
      state.activeBoard = board
    },
    handleError(state, err) {
      state.error = err
    },
    setLists(state, lists) {
      state.lists = lists
    },
    setTasks(state, payload) {
      Vue.set(state.tasks, payload.listId, payload.tasks)
    },
    setUser(state, user) {
      state.user = user
    },
    clearError(state) {
      state.error = {}
    }
  },
  // ACTIONS ARE RESPONSIBLE FOR MANAGING ALL ASYNC REQUESTS
  actions: {
    getBoards({ commit }) {
      api('userboards')
        .then(res => {
          commit('setBoards', res.data.data)
        })
        .catch(err => { commit('handleError', err) })
    },
    getBoard({ commit }, id) {
      api('boards/' + id)
        .then(res => {
          commit('setActiveBoard', res.data.data)
        })
        .catch(err => { commit('handleError', err) })
    },
    getLists({ commit }, id) {
      api('boards/' + id + '/lists')
        .then(res => {
          commit('setLists', res.data.data)
        })
        .catch(err => { commit('handleError', err) })
    },
    getTasks({ commit }, payload) {
      api('boards/' + payload.boardId + '/lists/' + payload.listId + '/tasks')
        .then(res => {
          commit('setTasks', { boardId: payload.boardId, listId: payload.listId, tasks: res.data.data })
        })
        .catch(err => { commit('handleError', err) })
    },
    createTask({ commit, dispatch }, task) {
      api.post('tasks/', task)
        .then(res => {
          dispatch('getTasks', {boardId: task.boardId, listId: task.listId})
        })
        .catch(err => { commit('handleError', err) })
    },
    createBoard({ commit, dispatch }, board) {
      api.post('boards/', board)
        .then(res => {
          dispatch('getBoards')
        })
        .catch(err => { commit('handleError', err) })
    },
    removeBoard({ commit, dispatch }, board) {
      api.delete('boards/' + board._id)
        .then(res => {
          dispatch('getBoards')
        })
        .catch(err => { commit('handleError', err) })
    },
    login({ commit }, user) {
      auth.post('login', user)
        .then(res => {
          console.log(res)
          commit('setUser', res.data.data)
        })
        .catch(err => { commit('handleError', err) })
    },
    register({ commit }, user) {
      auth.post('register', user)
        .then(res => {
          console.log(res)
          if (res.data.error) {
            return commit('handleError', err)
          }
          //LETS REDIRECT THE PAGE
          commit('setUser', res.data.data)
          router.push('/boards')
        })
        .catch(err => { commit('handleError', err) })
    },
    getAuth({ commit }) {
      auth('authenticate')
        .then(res => {
          commit('setUser', res.data.data)
          router.push('/boards')
        }).catch(err => {
          router.push('/login')
        })
    },
    clearError({ commit }) {
      commit('clearError')
    }
  }
})
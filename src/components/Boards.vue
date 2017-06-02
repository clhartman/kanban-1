<template>
  <div>
    <h1>Hello {{user.name}}</h1>
    <form>
      <button @click="createBoard">Add Board</button>
    </form>
    <ul>
      <li v-for="board in boards"><router-link :to="'/boards/'+board._id">{{board.name}}</router-link> <span @click="removeBoard(board)">x</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'boards',
  mounted(){
    this.$store.dispatch('getBoards')
  },
  computed:{
    boards(){
      return this.$store.state.boards
    },
    user(){
      return this.$store.state.user
    }
  },
  methods:{
    createBoard(){
      this.$store.dispatch('createBoard', {
        name: 'testing',
        description: '123'
      })
    },
    removeBoard(board){
      this.$store.dispatch('removeBoard', board)
    }
  }
}
</script>

<style scoped>

</style>

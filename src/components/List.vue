<template>
  <div> 
    Active List: {{list}}
    <button @click="createTask">+</button>
      <ul>
        <li v-for="task in tasks">
          {{task}}
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: ['list'],
  mounted(){
    this.$store.dispatch('getTasks', {boardId: this.$route.params.id, listId: this.list._id})
  },
  methods:{
    createTask(){
      this.$store.dispatch('createTask', {
        boardId: this.$route.params.id,
        listId: this.list._id,
        name: 'A TEST TASK',
        description: 'A SIMPLE TEST TASK'
      })
    }
  },
  computed:{
    tasks(){
      return this.$store.state.tasks[this.list._id]
    }
  },
  components:{
    
  }
}
</script>

<style scoped>

</style>

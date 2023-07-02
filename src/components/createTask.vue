<template>
    <div>
        <div v-show="open_edit_form">
            <input type="text" v-model="name_edit" placeholder="Task Name">
            <button @click="save_edit_task()">save</button>
        </div>
        <ul>
            <li v-for="task in tasks" :key="task.id">
                {{ task.user.name }}
                <button @click="edit_Task(task.id , task.name)">updateTask</button>
                <button @click="deleteTask(task.id)">deleteTask</button>
            </li>
        </ul>


        <div v-if="paginator">
            <div>Page: {{ paginator.currentPage }} / {{ paginator.lastPage }}</div>
            <div>
                Displaying {{ paginator.count }} entries out of {{ paginator.total }}
            </div>
            <div>
                <button @click="page--">
                &larr; Previous
                </button>
                <button @click="page++">
                Next &rarr;
                </button>
            </div>
        </div>

        <button @click="open_form = true">
            Add Task
        </button>
        <div v-show="open_form">
            <input type="text" v-model="name" placeholder="Task Name">
            <!-- <input type="number" v-model="user_id" placeholder="User Id"> -->
            <button @click="save_task">save</button>
        </div>

        <div v-show="errors" style="color:red">
            {{ errors }}
        </div>

        
    </div>
  </template>
  
  <script>
  import TASKQUERY from '@/graphql/Tasks.gql'
  import CREATETASK from '@/graphql/createTask.gql'
  import DELETETASK from '@/graphql/deleteTask.gql'
  import UPDATETASK from '@/graphql/updateTask.gql'
  export default {
    name: 'createTaskComponent',
    data(){
        return{
            tasks: null,
            name:'',
            name_edit:'',
            id_edit:null,
            // user_id:'',
            open_form:false,
            open_edit_form:false,
            page: 1,
            perPage: 2,
            paginator: null,
            errors:''
        }
    },
    methods:{
        save_task(){
            this.$apollo.mutate({
                mutation:CREATETASK,
                variables:{
                    name:this.name,
                    // user_id: parseInt(this.user_id)
                }
            }).then(()=>{
                this.name = '',
                // this.user_id = '',
                this.open_form = false
                this.$apollo.queries.tasks.refetch()
            }).catch((error) => {
                error.graphQLErrors.forEach(({extensions}) => {
                    if(extensions){
                        this.errors = extensions.validation.name[0];
                    }
                });

                // console.log(error.graphQLErrors);
            })
        },

        deleteTask(id){
            this.$apollo.mutate({
                mutation:DELETETASK,
                variables: {
                    id: id
                }
            }).then(()=>{
                this.$apollo.queries.tasks.refetch()
            })
        },
        edit_Task(id , name){
            this.open_edit_form = true,
            this.id_edit = id,
            this.name_edit = name
        },  
        save_edit_task(){
            this.$apollo.mutate({
                mutation:UPDATETASK,
                variables: {
                    id: this.id_edit,
                    name:this.name_edit
                }
            }).then(()=>{
                this.id_edit = null,
                this.name_edit = '',
                this.open_edit_form = false,
                this.$apollo.queries.tasks.refetch()
            })
        },    
    },
    apollo: {
        tasks: {
            query: TASKQUERY,
            variables() {
                return {
                    perPage: this.perPage, 
                    page: this.page
                }
            },
            update: function(data) {
                this.paginator = data.tasks.paginatorInfo
                return data.tasks.data
            }
        },
    },
  };
  </script>
  
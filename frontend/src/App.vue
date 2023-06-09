<template>
  <div>
    <input v-model="username" type="text" placeholder="Digite um username do GitHub" />
    <button @click="addUser">Adicionar</button>

    <div v-if="users.length != 0">
      <div class="grid">
        <div v-for="user in users" :key="user.id" class="user-card">
          <img :src="user.avatar_url" alt="User avatar" />
          <h2><a :href="getUserProfileUrl(user.login)" target="_blank">{{ user.login }}</a></h2>
          <p>{{ user.name }}</p>
          <button @click="deleteUser(user.login)">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      users: []
    };
  },
  created() {
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      axios
        .get('/users')
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async addUser() {
      try {
        if (this.users.length >= 5) {
          window.alert("Você não pode adicionar mais usuários!");
        }
        else {
          const response = await axios.post('/users', { username: this.username });
          const user = response.data;
          this.users.push(user);
          this.username = '';
        }
        
      } catch (error) {
        console.error(error);
        this.users = [];
      }
    },
    deleteUser(username) {
    axios
      .delete(`/users/${username}`)
    },
    getUserProfileUrl(username) {
      return `https://github.com/${username}`;
    },
  },
};
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border: 2px solid #ccc;
  border-radius: 25px;
  text-align: center;
}
</style>
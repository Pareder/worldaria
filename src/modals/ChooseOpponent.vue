<template>
  <div>
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-content">
        <div class="status">
          <span v-if="inviteSent" class="enemyTurn">
            Waiting for opponent's decision<span>.</span><span>.</span><span>.</span>
          </span>
          <span v-else-if="opponentDecline">
            <img class="status__img" src="../assets/images/cross.svg" width="32" height="32" />
            The opponent has declined your invite
          </span>
          <span v-else>
            <img class="status__img" src="../assets/images/global.svg" width="32" height="32" />
            You can find an opponent or play with random person
          </span>
        </div>
        <div v-if="users.length > 1">
          <button class="btn" @click="$emit('randomOpponent')" :disabled="inviteSent">Random</button>
          <ul class="users_list">
            <div class="search">
              <label class="search__label">Search</label>
              <input
                class="search__input search_icon"
                type="text"
                v-model="searchName"
                @input="sortUsers"
                placeholder="Opponent's name"
              >
            </div>
            <li
              :key="id"
              class="user"
              v-for="(user, id) in usersList"
            >
              {{ user }}
              <ul class="game_options">
                <li
                  class="option"
                  v-for="option in populationOptions"
                  :key="option.id"
                >
                  <input
                    class="option__input"
                    type="radio"
                    :id="option.id"
                    name="sort"
                    v-model="sort"
                    :value="option.value"
                    :checked="sort === option.value"
                  >
                  <label class="option__label" :for="option.id">
                    <div class="check"></div>
                    <span class="mode_name">
                      {{ option.name }}
                    </span>
                  </label>
                </li>
              </ul>
              <button
                v-if="idPressed === id && inviteSent"
                class="invite btn--red cancel_btn"
                @click="invite(user, id)"
              >
                cancel
              </button>
              <div class="buttons" v-else>
                <button
                  class="invite btn--blue"
                  @click="invite(user, id, 'name')"
                  :disabled="(idPressed !== id && inviteSent)"
                >
                  name
                </button>
                <button
                  class="invite btn--blue"
                  @click="invite(user, id, 'flag')"
                  :disabled="(idPressed !== id && inviteSent)"
                >
                  flag
                </button>
                <button
                  class="invite btn--blue"
                  @click="invite(user, id, 'capital')"
                  :disabled="(idPressed !== id && inviteSent)"
                >
                  capital
                </button>
              </div>
            </li>
            <li v-if="searchName && foundUsers.length === 0">There are no such users</li>
          </ul>
        </div>
        <p v-else class="no-users">There are no online users now. You can try another mode.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { populationOptions } from '../config'

export default {
  data() {
    return {
      searchName: '',
      idPressed: null,
      foundUsers: [],
      sort: '',
      populationOptions
    }
  },

  props: {
    users: {
      type: Array
    },
    nickname: {
      type: String
    },
    inviteSent: {
      type: Boolean
    },
    opponentDecline: {
      type: Boolean
    }
  },

  computed: {
    usersList() {
      return (this.searchName ? this.foundUsers : this.users).filter(user => user !== this.nickname)
    }
  },

  methods: {
    sortUsers() {
      this.foundUsers.length = 0
      this.foundUsers = this.users.filter(user => user.startsWith(this.searchName))
    },

    invite(name, id, type) {
      this.idPressed = id
      const data = {
        name,
        type,
        sort: this.sort
      }

      this.$emit('sendInvite', data)
    }
  }
}
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    width: 100%;
    max-width: 600px;
    max-height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    padding-bottom: 3px;
    z-index: 1051;
    background: #fff;
    overflow-y: auto;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.3);
  }
  .modal::before {
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 3px;
    width: 100%;
  }
  .modal-content {
    height: auto;
    position: relative;
    z-index: 1052;
    background: #fff;
    font-size: 24px;
  }
  .status {
    height: 100px;
    margin-bottom: 20px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .status__img {
    position: relative;
    top: 8px;
  }
  .search__label {
    margin-right: 10px;
  }
  .users_list {
    list-style: none;
    padding: 0;
    max-height: 300px;
    overflow-y: auto;
  }
  .user {
    position: relative;
    margin-bottom: 10px;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    transition: all 0.3s;
    background-color: #f2f2f2;
    border-left: 5px solid #003842;
  }
  .no-users {
    margin: 0;
    padding: 10px 20px;
    text-align: left;
    background-color: #f2f2f2;
    border-left: 5px solid #003842;
  }
  .user:hover {
    background-color: #f9f9f9;
    border-color: #00BDE8;
  }
  .invite {
    width: 100px;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    outline: none;
    border-radius: 5px;
  }
  .invite:disabled {
    cursor: not-allowed;
  }
  .buttons {
    width: 100%;
  }
  button {
    background-color: #fff;
  }
  .buttons button + button {
    margin-left: 5px;
  }
  .cancel_btn {
    margin: 0 auto;
  }
</style>
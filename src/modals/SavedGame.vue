<template>
  <div>
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-content start">
        <div class="status">
          <span>
            <img src="../assets/images/saved.svg" width="32" height="32">
            You have saved game.
          </span>
          <span>Do you want to continue?</span>
        </div>
        <div class="buttons">
          <button class="btn" @click="$emit('getSaved')">Continue</button>
          <button class="btn" @click="deleteStorage">New</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    deleteStorage () {
      localStorage.removeItem('guessed')
      this.getSaved()
    }
  }
}
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  outline: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: #A3CCFF;
}
.modal-content {
  width: 100%;
  max-width: 500px;
  transform: perspective(300px);
  padding-bottom: 30px;
  background: #fff;
  font-size: 24px;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.3);
}
.modal-content::before {
  background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
  content: "";
  display: block;
  height: 5px;
  width: 100%;
}
.start {
  animation: tiltup 0.7s;
}
.status {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
}
.buttons {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.buttons > button {
  margin-bottom: 10px;
  text-overflow: ellipsis;
}
</style>
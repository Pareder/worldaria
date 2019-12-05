<template>
  <div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <transition name="fade" appear>
      <div class="modal">
        <div class="modal-content">
          <img class="cancel" src="../assets/images/cancel.svg" @click.prevent="$emit('close')" />
          <div class="status">
            <img class="status__img" src="../assets/images/mode.svg" width="32" height="32" />
            Learn countries by
          </div>
          <div class="buttons">
            <router-link to="/learn/full" tag="button" class="btn btn--small">Full</router-link>
            <router-link to="/learn/continent" tag="button" class="btn btn--small">Lands</router-link>
            <router-link to="/learn/countries" tag="button" class="btn btn--small">Regions</router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
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
    max-width: 500px;
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
    padding-bottom: 30px;
    background: #fff;
    font-size: 24px;
  }
  .cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  .cancel:hover {
    transform: scale(1.2);
  }
  .status {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .status__img {
    margin-right: 5px;
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
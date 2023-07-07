<template>
  <div class="modal-outer">
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-content" :class="end ? 'end' : 'start'">
        <div class="status">
          <img src="../assets/images/question-mark.svg" height="24" width="24" />
          What is the capital of {{ country }}?
        </div>
        <div class="capitals">
          <button
            class="btn"
            v-for="(capital, id) in capitals"
            :key="id"
            :class="capital.isAnswered === 'right' ? 'right' : capital.isAnswered === 'wrong' ? 'wrong' : ''"
            @click="answer(id)"
            :disabled="end"
          >
            {{ capital.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      answered: false,
      end: false
    }
  },

  props: {
    country: {
      type: String,
      required: true
    },
    capitals: {
      type: Array,
      required: true
    },
    rightCapital: {
      type: String
    }
  },

  methods: {
    answer(id) {
      this.end = true
      if (this.capitals[id].name === this.rightCapital) {
        this.$emit('answer', id, 'right')
        this.answered = true
      } else {
        this.$emit('answer', id, 'wrong')
      }
      setTimeout(() => {
        this.$emit('check', this.answered)
      }, 2000)
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
  @media screen and (max-width: 400px) {
    .modal {
      display: block;
    }
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    opacity: 0.5;
    background-color: #000;
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
  @media screen and (max-width: 400px) {
    .modal {
      margin-top: 100px;
      overflow-y: scroll;
    }
  }
  .modal-content::before {
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 5px;
    width: 100%;
  }
  .start {
    -webkit-animation: tiltup 0.7s;
    -moz-animation: tiltup 0.7s;
    -ms-animation: tiltup 0.7s;
    animation: tiltup 0.7s;
  }
  .end {
    -webkit-animation: tiltbottom 0.7s 1.5s;
    -moz-animation: tiltbottom 0.7s 1.5s;
    -ms-animation: tiltbottom 0.7s 1.5s;
    animation: tiltbottom 0.7s 1.5s;
  }
  .status {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .status img {
    margin-right: 10px;
  }
  .capitals {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .capitals > button {
    margin-bottom: 10px;
    text-overflow: ellipsis;
  }
  .right {
    -webkit-animation: rightAnswer 2s ease;
    -moz-animation: rightAnswer 2s ease;
    -ms-animation: rightAnswer 2s ease;
    animation: rightAnswer 2s ease;
    color: #2c3e50;
  }
  .wrong {
    -webkit-animation: wrongAnswer 2s ease;
    -moz-animation: wrongAnswer 2s ease;
    -ms-animation: wrongAnswer 2s ease;
    animation: wrongAnswer 2s ease;
    color: #2c3e50;
  }
  @keyframes rightAnswer {
    0% {
      background: #91DC5A;
    }
    25% {
      background: transparent;
    }
    50% {
      background: #91DC5A;
    }
    75% {
      background: transparent;
    }
    100% {
      background: #91DC5A;
    }
  }
  @keyframes wrongAnswer {
    0% {
      background: tomato;
    }
    25% {
      background: transparent;
    }
    50% {
      background: tomato;
    }
    75% {
      background: transparent;
    }
    100% {
      background: tomato;
    }
  }
</style>
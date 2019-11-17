<template>
  <div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <transition name="fade" appear>
      <div class="modal">
        <div class="modal-content">
          <img class="cancel" src="../assets/images/cancel.svg" @click.prevent="$emit('close')" />
          <div class="status">
            <img class="status__img" :src="`/img/${bot ? 'artificial-intelligence' : 'mode'}.svg`" width="32" height="32" />
            {{ bot ? 'Choose bot difficulty' : 'Guess countries by' }}
          </div>
          <p class="title">Mode</p>
          <ul v-if="bot" class="game_options mode">
            <li class="option">
              <input class="option__input" type="radio" id="m1-option" name="botMode" v-model="mode" value="easy">
              <label class="option__label" for="m1-option">
                <div class="check"></div>
                <span class="mode_name">
                  Easy
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 437.6 437.6" style="enable-background:new 0 0 437.6 437.6;" xml:space="preserve" width="24px" height="24px">
                    <g>
                      <g>
                        <g>
                          <path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4     c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8     c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2     c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8     c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4     c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6     c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2     C192.8,139.6,193.6,141.2,194,142.8z" fill="#51667f"/>
                          <path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4     H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300     C260,294,255.2,289.2,249.6,289.2z" fill="#51667f"/>
                          <path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8     c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z" fill="#51667f"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <div class="hidden">
                  <p class="px5">In Easy mode bot makes a lot of mistakes.</p>
                </div>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="m2-option" name="botMode" v-model="mode" value="hard">
              <label class="option__label" for="m2-option">
                <div class="check"></div>
                <span class="mode_name">
                  Hard
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 437.6 437.6" style="enable-background:new 0 0 437.6 437.6;" xml:space="preserve" width="24px" height="24px">
                    <g>
                      <g>
                        <g>
                          <path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4     c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8     c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2     c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8     c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4     c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6     c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2     C192.8,139.6,193.6,141.2,194,142.8z" fill="#51667f"/>
                          <path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4     H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300     C260,294,255.2,289.2,249.6,289.2z" fill="#51667f"/>
                          <path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8     c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z" fill="#51667f"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <div class="hidden">
                  <p class="px5">In Hard mode bot makes not a lot of mistakes.</p>
                </div>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="m3-option" name="botMode" v-model="mode" value="extreme">
              <label class="option__label" for="m3-option">
                <div class="check"></div>
                <span class="mode_name">
                  Extreme
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 437.6 437.6" style="enable-background:new 0 0 437.6 437.6;" xml:space="preserve" width="24px" height="24px">
                    <g>
                      <g>
                        <g>
                          <path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4     c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8     c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2     c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8     c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4     c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6     c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2     C192.8,139.6,193.6,141.2,194,142.8z" fill="#51667f"/>
                          <path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4     H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300     C260,294,255.2,289.2,249.6,289.2z" fill="#51667f"/>
                          <path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8     c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z" fill="#51667f"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <div class="hidden">
                  <p class="px5">In Extreme mode there are no borders between the countries.</p>
                </div>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="m4-option" name="botMode" v-model="mode" value="impossible">
              <label class="option__label" for="m4-option">
                <div class="check"></div>
                <span class="mode_name">
                  Impossible
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 437.6 437.6" style="enable-background:new 0 0 437.6 437.6;" xml:space="preserve" width="24px" height="24px">
                    <g>
                      <g>
                        <g>
                          <path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4     c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8     c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2     c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8     c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4     c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6     c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2     C192.8,139.6,193.6,141.2,194,142.8z" fill="#51667f"/>
                          <path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4     H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300     C260,294,255.2,289.2,249.6,289.2z" fill="#51667f"/>
                          <path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8     c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z" fill="#51667f"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <div class="hidden">
                  <p class="px5">In Impossible mode map is invisble, only hardcore.</p>
                </div>
              </label>
            </li>
          </ul>
          <ul v-else class="game_options mode">
            <li class="option">
              <input class="option__input" type="radio" id="f-option" name="selector" v-model="mode" value="normal" checked>
              <label class="option__label" for="f-option">
                <div class="check"></div>
                <span class="mode_name">
                  Normal
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 437.6 437.6" style="enable-background:new 0 0 437.6 437.6;" xml:space="preserve" width="24px" height="24px">
                    <g>
                      <g>
                        <g>
                          <path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4     c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8     c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2     c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8     c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4     c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6     c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2     C192.8,139.6,193.6,141.2,194,142.8z" fill="#51667f"/>
                          <path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4     H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300     C260,294,255.2,289.2,249.6,289.2z" fill="#51667f"/>
                          <path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8     c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z" fill="#51667f"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <div class="hidden">
                  <p class="px5">In Normal mode you have unlimited time on each country.</p>
                </div>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="s-option" name="selector" v-model="mode" value="hard">
              <label class="option__label" for="s-option">
                <div class="check"></div>
                <span class="mode_name">
                  Hard
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 437.6 437.6" style="enable-background:new 0 0 437.6 437.6;" xml:space="preserve" width="24px" height="24px">
                    <g>
                      <g>
                        <g>
                          <path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4     c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8     c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2     c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8     c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4     c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6     c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2     C192.8,139.6,193.6,141.2,194,142.8z" fill="#51667f"/>
                          <path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4     H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300     C260,294,255.2,289.2,249.6,289.2z" fill="#51667f"/>
                          <path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8     c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z" fill="#51667f"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <div class="hidden">
                  <p class="px5">In Hard mode you have only 15 seconds on each country. After 15 seconds you will lose 1 point.</p>
                </div>
              </label>
            </li>
          </ul>
          <p class="title">Population</p>
          <ul class="game_options">
            <li class="option">
              <input class="option__input" type="radio" id="p1-option" name="sort" v-model="sort" value="" checked>
              <label class="option__label" for="p1-option">
                <div class="check"></div>
                <span class="mode_name">
                  All
                </span>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="p2-option" name="sort" v-model="sort" value="5000000">
              <label class="option__label" for="p2-option">
                <div class="check"></div>
                <span class="mode_name">
                  >&nbsp;5&nbsp;M
                </span>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="p3-option" name="sort" v-model="sort" value="10000000">
              <label class="option__label" for="p3-option">
                <div class="check"></div>
                <span class="mode_name">
                  >&nbsp;10&nbsp;M
                </span>
              </label>
            </li>
            <li class="option">
              <input class="option__input" type="radio" id="p4-option" name="sort" v-model="sort" value="50000000">
              <label class="option__label" for="p4-option">
                <div class="check"></div>
                <span class="mode_name">
                  >&nbsp;50&nbsp;M
                </span>
              </label>
            </li>
          </ul>
          <div v-if="bot" class="buttons">
            <router-link :to="{ name: 'Bot', params: { mode: mode, sort: sort, by: 'name' }}" tag="button" class="btn btn--small">Name</router-link>
            <router-link :to="{ name: 'Bot', params: { mode: mode, sort: sort, by: 'flag' }}" tag="button" class="btn btn--small">Flag</router-link>
            <router-link :to="{ name: 'Bot', params: { mode: mode, sort: sort, by: 'capital' }}" tag="button" class="btn btn--small">Capital</router-link>
            <!--<router-link :to="{ name: 'Bot', params: { chance: 0.95, mode: 'the_hardest' }}" tag="button" class="btn btn--small">Impossible</router-link>-->
          </div>
          <div v-else class="buttons">
            <router-link :to="mode === 'hard' ? '/hard' : '/game'" tag="button" class="btn btn--small">Name</router-link>
            <router-link :to="{ name: 'Flag', params: { mode: mode, sort: sort } }" tag="button" class="btn btn--small">Flag</router-link>
            <router-link :to="{ name: 'Capital', params: { mode: mode, sort: sort } }" tag="button" class="btn btn--small">Capital</router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mode: '',
      sort: ''
    }
  },
  props: {
    bot: {
      type: Boolean
    }
  },
  created () {
    this.mode = this.bot ? 'easy' : 'normal'
  },
  methods: {
    inputChange () {
      console.log(this.mode)
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
  max-width: 500px;
  max-height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  padding-bottom: 3px;
  z-index: 1051;
  background: #fff;
  overflow-y: visible;
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
.title {
  margin: 10px 0;
}
.mode li {
  flex-basis: 50%;
}
</style>
import Vue from 'vue'

Vue.mixin({
  computed: {

  },
  methods: {
    logout: function(){
      this.$store.commit('logout')
      this.$router.push("/login")
    },
    showMessage: function(message){
      this.$toasted.show(message, {
        theme: "bubble",
        position: "top-center",
        duration: 4000
      });
    },
    createCaseItems: function(items){
      var skins = []
      for(let a = 0; a < items.length; a++){
        for(let b = 0; b < items[a].odds*2; b++){
          skins.push(items[a])
        }
      }
      return skins
    },
    shuffleItems: function(items){
      items = items.sort(() => Math.random() - 0.5);
      items = items.sort(() => Math.random() - 0.5);
      items = items.sort(() => Math.random() - 0.5);
      return items.sort(() => Math.random() - 0.5);
    },
    startLoader: function(){
      this.$store.commit('startLoader', true)
    },
    endLoader: function () {
      this.$store.commit('startLoader', false)
    },
    playHoverSound: function () {
      var audio = new Audio(require('../audio/tick1.wav'))
      audio.play()
    },
    playOpeningSound: function () {
      var audio = new Audio(require('../audio/tick2.wav'))
      audio.play()
    }
  },
  filters: {

  }
});
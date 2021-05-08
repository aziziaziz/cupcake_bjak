<template>
  <div class="rz-input-main">
    <div class="placeholder-box" :class="[ inputFocus ? 'placeholder-top' : (privText ? 'placeholder-top' : (privNumberText ? 'placeholder-top' : 'placeholder-bottom')) ]">
      <span class="required-ind" v-if="required">**</span>
      <span>{{ placeholder }}</span>
    </div>
    <input v-if="privType != 'number'" :class="[ privType == 'password' ? 'password-input' : '' ]" :type="showPass ? 'text' : privType" 
      v-model="privText" @focus="inputStateChanged(true)" @blur="inputStateChanged(false)" ref="myInput">
    <input v-else type="number" v-model.number="privNumberText"
      @focus="inputStateChanged(true)" @blur="inputStateChanged(false)" ref="myInput">
    <div v-if="privText" class="circle-text" :class="[ privType == 'password' ? 'clear-password' : '' ]" @click="clearTextClicked">ｘ</div>
    <button tabindex="-1" v-if="privType == 'password' && privText" class="show-hide-pass" @click="showPassClicked">{{ showPass ? 'Hide' : 'Show' }}</button>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div class="input-line" :class="[ inputFocus ? 'max-line' : '' ]"></div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data: function() {
    return {
      inputTypeList: [ 'text', 'password', 'number' ],
      privText: '',
      privType: 'text',
      privNumberText: 0,
      inputFocus: false,
      showPass: false,
    }
  },
  props: {
    text: { type: String, default: '' },
    numberText: { type: Number, default: 0 },
    placeholder: { type: String, default: 'Placeholder' },
    required: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
    errorMessage: { type: String, default: '' },
  },
  methods: {
    inputStateChanged: function(focus) {
      this.inputFocus = focus;
      this.$emit('update:errorMessage', '');
    },
    clearTextClicked: function() {
      this.privText = '';
      this.privNumberText = 0;
      this.$refs['myInput'].focus();
    },
    showPassClicked: function() {
      this.showPass = !this.showPass;
      this.$refs['myInput'].focus();
      setTimeout(() => {
        this.$refs['myInput'].setSelectionRange(this.privText.length, this.privText.length);
      }, 10);
    }
  },
  mounted() {
    if (this.text) {
      this.privText = this.text;
    }

    if (this.numberText) {
      this.privNumberText = this.numberText;
    }

    if (this.type) {
      if (this.inputTypeList.includes(this.type)) {
        this.privType = this.type;
      } else {
        this.privType = 'text';
      }
    }
  },
  watch: {
    privText: function(val) {
      this.$emit('update:text', val);
    },
    privNumberText: function(val) {
      this.$emit('update:numberText', val);
    },
    text: function(val) {
      this.privText = val;
    },
    numberText: function(val) {
      this.privNumberText = val;
    },
    type: function(val) {
      if (val) {
        if (this.inputTypeList.includes(val)) {
          this.privType = val;
        } else {
          this.privType = 'text';
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rz-input-main {
  padding-bottom: 3px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;

  > .placeholder-box {
    padding: 0 0 0 2px;
    pointer-events: none;
    transition: 0.3s;
    width: 100%;

    > .required-ind {
      color: red;
      margin-right: 5px;
    }
  }

  > .placeholder-top {
    font-size: 0.75em;
    transform: translate(0, 8px);
    padding-left: 7px;
    opacity: 1;
  }

  > .placeholder-bottom {
    font-size: 1em;
    opacity: 0.5;
    transform: translate(5px, 28px);
  }

  > input {
    width: 100%;
    border-style: solid;
    border-width: 1px;
    border-color: transparent transparent black transparent;
    outline: none;
    padding-left: 5px;
    padding-right: 25px;
  }

  > .password-input {
    padding-right: 80px;
  }

  > .clear-password {
    right: 60px;
  }

  > .error-message {
    background-color: rgb(180, 0, 0);
    color: white;
    position: absolute;
    bottom: 6px;
    left: 3px;
    padding: 0 5px;
    border-radius: 7px;
    pointer-events: none;
  }

  > .input-line {
    min-height: 1px;
    max-width: 0;
    background-color: blue;
    transition: 0.3s;
    width: 100%;
  }

  > .max-line {
    max-width: 100%;
  }

  > .show-hide-pass {
    position: absolute;
    right: 5px;
    bottom: 5px;
    cursor: pointer;
    background: transparent;
    border: 1px solid gray;
    width: 50px;
    border-radius: 10px;
    padding: 3px;
  }

  > .circle-text {
    position: absolute;
    right: 5px;
    bottom: 10px;
    cursor: pointer;
    height: 15px;
    width: 15px;
    background-color: gray;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    border-radius: 100%;
  }

  > * {
    box-sizing: border-box;
  }
}
</style>
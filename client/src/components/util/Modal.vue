<template>
  <transition name="modal">
    <div v-if="isVisible">
      <div class="fixed inset-0 z-50 flex justify-center items-center">
        <div class="flex flex-col min-w-min rounded-lg shadow-lg bg-white">
          <!-- header -->
          <div class="p-5">
            <div class="flex justify-between items-start">
              <h3 class="text-2xl font-semibold">
                <slot name="title"></slot>
              </h3>
              <button class="p-1 leading-none" @click="emitCancel">
                <div class="text-xl font-semibold h-6 w-6">
                  <span>x</span>
                </div>
              </button>
            </div>
          </div>
          <!-- end header -->
          <!-- body -->
          <div class="p-6">
            <slot name="body"></slot>
          </div>
          <!-- end body -->
          <!-- footer -->
          <div class="p-6 flex justify-end items-center">
            <button @click="emitCancel">
              <slot name="cancel-button"></slot>
            </button>
            <button @click="emitConfirm">
              <slot name="confirm-button"></slot>
            </button>
          </div>
          <!-- end footer -->
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    isVisible: Boolean,
  },
  emits: ["cancel", "confirm"],
  setup(_, { emit }) {
    const emitCancel = () => {
      emit("cancel");
    };

    const emitConfirm = () => {
      emit("confirm");
    };

    return {
      emitCancel,
      emitConfirm,
    };
  },
};
</script>

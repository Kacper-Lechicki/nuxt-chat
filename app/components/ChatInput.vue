<script lang="ts" setup>
const { isStreaming = false } = defineProps<{
  isStreaming?: boolean;
}>();

const emit = defineEmits<{
  (e: 'send-message', message: string): void;
}>();

const textareaRef = useTemplateRef('textareaRef');
const newMessage = ref('');

const handleSendMessage = () => {
  if (!newMessage.value.trim() || isStreaming) {
    return;
  }

  emit('send-message', newMessage.value.trim());

  newMessage.value = '';

  nextTick(() => {
    adjustTextareaHeight();
    textareaRef.value?.focus();
  });
};

const adjustTextareaHeight = async (): Promise<void> => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';

    await nextTick();

    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

onMounted(() => {
  textareaRef.value?.focus();
});

watch(
  () => isStreaming,
  async (value: boolean) => {
    if (!value) {
      await nextTick();
      textareaRef.value?.focus();
    }
  },
);
</script>

<template>
  <form class="message-form-wrapper" @submit.prevent="handleSendMessage">
    <textarea
      ref="textareaRef"
      v-model="newMessage"
      :disabled="isStreaming"
      :rows="1"
      class="message-input"
      @input="adjustTextareaHeight"
      @keydown.enter.prevent="handleSendMessage"
    />

    <UButton
      :disabled="!newMessage || isStreaming"
      class="absolute right-3 bottom-3 rounded-full"
      color="primary"
      icon="i-heroicons-paper-airplane"
      square
      type="submit"
      variant="solid"
    />
  </form>
</template>

<style lang="css" scoped>
.message-form-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem 1rem 1.2rem;
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: 1.8rem;
  overflow: hidden;
  transition: all 0.15s ease-in-out;
}

.message-form-wrapper:focus-within,
.message-form-wrapper:hover {
  transform: none;
}

.message-form-wrapper:hover {
  box-shadow: none;
  outline: none;
}

.message-input {
  margin-right: 1.5rem;
  padding: 0;
  width: 100%;
  background: transparent;
  resize: none;
  outline: none;
}

.message-form-wrapper:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  outline: none;
}

.message-input:disabled {
  cursor: not-allowed;
}
</style>

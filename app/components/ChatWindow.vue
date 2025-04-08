<script lang="ts" setup>
import type { Chat, ChatMessage } from '~/types';
import useChatScroll from '~/composables/useChatScroll';

const props = defineProps<{
  messages: ChatMessage[];
  chat: Chat;
}>();

const emit = defineEmits(['send-message']);

const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll();

const messageClasses = computed(() => (message: ChatMessage) => {
  return {
    message: true,
    'message-user': message.role === 'user',
    'message-ai': message.role === 'assistant',
  };
});

function onSendMessage(message: string) {
  emit('send-message', message);
}

watch(() => props.messages, pinToBottom, { deep: true });
</script>

<template>
  <div ref="scrollContainer" class="scroll-container">
    <UContainer class="chat-container">
      <div v-if="!messages?.length" class="empty-state">
        <div class="empty-state-card">
          <h2 class="title">Start your chat</h2>
          <ChatInput @send-message="onSendMessage($event)" />
        </div>
      </div>

      <template v-else>
        <div class="chat-header">
          <h1 class="title">
            {{ chat?.title || 'Untitled Chat' }}
          </h1>
        </div>

        <div class="messages-container">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message', messageClasses(message)]"
          >
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>

        <UContainer class="message-form-container">
          <div class="scroll-to-bottom-button-container">
            <UButton
              v-if="showScrollButton"
              class="rounded-full shadow-sm"
              color="neutral"
              icon="i-heroicons-arrow-down"
              variant="outline"
              @click="() => scrollToBottom()"
            />
          </div>

          <ChatInput @send-message="onSendMessage($event)" />
        </UContainer>
      </template>
    </UContainer>
  </div>
</template>

<style lang="css" scoped>
.scroll-container {
  height: calc(100vh - 4rem);
  overflow-y: auto;
}

.chat-container {
  position: relative;
  max-width: 800px;
}

.chat-header {
  position: sticky;
  top: -2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  background: var(--ui-bg);
  border-bottom: 1px solid var(--ui-border);
  z-index: 5;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ui-text);
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 8rem;
  overflow-y: auto;
}

.message {
  padding: 1rem;
  border-radius: var(--ui-radius);
  transition: all 0.2s;
  animation: message-appear 0.3s ease-out;
}

.message-user {
  align-self: flex-end;
  width: 70%;
  background: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
}

.message-ai {
  padding: 1rem 0;
  width: 100%;
  background: none;
  border: none;
}

.message-content {
  word-wrap: break-word;
  white-space: pre-wrap;
  color: var(--ui-text);
  overflow-wrap: break-word;
}

.message-form-container {
  position: fixed;
  bottom: 0;
  left: 50%;
  padding-bottom: 2rem;
  width: calc(100% - 2rem);
  max-width: 800px;
  background: var(--ui-bg);
  z-index: 10;
  transform: translateX(-50%);
}

.scroll-to-bottom-button-container {
  position: absolute;
  left: 0;
  bottom: calc(100% + 2rem);
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: none;
}

.scroll-to-bottom-button-container :deep(button) {
  pointer-events: auto;
  cursor: pointer;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex: 1;
  min-height: calc(100% - 2rem);
}

.empty-state-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.empty-state-message {
  font-size: 1rem;
  color: var(--ui-text-muted);
}

.message-input {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-input::-webkit-scrollbar {
  display: none;
}

@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

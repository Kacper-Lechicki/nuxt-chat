<script lang="ts" setup>
import type { ChatMessage } from '~/types';

const { chat, messages, sendMessage } = useChat();

const messageClasses = computed(() => (message: ChatMessage) => {
  return {
    message: true,
    'message-user': message.role === 'user',
    'message-ai': message.role === 'assistant',
  };
});

function onSendMessage(message: string) {
  sendMessage(message);
}
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

        <div class="message-form-container">
          <ChatInput @send-message="onSendMessage($event)" />
        </div>
      </template>
    </UContainer>
  </div>
</template>

<style lang="css" scoped>
.scroll-container {
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.chat-container {
  position: relative;
  max-width: 800px;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
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
  position: absolute;
  bottom: 2rem;
  width: calc(100% - 2rem);
  z-index: 10;
}

.scroll-to-bottom-button-container {
  position: absolute;
  left: 0;
  bottom: calc(100% + 1rem);
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: none;
}

.scroll-to-bottom-button-container :deep(button) {
  pointer-events: auto;
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
</style>

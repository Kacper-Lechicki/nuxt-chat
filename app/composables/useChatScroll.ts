export default function useChatScroll() {
  const scrollContainer = useTemplateRef<HTMLDivElement>('scrollContainer');
  const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef');
  const isAtBottom = ref(true);
  const showScrollButton = ref(false);

  const checkScrollPosition = (): void => {
    if (scrollContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

      isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 200;
      showScrollButton.value = !isAtBottom.value;
    }
  };

  const scrollToBottom = (immediate: boolean = false): void => {
    if (!scrollContainer.value) {
      return;
    }

    const targetScrollTop: number =
      scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight;

    if (immediate) {
      scrollContainer.value.scrollTop = targetScrollTop;
      return;
    }

    const startScrollTop: number = scrollContainer.value.scrollTop;
    const distance: number = targetScrollTop - startScrollTop;
    const duration: number = 300;

    const startTime: number = performance.now();

    function step(currentTime: number): void {
      const elapsed: number = currentTime - startTime;
      const progress: number = Math.min(elapsed / duration, 1);
      const easeInOutCubic: number =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (scrollContainer.value) {
        scrollContainer.value.scrollTop =
          startScrollTop + distance * easeInOutCubic;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
    }

    requestAnimationFrame(step);
  };

  async function pinToBottom(): Promise<void> {
    if (isAtBottom.value) {
      if (scrollContainer.value) {
        await nextTick();
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
      }
    }
  }

  function initialCheck() {
    nextTick(() => {
      checkScrollPosition();

      if (typeof MutationObserver !== 'undefined' && scrollContainer.value) {
        const observer = new MutationObserver(() => {
          checkScrollPosition();
        });

        observer.observe(scrollContainer.value, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
      }
    }).then();
  }

  onMounted((): void => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', checkScrollPosition);

      initialCheck();

      nextTick((): void => {
        scrollToBottom(true);
        textareaRef.value?.focus();
      }).then();

      window.addEventListener('resize', checkScrollPosition);
    }
  });

  onUnmounted((): void => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    }
  });

  onUpdated((): void => {
    checkScrollPosition();
  });

  return {
    isAtBottom,
    showScrollButton,
    scrollToBottom,
    textareaRef,
    pinToBottom,
  };
}

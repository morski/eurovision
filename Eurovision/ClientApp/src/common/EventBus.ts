const eventBus = {
  on(event: string, callback: (e: CustomEvent) => void) {
    document.addEventListener(event, (e) => callback(e as CustomEvent));
  },
  dispatch(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: EventListener) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
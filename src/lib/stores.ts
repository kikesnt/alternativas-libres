export type Store<T extends string> = {
  get: () => T | null;
  set: (value: T) => void;
  subscribe: (callback: () => void) => () => void;
};

export function createLocalStorageStore<T extends string>(
  key: string,
  eventName: string,
): Store<T> {
  return {
    get: () => {
      if (typeof window === "undefined") return null;
      return (window.localStorage.getItem(key) as T | null) ?? null;
    },
    set: (value: T) => {
      window.localStorage.setItem(key, value);
      window.dispatchEvent(new Event(eventName));
    },
    subscribe: (callback: () => void) => {
      window.addEventListener(eventName, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(eventName, callback);
        window.removeEventListener("storage", callback);
      };
    },
  };
}

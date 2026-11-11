import "@testing-library/jest-dom";

const store = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  writable: true,
  value: {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => store.get(k) ?? null,
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    removeItem: (k: string) => void store.delete(k),
    setItem: (k: string, v: string) => void store.set(k, String(v))
  } satisfies Storage
});

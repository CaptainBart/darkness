
export type GetOrCreateFn<K, V> = (key: K, createFn: () => V) => V;
export interface Cache<K, V> {
  getOrCreate: GetOrCreateFn<K, V>;
  clear: () => void;
}

export const createCache = <K, V>(): Cache<K, V> => {
  const cache = new Map<K, V>();

  const getOrCreate = (key: K, createFn: () => V): V => {
    let value = cache.get(key);
    if (value != undefined) {
      return value;
    }

    value = createFn();
    cache.set(key, value);
    return value;
  }

  const clear = () => { cache.clear(); };

  return {
    getOrCreate,
    clear,
  };
};

import { useState, useEffect, useCallback } from 'react';
import localLists, { LISTS_CHANGED_EVENT } from '../utils/localLists';

/**
 * Subscribe to a device-local list (favorites / watchlist / recently viewed).
 * Re-renders whenever the list changes anywhere in the app.
 */
export const useLocalList = (key) => {
  const [items, setItems] = useState(() => localLists.get(key));

  const refresh = useCallback(() => setItems(localLists.get(key)), []);

  useEffect(() => {
    refresh();
    window.addEventListener(LISTS_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(LISTS_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [key, refresh]);

  const toggle = useCallback((movie) => localLists.toggle(key, movie), [key]);
  const remove = useCallback((id) => localLists.remove(key, id), [key]);
  const clear = useCallback(() => localLists.clear(key), [key]);
  const has = useCallback((id) => items.some((m) => String(m.id ?? m._id) === String(id)), [items]);

  return { items, toggle, remove, clear, has, refresh };
};

export default useLocalList;

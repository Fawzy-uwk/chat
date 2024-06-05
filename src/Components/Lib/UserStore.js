import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./Firebase";


export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  

  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err.message);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));

export const useFullScreenStore = create((set) => ({
  isFullscreen: false,
  toggleFullscreen: () =>
    
    set((state) => ({ isFullscreen: !state.isFullscreen })),
}));

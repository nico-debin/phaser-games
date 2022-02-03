import create from "zustand";

interface PlayerState {
  username: string;
  avatar: string
  isAdmin: boolean;
  gameStarted: boolean;
  setUsername: (username: string) => void;
  setAvatar: (avatar: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setGameStarted: (gameStarted: boolean) => void;
  isReadyToPlay: () => boolean;
}

export const useStore = create<PlayerState>((set, get) => ({
  username: '',
  usernameFromSlider: '',
  usernameFromInputText: '',
  avatar: '',
  isAdmin: false,
  gameStarted: false,

  setUsername: (username: string) => {
    set((state) => ({
      username
    }))
  },

  setAvatar: (avatar: string) => {
    set((state) => ({
      avatar
    }))
  },

  setIsAdmin: (isAdmin: boolean) => {
    set((state) => ({
      isAdmin
    }))
  },

  setGameStarted: (gameStarted: boolean) => {
    set((state) => ({
      gameStarted
    }))
  },

  isReadyToPlay: () => {
    return get().username !== '' && get().avatar !== ''
  }
}))

import create from "zustand";
import { avatarSlides } from "../avatarSlides";
import { Slide } from "../components/ui";

interface PlayerState {
  username: string;
  avatar: string;
  isVoter: boolean;
  isAdmin: boolean;
  gameStarted: boolean;
  setUsername: (username: string) => void;
  setAvatar: (avatar: string) => void;
  setIsVoter: (isVoter: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setGameStarted: (gameStarted: boolean) => void;
  isReadyToPlay: () => boolean;
}

export const useStore = create<PlayerState>((set, get) => ({
  username: "",
  usernameFromSlider: "",
  usernameFromInputText: "",
  avatar: "",
  isVoter: true,
  isAdmin: false,
  gameStarted: false,

  setUsername: (username: string) => {
    set((state) => {
      const predefinedPlayer = avatarSlides.find(
        (slide: Slide) => slide.name === username
      );
      if (predefinedPlayer && predefinedPlayer.isVoter !== undefined) {
        return {
          ...state,
          username,
          isVoter: predefinedPlayer.isVoter,
        };
      } else {
        return { ...state, username };
      }
    });
  },

  setAvatar: (avatar: string) => {
    set((state) => ({
      avatar,
    }));
  },

  setIsVoter: (isVoter: boolean) => {
    set((state) => ({
      isVoter,
    }));
  },

  setIsAdmin: (isAdmin: boolean) => {
    set((state) => ({
      isAdmin,
    }));
  },

  setGameStarted: (gameStarted: boolean) => {
    set((state) => ({
      gameStarted,
    }));
  },

  isReadyToPlay: () => {
    return get().username !== "" && get().avatar !== "";
  },
}));

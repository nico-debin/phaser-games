import React, { useEffect, useState } from 'react';
import { useStore } from "../store/useStore";

import { Slide } from "../components/ui";

import PlayButton from "../components/PlayButton/PlayButton";
import UsernameSelector from "../components/UsernameSelector/UsernameSelector";
import AvatarSelector from "../components/AvatarSelector/AvatarSelector";
import OptionsSection from "../components/OptionsSection/OptionsSection";

import { avatarSlides, defaultAvatarSlides } from "../avatarSlides";

import StoreDebugger from "../store/StoreDebugger";

import '../styles/HomePage.scss';

const HomePage = () => {
  const { username, isReadyToPlay } = useStore();
  const [avatarsLoaded, setAvatarsLoaded] = useState<boolean>(false)
  const [activeSlides, setActiveSlides] = useState<Slide[]>(defaultAvatarSlides)

  useEffect(() => {
    const loadImage = (slide: Slide) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image()
        loadImg.src = slide.url
        loadImg.onload = () => resolve(slide.url)
        loadImg.onerror = err => reject(err)
      })
    }

    Promise.all([...avatarSlides, ...defaultAvatarSlides].map(slide => loadImage(slide)))
      .then(() => setAvatarsLoaded(true))
      .catch(err => console.log("Failed to load images", err))
  }, [])

  useEffect(() => {
    // Set active avatar slides based on selected username
    username && setActiveSlides([...avatarSlides.filter((slide: Slide) => slide.name === username), ...defaultAvatarSlides])
  }, [username])

  const showPlayButton: boolean = isReadyToPlay();

  return (
    <div className="App noselect">
      <div className="homepage-board">
        <h1>Grooming Wars</h1>

        <UsernameSelector usernames={avatarSlides.map(slide => slide.name)} />

        { username && (
          avatarsLoaded ? (
            <AvatarSelector slides={activeSlides} />
          ) : (<h1>Loading...</h1>)
        )}

        <OptionsSection />

        {showPlayButton && <PlayButton />}

      </div>

      <StoreDebugger />
    </div>
  );
};

export default HomePage;

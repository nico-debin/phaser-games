import React, { useEffect, useState } from "react";
import { useStore } from '../../store/useStore';
import { TextInput, TextSlider } from "../ui";

interface UsernameSelectorProps {
  title?: string;
  usernames: string[];
  onUsernameSelected?: (newUsername: string) => void;
}

const UsernameSelector = ({ title, usernames, onUsernameSelected = () => null }: UsernameSelectorProps) => {
  const { username, setUsername } = useStore();
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [initialUsernameHasLoaded, setInitialUsernameHasLoaded] = useState<boolean>(false);

  const [textSliderStartKey, setTextSliderStartKey] = useState<number>(-1);

  if (initialUsernameHasLoaded === false && username) {
    const usernameKey = usernames.findIndex((u: string) => u === username);
    if (usernameKey >= 0) {
      setTextSliderStartKey(usernameKey)
    } else {
      setTextInputValue(username)
    }
    setInitialUsernameHasLoaded(true);
  }

  // Show TextSlider placeholder if the TextInput has been used
  useEffect(() => {
    if (textInputValue !== '') {
      setTextSliderStartKey(-1);
    }
  }, [textInputValue])

  const onSlideHandler = (username: string) => {
    setTextInputValue('');
    onUsernameSelectedWrapper(username);
  }

  const onTextInputChangeHandle = (username: string) => {
    setTextInputValue(username);
    onUsernameSelectedWrapper(username);
  }

  const onUsernameSelectedWrapper = (username: string) => {
    setUsername(username);
    onUsernameSelected(username);
  }

  return (
    <div className="username-selector">
      <h2>{title ?? 'Select your username'}</h2>
      <TextSlider placeholder='Select' options={usernames} onSlide={onSlideHandler} startKey={textSliderStartKey} setStartKey={setTextSliderStartKey} />
      <hr className="hr-text" data-content="OR" />
      <TextInput value={textInputValue} placeholder="Insert your username" onChange={onTextInputChangeHandle} />
    </div>
  )
}

export default UsernameSelector;

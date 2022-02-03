import React, { useEffect, useState } from "react";
import { useStore } from '../../store/useStore';
import { TextInput, TextSlider } from "../ui";

interface UsernameSelectorProps {
  title?: string;
  usernames: string[];
  onUsernameSelected?: (newUsername: string) => void;
}

const UsernameSelector = ({ title, usernames, onUsernameSelected = () => null }: UsernameSelectorProps) => {
  const setUsername = useStore(store => store.setUsername);
  const [sliderKey, setSliderKey] = useState(0);
  const [textInputValue, setTextInputValue] = useState<string>('')

  // Hack to reset TextSlider if the TextInput has been used
  useEffect(() => {
    if (textInputValue !== '') {
      setSliderKey((prev) => prev + 1);
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
      <TextSlider placeholder='Select' options={usernames} onSlide={onSlideHandler} key={sliderKey} />
      <hr className="hr-text" data-content="OR" />
      <TextInput value={textInputValue} placeholder="Insert your username" onChange={onTextInputChangeHandle} />
    </div>
  )
}

export default UsernameSelector;

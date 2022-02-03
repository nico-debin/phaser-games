import React from "react";
import { useStore } from "../../store/useStore";
import { CheckboxInput } from "../ui";

const OptionsSection = ({ }) => {
  const setIsAdmin = useStore(store => store.setIsAdmin);

  return (
    <div className="options-section">
      <CheckboxInput label="Log in as admin" onChange={setIsAdmin} />
    </div>
  )
}

export default OptionsSection;
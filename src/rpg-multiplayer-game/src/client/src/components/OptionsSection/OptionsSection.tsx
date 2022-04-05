import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { CheckboxInput } from '../ui';

import './OptionsSection.scss';

const OptionsSection = ({}) => {
  const { isAdmin, setIsAdmin, isVoter, setIsVoter } = useStore();
  const [voterCheckboxValue, setVoterCheckboxValue] =
    useState<boolean>(isVoter);

  useEffect(() => setVoterCheckboxValue(isVoter), [isVoter]);

  return (
    <div className="options-section">
      <CheckboxInput
        className="isAdmin"
        label="Log in as admin"
        onChange={setIsAdmin}
        value={isAdmin}
      />
      <CheckboxInput
        className="isVoter"
        label="I'm a voter"
        onChange={setIsVoter}
        value={voterCheckboxValue}
      />
    </div>
  );
};

export default OptionsSection;

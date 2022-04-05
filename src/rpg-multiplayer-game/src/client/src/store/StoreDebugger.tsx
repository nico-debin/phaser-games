import React from 'react';
import { useStore } from './useStore';

const StoreDebugger = () => {
  const { username, avatar, isVoter, isAdmin } = useStore();

  return (
    <div className="store-debugger">
      <ul>
        <li>username: {username ?? '-'}</li>
        <li>avatar: {avatar ?? '-'}</li>
        <li>isVoter: {isVoter ? 'yes' : 'no'}</li>
        <li>isAdmin: {isAdmin ? 'yes' : 'no'}</li>
      </ul>
    </div>
  );
};

export default StoreDebugger;

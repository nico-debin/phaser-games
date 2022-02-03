import React from "react";
import { useStore } from './useStore';

const StoreDebugger = () => {
  const { username, avatar, isAdmin } = useStore();

  return (
    <div className="store-debugger">
      <ul>
        <li>username: {username ?? '-'}</li>
        <li>avatar: {avatar ?? '-'}</li>
        <li>isAdmin: {isAdmin ? 'yes' : 'no'}</li>
      </ul>
    </div>
  )
}

export default StoreDebugger;

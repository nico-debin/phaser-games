import React from "react"

import './ArrowButton.scss'

interface ArrowButtonProps {
  onClick: () => void;
  orientation: 'left' | 'right';
  className?: string;
}

const ArrowButton = ({ onClick, orientation, className }: ArrowButtonProps) => {
  return (
    <div className="arrow-button">
      <button type="button" className={`${orientation} ${className || ''}`} onClick={onClick}>ARROW</button>
    </div>
  )
}

export default ArrowButton
import React from "react";

type Props = JSX.IntrinsicElements["svg"];

const NextButton = React.memo<Props>(props => {
  return (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        transform="rotate(-90 12 12)"
        d="M18.846 9.867a.478.478 0 0 0-.015-.716.625.625 0 0 0-.799-.013l-5.611 5.027a.778.778 0 0 1-1.048-.009L5.968 9.138a.625.625 0 0 0-.8.013.478.478 0 0 0-.014.716l6.223 5.664c.294.267.74.27 1.038.008l6.43-5.672z"
        fill="#656565"
      />
    </svg>
  );
});

export default NextButton;

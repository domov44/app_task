// AnimationComponent.js

import React from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';

const StyledAnimation = styled(Lottie)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function AnimationComponent({ animationData, loop, autoplay }) {
  return (
    <StyledAnimation
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
    />
  );
}

export default AnimationComponent;

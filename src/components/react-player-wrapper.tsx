import React, { forwardRef } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

const ReactPlayerWrapper = forwardRef<ReactPlayer, ReactPlayerProps>((props, ref) => (
  <ReactPlayer ref={ref} {...props} />
));

export default ReactPlayerWrapper;

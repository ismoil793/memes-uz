import React, { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { isMac } from '@/utils/device';

const MemePrintScreenTip = () => {
  const tooltipText = useMemo(() => {
    if (isMac) return "To capture a screenshot use 'Command (⌘) + Shift + 4'.";
    return "To capture a screenshot use the 'Print Screen' key or 'Snipping Tool'.";
  }, []);

  return (
    <Tooltip id="meme-tooltip" style={{ background: '#6441a5' }}>
      <div style={{ maxWidth: 200 }}>{tooltipText}</div>
    </Tooltip>
  );
};

export default MemePrintScreenTip;

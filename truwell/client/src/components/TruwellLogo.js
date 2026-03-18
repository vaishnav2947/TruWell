import React from 'react';

/**
 * TruwellLogo — renders the official Truwell Pharmacy PNG logo.
 *
 * Props:
 *   size    — scale multiplier, default 1 (base height ~52px)
 *   dark    — if true, renders white version for dark backgrounds
 *   compact — reduces height slightly for tight spaces
 */
export default function TruwellLogo({ size = 1, dark = false, compact = false }) {
  const height = (compact ? 40 : 52) * size;

  return (
    <img
      src="/truwell-logo.png"
      alt="Truwell Pharmacy"
      height={height}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: dark ? 'brightness(0) invert(1)' : 'none',
        objectFit: 'contain',
        maxWidth: '100%',
      }}
    />
  );
}

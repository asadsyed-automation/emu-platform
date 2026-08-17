import React, { useEffect, useState, useRef } from 'react';

export const AnimatedCounter = ({
  target,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const targetNum = typeof target === 'number' ? target : parseFloat(target) || 0;

  useEffect(() => {
    let animationFrameId;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const currentVal = targetNum * easeOutCubic(progress);

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(targetNum);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum, duration]);

  const formattedValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toString();

  return (
    <span>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

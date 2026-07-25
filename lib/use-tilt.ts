"use client";

import { useCallback, useRef, useEffect } from "react";

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  disabled?: boolean | null;
}

/**
 * useTilt — lightweight 3D card tilt on hover.
 *
 * Attach the returned ref to the card element. The card tilts toward
 * the cursor position using CSS perspective + rotateX/rotateY, up to
 * `maxTilt` degrees. Resets smoothly on mouse leave.
 */
export function useTilt<T extends HTMLElement = HTMLElement>({
  maxTilt = 6,
  perspective = 1000,
  scale = 1.01,
  speed = 200,
  disabled = false,
}: TiltOptions = {}) {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el || disabled === true) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const rotateY = deltaX * maxTilt;
      const rotateX = -deltaY * maxTilt;

      el.style.transform = `
        perspective(${perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;
    },
    [maxTilt, perspective, scale, disabled]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el || disabled === true) return;
    el.style.transform = `
      perspective(${perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
  }, [perspective, disabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled === true) return;

    el.style.transition = `transform ${speed}ms ease-out`;
    el.style.willChange = "transform";
    el.style.transformStyle = "preserve-3d";

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.style.transition = "";
      el.style.willChange = "";
      el.style.transformStyle = "";
      el.style.transform = "";
    };
  }, [handleMouseMove, handleMouseLeave, speed, disabled]);

  return ref;
}

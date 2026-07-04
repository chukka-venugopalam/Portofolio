"use client";

import dynamic from "next/dynamic";

/**
 * SceneAccents — lightweight 3D accent objects across the page
 *
 * To keep GPU cost low: only 2 accent objects, each with DPR limit [1, 1.2].
 * Sizing is explicit on wrapper divs so Canvas elements render correctly.
 * Hidden on mobile/tablet via `hidden desktop:block`.
 */

const FloatingSphere = dynamic(
  () => import("@/components/home/FloatingSphere"),
  { ssr: false }
);

const GeometricPrism = dynamic(
  () => import("@/components/home/GeometricPrism"),
  { ssr: false }
);

export function SceneAccents() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none hidden desktop:block" aria-hidden="true">
        <div className="relative w-full h-full">
          {/* Floating sphere — top right area */}
          <div className="absolute right-[8%] top-[18vh] w-[120px] h-[120px]">
            <FloatingSphere />
          </div>

          {/* Geometric prism — mid-left area */}
          <div className="absolute left-[5%] top-[55vh] w-[100px] h-[100px]">
            <GeometricPrism />
          </div>
        </div>
      </div>
    </>
  );
}

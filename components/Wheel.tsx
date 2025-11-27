import React, { useEffect, useRef, useState } from "react";
import { FoodItem } from "../types";
import mascot from '../assets/mascot.png';

interface WheelProps {
  items: FoodItem[];
  isSpinning: boolean;
  onSpinEnd: (selectedItem: FoodItem) => void;
  spinTrigger: number; // Increment to trigger a spin
}

const COLORS = [
  "#FFADAD", // Pastel Red
  "#FFD6A5", // Pastel Orange
  "#FDFFB6", // Pastel Yellow
  "#CAFFBF", // Pastel Green
  "#9BF6FF", // Pastel Cyan
  "#A0C4FF", // Pastel Blue
  "#BDB2FF", // Pastel Purple
  "#FFC6FF", // Pastel Pink
];

// Helper to create pie slice path
const getCoordinatesForPercent = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

const MakeSlice: React.FC<{ item: FoodItem; index: number; total: number }> = ({ item, index, total }) => {
  const startPercent = index / total;
  const endPercent = (index + 1) / total;
  const [startX, startY] = getCoordinatesForPercent(startPercent);
  const [endX, endY] = getCoordinatesForPercent(endPercent);

  const largeArcFlag = 1 / total > 0.5 ? 1 : 0;

  const pathData = [
    `M 0 0`,
    `L ${startX} ${startY}`,
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    `L 0 0`,
  ].join(" ");

  // Text rotation
  const midPercent = startPercent + (0.5 / total);
  const rotationAngle = midPercent * 360; // 0 is 3 o'clock. 
  // We want text to read outwards or inwards.

  return (
    <g>
      <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth="0.02" />
      <g transform={`rotate(${rotationAngle}) translate(0.6, 0)`}>
        {/* Text is centered at 0.6 radius. We rotate text to be upright or radial? Radial looks best on wheels. */}
        <text
          x="0"
          y="0"
          fill="#221910"
          fontSize="0.12"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(90)`} // Rotate text to be perpendicular to radius
          style={{ fontFamily: 'Be Vietnam Pro', pointerEvents: 'none' }}
        >
          {item.name.length > 12 ? item.name.substring(0, 10) + '..' : item.name}
        </text>
        {/* Icon could go here too */}
      </g>
    </g>
  );
};

export const Wheel: React.FC<WheelProps> = ({ items, isSpinning, onSpinEnd, spinTrigger }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // We need at least 1 item to render. If empty, we might show a placeholder.
  const safeItems = items.length > 0 ? items : [{ id: '0', name: 'Thêm Món Đi!', icon: 'add' }];

  useEffect(() => {
    if (spinTrigger > 0) {
      handleSpin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinTrigger]);

  const handleSpin = () => {
    const sliceDeg = 360 / safeItems.length;
    const randomSegmentIndex = Math.floor(Math.random() * safeItems.length);

    // Calculate rotation to land on randomSegmentIndex at the LEFT (270 degrees relative to Top)
    // Current logic: Index 0 starts at Top (0 deg visual).
    // To get Index X to Left (270 deg):
    // Rotation required = (Angle of Index X) - 270 ? No.

    // Let's stick to the robust math:
    // We want to rotate randomly. Then calculate who won.
    const newRotation = rotation + 1800 + Math.random() * 360;

    setRotation(newRotation);

    // Calculate winner based on final rotation
    setTimeout(() => {
      const degreesPerSlice = 360 / safeItems.length;

      // Pointer is at LEFT (9 o'clock).
      // Relative to Top (12 o'clock), Left is 270 degrees (clockwise).
      // Formula: (PointerPos - Rotation) % 360
      // PointerPos = 270.

      const effectiveAngle = (270 - (newRotation % 360) + 360) % 360;
      const winningIndex = Math.floor(effectiveAngle / degreesPerSlice);

      onSpinEnd(safeItems[winningIndex]);
    }, 4500); // 4.5s matches CSS transition
  };

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto my-4 flex items-center justify-center pl-16 md:pl-0">
      {/* Mascot Pointer (Left Side) */}
      <div className="absolute left-[-16px] md:left-[-150px] top-1/2 -translate-y-1/2 z-20 w-28 h-28 md:w-40 md:h-40 pointer-events-none">
        <img
          src={mascot}
          alt="Mascot Pointer"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Wheel Container */}
      <div className="w-full h-full rounded-full border-[8px] border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-800 relative z-10">
        <div
          ref={wheelRef}
          className="w-full h-full transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: '4.5s',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.3, 1)'
          }}
        >
          <svg
            viewBox="-1 -1 2 2"
            className="w-full h-full transform -rotate-90" // Start at 12 o'clock
            style={{ overflow: 'visible' }}
          >
            {safeItems.map((item, index) => (
              <MakeSlice key={item.id} item={item} index={index} total={safeItems.length} />
            ))}
          </svg>
        </div>

        {/* Center Cap */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-md z-20 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
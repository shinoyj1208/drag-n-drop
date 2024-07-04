import React, { useState } from "react";
import { Connection } from "../utils/modals";

interface ConnectionsProps {
  connections: Connection[];
}

export const Connections: React.FC<ConnectionsProps> = ({ connections }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedMidX, setDraggedMidX] = useState<number | null>(null);
  const [draggedMidY, setDraggedMidY] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement>, index: number) => {
    setDraggedIndex(index);
    setDraggedMidX(e.clientX);
    setDraggedMidY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedIndex !== null) {
      const svg = e.currentTarget;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const cursorPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      setDraggedMidX(cursorPoint.x);
      setDraggedMidY(cursorPoint.y);
    }
  };

  const handleMouseUp = () => {
    setDraggedIndex(null);
    setDraggedMidX(null);
    setDraggedMidY(null);
  };

  const createPath = (conn: Connection, index: number) => {
    const { from, to } = conn;
    const midX = draggedIndex === index && draggedMidX !== null ? draggedMidX : (from.x + to.x) / 2;
    const midY = draggedIndex === index && draggedMidY !== null ? draggedMidY : (from.y + to.y) / 2;

    const path = `M ${from.x} ${from.y} 
                  Q ${midX} ${from.y}, ${midX} ${midY}
                  T ${to.x} ${to.y}`;

    return { path, midX, midY };
  };

  const calculateRotation = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  };

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {connections.map((conn, index) => {
        const { path, midX, midY } = createPath(conn, index);
        const angle = calculateRotation(conn.from, conn.to);

        return (
          <g key={index}>
            <path
              d={path}
              stroke="#EB9B41"
              strokeWidth="2"
              fill="none"
            />
            <circle cx={conn.from.x} cy={conn.from.y} r="5" fill="#EB9B41" />
            <polygon
              points={`${conn.to.x},${conn.to.y - 5} ${conn.to.x + 10},${conn.to.y} ${conn.to.x},${conn.to.y + 5}`}
              fill="#EB9B41"
              transform={`rotate(${angle} ${conn.to.x} ${conn.to.y})`}
            />
            <circle
              cx={midX}
              cy={midY}
              r="5"
              fill="#888888"
              cursor="move"
              onMouseDown={(e) => handleMouseDown(e, index)}
            />
          </g>
        );
      })}
    </svg>
  );
};

import React from "react";
import { Connection } from "../utils/modals";

interface ConnectionsProps {
  connections: Connection[];
}

export const Connections: React.FC<ConnectionsProps> = ({ connections }) => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {connections.map((conn, index) => (
        <line
          key={index}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke="black"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};

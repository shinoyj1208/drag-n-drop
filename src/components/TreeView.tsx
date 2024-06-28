import React, { useState } from "react";
import { Table } from "../utils/modals";

interface TreeProps {
  tables: Table[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, table: Table) => void;
}

export const TreeView: React.FC<TreeProps> = ({ tables, onDragStart }) => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  const togglePanel = (tableId: string) => {
    setOpenPanel((prev) => (prev === tableId ? null : tableId));
  };

  return (
    <div className="">
      {tables.map((table) => (
        <div key={table.id} className="mb-2">
          <div
            className="flex items-center justify-between cursor-pointer py-2 px-4 bg-gray-100"
            onClick={() => togglePanel(table.id)}
            draggable
            onDragStart={(e) => onDragStart(e, table)}
          >
            <div className="flex text-sm font-bold flex-grow cursor-pointer items-start">
              {openPanel !== table.id ? (
                <img className="mt-1 mr-2" width={15} src="plus.png" alt="open icon" />
              ) : (
                <img className="mt-1 mr-2" width={15} src="minus.png" alt="close icon" />
              )}

              <img
                className="mt-1 mr-2"
                src="table-icon.png"
                alt="table icon"
                width={15}
                height={15}
              />
              <span>{table.name}</span>
            </div>
          </div>
          {openPanel === table.id && (
            <ul className="ml-4 pl-7 tree-view-list">
              {table.columns.map((column) => (
                <li key={column.column_id} className="cursor-pointer text-sm">
                  {column.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

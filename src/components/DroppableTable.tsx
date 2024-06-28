import React, { useRef, useEffect, useState, DragEvent } from "react";
import { Rnd } from "react-rnd";
import {
  Table as TableType,
  Column,
  Connection,
  Position,
} from "../utils/modals";

interface TableProps {
  table: TableType;
  onRemove: (id: string) => void;
  addConnection: (from: Connection["from"], to: Connection["to"]) => void;
  isGlowing: boolean;
}

export const DroppableTable: React.FC<TableProps> = ({
  table,
  onRemove,
  addConnection,
  isGlowing,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [columnPositions, setColumnPositions] = useState<{
    [key: string]: Position;
  }>({});

  const handleColumnDragStart = (
    e: DragEvent<HTMLTableRowElement>,
    column: Column
  ) => {
    e.stopPropagation();
    e.dataTransfer.setData(
      "column",
      JSON.stringify({ ...column, tableId: table.id })
    );
  };

  const handleColumnDrop = (
    e: DragEvent<HTMLTableRowElement>,
    targetColumn: Column
  ) => {
    e.stopPropagation();
    const sourceColumn: Column & { tableId: string } = JSON.parse(
      e.dataTransfer.getData("column")
    );
    const targetPosition = columnPositions[targetColumn.column_id];
    const sourcePosition = columnPositions[sourceColumn.column_id];

    addConnection(
      { ...sourceColumn, ...sourcePosition },
      { ...targetColumn, tableId: table.id, ...targetPosition }
    );
  };

  useEffect(() => {
    const updatePositions = () => {
      const positions: { [key: string]: Position } = {};
      table.columns.forEach((col) => {
        const element = tableRef.current?.querySelector(
          `[data-column-id='${col.column_id}']`
        );
        if (element) {
          const rect = element.getBoundingClientRect();
          positions[col.column_id] = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }
      });
      setColumnPositions(positions);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, [table]);

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
      minWidth={150}
      minHeight={100}
      bounds="parent"
      className={`bg-white border shadow-lg rounded-xl overflow-hidden ${
        isGlowing ? "border-glow" : ""
      }`}
    >
      <div ref={tableRef} className="relative">
        <div className="flex p-3">
          <h3 className="flex text-sm font-bold flex-grow items-start">
            <img
              className="mt-1 mr-2"
              src="table-icon.png"
              alt="table icon"
              width={15}
              height={15}
            />
            <span>{table.name}</span>
          </h3>
          <button onClick={() => onRemove(table.id)}>
            <img
              src="/cross.png"
              alt="remove icon"
              width={20}
              height={20}
            ></img>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2 text-sm font-bold bg-sky-100">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                />{" "}
                Column
              </th>
              <th className="text-left p-2 text-sm font-bold bg-sky-100">
                Data type
              </th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((col) => (
              <tr
                key={col.column_id}
                data-column-id={col.column_id}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, col)}
                onDrop={(e) => handleColumnDrop(e, col)}
                className="p-1 border"
              >
                <td className="text-left p-2 text-sm">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  />{" "}
                  {col.name}
                </td>
                <td className="text-left p-2 text-sm">
                  {col.column_data_type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-center bg-gray-200 absolute w-full bottom-0 p-2">
          Scroll to see more columns
        </div>
      </div>
    </Rnd>
  );
};

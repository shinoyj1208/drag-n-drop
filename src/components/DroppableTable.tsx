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
  updateColumnPositions: (
    tableId: string,
    positions: { [key: string]: Position }
  ) => void;
  isGlowing: boolean;
  columnPositions: { [key: string]: { [key: string]: Position } };
}

export const DroppableTable: React.FC<TableProps> = ({
  table,
  onRemove,
  addConnection,
  updateColumnPositions,
  isGlowing,
  columnPositions,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);

  const handleColumnDragStart = (
    e: DragEvent<HTMLTableRowElement>,
    column: Column
  ) => {
    e.stopPropagation();
    setIsDraggingColumn(true);
    e.dataTransfer.setData(
      "column",
      JSON.stringify({ ...column, tableId: table.id })
    );
  };

  const handleColumnDrop = (
    e: DragEvent<HTMLTableRowElement>,
    targetColumn: Column
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingColumn(false);
    const sourceColumn: Column & { tableId: string } =
      e.dataTransfer.getData("column") &&
      JSON.parse(e.dataTransfer.getData("column"));
    if (sourceColumn.tableId === table.id) return;
    const sourcePosition =
      columnPositions[sourceColumn.tableId]?.[sourceColumn.column_id];
    const targetPosition = columnPositions[table.id]?.[targetColumn.column_id];
    if (sourcePosition && targetPosition) {
      addConnection(
        {
          ...sourceColumn,
          x: sourcePosition.x,
          y: sourcePosition.y,
          width: sourcePosition.width,
          left: sourcePosition.left,
          right: sourcePosition.right,
        },
        {
          ...targetColumn,
          tableId: table.id,
          x: targetPosition.x,
          y: targetPosition.y,
          width: targetPosition.width,
          left: targetPosition.left,
          right: targetPosition.right,
        }
      );
    }
  };

  const updatePositions = () => {
    const positions: { [key: string]: Position } = {};

    table.columns.forEach((col) => {
      const element = tableRef.current?.querySelector(
        `[data-column-id='${col.column_id}_${table.id}']`
      );
      if (element) {
        const rect = element.getBoundingClientRect();        
        positions[col.column_id] = {
          x: rect.x - 65,
          y: rect.y - 35,
          width: rect.width,
          left: rect.left,
          right: rect.right,
        };
      }
    });
    updateColumnPositions(table.id, positions);
  };

  useEffect(() => {
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
      minWidth={320}
      minHeight={200}
      bounds="parent"
      className={`bg-white border shadow-lg rounded-xl overflow-hidden relative ${
        isGlowing ? "border-glow" : ""
      }`}
      onDrag={updatePositions}
      onDragStart={updatePositions}
      onDragStop={updatePositions}
      onResize={updatePositions}
      dragHandleClassName="drag-handle"
      enableResizing={!isDraggingColumn}
    >
      <div ref={tableRef}>
        <div className="flex p-3 drag-handle">
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
                data-column-id={`${col.column_id}_${table.id}`}
                draggable
                onClick={() => setIsDraggingColumn(false)}
                onDragStart={(e) => handleColumnDragStart(e, col)}
                onDragOver={() => setIsDraggingColumn(false)}
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

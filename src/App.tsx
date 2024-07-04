import React, { useState, DragEvent, useEffect } from "react";
import { Connection, Table, Position } from "./utils/modals";
import { Connections } from "./components/Connections";
import { SAMPLE_TABLE } from "./utils/constant";
import { TreeView } from "./components/TreeView";
import { DroppableTable } from "./components/DroppableTable";

const App: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [columnPositions, setColumnPositions] = useState<{
    [key: string]: { [key: string]: Position };
  }>({});
  const [glowingTableId, setGlowingTableId] = useState<string | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("table");
    if (!data) {
      console.error("No table data found in dataTransfer");
      return;
    }

    try {
      const tableData: Table = JSON.parse(data);
      if (tableData && tableData.id && tableData.name && tableData.columns) {
        if (tables.find((table) => table.id === tableData.id)) {
          setGlowingTableId(tableData.id);
          setTimeout(() => setGlowingTableId(null), 2000);
        } else {
          setTables([...tables, tableData]);
        }
      } else {
        console.error("Invalid table data:", data);
      }
    } catch (error) {
      console.error("Error parsing table data:", error, data);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, table: Table) => {
    e.dataTransfer.setData("table", JSON.stringify(table));
  };

  const removeTable = (id: string) => {
    setTables(tables.filter((table) => table.id !== id));
    setConnections(
      connections.filter(
        (conn) => conn.from.tableId !== id && conn.to.tableId !== id
      )
    );
  };

  const calculateConnectionPositions = (
    from: Connection["from"],
    to: Connection["to"]
  ) => {
    const fromPosition = columnPositions[from.tableId]?.[from.column_id];
    const toPosition = columnPositions[to.tableId]?.[to.column_id];

    if (fromPosition && toPosition) {
      const newConnection = {
        from: {
          ...from,
          x: fromPosition.x,
          y: fromPosition.y,
        },
        to: {
          ...to,
          x: toPosition.x,
          y: toPosition.y,
        },
      };

      if (fromPosition.x > toPosition.x) {
        newConnection.from.x = fromPosition.x - 320;
        newConnection.to.x =
          toPosition.width > 320
            ? toPosition.x + toPosition.width - 320
            : toPosition.x;
      } else {
        newConnection.to.x = toPosition.x - 320;
        newConnection.from.x =
          fromPosition.width > 320
            ? fromPosition.x + fromPosition.width - 320
            : fromPosition.x;
      }

      return newConnection;
    }
    return null;
  };

  const updateConnections = () => {
    setConnections((prevConnections) =>
      prevConnections.map((conn) => {
        const updatedConnection = calculateConnectionPositions(
          conn.from,
          conn.to
        );
        return updatedConnection || conn;
      })
    );
  };

  const addConnection = (from: Connection["from"], to: Connection["to"]) => {
    const newConnection = calculateConnectionPositions(from, to);
    if (newConnection) {
      setConnections((prevConnections) => [...prevConnections, newConnection]);
    }
  };

  const updateColumnPositions = (
    tableId: string,
    positions: { [key: string]: Position }
  ) => {
    setColumnPositions((prev) => ({ ...prev, [tableId]: positions }));
  };

  useEffect(() => {
    updateConnections();
  }, [tables, columnPositions]);

  return (
    <div className="flex h-screen p-10 gap-5 bg-gray-100">
      <div className="w-full lg:w-1/6 bg-white bg-stripes-gray p-4">
        <TreeView tables={SAMPLE_TABLE} onDragStart={handleDragStart} />
      </div>
      <div className="p-4 bg-white w-full lg:w-5/6">
        <div
          className="relative w-full h-full p-4"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{ backgroundImage: `url('backdrop.jpg')` }}
        >
          {tables.map((table) => (
            <DroppableTable
              key={table.id}
              table={table}
              onRemove={removeTable}
              addConnection={addConnection}
              updateColumnPositions={updateColumnPositions}
              isGlowing={table.id === glowingTableId}
              columnPositions={columnPositions}
            />
          ))}
          <Connections connections={connections} />
        </div>
      </div>
    </div>
  );
};

export default App;

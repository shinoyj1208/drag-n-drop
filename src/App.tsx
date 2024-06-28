import React, { useState, DragEvent } from "react";
import { Connection, Table } from "./utils/modals";
import { Connections } from "./components/Connections";
import { SAMPLE_TABLE } from "./utils/constant";
import { TreeView } from "./components/TreeView";
import { DroppableTable } from "./components/DroppableTable";

const App: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
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
          setTimeout(() => setGlowingTableId(null), 2000); // Remove glow after 2 seconds
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

  const addConnection = (from: Connection["from"], to: Connection["to"]) => {
    setConnections([...connections, { from, to }]);
  };

  return (
    <div className="flex h-screen p-10 gap-5">
      <div className="w-full lg:w-1/6 bg-gray-100 bg-stripes-gray p-4">
        <TreeView tables={SAMPLE_TABLE} onDragStart={handleDragStart} />
      </div>
      <div
        className="relative w-full lg:w-5/6 p-4"
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
            isGlowing={table.id === glowingTableId}
          />
        ))}
        <Connections connections={connections} />
      </div>
    </div>
  );
};

export default App;

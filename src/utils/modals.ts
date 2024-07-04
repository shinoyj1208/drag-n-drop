export interface Column {
  column_id: string;
  name: string;
  column_data_type: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}

export interface Connection {
  from: Position & Column & { tableId: string };
  to: Position & Column & { tableId: string };
}

export interface Position {
  x: number;
  y: number;
  width: number;
  left: number;
  right: number;
}

export const SAMPLE_TABLE = [
  {
    id: "table_1",
    name: "employees",
    columns: [
      {
        column_id: "column_1",
        name: "employee_id",
        column_data_type: "integer",
      },
      {
        column_id: "column_2",
        name: "email",
        column_data_type: "string",
      },
      {
        column_id: "column_3",
        name: "department_id",
        column_data_type: "integer",
      }
    ],
  },
  {
    id: "table_2",
    name: "employee_salary",
    columns: [
      {
        column_id: "column_1",
        name: "age",
        column_data_type: "integer",
      },
      {
        column_id: "column_2",
        name: "employee_id",
        column_data_type: "integer",
      },
      {
        column_id: "column_3",
        name: "Experience",
        column_data_type: "integer",
      },
    ],
  },
  {
    id: "table_3",
    name: "patients",
    columns: [
      {
        column_id: "column_1",
        name: "first_name",
        column_data_type: "varchar(50)",
      },
      {
        column_id: "column_2",
        name: "last_name",
        column_data_type: "varchar(50)",
      },
      {
        column_id: "column_3",
        name: "gender",
        column_data_type: "varchar(10)",
      },
      {
        column_id: "column_4",
        name: "date_of_birth",
        column_data_type: "date",
      }
    ],
  }
];

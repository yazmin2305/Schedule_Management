import React, { useEffect, useRef, useState } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import "../../App.css";

import axios from "axios";

function Dashboardteacher() {
  const [teachers, setTeachers] = useState([]);
  const [teacherDialog, setTeacherDialog] = useState(false);
  const [teacher, setTeacher] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  //Referencias
  const toast = useRef(null);
  const dt = useRef(null);

  /**
   * Metodo para cargar los profesores de la base de datos
   */
  const loadTeacher = () => {
    let baseUrl = "http://localhost:8080/teacher";
    axios.get(baseUrl).then((response) => {
      setTeachers(
        response.data.map((teacher) => {
          return {
            id: teacher.id,
            area: teacher.area,
            identityCard: teacher.identityCard,
            lastname: teacher.lastname,
            name: teacher.name,
            status: teacher.status,
            tipo_id: teacher.tipo_id,
            type: teacher.type,
            typeContract: teacher.typeContract,
          };
        })
      );
    });
  };

  /**
   * Rrepresentacion del objeto que se va a guardar en la base de datos
   */
  let emptyTeacher = {
    id: null,
    area: "",
    identityCard: "",
    lastname: "",
    name: "",
    status: "",
    tipo_id: "",
    type: "",
    typeContract: "",
  };

  useEffect(() => {
    loadTeacher();
  }, []);

  const openNew = () => {
    setTeacher(emptyTeacher);
    setSubmitted(false);
    setTeacherDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTeacherDialog(false);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _teacher = { ...teacher };
    _teacher[`${name}`] = val;

    setTeacher(_teacher);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Nuevo profesor"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={(e) => {
            //openNew();
            //setIsEdit(false);
          }}
        />
        {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTeachers || !selectedTeachers.length} /> */}
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
      </React.Fragment>
    );
  };

  /**
   * Template de las acciones de la tabla de profesores
   * @param {*} rowData informacion de la fila
   * @returns
   */
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          //onClick={() => editTeacher(rowData)}
        />
        <Button
          icon="pi pi-eye-slash"
          className="p-button-rounded p-button-warning"
          //onClick={() => confirmDeleteTeacher(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Profesores</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
        <DataTable
          ref={dt}
          value={teachers}
          //selection={selectedTeachers}
          //onSelectionChange={(e) => setSelectedTeachers(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} profesores"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          <Column field="id" header="Id" style={{ minWidth: "6rem" }}></Column>
          <Column
            field="name"
            header="Nombre"
            sortable
            style={{ minWidth: "9rem" }}
          ></Column>
          <Column
            field="lastname"
            header="Apellido"
            style={{ minWidth: "9rem" }}
          ></Column>

          <Column
            field="identityCard"
            header="Identificación"
            style={{ minWidth: "9rem" }}
          ></Column>
          <Column
            field="area"
            header="Area"
            style={{ minWidth: "9rem" }}
          ></Column>
          <Column field="type" header="Tipo"></Column>
          <Column
            field="typeContract"
            header="Tipo contrato"
            style={{ minWidth: "9rem" }}
          ></Column>
          <Column
            field="status"
            header="Estado"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
export default Dashboardteacher;

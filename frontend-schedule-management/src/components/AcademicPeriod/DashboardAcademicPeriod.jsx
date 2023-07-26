import React, { useEffect, useRef, useState } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import logo from "../../assets/img/logo.png";
import "../../App.css";

import axios from "axios";

function DashboardAcademicPeriod() {
  const [academicPeriods, setAcademicPeriods] = useState(null);
  const [academicPeriodDialog, setAcademicPeriodDialog] = useState(false);
  const [deleteAcademicPeriodDialog, setDeleteAcademicPeriodDialog] =
    useState(false);
  const [deleteAcademicPeriodsDialog, setDeleteAcademicPeriodsDialog] =
    useState(false);
  const [academicPeriod, setAcademicPeriod] = useState([]);
  const [selectedAcademicPeriods, setSelectedAcademicPeriod] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectType, setSelectType] = useState(null);
  //calendario
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFinalizacion, setFechaFinalizacion] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [programsDialog, setProgramsDialog] = useState(false);

  //Se declara un estado para controlar cuando se edita o se crea una competencia
  const [isEdit, setIsEdit] = useState(false);

  //Referencias
  const toast = useRef(null);
  const dt = useRef(null);
  const [dateIni, setDateIni] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);

  const loadAcademicPeriod = () => {
    let baseUrl = "http://localhost:8080/academicPeriod";
    axios.get(baseUrl).then((response) =>
      setAcademicPeriods(
        response.data.map((academicPeriod) => {
          return {
            id: academicPeriod.id,
            name: academicPeriod.name,
            date_init: academicPeriod.date_init,
            date_end: academicPeriod.date_end,
          };
        })
      )
    );
  };

  const loadPrograms = (id) => {
    console.log("id", id);
    //return 0;

    let baseUrl = "http://localhost:8080/program/programAcademicPeriod/" + id;
    axios.get(baseUrl).then((response) =>
      setPrograms(
        response.data.map((program) => {
          return {
            id: program.id,
            code: program.code,
            name: program.name,
            academic_period_id: program.academic_period_id,
          };
        })
      )
    );
  };

  let emptyAcademicPeriod = {
    id: null,
    name: "",
    date_init: "",
    date_end: "",
  };

  useEffect(() => {
    loadAcademicPeriod();
    console.log("academic Period", academicPeriod);
  }, []);

  const openNew = () => {
    setAcademicPeriod(emptyAcademicPeriod);
    setSubmitted(false);
    setAcademicPeriodDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setAcademicPeriodDialog(false);
    setDateIni(null);
    setDateEnd(null);
  };

  const hidedeleteAcademicPeriodDialog = () => {
    setDeleteAcademicPeriodDialog(false);
  };

  const hidedeleteAcademicPeriodsDialog = () => {
    setDeleteAcademicPeriodsDialog(false);
  };

  const saveacademicPeriod = () => {
    setSubmitted(true);
    console.log("academicPeriod", academicPeriod);
    //return 0;
    let academicPeriodSave = {
      name: academicPeriod.name,
      date_init: academicPeriod.date_init,
      date_end: academicPeriod.date_end,
    };
    //Fecha inicio
    // let fecha = academicPeriod.date_init;
    // let dia = fecha.getDate() < 9 ? `0${fecha.getDate()}` : fecha.getDate();
    // let mes =
    //   fecha.getMonth() + 1 < 9
    //     ? `0${fecha.getMonth() + 1}`
    //     : fecha.getMonth() + 1;
    // let year = fecha.getFullYear();
    // let fechaCompletaIni = `${year}-${mes}-${dia}`;
    // academicPeriod.date_init = fechaCompletaIni;
    // //Fecha finalizacion
    // let fechaFin = academicPeriod.date_end;
    // let diaFin =
    //   fechaFin.getDate() < 9 ? `0${fechaFin.getDate()}` : fechaFin.getDate();
    // let mesFin =
    //   fechaFin.getMonth() + 1 < 9
    //     ? `0${fechaFin.getMonth() + 1}`
    //     : fechaFin.getMonth() + 1;
    // let yearFin = fechaFin.getFullYear();
    // let fechaCompletaFin = `${yearFin}-${mesFin}-${diaFin}`;
    // academicPeriod.date_end = fechaCompletaFin;
    console.log("que paso", academicPeriod);

    if (!isEdit) {
      console.log("crear");
      //hago la peticion a la api para guardar el registro
      axios
        .post("http://localhost:8080/academicPeriod", academicPeriodSave)
        .then((response) => {
          if (response.data != null) {
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Periodo Académico creado",
              life: 5000,
            });
            console.log("periodoAcademicoCrear", academicPeriodSave);
            setAcademicPeriodDialog(false);
            setAcademicPeriod(emptyAcademicPeriod);
            setDateIni(null);
            setDateEnd(null);
            loadAcademicPeriod();
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Ocurrió unerror, por favor vuelve a intentarlo",
              life: 5000,
            });
            setAcademicPeriodDialog(false);
            setAcademicPeriod(emptyAcademicPeriod);
          }
        });
    } else {
      console.log(academicPeriod.id);
      console.log("fecha inicio editar", academicPeriod.date_init);
      console.log("periodoAcademico Editar", academicPeriodSave);
      //return 0;
      //Hago la peticion a la api para que guarde el programa academico editado
      axios
        .patch(
          "http://localhost:8080/academicPeriod/" + academicPeriod.id,
          academicPeriodSave
        )
        .then((response) => {
          if (response.data != null) {
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Programa actualizado",
              life: 5000,
            });
            setAcademicPeriodDialog(false);
            setAcademicPeriod(emptyAcademicPeriod);
            setDateIni(null);
            setDateEnd(null);
            loadAcademicPeriod();
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Ocurrió un error, por favor vuelve a intentarlo",
              life: 5000,
            });
            setAcademicPeriodDialog(false);
            setAcademicPeriod(emptyAcademicPeriod);
          }
        });
    }
  };

  const editacademicPeriod = (academicPeriod) => {
    setAcademicPeriod({ ...academicPeriod });
    setDateIni(new Date(academicPeriod.date_init));
    setDateEnd(new Date(academicPeriod.date_end));
    setAcademicPeriodDialog(true);
    setIsEdit(true);
  };

  const showPrograms = (programs) => {
    // setPrograms({...programs});
    setProgramsDialog(true);
  };

  const hideProgramDialog = () => {
    setProgramsDialog(false);
  };

  const confirmDeleteacademicPeriod = (academicPeriod) => {
    setAcademicPeriod(academicPeriod);
    setDeleteAcademicPeriodDialog(true);
  };

  const deleteacademicPeriod = () => {
    let _academicPeriods = academicPeriods.filter(
      (val) => val.id !== academicPeriod.id
    );
    setAcademicPeriods(_academicPeriods);
    setDeleteAcademicPeriodDialog(false);
    setAcademicPeriod(emptyAcademicPeriod);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "academicPeriod Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < academicPeriods.length; i++) {
      if (academicPeriods[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const confirmDeleteSelected = () => {
    setDeleteAcademicPeriodsDialog(true);
  };

  const deleteSelectedacademicPeriods = () => {
    let _academicPeriods = academicPeriods.filter(
      (val) => !selectedAcademicPeriods.includes(val)
    );
    setAcademicPeriods(_academicPeriods);
    setDeleteAcademicPeriodsDialog(false);
    setSelectedAcademicPeriod(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "academicPeriods Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _academicPeriod = { ...academicPeriod };
    _academicPeriod["category"] = e.value;
    setAcademicPeriod(_academicPeriod);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _academicPeriod = { ...academicPeriod };
    _academicPeriod[`${name}`] = val;

    setAcademicPeriod(_academicPeriod);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _academicPeriod = { ...academicPeriod };
    _academicPeriod[`${name}`] = val;

    setAcademicPeriod(_academicPeriod);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Nuevo periodo académico"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={(e) => {
            openNew();
            setIsEdit(false);
          }}
        />
        {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedAcademicPeriods || !selectedAcademicPeriods.length} /> */}
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

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editacademicPeriod(rowData)}
        />
        {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteacademicPeriod(rowData)} /> */}
        <Button
          label="Programas asociados"
          onClick={() => {
            showPrograms(loadPrograms(rowData.id));
          }}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Periodos Académicos</h5>
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
  const academicPeriodDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        style={{ color: "gray" }}
        onClick={hideDialog}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        style={{ color: "#5EB319" }}
        onClick={saveacademicPeriod}
      />
    </React.Fragment>
  );
  const deleteAcademicPeriodDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hidedeleteAcademicPeriodDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteacademicPeriod}
      />
    </React.Fragment>
  );
  const deleteAcademicPeriodsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hidedeleteAcademicPeriodsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedacademicPeriods}
      />
    </React.Fragment>
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
          value={academicPeriods}
          selection={selectedAcademicPeriods}
          onSelectionChange={(e) => setSelectedAcademicPeriod(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} periodos académicos"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          <Column field="id" header="Id" style={{ minWidth: "8rem" }}></Column>
          <Column
            field="name"
            header="Nombre"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column field="date_init" header="Fecha de inicio"></Column>
          <Column
            field="date_end"
            header="Fecha de finalización"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={academicPeriodDialog}
        style={{ width: "450px" }}
        header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
        modal
        className="p-fluid"
        footer={academicPeriodDialogFooter}
        onHide={hideDialog}
      >
        <div
          className="title-form"
          style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}
        >
          <p style={{ marginTop: "0px" }}>Crear Periodo Académico</p>
        </div>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <InputText
            id="name"
            value={academicPeriod.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !academicPeriod.name,
            })}
          />
          {submitted && !academicPeriod.name && (
            <small className="p-error">Nombre requerido.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="date_init">Fecha de Inicio</label>
          <Calendar
            id="date_init"
            dateFormat="yy-mm-dd"
            value={dateIni}
            onChange={(e) => {
              setFechaInicio(e.value);
              onInputChange(e, "date_init");
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="date_end">Fecha de Finalización</label>
          <Calendar
            id="date_end"
            dateFormat="yy-mm-dd"
            value={dateEnd}
            onChange={(e) => {
              setFechaFinalizacion(e.value);
              onInputChange(e, "date_end");
            }}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteAcademicPeriodDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteAcademicPeriodDialogFooter}
        onHide={hidedeleteAcademicPeriodDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {academicPeriod && (
            <span>
              Are you sure you want to delete <b>{academicPeriod.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteAcademicPeriodsDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteAcademicPeriodsDialogFooter}
        onHide={hidedeleteAcademicPeriodsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {academicPeriod && (
            <span>
              Are you sure you want to delete the selected academicPeriods?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={programsDialog}
        style={{ width: "450px" }}
        header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
        modal
        className="p-fluid"
        onHide={hideProgramDialog}
      >
        <div
          className="title-form"
          style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}
        >
          <p style={{ marginTop: "0px" }}>Lista de programas asociados</p>
        </div>

        <div className="card">
          <DataTable
            ref={dt}
            value={programs}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} programas"
            responsiveLayout="scroll"
          >
            <Column
              field="code"
              header="Código"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>
            <Column field="name" header="Nombre"></Column>
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
}
export default DashboardAcademicPeriod;

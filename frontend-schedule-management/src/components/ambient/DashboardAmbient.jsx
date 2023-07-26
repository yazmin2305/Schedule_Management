import React, { useEffect, useRef, useState } from "react";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import logo from '../../assets/img/logo.png';
import '../../App.css';

import axios from "axios";

function DashboardAmbient() {

    const [ambients, setAmbients] = useState(null);
    const [ambientDialog, setAmbientDialog] = useState(false);
    const [disabledAmbientDialog, setDisabledAmbientDialog] = useState(false);
    const [disabledAmbientsDialog, setDisabledAmbientsDialog] = useState(false);
    const [ambient, setAmbient] = useState([]);
    const [selectedAmbient, setSelectedAmbient] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectType, setSelectType] = useState(null);
    //Se declara un estado para controlar cuando se edita o se crea una competencia
    const [isEdit, setIsEdit] = useState(false);

    //Referencias 
    const toast = useRef(null);
    const dt = useRef(null);

    const loadAmbient = () => {
        let baseUrl = "http://localhost:8080/ambient";
        axios.get(baseUrl).then(response =>
            setAmbients(
                response.data.map((ambient) => {
                    return {
                        id: ambient.id,
                        name: ambient.name,
                        location: ambient.location,
                        typeEnvironment: ambient.typeEnvironment,
                        typeEnvironment_id: ambient.typeEnvironment === "PRESENCIAL" ? 1 : 0,
                        ability: ambient.ability,
                        state: ambient.state,
                    }
                })
            )
        );
    };

    let emptyAmbient = {
        id: null,
        name: '',
        location: '',
        typeEnvironment: -1,
        ability: '',
        state: '',
    };

    const typeOptions = [
        {
            label: 'VIRTUAL',
            value: 0
        },
        {
            label: 'PRESENCIAL',
            value: 1
        }
    ];

    useEffect(() => {
        loadAmbient();
    }, []);

    const openNew = () => {
        setAmbient(emptyAmbient);
        setSubmitted(false);
        setAmbientDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setAmbientDialog(false);
    }

    const hideDisabledAmbientDialog = () => {
        setDisabledAmbientDialog(false);
    }

    const hideDisabledAmbientsDialog = () => {
        setDisabledAmbientsDialog(false);
    }

    const saveAmbient = () => {
        setSubmitted(true);

        //completo los campos 
        ambient.state = 'Activo';
        //delete ambient.id; //elimino el id porque es autoincrementable
        console.log("ambient", ambient);

        let ambientSave = {
            name: ambient.name,
            location: ambient.location,
            typeEnvironment: ambient.typeEnvironment_id,
            ability: ambient.ability,
            state: ambient.state,
        }
        console.log("estado", ambientSave)
        // return 0;

        if (!isEdit) {
            // console.log("crear");
            //hago la peticion a la api para guardar el registro
            axios.post("http://localhost:8080/ambient", ambientSave)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ambiente creado', life: 5000 });
                        setAmbientDialog(false);
                        setAmbient(emptyAmbient);
                        loadAmbient();
                    } else {
                        toast.current.show({
                            severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                            , life: 5000
                        });
                        setAmbientDialog(false);
                        setAmbient(emptyAmbient);
                    }
                });
        } else {
            console.log(ambient.id)
            console.log('ambient', ambientSave)
            //return 0;
            //hago la peticion a la api para que guarde la competencia editada 
            axios.patch("http://localhost:8080/ambient/" + ambient.id, ambientSave)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ambiente actualizada', life: 5000 });
                        setAmbientDialog(false);
                        setAmbient(emptyAmbient);
                        loadAmbient();
                    } else {
                        toast.current.show({
                            severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                            , life: 5000
                        });
                        setAmbientDialog(false);
                        setAmbient(emptyAmbient);
                    }
                });
        }
    }

    const editAmbient = (ambient) => {
        setAmbient({ ...ambient });
        setAmbientDialog(true);
        setIsEdit(true);
    }

    const confirmDisabledAmbient = (ambient) => {
        setAmbient(ambient);
        setDisabledAmbientDialog(true);
    }

    /**
    * Metodo para desactivar una competencia de la base de datos
    */
    const disabledAmbient = () => {
        //desactivo el registro en la base de datos 
        axios.patch("http://localhost:8080/ambient/disable/" + ambient.id)
            .then(response => {
                if (response.data != null) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ambiente desactivado', life: 5000 });
                    setDisabledAmbientDialog(false);
                    setAmbient(emptyAmbient);
                    loadAmbient();
                }
            });
    }

    const confirmDisabledSelected = () => {
        setDisabledAmbientsDialog(true);
    }

    const disabledSelectedAmbients = () => {
        let _ambients = ambients.filter(val => !selectedAmbient.includes(val));
        setAmbients(_ambients);
        setDisabledAmbientsDialog(false);
        setSelectedAmbient(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ambientes eliminados', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _ambient = { ...ambient };
        _ambient[`${name}`] = val;

        setAmbient(_ambient);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _ambient = { ...ambient };
        _ambient[`${name}`] = val;

        setAmbient(_ambient);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo Ambiente" icon="pi pi-plus" className="p-button-success mr-2" onClick={(e) => {
                    openNew()
                    setIsEdit(false)
                }} />
                {/* <Button label="Inactivar" className="p-button-danger" onClick={confirmDisabledSelected} disabled={!selectedAmbient || !selectedAmbient.length} /> */}
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editAmbient(rowData)} />
                <Button icon="pi pi-eye-slash" className="p-button-rounded p-button-warning" onClick={() => confirmDisabledAmbient(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Ambientes</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    const ambientDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" style={{ color: "gray" }} onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" style={{ color: "#5EB319" }} onClick={saveAmbient} />
        </React.Fragment>
    );
    const DisabledAmbientDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" style={{ color: "gray" }} className="p-button-text" onClick={hideDisabledAmbientDialog} />
            <Button label="Si" icon="pi pi-check" style={{ color: "#5EB319" }} className="p-button-text" onClick={disabledAmbient} />
        </React.Fragment>
    );
    const deleteAmbientsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDisabledAmbientsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={disabledSelectedAmbients} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={ambients} selection={selectedAmbient} onSelectionChange={(e) => setSelectedAmbient(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ambientes"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="Id" style={{ minWidth: '9rem' }}></Column>
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="location" header="Ubicación" ></Column>
                    <Column field="typeEnvironment" header="Tipo de ambiente" ></Column>
                    <Column field="state" header="Estado" ></Column>
                    <Column field="ability" header="Capacidad" ></Column>
                    {/* //<Column field="state" header="Estado" style={{ minWidth: '8rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={ambientDialog} style={{ width: '450px' }}
                header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
                modal className="p-fluid" footer={ambientDialogFooter} onHide={hideDialog}>
                <div className="title-form" style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}>
                    <p style={{ marginTop: "0px" }}>
                        Crear Ambiente
                    </p>
                </div>
                <div className="field">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={ambient.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !ambient.name })} />
                    {submitted && !ambient.name && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="location">Ubicación</label>
                    <InputText
                        id="location"
                        value={ambient.location}
                        onChange={(e) => onInputChange(e, 'location')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !ambient.location })} />
                    {submitted && !ambient.location && <small className="p-error">Ubicación es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="typeEnvironment">Tipo de ambiente</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",
                        }}
                        name="typeEnvironment"
                        value={ambient.typeEnvironment_id}
                        options={typeOptions}
                        onChange={(e) => {
                            setSelectType(e.value)
                            onInputNumberChange(e, "typeEnvironment")
                            onInputNumberChange(e, "typeEnvironment_id")
                            console.log("tipo", ambient.typeEnvironment)
                            console.log(" id", ambient.typeEnvironment_id)
                        }}
                        optionLabel="label"
                        placeholder="Seleccione tipo"
                    />
                </div>
                {console.log("tipo ambient", ambient.typeEnvironment)}

                <div className="field">
                    <label htmlFor="ability">Capacidad</label>
                    <InputText
                        id="ability"
                        value={ambient.ability}
                        onChange={(e) => onInputChange(e, 'ability')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !ambient.ability })} />
                    {submitted && !ambient.ability && <small className="p-error">Capacidad es requerida.</small>}
                </div>
            </Dialog>

            <Dialog visible={disabledAmbientDialog} style={{ width: '450px' }} header="Desactivar Ambiente" modal footer={DisabledAmbientDialogFooter} onHide={hideDisabledAmbientDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {ambient && <span>¿Estás seguro(a) de desactivar el ambiente <b>{ambient.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={disabledAmbientsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAmbientsDialogFooter} onHide={hideDisabledAmbientsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {ambient && <span>Are you sure you want to delete the selected ambients?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DashboardAmbient;

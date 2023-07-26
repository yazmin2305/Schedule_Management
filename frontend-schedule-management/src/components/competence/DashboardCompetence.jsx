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

function DashboardCompetence() {

    //const [competence, setCompetence] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [competenceDialog, setCompetenceDialog] = useState(false);
    const [disabledCompetenceDialog, setDisabledCompetenceDialog] = useState(false);
    const [disabledCompetencesDialog, setDisabledCompetencesDialog] = useState(false);
    const [competence, setCompetence] = useState([]);
    const [selectedCompetences, setSelectedCompetences] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectType, setSelectType] = useState(null);
    const [selectProgram, setSelectProgram] = useState(null);
    const [program, setProgram] = useState(new Array());
    const [optionsProgram, setOptionsProgram] = useState([]);
    //Se declara un estado para controlar cuando se edita o se crea una competencia
    const [isEdit, setIsEdit] = useState(false);

    //Referencias
    const toast = useRef(null);
    const dt = useRef(null);

    /**
     * Metodo para cargar las competencias de la base de datos
     */
    const loadCompetence = () => {
        let baseUrl = "http://localhost:8080/competence";
        axios.get(baseUrl).then(response => {
            setCompetences(
                response.data.map((competence) => {
                    return {
                        id: competence.id,
                        name: competence.name,
                        type: competence.type,
                        state: competence.state,
                        program: competence.program ? competence.program.name : null,
                        program_id: competence.program ? competence.program.id : null
                    }
                })
            )
            console.log("las competencias", response.data)
        }
        );
    };

    /**
     * Metodop para cargar los programas de la base de datos
     */
    const loadProgram = () => {
        let baseUrl = "http://localhost:8080/program";
        let arrayData = [];
        axios.get(baseUrl).then(response => {
            //agrego al estado
            // response.data.map((program) => {
            //     console.log("program", program);
            // })

            setProgram(response.data)
            //agrego al array de programas 
            arrayData = response.data
            setOptionsProgram(
                arrayData.map((program) => {
                    return {
                        label: program.name,
                        value: program.id
                    }
                }))
        }
        );
    };

    /**
     * Rrepresentacion del objeto que se va a guardar en la base de datos
     */
    let emptyCompetence = {
        id: null,
        name: '',
        type: '',
        state: '',
        program: null,
    };

    const typeOptions = [
        {
            label: 'Genérica',
            value: 'Generica'
        },
        {
            label: 'Específica',
            value: 'Especifica'
        }
    ];

    useEffect(() => {
        loadCompetence();
        loadProgram();

    }, []);


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const openNew = () => {
        setCompetence(emptyCompetence);
        setSubmitted(false);
        setCompetenceDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCompetenceDialog(false);
    }

    const hideDisabledCompetenceDialog = () => {
        setDisabledCompetenceDialog(false);
    }

    const hideDeleteCompetencesDialog = () => {
        setDisabledCompetencesDialog(false);
    }

    const saveCompetence = () => {
        setSubmitted(true);
        //completo los campos 
        console.log("este ver", competence);
        competence.state = 'Activo';
        //busco el programa seleccionado
        let selectProgram = program.find(program => program.id === competence.program_id);
        competence.program = selectProgram ? selectProgram : null;
        //armo el objeto para guardarlo en la db posteriormente
        let competenceSave = {
            name: competence.name,
            program: competence.program,
            state: competence.state,
            type: competence.type,
        }
        console.log("que paso", competenceSave);
        if (!isEdit) {
            console.log("crear");
            // return 0 ; 
            //hago la peticion a la api para guardar el registro
            axios.post("http://localhost:8080/competence", competenceSave)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencia creada', life: 5000 });
                        setCompetenceDialog(false);
                        setCompetence(emptyCompetence);
                        loadCompetence();
                    } else {
                        toast.current.show({
                            severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                            , life: 5000
                        });
                        setCompetenceDialog(false);
                        setCompetence(emptyCompetence);
                    }
                });
        } else {
            console.log(competence.id)
            console.log('competence', competenceSave)
            // return 0; 
            //hago la peticion a la api para que guarde la competencia editada 
            axios.patch("http://localhost:8080/competence/" + competence.id, competenceSave)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencia actualizada', life: 5000 });
                        setCompetenceDialog(false);
                        setCompetence(emptyCompetence);
                        loadCompetence();
                    } else {
                        toast.current.show({
                            severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                            , life: 5000
                        });
                        setCompetenceDialog(false);
                        setCompetence(emptyCompetence);
                    }
                });
        }
    }
    /**
     * Metodo que me muestra el dialog para editar una competencia y actualizarla en la base de datos
     * @param {*} competence competencia a editar
     */
    const editCompetence = (competence) => {
        setCompetence({ ...competence });
        setCompetenceDialog(true);
        setIsEdit(true);
    }

    const confirmDeleteCompetence = (competence) => {
        setCompetence(competence);
        setDisabledCompetenceDialog(true);
    }
    /**
     * Metodo para desactivar una competencia de la base de datos
     */
    const disabledCompetence = () => {
        //desactivo el registro en la base de datos 
        axios.patch("http://localhost:8080/competence/disable/" + competence.id)
            .then(response => {
                if (response.data != null) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencia desactivada', life: 5000 });
                    setDisabledCompetenceDialog(false);
                    setCompetence(emptyCompetence);
                    loadCompetence();
                }
            });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < competences.length; i++) {
            if (competences[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const confirmDeleteSelected = () => {
        setDisabledCompetencesDialog(true);
    }

    const deleteSelectedCompetences = () => {
        let _competences = competences.filter(val => !selectedCompetences.includes(val));
        setCompetences(_competences);
        setDisabledCompetencesDialog(false);
        setSelectedCompetences(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Competencias desactivadas', life: 5000 });
    }

    const onCategoryChange = (e) => {
        let _competence = { ...competence };
        _competence['category'] = e.value;
        setCompetence(_competence);
    }

    const onInputChange = (e, name) => {    
        const val = (e.target && e.target.value) || '';
        let _competence = { ...competence };
        _competence[`${name}`] = val;

        setCompetence(_competence);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _competence = { ...competence };
        _competence[`${name}`] = val;

        setCompetence(_competence);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nueva competencia" icon="pi pi-plus" className="p-button-success mr-2" onClick={(e) => {
                    openNew()
                    setIsEdit(false)
                }} />
                {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCompetences || !selectedCompetences.length} /> */}
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

    /**
     * Template de las acciones de la tabla de competencias
     * @param {*} rowData informacion de la fila
     * @returns 
     */
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCompetence(rowData)} />
                <Button icon="pi pi-eye-slash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCompetence(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Competencias</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const competenceDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" style={{ color: "gray" }} className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" style={{ color: "#5EB319" }} className="p-button-text" onClick={saveCompetence} />
        </React.Fragment>
    );
    const disabledCompentenceDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" style={{ color: "gray" }} className="p-button-text" onClick={hideDisabledCompetenceDialog} />
            <Button label="Si" icon="pi pi-check" style={{ color: "#5EB319" }} className="p-button-text" onClick={disabledCompetence} />
        </React.Fragment>
    );
    const deleteCompetencesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCompetencesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCompetences} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={competences} selection={selectedCompetences} onSelectionChange={(e) => setSelectedCompetences(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} competences"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="id" header="Id" style={{ minWidth: '9rem' }}></Column>
                    <Column field="name" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="type" header="Tipo" ></Column>
                    <Column field="state" header="Estado" style={{ minWidth: '8rem' }}></Column>
                    <Column field="program" header="Programa" ></Column>
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={competenceDialog} style={{ width: '450px' }}
                header={<img src={logo} alt={"logo"} className="block m-auto pb-0 " />}
                modal className="p-fluid" footer={competenceDialogFooter} onHide={hideDialog}>
                <div className="title-form" style={{ color: "#5EB319", fontWeight: "bold", fontSize: "22px" }}>
                    <p style={{ marginTop: "0px" }}>
                        Crear competencia
                    </p>
                </div>
                <div className="field">

                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={competence.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required autoFocus
                        className={classNames({ 'p-invalid': submitted && !competence.name })} />
                    {submitted && !competence.name && <small className="p-error">El nombre es requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="type">Tipo</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",

                        }}
                        name="type"
                        value={competence.type}
                        options={typeOptions}
                        onChange={(e) => {
                            setSelectType(e.value)
                            onInputChange(e, 'type')
                        }}
                        optionLabel="label"
                        placeholder="Seleccione tipo"
                    />
                </div>
                <div className="field">
                    <label htmlFor="program">Seleccione programa al que pertenece</label>
                    <Dropdown
                        style={{
                            borderBlockColor: "#5EB319",
                            boxShadow: "0px 0px 0px 0.2px #5EB319",
                            borderColor: "#5EB319",

                        }}
                        name="program"
                        value={competence.program_id}
                        options={optionsProgram}
                        onChange={(e) => {
                            setSelectProgram(e.value)
                            onInputChange(e, 'program')
                            onInputChange(e, "program_id")
                        }}
                        optionLabel="label"
                        placeholder="Seleccione programa"
                    />
                </div>

            </Dialog>

            <Dialog visible={disabledCompetenceDialog} style={{ width: '450px' }} header="Desactivar competencia" modal footer={disabledCompentenceDialogFooter} onHide={hideDisabledCompetenceDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {competence && <span>¿Estás seguro(a) de desactivar la competencia <b>{competence.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={disabledCompetencesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCompetencesDialogFooter} onHide={hideDeleteCompetencesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {competence && <span>Are you sure you want to delete the selected competences?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DashboardCompetence;

import React, { useEffect, useState, useRef } from "react"

import {
    ScheduleComponent,
    Inject,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    EventSettingsModel,
    DragAndDrop,
    Resize,
    ViewsDirective,
    ViewDirective,
    HeaderRowDirective,
    HeaderRowsDirective,
} from '@syncfusion/ej2-react-schedule';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from "axios";
import "../../App.css";
import { extend, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
L10n.load({
    'en-US': {
        'schedule': {
            'saveButton': 'Guardar',
            'cancelButton': 'Cerrar',
            'deleteButton': 'Eliminar',
            'deleteEvent': 'Eliminar evento',
            'deleteEventMessage': '¿Está seguro de eliminar este evento?',
            'deleteRecurrenceContent': '¿Desea eliminar solo este evento o toda la serie?',
        },
    }
});

function Schedule() {

    //Se declara un estado para guargar los ambientes
    const [dataAmbients, setDataAmbients] = useState([])
    //Se declara un estado para guargar las competencias
    const [dataCompetences, setDataCompetences] = useState([])
    //Se declara un estado para guargar los docentes
    const [dataTeachers, setDataTeachers] = useState([])
    //Se declara un estado para guargar los franjas horarias 
    const [dataSchedules, setDataSchedules] = useState([])
    //Se declara un estado para cargar las franjas horarias con el respectivo formato 
    const [dataSchedulesFormat, setDataSchedulesFormat] = useState([])
    //Se declara un estado para guargar los periodos academicos
    const [dataAcademicPeriod, setDataAcademicPeriod] = useState([])
    //Se declara un estado para guardar todos los programas 
    const [dataAllPrograms, setDataAllPrograms] = useState([])
    //Se declara un estado para cargar los programas de un respectivo periodo academico
    const [dataPrograms, setDataPrograms] = useState([])
    //Se declara un estado para cargar las opciones de ambiente en el select de ambientes
    const [optionsAmbient, setOptionsAmbient] = useState([])
    //Se declara un estado para cargar las opciones de competencia en el select de competencias
    const [optionsCompetence, setOptionsCompetence] = useState([])
    const [optionsAuxCompetence, setOptionsAuxCompetence] = useState([])
    //Se declara un estado para cargar los docentes en el select de docentes
    const [optionsTeacher, setOptionsTeacher] = useState([])
    //Se declara un estado para cargar los periodos academicos en el select de periodos academicos
    const [optionsAcademicPeriod, setOptionsAcademicPeriod] = useState([])
    //Se declara un estado para cargar los programas de un respectivo periodo academico en el select de programas
    const [optionsProgram, setOptionsProgram] = useState([])
    const [optionsAuxProgram, setOptionsAuxProgram] = useState([])
    //Se declara un estado para saber si se esta editando un evento o creando uno nuevo
    const [isEdit, setIsEdit] = useState(false)
    let isEditEvent = ""
    //variable para guardar el id de la franja horaria que se esta editando
    let IdScheduleEdit = 0;
    //Se declara un estado para guardar los valores que seleccionan en el formulario
    const [values, setValues] = useState({
        id: 0,
        academicPeriod: 0,
        program: 0,
        competence: 0,
        teacher: 0,
        ambient: 0,
    })
    const toast = useRef(null);
    //variable para manipular el objeto de schedule
    let scheduleObj;

    /**
     * Metodo para cargar los ambientes haciendo la peticion a la API
     */
    const loadAmbients = () => {
        fetch('http://localhost:8080/ambient')
            .then(response => response.json())
            .then(data => {
                setDataAmbients(data)
                //cargo las opciones del select de ambientes
                setOptionsAmbient(
                    data.map(ambiente => {
                        return {
                            id: ambiente.id,
                            name: ambiente.name
                        }
                    })
                )
            })
    }
    /**
     * Metodo para cargar los periodos academicos haciendo la peticion a la API
     */
    const loadAcademicPeriod = () => {
        fetch('http://localhost:8080/academicPeriod')
            .then(response => response.json())
            .then(data => {
                setDataAcademicPeriod(data)
                //cargo las opciones del select de los periodos academicos
                let arrayData = []
                data.map(academicPeriod => {
                    let date = new Date()
                    let dateDataEnd = new Date(academicPeriod.date_end !== null ? academicPeriod.date_end : "2021-12-31")
                    if (dateDataEnd >= date) {
                        arrayData.push({
                            id: academicPeriod.id,
                            name: academicPeriod.name
                        })
                    }
                })
                setOptionsAcademicPeriod(arrayData)
            })

    }

    /**
     * Metodo para cargar las competencias haciendo la peticion a la API
     */
    const loadCompetences = () => {
        fetch('http://localhost:8080/competence')
            .then(response => response.json())
            .then(data => {
                setDataCompetences(data)
                //cargo las  opciones del select de competencias
                setOptionsAuxCompetence(
                    data.map(comp => {
                        return {
                            id: comp.id,
                            name: comp.name
                        }
                    })
                )
            })
    }
    /**
     * Metodo para cargar las competencias haciendo la peticion a la API
     */
    const loadCompetencesToProgram = (progrmaId) => {
        fetch('http://localhost:8080/competence/competenceProgram/' + progrmaId)
            .then(response => response.json())
            .then(data => {
                setDataCompetences(data)
                //cargo las  opciones del select de competencias
                setOptionsCompetence(
                    data.map(comp => {
                        return {
                            id: comp.id,
                            name: comp.name
                        }
                    })
                )
            })
    }
    /**
     * Metodo para cargar los docentes haciendo la peticion a la API
     */
    const loadTeachers = () => {
        fetch('http://localhost:8080/teacher')
            .then(response => response.json())
            .then(data => {
                setDataTeachers(data)
                //cargo las opciones del select de docentes
                setOptionsTeacher(
                    data.map(teacher => {
                        return {
                            id: teacher.id,
                            name: teacher.name + " " + teacher.lastname
                        }
                    })
                )
            })
    }
    /**
     * Metodo para cargar todos los programas haciendo la peticion a la API
     */
    const loadAllPrograms = () => {
        fetch('http://localhost:8080/program')
            .then(response => response.json())
            .then(data => {
                setDataAllPrograms(data)
                //cargo las opciones del select de programasaux 
                setOptionsAuxProgram(
                    data.map(program => {
                        return {
                            id: program.id,
                            name: program.name
                        }
                    })
                )
            })
    }

    /**
     * Metodo para cargar los programas de un respectivo periodo academico haciendo la peticion a la API
     * @param {*} idAcademicPeriod
     */
    const loadPrograms = (idAcademicPeriod) => {
        fetch('http://localhost:8080/program/programAcademicPeriod/' + idAcademicPeriod)
            .then(response => response.json())
            .then(data => {
                setDataPrograms(data)
                //cargo las opciones del select de ambientes
                setOptionsProgram(
                    data.map(program => {
                        return {
                            id: program.id,
                            name: program.name
                        }
                    })
                )
            })
    }
    /**
     * Metodo para cargar las franjas horarias registradas en la base de datos haciendo la peticion a la API
     */
    const loadSchedules = () => {
        fetch('http://localhost:8080/schedule')
            .then(response => response.json())
            .then(data => {
                setDataSchedules(data)

                //armo el objero json para cargar el schedule
                setDataSchedulesFormat(
                    data.map(schedule => {
                        return {
                            Id: schedule.id,
                            Subject: schedule.competence.program.name,
                            academicPeriod: schedule.competence.program.academicPeriod.name,
                            day: schedule.day,
                            duration: schedule.duration,
                            ambient: schedule.ambient.id,
                            competence: schedule.competence.id,
                            teacher: schedule.teacher.id,
                            program: schedule.competence.program.id,
                            StartTime: schedule.init_class,
                            EndTime: schedule.end_class,
                        }
                    })
                )
            })
    }

    //json de docentes con los atributos siguientes: id, area, identity_card, lastname,name, status, type_id, type ,type_contract
    let jsonDocentes = {
        "teachers": [
            {
                "id": 1,
                "area": "Matemáticas",
                "identity_card": "1234567890",
                "lastname": "Pérez",
                "name": "Juan",
                "status": "Activo",
                "type_id": 1,
                "type": "Técnico",
                "type_contract": "Planta",
            },
            {
                "id": 2,
                "area": "Lenguaje",
                "identity_card": "0987654321",
                "lastname": "Gómez",
                "name": "Maria",
                "status": "Activo",
                "type_id": 2,
                "type": "Profesional",
                "type_contract": "Contratista"
            },
            {
                "id": 3,
                "lastname": "Gómez",
                "name": "Marta",
                "status": "Activo",
                "type_id": 2,
                "type": "Profesional",
                "type_contract": "Planta"
            },
            {
                "id": 4,
                "lastname": "Lopez",
                "name": "Bruno",
                "status": "Activo",
                "type_id": 1,
                "type": "Profesional",
                "type_contract": "Planta"
            },
        ]
    }
    /**
     * Metodo que se ejecuta cuando se abre el modal para agregar un evento
     * @param {*} args data de la celda
     */
    const onPopupOpen = (args) => {
        if (args.type === 'Editor' && !isNullOrUndefined(args.data)) {
            //verifico si el evento es nuevo o se esta editando
            if (args.data.day) {
                isEditEvent = "editar"
                IdScheduleEdit = args.data.Id
                setIsEdit(true);
            } else {
                isEditEvent = "crear"
                setIsEdit(false);
            }

        }
    }
    /**
     * Metodo que se  ejecuta cuando se cierra el modal al agregar un evento
     * @param {*} args data de la celda
     */
    const onPopupClose = (args) => {
        if (args.type === 'Editor' && !isNullOrUndefined(args.data)) {

            let errorVerify = false;

            //validadaciones de campos
            if (args.data.ambient === null) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione un ambiente', life: 5000 });
                //evito que se cierre el modal
                args.cancel = true;
                errorVerify = true;
            }
            if (args.data.teacher === null) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione un docente', life: 5000 });
                //evito que se cierre el modal
                args.cancel = true;
                errorVerify = true;
            }
            if (args.data.competence === null) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una competencia', life: 5000 });
                //evito que se cierre el modal
                args.cancel = true;
                errorVerify = true;
            }
            if (args.data.StartTime === null) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una hora de inicio', life: 5000 });
                //evito que se cierre el modal
                args.cancel = true;
                errorVerify = true;
            }
            if (args.data.EndTime === null) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una hora de fin', life: 5000 });
                //evito que se cierre el modal
                args.cancel = true;
                errorVerify = true;
            }
            if (args.data.EndTime.getHours() - args.data.StartTime.getHours() < 2 ||
                args.data.EndTime.getHours() - args.data.StartTime.getHours() > 4) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las franjas horarias deben ser bloques de 2 o 4 horas', life: 5000 });
                //evito que se cierre el modal
                args.cancel = true;
                errorVerify = true;
                return 0;
            }
            //validar que un profesor no este dos veces en la misma franja horaria
            let teacherSchedule = dataSchedules.filter(schedule => schedule.teacher.id === args.data.teacher)
            teacherSchedule.forEach(schedule => {
                let auxStartTimeSchedule = new Date(schedule.init_class);
                let auxEndTimeSchedule = new Date(schedule.end_class);
                if (schedule.day == args.data.StartTime.getDay()) {
                    if (args.data.StartTime.getHours() >= auxStartTimeSchedule.getHours() &&
                        args.data.StartTime.getHours() < auxEndTimeSchedule.getHours()) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El docente ya tiene una clase en ese horario', life: 5000 });
                        //evito que se cierre el modal
                        args.cancel = true;
                        errorVerify = true;
                        return 0;
                    }
                    if (args.data.EndTime.getHours() > auxStartTimeSchedule.getHours() &&
                        args.data.EndTime.getHours() <= auxEndTimeSchedule.getHours()) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El docente ya tiene una clase en ese horario', life: 5000 });
                        //evito que se cierre el modal
                        args.cancel = true;
                        errorVerify = true;
                        return 0;
                    }
                }
            });
            //validar que un ambiente no este dos veces en la misma franja horaria
            let ambientSchedule = dataSchedules.filter(schedule => schedule.ambient.id === args.data.ambient)
            ambientSchedule.forEach(schedule => {
                let auxStartTimeSchedule = new Date(schedule.init_class);
                let auxEndTimeSchedule = new Date(schedule.end_class);
                if (schedule.day == args.data.StartTime.getDay()) {
                    if (args.data.StartTime.getHours() >= auxStartTimeSchedule.getHours() &&
                        args.data.StartTime.getHours() < auxEndTimeSchedule.getHours()) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El ambiente ya tiene una clase en ese horario', life: 5000 });
                        //evito que se cierre el modal
                        args.cancel = true;
                        errorVerify = true;
                        return 0;
                    }
                    if (args.data.EndTime.getHours() > auxStartTimeSchedule.getHours() &&
                        args.data.EndTime.getHours() <= auxEndTimeSchedule.getHours()) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El ambiente ya tiene una clase en ese horario', life: 5000 });
                        //evito que se cierre el modal
                        args.cancel = true;
                        errorVerify = true;
                        return 0;
                    }
                }
            });
            //validar que una competencia no este dos veces en la misma franja horaria
            let competenceSchedule = dataSchedules.filter(schedule => schedule.competence.id === args.data.competence)
            competenceSchedule.forEach(schedule => {
                let auxStartTimeSchedule = new Date(schedule.init_class);
                let auxEndTimeSchedule = new Date(schedule.end_class);
                if (schedule.day == args.data.StartTime.getDay()) {
                    if (args.data.StartTime.getHours() >= auxStartTimeSchedule.getHours() &&
                        args.data.StartTime.getHours() < auxEndTimeSchedule.getHours()) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'La competencia ya tiene una clase en ese horario', life: 5000 });
                        //evito que se cierre el modal
                        args.cancel = true;
                        errorVerify = true;
                        return 0;
                    }
                    if (args.data.EndTime.getHours() > auxStartTimeSchedule.getHours() &&
                        args.data.EndTime.getHours() <= auxEndTimeSchedule.getHours()) {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'La competencia ya tiene una clase en ese horario', life: 5000 });
                        //evito que se cierre el modal
                        args.cancel = true;
                        errorVerify = true;
                        return 0;
                    }
                }
            });

            //Si pasa las validaciones se debe enviar la data a la API
            if (errorVerify == false) {
                // Busco el ambiente seleccionado en el select de ambientes
                let ambient = dataAmbients.find(ambient => ambient.id === args.data.ambient)
                // Busco el docente seleccionado en el select de docentes
                let teacher = dataTeachers.find(teacher => teacher.id === args.data.teacher)
                // Busco la competencia seleccionado en el select de competencias
                let competenceRef = dataCompetences.find(competence => competence.id === args.data.competence)
                //1. armo el objeto que voy a enviar a la API
                let dataSendSchedule = {
                    // "id": 0,
                    day: args.data.StartTime.getDay(),
                    duration: args.data.EndTime.getHours() - args.data.StartTime.getHours(),
                    end_class: args.data.EndTime,
                    init_class: args.data.StartTime,
                    ambient: ambient ? ambient : null,
                    competence: competenceRef ? competenceRef : null,
                    teacher: teacher ? teacher : null,
                    program: competenceRef.program.id,
                }
                console.log("objectDB", dataSendSchedule)

                if (isEditEvent === "editar") {
                    //actualizar el evento
                    //hago la peticion a la API para actualizar la frnaja horaria en la base de datos
                    axios.patch("http://localhost:8080/schedule/" + IdScheduleEdit, dataSendSchedule)
                        .then(response => {
                            if (response.data != null) {
                                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Franja horaria actualizada exitosamente', life: 5000 });
                            } else {
                                toast.current.show({
                                    severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                                    , life: 5000
                                });
                            }
                        });
                } else {
                    //crear un nuevo evento
                    //hago la peticion a la API para guardar el horario en la base de datos
                    axios.post("http://localhost:8080/schedule", dataSendSchedule)
                        .then(response => {
                            if (response.data != null) {
                                //si el bloque es de 4 horas reseteo los campos
                                if (args.data.EndTime.getHours() - args.data.StartTime.getHours() === 4) {
                                    resetValues();
                                }
                                //alerta de exito
                                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Franja horaria guardada exitosamente', life: 5000 });
                            } else {
                                toast.current.show({
                                    severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                                    , life: 5000
                                });
                            }
                        });
                }
            }
        }

        //eliminar una franja horaria
        if (args.type === "DeleteAlert" && args.cancel === false) {
            //eliminar una franja horaria 
            console.log("eliminar", args.data.Id);
            axios.delete("http://localhost:8080/schedule/" + args.data.Id)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Franja horaria eliminada exitosamente', life: 5000 });
                    } else {
                        toast.current.show({
                            severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                            , life: 5000
                        });
                    }
                });
        }
    }
    /**
     * Metodo que se ejecuta cuando se arrastra un evento
     * @param {*} args objeto que contiene la informacion del evento
     * @returns
     */
    const onDrag = (args) => {
        //selecciono el id del evento a editar
        IdScheduleEdit = args.data.Id;
    }
    /**
     * Metodo que se ejecuta cuando se termina de arrastrar un evento
     * @param {*} args objeto que contiene la informacion del evento
     * @returns 
     */
    const onDragStop = (args) => {
        //guardo en la base de datos la nueva posicion del evento
        //validadaciones de campos
        let errorVerify = false;
        //validadaciones de campos
        if (args.data.ambient === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione un ambiente', life: 5000 });
            //evito que se cierre el modal
            args.cancel = true;
            errorVerify = true;
        }
        if (args.data.teacher === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione un docente', life: 5000 });
            //evito que se cierre el modal
            args.cancel = true;
            errorVerify = true;
        }
        if (args.data.competence === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una competencia', life: 5000 });
            //evito que se cierre el modal
            args.cancel = true;
            errorVerify = true;
        }
        if (args.data.StartTime === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una hora de inicio', life: 5000 });
            //evito que se cierre el modal
            args.cancel = true;
            errorVerify = true;
        }
        if (args.data.EndTime === null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Por favor seleccione una hora de fin', life: 5000 });
            //evito que se cierre el modal
            args.cancel = true;
            errorVerify = true;
        }
        if (args.data.EndTime.getHours() - args.data.StartTime.getHours() < 2 ||
            args.data.EndTime.getHours() - args.data.StartTime.getHours() > 4) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las franjas horarias deben ser bloques de 2 o 4 horas', life: 5000 });
            //evito que se cierre el modal
            args.cancel = true;
            errorVerify = true;
            return 0;
        }
        //validar que un profesor no este dos veces en la misma franja horaria
        let teacherSchedule = dataSchedules.filter(schedule => schedule.teacher.id === args.data.teacher)
        teacherSchedule.forEach(schedule => {
            let auxStartTimeSchedule = new Date(schedule.init_class);
            let auxEndTimeSchedule = new Date(schedule.end_class);
            if (schedule.day == args.data.StartTime.getDay()) {
                if (args.data.StartTime.getHours() >= auxStartTimeSchedule.getHours() &&
                    args.data.StartTime.getHours() < auxEndTimeSchedule.getHours()) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'El docente ya tiene una clase en ese horario', life: 5000 });
                    //evito que se cierre el modal
                    args.cancel = true;
                    errorVerify = true;
                    return 0;
                }
                if (args.data.EndTime.getHours() > auxStartTimeSchedule.getHours() &&
                    args.data.EndTime.getHours() <= auxEndTimeSchedule.getHours()) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'El docente ya tiene una clase en ese horario', life: 5000 });
                    //evito que se cierre el modal
                    args.cancel = true;
                    errorVerify = true;
                    return 0;
                }
            }
        });
        //validar que un ambiente no este dos veces en la misma franja horaria
        let ambientSchedule = dataSchedules.filter(schedule => schedule.ambient.id === args.data.ambient)
        ambientSchedule.forEach(schedule => {
            let auxStartTimeSchedule = new Date(schedule.init_class);
            let auxEndTimeSchedule = new Date(schedule.end_class);
            if (schedule.day == args.data.StartTime.getDay()) {
                if (args.data.StartTime.getHours() >= auxStartTimeSchedule.getHours() &&
                    args.data.StartTime.getHours() < auxEndTimeSchedule.getHours()) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'El ambiente ya tiene una clase en ese horario', life: 5000 });
                    //evito que se cierre el modal
                    args.cancel = true;
                    errorVerify = true;
                    return 0;
                }
                if (args.data.EndTime.getHours() > auxStartTimeSchedule.getHours() &&
                    args.data.EndTime.getHours() <= auxEndTimeSchedule.getHours()) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'El ambiente ya tiene una clase en ese horario', life: 5000 });
                    //evito que se cierre el modal
                    args.cancel = true;
                    errorVerify = true;
                    return 0;
                }
            }
        });
        //validar que una competencia no este dos veces en la misma franja horaria
        let competenceSchedule = dataSchedules.filter(schedule => schedule.competence.id === args.data.competence)
        competenceSchedule.forEach(schedule => {
            let auxStartTimeSchedule = new Date(schedule.init_class);
            let auxEndTimeSchedule = new Date(schedule.end_class);
            if (schedule.day == args.data.StartTime.getDay()) {
                if (args.data.StartTime.getHours() >= auxStartTimeSchedule.getHours() &&
                    args.data.StartTime.getHours() < auxEndTimeSchedule.getHours()) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'La competencia ya tiene una clase en ese horario', life: 5000 });
                    //evito que se cierre el modal
                    args.cancel = true;
                    errorVerify = true;
                    return 0;
                }
                if (args.data.EndTime.getHours() > auxStartTimeSchedule.getHours() &&
                    args.data.EndTime.getHours() <= auxEndTimeSchedule.getHours()) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'La competencia ya tiene una clase en ese horario', life: 5000 });
                    //evito que se cierre el modal
                    args.cancel = true;
                    errorVerify = true;
                    return 0;
                }
            }
        });
        //Si pasa las validaciones se debe enviar la data a la API
        if (errorVerify === false) {
            // Busco el ambiente seleccionado en el select de ambientes
            let ambient = dataAmbients.find(ambient => ambient.id === args.data.ambient)
            // Busco el docente seleccionado en el select de docentes
            let teacher = dataTeachers.find(teacher => teacher.id === args.data.teacher)
            // Busco la competencia seleccionado en el select de competencias
            let competenceRef = dataCompetences.find(competence => competence.id === args.data.competence)
            //1. armo el objeto que voy a enviar a la API
            console.log("program ver", competenceRef.program.id)
            let dataSendSchedule = {
                // "id": 0,
                day: args.data.StartTime.getDay(),
                duration: args.data.EndTime.getHours() - args.data.StartTime.getHours(),
                end_class: args.data.EndTime,
                init_class: args.data.StartTime,
                ambient: ambient ? ambient : null,
                competence: competenceRef ? competenceRef : null,
                teacher: teacher ? teacher : null,
                program: competenceRef.program.id,
            }
            console.log("objectDB", dataSendSchedule)
            console.log("idSchedule", IdScheduleEdit)

            //hago la peticion a la API para actualizar la frnaja horaria en la base de datos
            axios.patch("http://localhost:8080/schedule/" + IdScheduleEdit, dataSendSchedule)
                .then(response => {
                    if (response.data != null) {
                        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Franja horaria actualizada exitosamente', life: 5000 });
                    } else {
                        toast.current.show({
                            severity: 'error', summary: 'Error', detail: 'Ocurrió un error, por favor vuelve a intentarlo'
                            , life: 5000
                        });
                    }
                });
        }

    }

    //Template para el renderizado del formulario que se muestra al hacer click en una franja horaria
    function editorTemplate(props) {
        return (
            props !== undefined ? <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}>
                <tbody>
                    <tr>
                        <td className="e-textlabel">Evento</td><td colSpan={4}>
                            <input
                                id="Summary"
                                className="e-field e-input"
                                type="text"
                                name="Subject"
                                style={{ width: '100%' }}
                                placeholder="Nombre del evento"
                                value={props.Subject ? props.Subject : findByIdInfo("program", values.program)}
                                // value={findByIdInfo("program", values.program) || props.Subject}
                                disabled={true}
                            />
                        </td>
                    </tr>
                    {/* Periodo academico */}
                    <tr>
                        <td className="e-textlabel">Perido académico</td>
                        <td colSpan={4}>
                            <input
                                id="academicPeriod"
                                className="e-field e-input"
                                type="text"
                                name="academicPeriod"
                                style={{ width: '100%' }}
                                placeholder="Periodo académico"
                                value={props.academicPeriod ? props.academicPeriod : findByIdInfo("academicPeriod", values.academicPeriod)}
                                disabled={true}
                            />
                            {/* <DropDownListComponent id="academicPeriod" placeholder='Seleccione el periodo académico'
                                data-name="academicPeriod" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsAcademicPeriod}
                                fields={{ text: 'name', value: 'id' }}
                                value={values.academicPeriod !== 0 ? values.academicPeriod : props.academicPeriod ? props.academicPeriod : ""}
                            >
                            </DropDownListComponent> */}
                        </td>
                    </tr>
                    {/* Programa */}
                    <tr>
                        <td className="e-textlabel">Programa</td>
                        <td colSpan={4}>
                            <input
                                id="program"
                                className="e-field e-input"
                                type="text"
                                name="program"
                                style={{ width: '100%' }}
                                placeholder="Programa"
                                value={props.Subject ? props.Subject : findByIdInfo("program", values.program)}
                                disabled={true}
                            />
                            {/* <DropDownListComponent id="program" placeholder='Seleccione el programa'
                                data-name="program" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsAuxProgram}
                                fields={{ value: "id", text: "name" }}
                                value={values.program !== 0 ? values.program : props.program ? props.program : ""}
                            >
                            </DropDownListComponent> */}
                        </td>
                    </tr>
                    {/* Competencia */}
                    <tr>
                        <td className="e-textlabel">Competencia</td>
                        <td colSpan={4}>
                            <DropDownListComponent id="competence" placeholder='Seleccione la competencia'
                                data-name="competence" className="e-field" style={{ width: '100%' }}
                                // dataSource={optionsCompetence}
                                dataSource={optionsAuxCompetence}
                                fields={{ text: 'name', value: 'id' }}
                                value={props.competence ? props.competence : values.competence !== 0 ? values.competence : ""}
                            // value={values.competence !== 0 ? values.competence : props.competence ? props.competence : ""}
                            >
                            </DropDownListComponent>
                        </td>
                    </tr>
                    {/* Docente */}
                    <tr>
                        <td className="e-textlabel">Docente</td>
                        <td colSpan={4}>
                            <DropDownListComponent id="teacher" placeholder='Seleccione el docente'
                                data-name="teacher" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsTeacher}
                                fields={{ value: "id", text: "name" }}
                                value={props.teacher ? props.teacher : values.teacher !== 0 ? values.teacher : ""}
                            >
                            </DropDownListComponent>
                        </td>
                    </tr>
                    {/* Ambiente */}
                    <tr>
                        <td className="e-textlabel">Ambiente</td>
                        <td colSpan={4}>
                            <DropDownListComponent id="ambient" placeholder='Seleccione el lugar'
                                data-name="ambient" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsAmbient}
                                fields={{ value: "id", text: "name" }}
                                value={props.ambient ? props.ambient : values.ambient !== 0 ? values.ambient : ""}
                            >
                            </DropDownListComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Desde</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent
                                format='dd/MM/yy hh:mm a'
                                id="StartTime"
                                data-name="StartTime"
                                value={new Date(props.startTime || props.StartTime)}
                                className="e-field"
                            >

                            </DateTimePickerComponent>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Hasta</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent
                                format='dd/MM/yy hh:mm a'
                                id="EndTime"
                                data-name="EndTime"
                                value={new Date(props.endTime || props.EndTime)}
                                className="e-field">
                            </DateTimePickerComponent>
                        </td>
                    </tr>
                </tbody>
            </table>
                :
                <div></div>
        );
    }
    /**
     * Metodo para resetar valores del formulario
     */
    const resetValues = () => {
        setValues({
            id: 0,
            academicPeriod: 0,
            program: 0,
            competence: 0,
            teacher: 0,
            ambient: 0,
        })
    }
    //Handle change para que me actualizar el valor seleccionado en los campos
    const onHandleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    //Metodo para buscar el periodo academico seleccionado
    const findByIdInfo = (reference, id) => {
        let result = "";
        switch (reference) {
            case "academicPeriod":
                result = optionsAcademicPeriod.find(academic => academic.id === id);
                break;
            case "program":
                result = optionsProgram.find(program => program.id === id);
                // result = optionsAuxProgram.find(program => program.id === id);
                break;
            case "competence":
                result = optionsCompetence.find(competence => competence.id === id);
                break;
            case "teacher":
                result = optionsTeacher.find(teacher => teacher.id === id);
                break;
            case "ambient":
                result = optionsAmbient.find(ambient => ambient.id === id);
        }
        return result !== undefined && result.name !== undefined ? result.name : "";
    }

    //useEffect que hace referencia al ciclo de vida del componente (inicio, actualizacion, fin)
    useEffect(() => {
        loadAmbients()
        loadCompetences()
        loadTeachers()
        loadAcademicPeriod()
        loadSchedules()
        loadAllPrograms()
    }, [])

    return (
        <div className="container">
            <Toast ref={toast} />
            <div className="title-schedule">
                <h4>
                    Asignación horaria
                </h4>
            </div>
            <div className="container-fields">
                <div className="selects-field">
                    <div className="field-academic-period">
                        <p>
                            1. Debes seleccionar el periodo academico
                        </p>
                        <div className="field-body">
                            <label htmlFor="">Periodo académico:</label>
                            <DropDownListComponent id="academicPeriod" placeholder='Seleccione el periodo académico'
                                name="academicPeriod" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsAcademicPeriod}
                                fields={{ value: "id", text: "name" }}
                                value={values.academicPeriod || null}
                                onChange={(e) => {
                                    onHandleChange(e)
                                    //llamar al metodo que carga los programas academicos
                                    loadPrograms(e.target.value)
                                }}
                            >
                            </DropDownListComponent>
                        </div>
                    </div>
                    <div className="field-program-academic">
                        <p>
                            2. Debes seleccionar el programa académico
                        </p>
                        <div className="field-body" >
                            <label htmlFor="">Programa académico:</label>
                            <DropDownListComponent id="program" placeholder='Seleccione el programa académico'
                                name="program" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsProgram}
                                fields={{ value: "id", text: "name" }}
                                value={values.program || null}
                                onChange={(e) => {
                                    onHandleChange(e)
                                    //llamar al metodo que carga las competencias
                                    loadCompetencesToProgram(e.target.value)
                                }}
                            >
                            </DropDownListComponent>
                        </div>
                    </div>
                    <div className="field-competence">
                        <p>
                            3. Debes seleccionar la competencia
                        </p>
                        <div className="field-body" >
                            <label htmlFor="">Competencia:</label>
                            <DropDownListComponent id="competence" placeholder='Seleccione la competencia'
                                name="competence" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsCompetence}
                                fields={{ value: "id", text: "name" }}
                                value={values.competence || null}
                                onChange={onHandleChange}
                            >
                            </DropDownListComponent>
                        </div>
                    </div>
                    <div className="field-teacher">
                        <p>
                            4. Debes seleccionar el docente
                        </p>
                        <div className="field-body" >
                            <label htmlFor="">Docente:</label>
                            <DropDownListComponent id="teacher" placeholder='Seleccione el docente'
                                name="teacher" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsTeacher}
                                fields={{ value: "id", text: "name" }}
                                value={values.teacher || null}
                                onChange={onHandleChange}
                            >
                            </DropDownListComponent>
                        </div>
                    </div>
                    <div className="field-ambient">
                        <p>
                            5. Debes seleccionar el ambiente (lugar)
                        </p>
                        <div className="field-body" >
                            <label htmlFor="">Ambiente:</label>
                            <DropDownListComponent id="ambient" placeholder='Seleccione el ambiente'
                                name="ambient" className="e-field" style={{ width: '100%' }}
                                dataSource={optionsAmbient}
                                fields={{ value: "id", text: "name" }}
                                value={values.ambient || null}
                                onChange={onHandleChange}
                            >
                            </DropDownListComponent>
                        </div>
                    </div>
                </div>
                {/* Card */}
                <div className="card-container">
                    <div className="card">
                        <div className="card-title">
                            <p>
                                Datos seleccionados
                            </p>
                        </div>
                        <div className="card-info">
                            <div className="header">
                                {/* icono */}
                                <div className="icon" style={{ textAlign: "center" }}>
                                    <i className="pi pi-info-circle" style={{ fontSize: "50px" }} />
                                </div>
                            </div>
                            <div className="body">
                                <p>
                                    <strong>Periodo:</strong>
                                    <span> {findByIdInfo("academicPeriod", values.academicPeriod)}</span>
                                </p>
                                <p>
                                    <strong>Programa:</strong>
                                    <span> {findByIdInfo("program", values.program)}</span>
                                </p>
                                <p>
                                    <strong>Competencia:</strong>
                                    <span> {findByIdInfo("competence", values.competence)}</span>
                                </p>
                                <p>
                                    <strong>Docente:</strong>
                                    <span> {findByIdInfo("teacher", values.teacher)}</span>
                                </p>
                                <p>
                                    <strong>Ambiente (lugar):</strong>
                                    <span> {findByIdInfo("ambient", values.ambient)}</span>
                                </p>

                            </div>
                        </div>
                    </div>
                    <div className="button-reset">
                        <Button
                            label="Reiniciar valores"
                            className="p-button-success"
                            onClick={resetValues}
                        />
                    </div>
                </div>
            </div>
            <div className="schedule" >
                <div className="schedule-header">
                    <h3>Agenda horaria</h3>
                    <ScheduleComponent
                        ref={schedule => scheduleObj = schedule}
                        eventSettings={{ dataSource: dataSchedulesFormat }}
                        popupOpen={onPopupOpen}
                        popupClose={onPopupClose}
                        drag={onDrag}
                        dragStop={onDragStop}
                        showQuickInfo={false}
                        editorTemplate={editorTemplate}
                        rowAutoHeight={true}
                        height="700px"
                        workHours={{ highlight: true, start: '07:00', end: '20:00' }}
                        timeScale={{ enable: true, interval: 60, slotCount: 1 }}
                        weekRule="FirstFullWeek"
                        workDays={[1, 2, 3, 4, 5, 6]}
                        showWeekend={false}
                        startHour="07:00"
                        endHour="23:00"
                        // showHeaderBar={false} oculta el header
                        // readonly={true} // solo lectura 
                        minDate={new Date(2023, 0, 1)}
                        // maxDate={new Date(2023, 11, 31)}
                    >
                        <ViewsDirective>
                            <ViewDirective option='Day' />
                            <ViewDirective option='WorkWeek' />
                            <ViewDirective option='Week' />
                            <ViewDirective option='Month' />
                            <ViewDirective option='Agenda' />
                        </ViewsDirective>
                        <Inject services={[Day, WorkWeek, Week, Agenda, Month, DragAndDrop]}
                        />
                    </ScheduleComponent>
                </div>
            </div>
        </div>
    )
}
export default Schedule;
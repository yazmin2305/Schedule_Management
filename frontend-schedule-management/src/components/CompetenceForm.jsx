import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

function CompetenceForm(){

    const [competence, setCompetence] = useState([]); 

    
    const loadCompetence = () => {
        let baseUrl = "http://localhost:8080/competence";
        axios.get(baseUrl).then(response =>
            setCompetence(response.data)
        );
        console.log("mirar este", competence)
    };


    useEffect(() => {
        console.log("hola");
        loadCompetence();
        console.log("mirar este", competence)
    }, []);


    return(
        <div>
            <h1>Informacion de la competencia</h1>
            <div className="">
                {
                    competence.length > 0 ? (
                        competence.map((competence, index) => (
                            <div key = {index}>
                                <p>Id: {competence.id}</p>
                                <p>Nombre: {competence.name}</p>
                                <p>Tipo: {competence.type}</p>
                                <p>Estado: {competence.state}</p>
                            </div>
                        ))
                    ) : 
                    (
                        <p>No hay competencias</p>
                    )
                }
            </div>

        </div>
    )
}
export default CompetenceForm;

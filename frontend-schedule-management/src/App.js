import "./App.css";
import PublicRouters from "./routers/PublicRouters";
//import {useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from "./components/login/supabaseClient";
import Account from "./components/login/Account";
import Auth from "./components/login/Auth";
import CompetenceForm from "./components/CompetenceForm";
import DashboardCompetence from "./components/competence/DashboardCompetence";
import DashboardAmbient from "./components/ambient/DashboardAmbient";
import DashboardAcademicPeriod from "./components/AcademicPeriod/DashboardAcademicPeriod";
import DashboardProgram from "./components/program/DashboardProgram";
import Navbar from "./components/Navbar";
import DashboardTeacher from "./components/teacher/DashboardTeacher";
import Schedule from "./components/schedule/Schedule";

// import { Routes, Route} from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  //const navigate = useNavigate();
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    getSession()
    supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_OUT') {
        window.location.href = "/";

      }
      if (!session) {
        window.location.href = "/";
        //navigate("/login");
        console.log("entraaaaaaaaaaaaaaaaaaaaaaa");
        //window.location.href="/";
      } else {
        // window.location.reload();
        console.log("wwindowwwwwwww ", window.location.href)
        if (window.location.href === "http://localhost:3000/") {
          window.location.href = "/account";
        }
        // console.log("verrrr ", window.location.href)
        // window.location.href = "/account";
      }
    });
  }, []);


  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (data.session !== null) {
        console.log("entra en sesion", data)
        setSession(data)
        setLoading(true)
      } else {
        setLoading(false)
      }
    } catch (error) {
      alert(error.message)
    }
  }


  return (
    <div className="App">
      {console.log("es: ", loading)}
      <BrowserRouter>

        <Navbar render={loading} />

        {/* <PublicRouters /> */}
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/competence" element={<CompetenceForm />} />
          <Route path="/view-competence/" element={<DashboardCompetence />} />
          <Route path="/view-ambient/" element={<DashboardAmbient />} />
          <Route
            path="/view-academicperiod/"
            element={<DashboardAcademicPeriod />}
          />
          <Route path="/view-program/" element={<DashboardProgram />} />
          <Route path="/view-teacher/" element={<DashboardTeacher />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </BrowserRouter>
    </div>


  );
}

export default App;

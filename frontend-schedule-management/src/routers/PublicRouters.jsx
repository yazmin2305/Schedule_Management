import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import CompetenceForm from "../components/CompetenceForm";
import DashboardCompetence from "../components/competence/DashboardCompetence";
import DashboardAmbient from "../components/ambient/DashboardAmbient";
import DashboardAcademicPeriod from "../components/AcademicPeriod/DashboardAcademicPeriod";
import DashboardProgram from "../components/program/DashboardProgram";
import DashboardTeacher from "../components/teacher/DashboardTeacher";
import "../App.css";
import Schedule from "../components/schedule/Schedule";

import Account from "../components/login/Account";
import Auth from "../components/login/Auth";

function PublicRouters() {
  return (
    <>
      {/* <Navbar render={true}/> */}
      <Routes>
        {/* <Route path="/" element={<Navbar />} /> */}
        <Route path="/competence" element={<CompetenceForm />} />
        <Route path="/view-competence/" element={<DashboardCompetence />} />
        <Route path="/view-ambient/" element={<DashboardAmbient />} />
        <Route
          path="/view-academicperiod/"
          element={<DashboardAcademicPeriod />}
        />
        <Route path="/view-program/" element={<DashboardProgram />} />
        <Route path="/view-teacher/" element={<DashboardTeacher />} />
        {/* <Route path="/" element={<Auth />} />
                <Route path="/account" element={<Account />} /> */}
        <Route path="/schedule" element={<Schedule />} />

      </Routes>
    </>
  );
}
export default PublicRouters;

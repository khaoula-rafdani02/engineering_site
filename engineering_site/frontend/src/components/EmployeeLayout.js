import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import "./EmployeeLayout.css";

function EmployeeLayout() {
  return (
    <div className="emp-layout">
      <EmployeeSidebar />
      <main className="emp-layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;
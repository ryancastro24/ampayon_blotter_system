import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [navigationList, setNavigationList] = useState("case");
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen">
      <div className="w-full h-[70px] sticky top-0 z-20 bg-blue-500 flex justify-between items-center px-4">
        <div className="flex items-center gap-16">
          <div className="flex flex-col">
            <h1 className="text-white font-display text-lg font-bold">
              Brgy. Ampayon
            </h1>
            <h2 className="text-white text-xs font-display">Butuan City</h2>
          </div>

          <ul className="flex items-center gap-8">
            <li
              onClick={() => {
                navigate("/dashboard");
                setNavigationList("case");
              }}
              className={`text-white text-sm py-2 px-3 font-display cursor-pointer ${
                navigationList === "case" ? "bg-blue-600" : ""
              }  hover:bg-blue-600 rounded`}
            >
              Case
            </li>
            <li
              onClick={() => {
                navigate("archives");
                setNavigationList("archives");
              }}
              className={`text-white text-sm py-2 px-3 font-display cursor-pointer ${
                navigationList === "archives" ? "bg-blue-600" : ""
              }  hover:bg-blue-600 rounded`}
            >
              Archives
            </li>
            <li
              onClick={() => {
                navigate("report");
                setNavigationList("report");
              }}
              className={`text-white text-sm py-2 px-3 font-display cursor-pointer ${
                navigationList === "report" ? "bg-blue-600" : ""
              }  hover:bg-blue-600 rounded`}
            >
              Report
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full p-5">{<Outlet />}</div>
    </div>
  );
};

export default Dashboard;

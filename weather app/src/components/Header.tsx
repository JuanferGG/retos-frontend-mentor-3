import { useState } from "react";
import logo from "../assets/images/logo.svg";
import { BiChevronDown } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="logo weather app" className="logoApp" />
      </div>

      <div className="dropdown">
        <button className="dropdown-btn" onClick={() => setOpen(!open)}>
          <span className="icon"><CiSettings /> Units</span>
          
          <span className={`arrow ${open ? "open" : ""}`}>
            <BiChevronDown />
          </span>
        </button>

        {open && (
          <div className="dropdown-menu">
            <button>Metric (°C)</button>
            <button>Imperial (°F)</button>
          </div>
        )}
      </div>
    </header>
  );
};

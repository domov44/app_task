import React, { useState, useEffect } from 'react';
import '../../assets/style/style.css';
import { successMessageEvent } from '../../hooks/events/customEvents';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import ThemeView from '../ThemeView';

function ThemeSwitch() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme);
      document.querySelector("body").setAttribute("data-theme", currentTheme);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.querySelector("body").setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    const successMessage = `Nouveau thème ${newTheme} sauvegardé`;
    notifySuccess(successMessage);
  };

  return (
    <>
      <div className='theme-container'>
        <input
          className='radio-theme'
          type="radio"
          id="Light"
          name="theme"
          value="light"
          checked={theme === "light"}
          onChange={() => handleThemeChange("light")}
        />
        <label className="label-theme" htmlFor="Light">
          <ThemeView theme="light" />
          <div className="text-theme">Clair</div>
        </label>
      </div>
      <div className='theme-container'>
        <input
          className='radio-theme'
          type="radio"
          id="Dark"
          name="theme"
          value="dark"
          checked={theme === "dark"}
          onChange={() => handleThemeChange("dark")}
        />
        <label className="label-theme" htmlFor="Dark">
          <ThemeView theme="dark" />
          <div className="text-theme">Sombre</div>
        </label>
      </div>
    </>
  );
}

export default ThemeSwitch;

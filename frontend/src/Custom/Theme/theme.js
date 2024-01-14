// theme.js
export function applyTheme() {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.querySelector("body").setAttribute("data-theme", currentTheme);
    } else { // défini le thème par défaut tant que rien n'est coché
      document.querySelector("body").setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }
  
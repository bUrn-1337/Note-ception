const theme = new URLSearchParams(location.search).get("mode");
if (theme) {
  setTimeout(`setTheme("theme=${theme}")`, 1000);
}

function setTheme(x) {
  if (mode === "dark" || mode === "light") {
    document.body.classList.add(mode);
  }
}

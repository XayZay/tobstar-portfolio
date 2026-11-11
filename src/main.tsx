import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

let savedTheme: string | null = null;
try {
  savedTheme = localStorage.getItem("tobstar-theme");
} catch {
  // Use the default light theme when browser storage is unavailable.
}
const initialTheme = savedTheme === "dark" ? "dark" : "light";
document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme;
document.querySelector('meta[name="theme-color"]')?.setAttribute(
  "content",
  initialTheme === "dark" ? "#181c19" : "#eeebdf",
);

createRoot(document.getElementById("root")!).render(<App />);

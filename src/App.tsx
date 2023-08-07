import { useState } from "react";
import FormBuilder from "./components/base/FormBuilder";
import FormTester from "./components/base/FormTester";
import NavElement from "./components/misc/NavElement";
import "./App.css";

type Pages = "builder" | "tester";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Pages>("builder");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigateTo = (page: Pages) => {
    if (page === "tester" && hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes that will be lost. Do you want to continue?"
        )
      ) {
        setCurrentPage(page);
      }
    } else {
      setCurrentPage(page);
    }
  };

  const pages = {
    builder: {
      component: <FormBuilder onUnsavedChanges={setHasUnsavedChanges} />,
      text: "Form Builder",
    },
    tester: { component: <FormTester />, text: "Form Tester" },
  };

  return (
    <>
      <nav className="fixed z-50 left-0 top-0 w-full h-16 flex flex-row justify-center align-middle lg:h-full lg:w-64 lg:flex-col lg:justify-start bg-slate-700">
        {Object.keys(pages).map((page) => (
          <NavElement
            key={page}
            navigateTo={() => {
              navigateTo(page as Pages);
            }}
            text={pages[page as Pages].text}
            isActive={currentPage === page}
          />
        ))}
      </nav>
      <main className="flex-grow p-8 lg:p-12 lg:pl-72">
        {pages[currentPage].component}
      </main>
    </>
  );
};

export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { FormProvider } from './context/FormContext';
// import FormBuilder from './components/FormBuilder';
// import FormFiller from './components/FormFiller';
// import Responses from './components/Responses';
// import './index.css';

// // Main app with routing for Form Builder, Form Filler, and Responses
// function App() {
//   return (
//     <FormProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<FormBuilder />} />
//           <Route path="/form/:formId" element={<FormFiller />} />
//           <Route path="/responses/:formId" element={<Responses />} />
//         </Routes>
//       </Router>
//     </FormProvider>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import { FormProvider } from "./context/FormContext";
import FormBuilder from "./components/FormBuilder";
import FormFiller from "./components/FormFiller";
import Responses from "./components/Responses";
import "./index.css";

function App() {
  return (
    <FormProvider>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/form/:formId" element={<FormFiller />} />
        <Route path="/responses/:formId" element={<Responses />} />
      </Routes>
    </FormProvider>
  );
}

export default App;

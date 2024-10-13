import { Route, Routes } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
   <>
    <Routes>
          <Route path="/*" element={<AdminRoute/>} />
    </Routes>
   </>
  )
}
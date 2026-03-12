import { Toaster } from "react-hot-toast";
import Router from "./routers/Router";


function App() {
    return (
        <div>
            <Toaster position="top-right"/>
            <Router />
        </div>
    );
}

export default App;
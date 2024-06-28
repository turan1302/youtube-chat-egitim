import {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from "react-router-dom";
import AppRouter from "./router/AppRouter";

class App extends Component {
    render() {
        return (
           <Routes>
               <Route path={"/*"} element={<AppRouter/>}></Route>
           </Routes>
        )
    }
}

export default App;

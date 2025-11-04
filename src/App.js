import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import { BrowserRouter as Router, } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useContext } from 'react';
// import _ from 'lodash';
import AppRoutes from './routes/AppRoutes';
import { TailSpin } from 'react-loader-spinner'
import { UserContext } from "./context/UserContext";

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      {user && user.isLoading ?
        <div className='loading-container'>
          <TailSpin
            heigth="100"
            width="100"
            color='#046ab9'
            ariaLabel='loading'
          />
          <div> Đang tải trang...</div>
        </div>


        :
        <>
          <div className='app-header'>
            <NavHeader />
          </div>
          <div className='app-container'>
            <AppRoutes />
          </div>
        </>
      }


      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      // theme="light"
      // transition={Bounce}
      />
    </Router>
  );
}


export default App;

import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
// import _ from 'lodash';
import AppRoutes from './routes/AppRoutes';
import { TailSpin } from 'react-loader-spinner'
import { UserContext } from "./context/UserContext";
import { NewsProvider } from './context/NewsContext';

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
          <NewsProvider>
            <div className='app-header'>
              <NavHeader />
            </div>
            <div className='app-container'>
              <AppRoutes />
            </div>
            <Footer />
          </NewsProvider>
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

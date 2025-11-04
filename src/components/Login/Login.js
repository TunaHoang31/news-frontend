import './Login.scss';
// import { Link } from 'react-router-dom';
import { useHistory, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from "../../services/userService";
import { UserContext } from "../../context/UserContext";

const Login = (props) => {
    const { user, loginContext } = useContext(UserContext);
    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateNewAccount = () => {
        // alert('click me');
        history.push('/register');
    }
    const handleLogin = async () => {
        if (!valueLogin) {
            toast.error("Vui lòng điền tên đăng nhập!")
            return;
        }
        if (!password) {
            toast.error("Vui lòng điền mật khẩu!")
            return;
        }

        let response = await loginUser(valueLogin, password);
        if (response && +response.EC === 0) {
            // success
            let groupWithRoles = response.DT.groupWithRoles;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;

            let data = {
                isAuthenticated: true,
                token,
                account: { groupWithRoles, email, username }
            }
            localStorage.setItem('jwt', token)
            loginContext(data);
            history.push('/');
            // // window.location.reload();
            toast.success(response.EM)
        }
        if (response && +response.EC !== 0) {
            // error
            toast.error(response.EM)
        }
    }
    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === 'Enter') {
            handleLogin();
        }
    }
    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, [user, history]);
    return (
        <div className="login-container">
            <div className="container" >
                <div className="row" px-3 px-sm-0>
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block ">
                        <div className='brand'>
                            <Link to="/"> <span title='Return to HomePage'>  Tin tức nhanh </span></Link>

                        </div>
                        <div className='detail'>
                            Đọc ngay những tin tức mới nhất trong ngày, cập nhật liên tục 24/7. Những sự kiện nóng hổi, những câu chuyện hấp dẫn đang chờ bạn khám phá.

                        </div>
                    </div>
                    <div className="content-right col-sm-5 col-12 d-flex flex-column gap-3 py-3 ">
                        <div className='brand d-sm-none' >
                            Tin tức nhanh
                        </div>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={(event) => { setValueLogin(event.target.value) }}
                        />
                        <input
                            type='password'
                            className='form-control'
                            placeholder='Password'
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                            onKeyPress={(event) => handlePressEnter(event)}
                        />
                        <button
                            className='btn btn-primary'
                            onClick={() => handleLogin()}>
                            Đăng nhập
                        </button>
                        {/* <span className='text-center'>
                            <a className='forgot-password' href='#'>
                                Quên mật khẩu?
                            </a>
                        </span> */}
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleCreateNewAccount()}>
                                Tạo tài khoản mới
                            </button>
                            <div className='mt-3 return'>
                                <Link to='/'>
                                    <i className='fa fa-arrow-circle-left'></i>
                                    <span title='Return to HomePage'>Trở về Trang chủ</span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}


export default Login;

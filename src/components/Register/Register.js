
import './Register.scss';
import { useHistory, Link } from 'react-router-dom';
// import { data } from 'autoprefixer';
import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { registerNewUser } from "../../services/userService";
import { UserContext } from '../../context/UserContext';


const Register = (props) => {
    const { user } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    }
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    let history = useHistory();
    const handleLogin = () => {
        // alert('click me');
        history.push('/login');
    }
    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, [])

    const isValidInput = () => {
        setObjCheckInput(defaultValidInput);

        if (!email) {
            toast.error("Vui lòng điền thông tin Email!");
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }

        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            toast.error("Email không hợp lệ!");
            return false;
        }
        if (!phone) {
            toast.error("Vui lòng điền thông tin!");
            setObjCheckInput({ ...defaultValidInput, isValidPhone: false });
            return false;
        }
        if (!password) {
            toast.error("Vui lòng điền thông tin!");
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (password !== confirmPassword) {
            setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
            toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
            return false;
        }


        return true;
    }


    const handleRegister = async () => {

        let check = isValidInput();

        if (check === true) {
            let serverData = await registerNewUser(email, phone, username, password);
            if (+serverData.EC === 0) {
                toast.success(serverData.EM);
                history.push('/login');
            } else {
                toast.error(serverData.EM);
            }
        }

    }


    return (
        <div className="register-container ">
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

                        <div className='form-group' >
                            <label>Email</label>
                            <input type='text' className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Email address'
                                value={email} onChange={(event) => setEmail(event.target.value)}
                            />

                        </div>
                        <div className='form-group' >
                            <label>Phone number</label>
                            <input type='text' className={objCheckInput.isValidPhone ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Phone number'
                                value={phone} onChange={(event) => setPhone(event.target.value)}
                            />

                        </div>
                        <div className='form-group' >
                            <label>Username </label>
                            <input type='text' className='form-control' placeholder='Username'
                                value={username} onChange={(event) => setUsername(event.target.value)}
                            />

                        </div>

                        <div className='form-group' >
                            <label> Password</label>
                            <input type='password' className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Password'
                                value={password} onChange={(event) => setPassword(event.target.value)}
                            />

                        </div>
                        <div className='form-group' >
                            <label> Re-enter password</label>
                            <input type='password' className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Re-enter password'
                                value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                            />

                        </div>

                        <button className='btn btn-primary' type='button' onClick={() => handleRegister()}>Đăng ký</button>

                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleLogin()}>
                                Đã có tài khoản? Đăng nhập
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


export default Register;

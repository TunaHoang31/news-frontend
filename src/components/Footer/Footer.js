import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="footer-section">
                            <h5>TRỤ SỞ HÀ NỘI</h5>
                            <div className="footer-content">
                                <p>
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Tầng 12, Tòa nhà Geleximco, 36 Kim Mã, Quận Hoàn Kiếm, Tp.Hà Nội</span>
                                </p>
                                <p>
                                    <i className="fas fa-phone"></i>
                                    <span>Điện thoại: (84-24) 73 00 24 24 | (84-24) 35 12 18 06</span>
                                </p>
                                <p>
                                    <i className="fa fa-fax"></i>
                                    Email: hoangtuan312@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="footer-section">
                            <h5>CHI NHÁNH QUẢNG NINH</h5>
                            <div className="footer-content">
                                <p>
                                    <i className="fa fa-map-marker-alt"></i>
                                    Tầng 7, Tòa nhà Vàng, 467 Trần Phú, Phường Quang Hanh, Tỉnh Quảng Ninh
                                </p>
                                <p>
                                    <i className="fa fa-phone"></i>
                                    Điện thoại: (84-28) 73 00 16 17
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Giấy phép */}
                    <div className="col-12 mt-4">
                        <div className="footer-bottom">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <p className="mb-2">
                                        GIẤY PHÉP THIẾT LẬP TRANG THÔNG TIN ĐIỆN TỬ TỔNG HỢP TRÊN MẠNG
                                    </p>
                                    <p className="mb-2">
                                        Giấy phép số 180/GP-STTTT ngày cấp 11/12/2024 - Sở thông tin và truyền thông Hà Nội
                                    </p>
                                    <p className="mb-0">
                                        Giấy xác nhận thông báo cung cấp dịch vụ Mạng xã hội số 89 /GXN-PTTH&TTĐT do Cục
                                        Phát thanh, Truyền hình và Thông tin Điện tử cấp ngày 31 tháng 10 năm 2025
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <div className="footer-links">
                                        {/* <Link to="/lien-he">LIÊN HỆ QUẢNG CÁO</Link>
                                        <Link to="/gioi-thieu">GIỚI THIỆU</Link>
                                        <Link to="/gop-y">GÓP Ý</Link>
                                        <Link to="/chinh-sach">CHÍNH SÁCH BẢO MẬT</Link>
                                        <Link to="/dieu-khoan">ĐIỀU KHOẢN SỬ DỤNG</Link>
                                        <Link to="/tuyen-dung">TUYỂN DỤNG</Link> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
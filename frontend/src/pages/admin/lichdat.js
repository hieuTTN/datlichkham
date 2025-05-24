import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod, postMethod} from '../../services/request';
import { formatTime} from '../../services/date';
import { formatMoney} from '../../services/money';
import Swal from 'sweetalert2';
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Table } from "antd";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



var size = 10;
var url = '';
const { RangePicker } = DatePicker;
const AdminLichDat = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [description, setDescription] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [details, setDetails] = useState([]);
    const [booking, setBooking] = useState(null);
    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var uls = `/api/booking/admin/all?size=${size}&sort=id,desc`
        if(from != '' && to != ''){
            uls += '&start='+from+'&end='+to
        }
        uls += '&page=';
        var response = await getMethod(uls+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = uls;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    function onDateChange(dates, dateStrings){
        setFrom(dateStrings[0])
        setTo(dateStrings[1])
    }

    async function updateStatus(e, id) {
        const response = await postMethod(`/api/booking/admin/update-status?id=${id}&payStatus=${e.value}`)
        var result = await response.json();
        console.log(result)
        if (response.status < 300) {
            toast.success("Cập nhật thành công");
            getData();
        } else {
            toast.error("Thất bại");
        }
    }


    const printBooking = (booking) => {
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="text-align: center;">Hóa Đơn Đặt Lịch Khám</h2>
                <p><strong>Mã đặt lịch:</strong> ${booking.id}</p>
                <p><strong>Họ tên bệnh nhân:</strong> ${booking.fullName || booking.user?.fullname || "—"}</p>
                <p><strong>Ngày sinh:</strong> ${booking.dob || "—"}</p>
                <p><strong>Số điện thoại:</strong> ${booking.phone || "—"}</p>
                <p><strong>Địa chỉ:</strong> ${booking.address || "—"}</p>
                <p><strong>Ngày khám:</strong> ${booking.appointmentDate || "—"}</p>
                <p><strong>Giờ khám:</strong> ${booking.appointmentTime || "—"}</p>
                <p><strong>Bác sĩ:</strong> ${booking.doctor?.fullName || "—"}</p>
                <p><strong>Chuyên khoa:</strong> ${booking.doctor?.specialty?.name || "—"}</p>
                <p><strong>Mô tả bệnh:</strong> ${booking.diseaseDescription || "—"}</p>
                <p><strong>Trạng thái thanh toán:</strong> ${booking.payStatus || "—"}</p>
                <h4>Dịch vụ sử dụng</h4>
                <table border="1" cellspacing="0" cellpadding="6" width="100%">
                    <thead>
                        <tr>
                            <th>Dịch vụ</th>
                            <th>Phòng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${booking.bookingDetails.map(detail => `
                            <tr>
                                <td>${detail.services?.name || "—"}</td>
                                <td>${detail.services?.room || "—"}</td>
                                <td>${(detail.price || 0).toLocaleString("vi-VN")} đ</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <h4 style="text-align: right;">Tổng tiền: ${booking.tongTien?.toLocaleString("vi-VN") || "0"} đ</h4>
            </div>
        `;

        const printWindow = window.open('', '', 'width=900,height=700');
        printWindow.document.write(`
            <html>
            <head>
                <title>In thông tin đặt lịch</title>
            </head>
            <body onload="window.print(); window.onafterprint = () => window.close();">
                ${html}
            </body>
            </html>
        `);
        printWindow.document.close();
    };



    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Lịch Khám</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <RangePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        placeholder={["Từ ngày", "Đến ngày"]}
                        onChange={onDateChange}
                    />
                     <button onClick={()=>getData()} className='btn btn-primary ms-2'><i class="fa fa-search"></i> </button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách lịch khám</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                           <tr>
                                <th>Id</th>
                                <th>Ngày đặt</th>
                                <th>Giờ khám</th>
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Ngày sinh</th>
                                <th>Mô tả bệnh</th>
                                <th>Tổng tiền dịch vụ</th>
                                <th>Cập nhật</th>
                                <th>In</th>
                            </tr>
                        </thead>
                        <tbody>
                             {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{formatTime(item.startTime)} - {formatTime(item.endTime)}</td>
                                    <td>{item.fullName == null ?item.user.fullname:item.fullName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.dob}</td>
                                    <td>{item.diseaseDescription}</td>
                                    <td>{formatMoney(item.tongTien)}</td>
                                    <td class="sticky-col">
                                        <select onChange={(e)=>updateStatus(e.target, item.id)} className='form-control'>
                                            <option selected={item.payStatus == 'DA_THANH_TOAN_KHAM'} value='DA_THANH_TOAN_KHAM'>Đã thanh toán khám</option>
                                            <option selected={item.payStatus == 'DA_THANH_TOAN_DU'} value='DA_THANH_TOAN_DU'>Đã thanh toán đủ</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={()=>printBooking(item)} className='delete-btn'><i className='fa fa-print'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
            </div>
        <div id="print-area" style={{ display: "none" }}></div>
        </>
    );
}

export default AdminLichDat;
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


   const exportPDF = (booking) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal"); // Font hỗ trợ tiếng Việt đơn giản
    doc.setFontSize(18);
    doc.text("Thông Tin Đặt Lịch Khám", 70, 15);

    doc.setFontSize(12);
    const info = [
        ["Mã đặt lịch:", booking.id],
        ["Họ tên bệnh nhân:", booking.fullName || booking.user?.fullname || "—"],
        ["Ngày sinh:", booking.dob || "—"],
        ["Số điện thoại:", booking.phone || "—"],
        ["Địa chỉ:", booking.address || "—"],
        ["Ngày khám:", booking.appointmentDate || "—"],
        ["Giờ khám:", booking.appointmentTime || "—"],
        ["Bác sĩ:", booking.doctor?.fullName || "—"],
        ["Chuyên khoa:", booking.doctor?.specialty?.name || "—"],
        ["Mô tả bệnh:", booking.diseaseDescription || "—"],
        ["Trạng thái thanh toán:", booking.payStatus || "—"],
    ];

    let y = 30;
    info.forEach(([label, value]) => {
        doc.text(`${label} ${value}`, 10, y);
        y += 8;
    });

    // Bảng dịch vụ
    autoTable(doc, {
        startY: y + 5,
        head: [["Dịch vụ", "Phòng", "Giá", "Kết quả"]],
        body: booking.bookingDetails.map((detail) => [
            detail.services.name || "—",
            detail.services.room || "—",
            (detail.price || 0).toLocaleString() + " đ",
            detail.result || "—",
        ]),
    });

    // Tổng tiền
    doc.setFontSize(14);
    doc.text(
        `Tổng tiền: ${booking.tongTien?.toLocaleString() || "0"} đ`,
        140,
        doc.lastAutoTable.finalY + 10
    );

    // Xuất file
    doc.save("booking.pdf");
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
                                <th>Kết luận</th>
                                <th>Tổng tiền dịch vụ</th>
                                <th class="sticky-col">Hành động</th>
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
                                    <td>{item.conclude}</td>
                                    <td>{formatMoney(item.tongTien)}</td>
                                    <td class="sticky-col">
                                        <select onChange={(e)=>updateStatus(e.target, item.id)} className='form-control'>
                                            <option selected={item.payStatus == 'DA_THANH_TOAN_KHAM'} value='DA_THANH_TOAN_KHAM'>Đã thanh toán khám</option>
                                            <option selected={item.payStatus == 'DA_THANH_TOAN_DU'} value='DA_THANH_TOAN_DU'>Đã thanh toán đủ</option>
                                        </select>

                                        <button onClick={()=>exportPDF(item)} className='delete-btn'><i className='fa fa-file'></i></button>
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

        </>
    );
}

export default AdminLichDat;
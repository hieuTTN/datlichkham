import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import { formatTime} from '../../services/date';
import { formatMoney } from '../../services/money';
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Table } from "antd";


var size = 3
var url = '';
const { RangePicker } = DatePicker;
function LichDaDangKy(){
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [details, setDetails] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [booking, setBooking] = useState(null);

    useEffect(()=>{
        getData();
    }, []);
  
    const getData= async() =>{
        var uls = `/api/booking/user/my-booking?size=${size}&sort=id,desc`
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
    
    return(
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Lịch Đặt</strong>
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
                    <span class="lbtable">Danh sách lịch đặt</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Giờ khám</th>
                                <th>Bác sỹ</th>
                                <th>Thông tin</th>
                                <th>Ngày sinh</th>
                                <th>Mô tả bệnh</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{formatTime(item.startTime)} - {formatTime(item.endTime)}<br/><strong>{item.appointmentDate}</strong></td>
                                    <td>{item.doctor.fullName}<br/>Chuyên khoa: {item.doctor.specialty.name}</td>
                                    <td>Họ tên: <strong>{item.fullName == null ?item.user.fullname:item.fullName}</strong><br/>
                                        Số điện thoại: <strong>{item.phone}</strong>
                                    </td>
                                    <td>{item.dob}</td>
                                    <td>{item.diseaseDescription}</td>
                                    <td class="sticky-col  d-flex">
                                        <button onClick={()=>setBooking(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" className='edit-btn' title='dịch vụ khám'><i className='fa fa-list'></i></button>
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

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body modalscroll">
                        <h4>Kết quả khám tổng quát</h4><hr/>
                        <div dangerouslySetInnerHTML={{__html:booking?.conclude}}></div>
                        <h4>Kết quả khám chi tiết</h4><hr/>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Dịch vụ</th>
                                    <th>Kết quả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {booking?.bookingDetails.map((item=>{
                                    return <tr>
                                        <td>#{item.services.id} - {item.services.name}</td>
                                        <td><div className='noidungxn' dangerouslySetInnerHTML={{__html:item.result}}></div>
                                        </td>
                                    </tr>
                                }))}    
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LichDaDangKy;

import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod, postMethodPayload,postMethodTextPlan} from '../../services/request';
import { formatTime} from '../../services/date';
import Swal from 'sweetalert2';
import {formatMoney} from '../../services/money';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Table } from "antd";

var token = localStorage.getItem("token");


var size = 10;
var url = '';
var description = '';
const { RangePicker } = DatePicker;
const DoctorBooking = ()=>{
    const [items, setItems] = useState([]);
    const [details, setDetails] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [booking, setBooking] = useState(null);
    const editorRef = useRef(null);
    const [bookingUpdate, setBookingUpdate] = useState(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(()=>{
        getData();
        getService();
    }, []);

    const getService= async() =>{
        var response = await getMethod('/api/service/public/find-all-list');
        var result = await response.json();
        setServices(result)
    };

    const getData= async() =>{
        var uls = `/api/booking/doctor/my-booking?size=${size}&sort=id,desc`
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

    const getDetail= async(id) =>{
        var response = await getMethod('/api/booking-detail/all/find-by-booking?bookingId='+id);
        var result = await response.json();
        setDetails(result)
    };

    function changeBooking(item){
        setBooking(item)
        getDetail(item.id);
    }

    async function deleteDetail(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa dịch vụ khám này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/booking-detail/doctor/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getDetail(booking.id);
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    async function saveDichVu(event) {
        event.preventDefault();
        var listId = []
        for(var i=0; i< selectedService.length; i++){
            listId.push(selectedService[i].id);
        }
        var payload = {
            "bookingId": booking.id,
            "serviceId": listId,
        }
        const response = await postMethodPayload('/api/booking-detail/doctor/create', payload)
        var result = await response.json();
        console.log(result)
        if (response.status < 300) {
            toast.success('Thêm dịch vụ khám thành công');
            getDetail(booking.id);
        } 
        if (response.status == 417) {
            toast.error(result.defaultMessage);
        } 
        
    }

    function handleEditorChange(content, editor) {
        description = content;
    }

    function changeBookingUpdate(item){
        setBookingUpdate(item)
        description = item.conclude
    }

    async function changeResult() {
        console.log(description);
        const response = await postMethodTextPlan(`/api/booking/doctor/update-result?id=${bookingUpdate?.id}`, description)
        var result = await response.json();
        if (response.status < 300) {
            toast.success('Cập nhật kết quả khám thành công');
            Swal.fire({
                title: "Thông báo",
                text: "Cập nhật kết quả khám thành công",
                preConfirm: () => {
                    window.location.reload();
                }
            });
        } 
        if (response.status == 417) {
            toast.error(result.defaultMessage);
        } 
        
    }
    function onDateChange(dates, dateStrings){
        setFrom(dateStrings[0])
        setTo(dateStrings[1])
    }
    
    return (
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
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
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
                                    <td>{item.fullName == null ?item.user.fullname:item.fullName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.address}</td>
                                    <td>{item.diseaseDescription}</td>
                                    <td class="sticky-col  d-flex">
                                        <button onClick={()=>changeBooking(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" className='edit-btn' title='dịch vụ khám'><i className='fa fa-list'></i></button>
                                        <button onClick={()=>changeBookingUpdate(item)} data-bs-toggle="modal" data-bs-target="#modalUpdate" className='edit-btn' title='Cập nhật kết quả'><i className='fa fa-edit'></i></button>
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
                        <h5 class="modal-title" id="exampleModalLabel">Các công đoạn khám của lịch đặt #{booking?.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body modalscroll">
                        <form onSubmit={saveDichVu} className='row classheadmodal'>
                            <div className='col-sm-10'>
                            <Select
                                isMulti
                                value={selectedService}
                                onChange={setSelectedService}
                                options={services}
                                getOptionLabel={(option) => option.name} 
                                getOptionValue={(option) => option.id}    
                                closeMenuOnSelect={false}
                                placeholder="Chọn dịch vụ khám"
                            />
                            </div>
                            <div className='col-sm-2'>
                                <button className='btn btn-primary form-control'>Thêm dịch vụ khám</button>
                            </div>
                        </form>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Dịch vụ</th>
                                    <th>Giá khám</th>
                                    <th>Kết quả</th>
                                    <th class="sticky-col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((item=>{
                                    return <tr>
                                        <td>#{item.services.id} - {item.services.name}</td>
                                        <td>{formatMoney(item.price)}</td>
                                        <td><div className='noidungxn' dangerouslySetInnerHTML={{__html:item.result}}></div>
                                        </td>
                                        <td>
                                            <button onClick={()=>deleteDetail(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                            <a href={'editbookingdetail?id='+item.id} target='_blank' className='edit-btn'><i className='fa fa-edit'></i></a>
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
            <div class="modal fade" id="modalUpdate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cập nhật kết quả khám tổng quát - Mã lịch khám {bookingUpdate?.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body modalscroll">
                        <Editor
                            key={bookingUpdate?.id || 'default'}
                            name='editor'
                            tinymceScriptSrc={'https://cdn.tiny.cloud/1/xqhz0tu1vx2a47ob4qdhwpyz39c09mrs2mfilfeahlm42vwa/tinymce/6/tinymce.min.js'}
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={bookingUpdate?.conclude || ''}
                            onEditorChange={handleEditorChange}
                            />
                    </div>
                    <div class="modal-footer">
                        <button onClick={()=>changeResult()} type="button" class="btn btn-primary">Lưu</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DoctorBooking;
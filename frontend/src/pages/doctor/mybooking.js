import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod, postMethodPayload} from '../../services/request';
import { formatTimestamp} from '../../services/date';
import Swal from 'sweetalert2';
import {formatMoney} from '../../services/money';
import Select from 'react-select';

var token = localStorage.getItem("token");


var size = 10;
var url = '';
const DoctorBooking = ()=>{
    const [items, setItems] = useState([]);
    const [details, setDetails] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [booking, setBooking] = useState(null);

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
        var response = await getMethod('/api/booking/doctor/my-booking?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/booking/doctor/my-booking?size='+size+'&sort=id,desc&page='
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


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Lịch Đặt</strong>
                <div class="search-wrapper d-flex align-items-center">
                   <a href='add-specialty' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
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
                                <th>Ngày đặt</th>
                                <th>Giờ khám</th>
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Ngày sinh</th>
                                <th>Mô tả bệnh</th>
                                <th>Kết luận</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.startTime} - {item.endTime}</td>
                                    <td>{item.fullName == null ?item.user.fullname:item.fullName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.address}</td>
                                    <td>{item.diseaseDescription}</td>
                                    <td>{item.conclude}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>changeBooking(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" className='edit-btn' title='dịch vụ khám'><i className='fa fa-list'></i></button>
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


            
        </>
    );
}

export default DoctorBooking;
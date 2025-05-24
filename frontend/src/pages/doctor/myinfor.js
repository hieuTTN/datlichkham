import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethod ,deleteMethod} from '../../services/request';
import { formatTime} from '../../services/date';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';


const MyInfor = ()=>{
    const [doctor, setDoctor] = useState(null);
    useEffect(()=>{
        getdoctor();
    }, []);

     const getdoctor= async() =>{
        var response = await getMethod('/api/doctor/doctor/my-infor');
        var result = await response.json();
        setDoctor(result)
    };


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Thông Tin Cá Nhân - Bác sỹ {doctor?.fullName} - Chuyên khoa: {doctor?.specialty.name}</strong>
                <div class="search-wrapper d-flex align-items-center">
                </div>
            </div><br/><br/>
            <div className='col-sm-6'>
                <table className='table table-bordered'>
                    <tr>
                        <th>Ảnh: </th>
                        <td><img src={doctor?.user.avatar} className='imgtable'/></td>
                    </tr>
                    <tr>
                        <th>Họ tên: </th>
                        <td>{doctor?.fullName}</td>
                    </tr>
                    <tr>
                        <th>Email: </th>
                        <td>{doctor?.user.email}</td>
                    </tr>
                    <tr>
                        <th>Số điện thoại: </th>
                        <td>{doctor?.user.phone}</td>
                    </tr>
                    <tr>
                        <th>Bằng cấp: </th>
                        <td>{doctor?.degree}</td>
                    </tr>
                    <tr>
                        <th>Giới tính: </th>
                        <td>{doctor?.gender}</td>
                    </tr>
                    <tr>
                        <th>Vị trí công việc: </th>
                        <td>{doctor?.position}</td>
                    </tr>
                    <tr>
                        <th>Số năm kinh nghiệm: </th>
                        <td>{doctor?.experienceYears} năm</td>
                    </tr>
                    <tr>
                        <th>Chuyên khoa: </th>
                        <td>{doctor?.specialty.name}</td>
                    </tr>
                    <tr>
                        <th>Đang công tác tại: </th>
                        <td>{doctor?.center.centerName}</td>
                    </tr>
                    <tr>
                        <th>Chi phí mỗi lần khám: </th>
                        <td>{formatMoney(doctor?.consultationFee)}</td>
                    </tr>
                </table>
            </div>
        </>
    );
}

export default MyInfor;
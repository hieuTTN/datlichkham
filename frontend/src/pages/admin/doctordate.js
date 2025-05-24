import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethod ,deleteMethod} from '../../services/request';
import { formatTime} from '../../services/date';
import Swal from 'sweetalert2';

var token = localStorage.getItem("token");


var size = 10;
var url = '';
const AdminDoctorDate = ()=>{
    const [items, setItems] = useState([]);
    const [doctor, setDoctor] = useState(null);
    useEffect(()=>{
        getData();
        getdoctor();
    }, []);

     const getdoctor= async() =>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("doctor");
        if(id != null){
            var response = await getMethod('/api/doctor/public/find-by-id?id=' + id);
            var result = await response.json();
            setDoctor(result)
        }
    };

    const getData= async() =>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("doctor");
        var response = await getMethod('/api/doctor-date/public/find-by-doctor?doctorId='+id);
        var result = await response.json();
        setItems(result)
    };

    function chuyenAdd(){
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("doctor");
        window.location.href = 'adddoctordate?doctor='+id
    }


    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Thời gian làm việc - Bác sỹ {doctor?.fullName} - Chuyên khoa: {doctor?.specialty.name}</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <button onClick={()=>chuyenAdd()} class="btn btn-primary ms-2">Thay đổi thời gian làm việc</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách thời gian làm việc</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Thứ trong tuần</th>
                                <th>Giờ làm việc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><strong>Thứ: {item.dayOfWeek + 1}</strong></td>
                                    <td>
                                        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "10px" }}>

                                        {item.doctorTimes.map((time=>{
                                            return <button type="button" className='timetable'>{formatTime(time.startTime)} - {formatTime(time.toTime)}</button>
                                        }))}
                                        </div>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminDoctorDate;
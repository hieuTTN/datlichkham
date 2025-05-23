import userDefault from '../../assest/images/avatar.png'
import {getMethod} from '../../services/request'
import { useState, useEffect } from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

var size = 6;
var url = '';
function Doctors(){
    const [items, setItems] = useState([]);
    const [chuyenKhoas, setChuyenKhoas] = useState([]);
    const [chuyenKhoa, setChuyenKhoa] = useState(null);
    const [pageCount, setpageCount] = useState(0);

     useEffect(()=>{
        const getChuyenKhoa = async() =>{
            var response = await getMethod('/api/specialty/public/find-all-list');
            var result = await response.json();
            setChuyenKhoas(result)
        };
        getChuyenKhoa();
        getItem();
    }, []);

    const getItem = async() =>{
        var uls = `/api/doctor/public/find-all?&size=${size}&sort=id,desc`
        if(chuyenKhoa != null){
            uls += `&specialtyId=${chuyenKhoa.id}`
        }
        uls += `&page=`
        url = uls;
        var response = await getMethod(uls+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    return(
       <div className='container-web mt-4'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Đội ngũ bác sỹ</li>
                </ol>
            </nav>
            <h3 class="news-title">Đội ngũ Danh sách đội ngũ bác sĩ Hệ thống y tế Thu Cúc TCI</h3><br/>
            <div className='row'>
                <div className='col-sm-6 coldivtimbs'>
                    <div className='divtimbacsy'>
                        <h4>Tìm kiếm thông tin</h4>
                        <div className='row'>
                            <div className='col-sm-8'>
                                <Select
                                    value={chuyenKhoa}
                                    onChange={setChuyenKhoa}
                                    options={chuyenKhoas}
                                    getOptionLabel={(option) => option.name} 
                                    getOptionValue={(option) => option.id}    
                                    placeholder="Chọn chuyên khoa"
                                />
                            </div>
                            <div className='col-sm-4'>
                                <button onClick={()=>getItem()} className='btn btn-primary'><i class="fa fa-search"></i> Tìm kiếm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row listdoctors'>
                {items.map((item, index)=>{
                    return <div className="col-md-4 mb-4">
                                <div className="card text-center h-100 shadow singlebslist">
                                    <a href={'doctor-detail?id='+item.id}><img src={item.user.avatar} className="imgdoctorlist"/></a>
                                    <div className="card-body">
                                        <p className="text-muted mb-1">Trình độ: {item.degree}, Chuyên khoa: {item.specialty.name}</p>
                                        <h5><a className="text-success fw-bold" href={'doctor-detail?id='+item.id}>{item.fullName}</a></h5>
                                        <hr style={{ borderTop: "2px solid orange", width: "80%", margin: "auto" }} />
                                        <p className="mt-2">{item.position}</p>
                                    </div>
                                </div>
                            </div>
                })}
            </div>
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
    );
}
export default Doctors;
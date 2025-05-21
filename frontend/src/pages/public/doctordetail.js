import userDefault from '../../assest/images/avatar.png'
import {getMethod} from '../../services/request'
import { useState, useEffect } from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


function DoctorDetail(){
    const [doctor, setDoctor] = useState(null);
    const [bestViewBlogs, setBestViewBlogs] = useState([]);

    useEffect(()=>{
        const getDoctor = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/doctor/public/find-by-id?id='+id);
                var result = await response.json();
                setDoctor(result)
            }
        };
        getDoctor();
        const getBestView = async() =>{
            var response = await getMethod('/api/blog/public/best-view');
            var result = await response.json();
            setBestViewBlogs(result)
        };
        getBestView();
    }, []);
  
    return(
        <>
        <div class="container mt-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
                <li class="breadcrumb-item"><a href="doctors">Đội ngũ bác sĩ</a></li>
                <li class="breadcrumb-item active" aria-current="page">{doctor?.fullName}</li>
                </ol>
            </nav>

            <div class="row mt-4">
                <div class="col-md-8 d-flex">
                <div class="doctor-img me-4">
                    <img src={doctor?.user.avatar} alt="Bác sĩ Nguyễn Phạm Ý Nhi" class="img-fluid rounded shadow"/>
                </div>
                <div class="doctor-info">
                    <h6 class="text-muted">Bằng cấp: {doctor?.degree}</h6>
                    <h3 class="text-success fw-bold">{doctor?.fullName}</h3>
                    <p class="mb-1"><strong>{doctor?.position}</strong> {doctor?.center.centerName}</p>
                    <div class="bg-light p-2 rounded d-inline-block mb-2">
                        {doctor?.experienceYears} năm kinh nghiệm trong nghề
                    </div>
                    <div class="d-flex gap-3">
                    <div class="border border-success p-2 rounded">
                        <span class="text-muted">Tổng đài:</span> <strong class="text-success">1900 55 88 92</strong>
                    </div>
                    <div class="border border-warning p-2 rounded">
                        <span class="text-muted">Liên hệ:</span> <strong class="text-dark">0936 388 288</strong>
                    </div>
                    </div>
                </div>
                </div>

                <div class="col-md-4 mt-4 mt-md-0">
                <div class="border rounded p-3">
                    <h5 class="text-success fw-bold border-bottom pb-2">BÀI VIẾT MỚI NHẤT</h5>
                    <ul class="list-unstyled lh-lg">
                        {bestViewBlogs.map((item,index)=>{
                        return <li><a className='linkblogdtbs' href={'blog-detail?id='+item.id}><span class="badge bg-warning text-dark me-2">{++index}</span> {item.title}</a></li>
                        })}
                    </ul>
                </div>
                </div>
            </div>

            <div class="mt-4" dangerouslySetInnerHTML={{__html:doctor?.description}}>
            </div>
        </div>
        </>
    );
}

export default DoctorDetail;

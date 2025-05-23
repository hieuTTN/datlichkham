import Footer from '../../layout/customer/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import ModalCenter from './modalcenter'


var sizepro = 20
function Home(){
    const [coSoKhams, setCoSoKhams] = useState([]);
    const [coSoKham, setCoSoKham] = useState(null);
    const [itemNews, setItemNews] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(()=>{
        const getCoSoKham = async() =>{
            var response = await getMethod('/api/center/public/find-all-list');
            var result = await response.json();
            setCoSoKhams(result)
        };
        getCoSoKham();
        const getItemNews = async() =>{
            var response = await getMethod('/api/blog/public/best-view');
            var result = await response.json();
            setItemNews(result)
        };
        getItemNews();
        const getDoctors = async() =>{
            var response = await getMethod('/api/doctor/public/get-cd');
            var result = await response.json();
            setDoctors(result)
            if(result.length>0){
                setSelectedDoctor(result[0])
            }
        };
        getDoctors();
    }, []);
  

    

    return(
     <>
        <div class="bannerindex">
        <div id="courseindex">
            <div id="carouselExampleControls" class="carousel slide bannerindex" data-bs-ride="carousel">
                <div id="carouselindex">
                    <div class="carousel-inner carousel-inner-index">
                        <div class="carousel-item active">
                            <a href=""><img src={banner2} class="d-block w-100"/></a>
                        </div>
                        <div class="carousel-item">
                            <a href=""><img src={banner1} class="d-block w-100"/></a>
                        </div>
                        <div class="carousel-item">
                            <a href=""><img src={banner} class="d-block w-100"/></a>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>

        <div className='container-web'>
            <h3 className='text-center titlemain'>Các Cơ Sở Khám</h3>

            <div className=''>
                 <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={3}
                    slidesPerGroup={3}
                    navigation
                    loop={true}
                    pagination={{ clickable: true }}
                >
                    {coSoKhams.map((item, index)=>{
                        return <SwiperSlide>
                        <div onClick={()=>setCoSoKham(item)} data-bs-toggle="modal" data-bs-target="#modalCenter" className="coSoKhamIndex">
                            <img src={item.image} className='imgcosokhamindex'/>
                            <span className='tencosokhamindex'>{item.centerName}</span>
                        </div>
                        </SwiperSlide>
                    })}
                </Swiper>
            </div>
            <h3 className='text-center titlemain'>Đội Ngũ Bác Sĩ</h3>
            <div className="container mt-5"  id='cosokham'>
                <div className="row doctor-detail-box p-4 shadow">
                    <div className="col-md-4 text-center">
                    <a href={'doctor-detail?id='+selectedDoctor?.id}><img src={selectedDoctor?.user.avatar} alt={selectedDoctor?.fullName} className="img-fluid rounded doctor-main-img" /></a>
                    </div>
                    <div className="col-md-8">
                    <p className="text-uppercase font-weight-bold">Chuyên Khoa: {selectedDoctor?.specialty.name}</p>
                    <h4><a  className="text-success font-weight-bold" href={'doctor-detail?id='+selectedDoctor?.id}>{selectedDoctor?.fullName}</a></h4>
                    <p><strong>{selectedDoctor?.position}</strong></p>
                    <div className="white-space-pre-line motabacsiindex" dangerouslySetInnerHTML={{__html:selectedDoctor?.description}}></div>
                    </div>
                </div>


                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={5}
                    navigation
                    loop={true}
                    pagination={{ clickable: true }}
                >
                    {doctors.map((item, index)=>{
                        return <SwiperSlide>
                         <div className={`card doctor-thumb m-2`} onClick={() => setSelectedDoctor(item)}>
                            <img src={item.user.avatar} className="card-img-top" />
                        </div>
                        </SwiperSlide>
                    })}
                </Swiper>
            </div>


            <div className='news-index-block'>
                <h5 className='text-center titlemain'>Tin tức mới nhất</h5>
                <hr/>
                <div className="news-slider">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={3}
                    slidesPerGroup={3}
                    navigation
                    loop={true}
                    pagination={{ clickable: true }}
                >
                    {itemNews.map((item, index)=>{
                        return <SwiperSlide>
                        <div className="blogindex">
                            <a href={'blog-detail?id='+item.id}><img src={item.image} className="imgblogindex" alt={item.title} /></a>
                            <div className="news-date mb-2">
                                <i className='fa fa-calendar-alt'></i> {item.createdDate}
                            </div>
                            <a href={'blog-detail?id='+item.id} className="titleblogindex">{item.title}</a>
                        </div>
                        </SwiperSlide>
                    })}
                </Swiper>
                </div>
            </div>
        </div>
    </div>
    <ModalCenter center={coSoKham}/>
     </>
    );
}

export default Home;

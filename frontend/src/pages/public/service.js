import dctracuu from '../../assest/images/banner2.jpg'
import logomini from '../../assest/images/logomini.svg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


var size = 10;
var url = '';
function Service(){
    const [item, setItem] = useState([]);
    const [service, setService] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        getItem();
    }, []);
  
    const getItem = async() =>{
        var search = document.getElementById("search").value
        var response = await getMethod(`/api/service/public/find-all?size=${size}&search=${search}&page=`+0);
        var result = await response.json();
        setItem(result.content)
        setpageCount(result.totalPages)
        url = `/api/service/public/find-all?size=${size}&search=${search}&page=`;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItem(result.content)
        setpageCount(result.totalPages)
    }
    
    return(
     <div className='container-web'>
        <img src={dctracuu} className='imgtracuulichtiem'/>
        <div className='row'>
                <div className='col-sm-12'>
                    <p className='link-head-section'>
                        <a href="/">Trang chủ</a>
                        <span class="separator"> » </span>
                        <span class="last">Tra cứu bảng giá dịch vụ</span>
                    </p>
                    <div className='section-content-web'>
                        <div className='flex-section'>
                            <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                            <h2 className='title-dki-tiem-chung'>TRA CỨU GIÁ DỊCH VỤ</h2>
                        </div>
                    </div>
                    <div className='headertracuu'>
                        <input onKeyUp={getItem} id='search' className='input-search-schedule' placeholder='Nhập tên dịch vụ'/>
                        <a href='lich-tiem-da-qua'></a>
                    </div>
                    <table className='table table-bordered tablelichtiemvaccine'> 
                        <thead className='thead'>
                            <tr>
                                <th>STT</th>
                                <th className='col-blue'>Tên dịch vụ</th>
                                <th className='col-gre'>Giá</th>
                                <th>Mô tả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.map((item, index)=>{
                                return <tr className='pointer hoverschedule'>
                                    <td>{index+1}</td>
                                    <td className='col-blue'>{item.name}</td>
                                    <td className='col-gre'>{formatMoney(item.price)}</td>
                                    <td><button onClick={()=>setService(item)} className='edit-btn' data-bs-toggle="modal" data-bs-target="#exampleModal"><i className='fa fa-eye'></i></button></td>
                                </tr>
                            })}
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
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thông tin dịch vụ {service?.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className='noidungbodymodal' dangerouslySetInnerHTML={{__html:service?.description}}></div>
                    </div>
                    </div>
                </div>
            </div>
     </div>
    );
}

export default Service;

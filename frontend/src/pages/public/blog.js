import userDefault from '../../assest/images/avatar.png'
import {getMethod} from '../../services/request'
import { useState, useEffect } from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReactPaginate from 'react-paginate';

var size = 6;
var url = '';
function Blog(){
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [bestViewBlogs, setBestViewBlogs] = useState([]);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("category");
        const getCategory = async() =>{
            var response = await getMethod('/api/category/public/findById?id='+id);
            var result = await response.json();
            
            setCategory(result)
        };
        getCategory();
        const getBestView = async() =>{
            var response = await getMethod('/api/blog/public/best-view');
            var result = await response.json();
            setBestViewBlogs(result)
        };
        getBestView();
        const getItem = async() =>{
            var response = await getMethod(`/api/blog/public/find-by-category?categoryId=${id}&size=${size}&sort=id,desc&page=`+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = `/api/blog/public/find-by-category?categoryId=${id}&size=${size}&sort=id,desc&page=`;
        };
        getItem();
    }, []);

     const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
  
    return(
        <>
        <div class="container mt-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
                <li class="breadcrumb-item active" aria-current="page">{category?.name}</li>
                </ol>
            </nav>

            <div class="row mt-4">
                <div class="col-md-8">
                    <h3 class="news-title">{category?.name}</h3><br/>
                    {items.map((item, index)=>{
                        return <div class="blog-single-list">
                            <a href={'blog-detail?id='+item.id}><img src={item.image} alt="News Image" class="imageblogsingle" /></a>
                            <div class="blog-content">
                            <h4 class="blog-heading"><a href={'blog-detail?id='+item.id} className='linkglo'>{item.title}</a></h4>
                            <p class="blog-description">
                                {item.description}
                            </p>
                            <p class="blog-date"><i class="fa fa-calendar"></i> {item.createdDate}</p>
                            </div>
                        </div>
                    })}
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


        </div>
        </>
    );
}

export default Blog;

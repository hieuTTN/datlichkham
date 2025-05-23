import userDefault from '../../assest/images/avatar.png'
import {getMethod} from '../../services/request'
import { useState, useEffect } from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


function ChiTietChuyenKhoa(){
    const [chyenKhoa, setChuyenKhoa] = useState(null);
    const [bestViewBlogs, setBestViewBlogs] = useState([]);

    useEffect(()=>{
        const getBlog = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/specialty/public/find-by-id?id='+id);
                var result = await response.json();
                setChuyenKhoa(result)
            }
        };
        getBlog();
        const getBestView = async() =>{
            var response = await getMethod('/api/blog/public/best-view');
            var result = await response.json();
            setBestViewBlogs(result)
        };
        getBestView();
    }, []);
  
    return(
        <>
         <div class="contentmains contentbaiviet">
            <div class="container">
                
            <div class="headerbaiviet">
                <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
                <li class="breadcrumb-item active" aria-current="page"><a href='chuyenkhoa'>Chuyên khoa</a></li>
                </ol>
            </nav>
                <h1 id="tieudect">{chyenKhoa?.name}</h1>
            </div>
            <hr/>
            <div class="row noidungdsbv">
                <div class="col-sm-8">
                    <p class="motabvdetail" id="motabvdetail">{chyenKhoa?.description}</p>
                    <div id="noidungbaiviet" dangerouslySetInnerHTML={{__html:chyenKhoa?.content}}>
                        
                    </div>
                </div>
                <div class="col-sm-4">
                    <h5>Bài viết được xem nhiều nhất</h5>
                    <div id="listblogView" class="dsblogindex">
                        {bestViewBlogs.map((item=>{
                            return <div class="singleblogindex">
                                <span class="timebaiviet">{item.createdDate} {item.createdTime} • {item.user.fullname}</span>
                                <a href={'blog-detail?id='+item.id}>{item.title}</a>
                            </div>
                        }))}
                    </div>
                </div>
            </div>
        </div>
    </div>
        </>
    );
}

export default ChiTietChuyenKhoa;

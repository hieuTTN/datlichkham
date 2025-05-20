import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,deleteMethod} from '../../services/request';
import { formatTimestamp} from '../../services/date';
import Swal from 'sweetalert2';
import {formatMoney} from '../../services/money';

var token = localStorage.getItem("token");


var size = 10;
var url = '';
const AdminSpecialty = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(()=>{
        getData();
    }, []);

    const getData= async() =>{
        var response = await getMethod('/api/specialty/public/find-all?size='+size+'&sort=id,desc&page='+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/specialty/public/find-all?size='+size+'&sort=id,desc&page='
    };

    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa chuyên khoa này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/specialty/admin/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getData();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }


    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Chuyên Khoa</strong>
                <div class="search-wrapper d-flex align-items-center">
                   <a href='add-specialty' class="btn btn-primary ms-2"><i className='fa fa-plus'></i></a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách cơ sở khám</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Số bác sỹ</th>
                                <th>Mô tả ngắn</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img className='imgtable' src={item.image}/></td>
                                    <td>{item.name}</td>
                                    <td>{item.numdoctor}</td>
                                    <td className='col40'>{item.description}</td>
                                    <td class="sticky-col">
                                         <a href={"add-specialty?id="+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
                                        <button onClick={()=>deleteData(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                        <button onClick={()=>setDescription(item.content)} class="edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className='fa fa-eye'></i></button>
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
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Mô tả chuyên khoa</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div className='motadv' dangerouslySetInnerHTML={{__html:description}}></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminSpecialty;
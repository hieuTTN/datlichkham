import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,uploadSingleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';
import Select from 'react-select';

var token = localStorage.getItem("token");

var linkbanner = '';
var description = '';


const AdminAddCenter = ()=>{
    const editorRef = useRef(null);
    const [item, setItem] = useState(null);
    useEffect(()=>{
        const getItem= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/center/public/find-by-id?id=' + id);
                var result = await response.json();
                setItem(result)
                linkbanner = result.image
                description = result.description;
            }
        };
        getItem();
    }, []);

    function handleEditorChange(content, editor) {
        description = content;
    }


    async function saveData(event) {
        event.preventDefault();
        document.getElementById("loading").style.display = 'block'
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var ims = await uploadSingleFile(document.getElementById("imgbanner"))
        if(ims != null){
            linkbanner = ims
        }
        var payload = {
            "id": id,
            "centerName": event.target.elements.centerName.value,
            "city": event.target.elements.city.value,
            "district": event.target.elements.district.value,
            "ward": event.target.elements.ward.value,
            "street": event.target.elements.street.value,
            "description": description,
            "image": linkbanner,
        }
        const response = await postMethodPayload('/api/center/admin/create', payload)
        var result = await response.json();
        console.log(result)
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thêm/cập nhật thành công!",
                preConfirm: () => {
                    window.location.href = 'center'
                }
            });
        } else {
            toast.error("Thêm/ sửa thất bại");
            document.getElementById("loading").style.display = 'none'
        }
    }


    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Thêm/ cập nhật cơ sở khám</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveData} method='post'>
                            <div class="col-md-4 col-sm-12 col-12">
                                <label class="lb-form">Tên sơ sở khám</label>
                                <input defaultValue={item?.centerName} name="centerName" type="text" class="form-control"/>
                                <label class="lb-form">Tỉnh/ thành phố</label>
                                <input defaultValue={item?.city} name="city" type="text" class="form-control"/>
                                <label class="lb-form">Quận/ huyện</label>
                                <input defaultValue={item?.district} name="district" type="text" class="form-control"/>
                                <label class="lb-form">Phường/ xã</label>
                                <input defaultValue={item?.ward} name="ward" type="text" class="form-control"/>
                                <label class="lb-form">Tên đường/ địa chỉ cụ thể</label>
                                <input defaultValue={item?.street} name="street" type="text" class="form-control"/>
                                <label class="lb-form">Ảnh cơ sở khám</label>
                                <input id="imgbanner" type="file" class="form-control"/>
                                <img src={item?.image} className='imgtable'/>
                                <img id="imgpreview" className='imgadmin'/>
                                <div id="loading">
                                    <div class="bar1 bar"></div>
                                </div>
                                <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-8 col-sm-12 col-12">
                                <label class="lb-form lbmotadv">Mô tả về cơ sở khám</label>
                                <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/xqhz0tu1vx2a47ob4qdhwpyz39c09mrs2mfilfeahlm42vwa/tinymce/6/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor} 
                                        initialValue={item==null?'':item.description}
                                        onEditorChange={handleEditorChange}/>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    );
}



export default AdminAddCenter;
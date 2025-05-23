import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod ,uploadSingleFile, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2';
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';
import Select from 'react-select';
var description = '';
const EditBookingDetail = ()=>{
    const [detail, setDetail] = useState(null);
    const editorRef = useRef(null);

    useEffect(()=>{
         const getDetail= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/booking-detail/all/find-by-id?id=' + id);
                var result = await response.json();
                setDetail(result)
                description = result.result;
            }
        };
        getDetail();
    }, []);

    function handleEditorChange(content, editor) {
        description = content;
    }

    async function saveData(event) {
        event.preventDefault();
    }

    async function saveData() {
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        var payload = {
            "id": id,
            "result": description,
        }
        const response = await postMethodPayload('/api/booking-detail/doctor/update', payload)
        var result = await response.json();
        console.log(result)
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thêm/cập nhật thành công!",
                preConfirm: () => {
                    window.location.href = 'mybooking'
                }
            });
        } else {
            toast.error("Cập nhật thất bại");
        }
    }


    return (
        <div>
             <div class="col-sm-12 header-sps">
                    <div class="title-add-admin">
                        <h4>Cập nhật kết quả khám dịch vụ {detail?.services.name}</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <div class="col-md-8 col-sm-12 col-12">
                            <label class="lb-form lbmotadv">Kết quả khám</label>
                            <Editor name='editor' tinymceScriptSrc={'https://cdn.tiny.cloud/1/xqhz0tu1vx2a47ob4qdhwpyz39c09mrs2mfilfeahlm42vwa/tinymce/6/tinymce.min.js'}
                                    onInit={(evt, editor) => editorRef.current = editor} 
                                    initialValue={detail==null?'':detail.result}
                                    onEditorChange={handleEditorChange}/>
                            <br/><br/>
                            <button onClick={()=>saveData()} class="btn btn-primary form-control">Cập nhật</button>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default EditBookingDetail;
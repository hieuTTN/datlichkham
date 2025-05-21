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


const AdminAddDoctor = ()=>{
    const [chuyenKhoas, setChuyenKhoas] = useState([]);
    const [chuyenKhoa, setChuyenKhoa] = useState(null);
    const [trungTams, setTrungTams] = useState([]);
    const [trungTam, setTrungTam] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const editorRef = useRef(null);
    const [item, setItem] = useState(null);
    useEffect(()=>{
        const getChuyenKhoa= async() =>{
            var response = await getMethod('/api/specialty/public/find-all-list');
            var result = await response.json();
            setChuyenKhoas(result)
        };
        const getTrungTam= async() =>{
            var response = await getMethod('/api/center/public/find-all-list');
            var result = await response.json();
            setTrungTams(result)
        };
        getChuyenKhoa();
        getTrungTam();
        const getItem= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                setIsUpdate(true);
                var response = await getMethod('/api/doctor/public/find-by-id?id=' + id);
                var result = await response.json();
                setItem(result)
                setChuyenKhoa(result.specialty)
                setTrungTam(result.center)
                linkbanner = result.user.avatar
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
        var userId = uls.searchParams.get("userId");
        var ims = await uploadSingleFile(document.getElementById("imgbanner"))
        if(ims != null){
            linkbanner = ims
        }
        var payload = {
            "id": id,
            "experienceYears": event.target.elements.experienceYears.value,
            "fullName": event.target.elements.fullName.value,
            "degree": event.target.elements.degree.value,
            "position": event.target.elements.position.value,
            "gender": event.target.elements.gender.value,
            "consultationFee": event.target.elements.consultationFee.value,
            "username": event.target.elements.email.value,
            "email": event.target.elements.email.value,
            "password": event.target.elements.password.value,
            "phone": event.target.elements.phone.value,
            "description": description,
            "specialtyId": chuyenKhoa.id,
            "centerId": trungTam.id,
            "avatar": linkbanner,
            "userId": userId,
        }
        const response = await postMethodPayload('/api/doctor/admin/create', payload)
        var result = await response.json();
        console.log(result)
        if (response.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Thêm/cập nhật thành công!",
                preConfirm: () => {
                    window.location.href = 'doctor'
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
                        <h4>Thêm/ cập nhật bác sỹ</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="form-add">
                        <form class="row" onSubmit={saveData} method='post'>
                            <div class="col-md-6 col-sm-12 col-12">
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Họ tên</label>
                                        <input defaultValue={item?.fullName} name="fullName" type="text" class="form-control"/>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Giới tính</label>
                                        <select name='gender' className='form-control'>
                                            <option selected={item?.gender == 'Nam'} value='Nam'>Nam</option>
                                            <option selected={item?.gender == 'Nữ'} value='Nữ'>Nữ</option>
                                        </select>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Bằng cấp</label>
                                        <select name='degree' className='form-control'>
                                            <option selected={item?.degree == 'Đại học'} value='Đại học'>Đại học</option>
                                            <option selected={item?.degree == 'Thạc sỹ'} value='Thạc sỹ'>Thạc sỹ</option>
                                            <option selected={item?.degree == 'Tiến sỹ'} value='Tiến sỹ'>Tiến sỹ</option>
                                            <option selected={item?.degree == 'Phó giáo sư'} value='Phó giáo sư'>Phó giáo sư</option>
                                            <option selected={item?.degree == 'Giáo sư'} value='Giáo sư'>Giáo sư</option>
                                        </select>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Số năm kinh nghiệm</label>
                                        <input defaultValue={item?.experienceYears} name="experienceYears" type="text" class="form-control"/>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Chọn chuyên khoa</label>
                                        <Select
                                            onChange={setChuyenKhoa}
                                            options={chuyenKhoas}
                                            value={chuyenKhoa}
                                            getOptionLabel={(option) => option.name} 
                                            getOptionValue={(option) => option.id}    
                                            closeMenuOnSelect={false}
                                            placeholder="Chọn chuyên khoa"
                                        />
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Chọn trung tâm khám</label>
                                        <Select
                                            onChange={setTrungTam}
                                            options={trungTams}
                                            value={trungTam}
                                            getOptionLabel={(option) => option.centerName} 
                                            getOptionValue={(option) => option.id}    
                                            closeMenuOnSelect={false}
                                            placeholder="Chọn trung tâm khám"
                                        />
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Chi phí khám</label>
                                        <input defaultValue={item?.consultationFee} name="consultationFee" type="text" class="form-control"/>
                                        <label class="lb-form">Chức vụ</label>
                                        <input defaultValue={item?.position} name="position" type="text" class="form-control"/>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Avatar</label>
                                        <input id="imgbanner" type="file" class="form-control"/>
                                        <img src={item == null ? '': item.user.avatar} className='imgadmin'/>
                                        <img id="imgpreview" className='imgadmin'/>
                                    </div>
                                </div>
                                <hr/>
                                <div className='row'>
                                     <div className='col-sm-6'>
                                        <label class="lb-form">Email</label>
                                        <input defaultValue={item?.user.email} name="email" type="text" class="form-control"/>
                                    </div>
                                     <div className='col-sm-6'>
                                        <label class="lb-form">Số điện thoại</label>
                                        <input defaultValue={item?.user.phone} name="phone" type="text" class="form-control"/>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label class="lb-form">Mật khẩu đăng nhập {isUpdate == true && <span>(Để trống để sử dụng mật khẩu cũ)</span>}</label>
                                        <input name="password" type="password" placeholder='********' class="form-control"/>
                                    </div>
                                </div>
                                <div id="loading">
                                    <div class="bar1 bar"></div>
                                </div>
                                <br/><br/><button class="btn btn-primary form-control">Thêm/ cập nhật</button>
                            </div>
                            <div class="col-md-6 col-sm-12 col-12">
                                <label class="lb-form lbmotadv">Mô tả tiểu sử/ kinh nghiệm</label>
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



export default AdminAddDoctor;
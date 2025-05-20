import logo from '../../../assest/images/vnvc-logo.png';
import { useState, useEffect } from 'react'
import {getMethod,getMethodByToken} from '../../../services/request'
import React, { createContext, useContext } from 'react';

export const HeaderContext = createContext();


var token = localStorage.getItem("token");
function Header (){
var auth = <a href="/login" class="itemheader itemtopheader hotlineheader">Đăng nhập</a>
if(token != null){
  auth = <>
  <a href="/tai-khoan" class="itemheader itemtopheader">Tài khoản</a>
  <a onClick={()=>logout()} class="itemheader itemtopheader hotlineheader pointer">Đăng xuất</a>
  </>
}
const [isCssLoaded, setCssLoaded] = useState(false);
useEffect(()=>{
  import('../styles/styleuser.scss').then(() => setCssLoaded(true));
}, []);
function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace('login')
}
 if (!isCssLoaded) {
      return <></>
  }

return(
  <>
    <div id="headerweb">
      <div class="container-web">
          <nav class="navbar navbar-expand-lg">
              <div class="container-fluid">
                <a class="navbar-brand" href="/"><img src={logo} class="imagelogoheader"/></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  </ul>
                  <div class="d-flex">
                      <a href="" class="itemheader itemtopheader"><i class="fa fa-map-marker"></i> Tìm cơ sở khám</a>
                      <a href="/dang-ky-tiem-chung" class="itemheader itemtopheader"><i class="fa fa-calendar"></i> Đăng ký khám</a>
                      <a href="tel:02871026595" class="itemheader itemtopheader hotlineheader">Hotline: 028 7102 6595</a>
                      {auth}
                  </div>
                  <form action='tim-kiem-vaccine' className='d-flex'>
                    <input name='search' className='form-control' placeholder='Tìm kiếm dịch vụ'/>
                  </form>
                </div>
              </div>
          </nav>
      </div>
      <hr className='hrheader-web'/>
      <div class="container-web container-bottom-header">
          <a href="" class="itemheader">Trang chủ</a>
          <a href="" class="itemheader">Giới thiệu</a>
          <a href="" class="itemheader">Chuyên khoa</a>
          <a href="" class="itemheader">Cơ sở khám</a>
          <a href="" class="itemheader">Đội ngũ bác sĩ</a>
          <a href="tra-cuu-lich-tiem" class="itemheader">Đăng ký khám</a>
          <a href="" class="itemheader">Bảng giá dịch vụ</a>
          <a href="" class="itemheader">Bài viết</a>
      </div>
    </div>
    
  </>

);

    
}

export default Header;
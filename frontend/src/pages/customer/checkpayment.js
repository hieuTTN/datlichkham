import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Swal from 'sweetalert2'
import Select from 'react-select';


async function createBooking() {
    var dto = JSON.parse(localStorage.getItem("benhnhan"));
    var uls = new URL(document.URL)
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark

    dto.vnpOrderInfo = vnpOrderInfo;
    dto.urlVnpay = urlVnpay;


    const res = await postMethodPayload('/api/booking/user/create', dto)
    var result = await res.json();
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
        window.localStorage.removeItem("product_cart")
    }
    if (res.status == 417) {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }
}


function PublicPayment(){
    useEffect(()=>{
        createBooking();
    }, []);

    return(
    <div class="content contentlogin">
        <div style={{marginTop:'180px'}}>
            <div id="thanhcong">
                <h3>Đặt hàng thành công</h3>
                <p >Cảm ơn bạn đã mua sản phẩm của chúng tôi.</p>
                <p>Hãy kiểm tra thông tin đặt hàng của bạn trong lịch sử đặt hàng</p>
                <a href="account#invoice" class="btn btn-danger">Xem lịch sử đặt hàng</a>
            </div>

            <div id="thatbai">
                <h3>Thông báo</h3>
                <p id="errormess">Bạn chưa hoàn thành thanh toán.</p>
                <p>Quay về <a href="index" style={{color:'red'}}>trang chủ</a></p>
            </div>
        </div>
    </div>
    );
}

export default PublicPayment;

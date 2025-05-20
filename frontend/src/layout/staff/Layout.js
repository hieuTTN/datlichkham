import lich from "../../assest/images/lich.png";
import avatar from "../../assest/images/user.svg";
import {useEffect, useState} from "react";

function Header({ children }) {
  const [isCssLoaded, setCssLoaded] = useState(false);
  useEffect(() => {
    if (!isCssLoaded) {
      import("../staff/layout.scss").then(() => setCssLoaded(true));
    }
  }, [isCssLoaded]);




  return (
    <>
      <div class="navleft" id="navleft">
        <div class="divroot">
         <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4hUp-MAkSvxl5dRdJldNsEN7K-BljNVZaEQ&s"}
          style={{borderRadius:"50%", height:"90%"}}
         />
        </div>
        <div class="listmenumain">
          <a href="chat">Tin nhắn</a>
          <a href="vaccine">Quản lý vaccine</a>
          <a href="vaccine-inventory">Kho vaccine</a>
          <a href="customer-schedule">Danh sách đăng ký</a>
          <a href="#" onClick={() => logout()}>
            Đăng xuất
          </a>
        </div>
      </div>
      <div class="contentadminweb">

        <div class="contentmain">{children}</div>
      </div>
    </>
  );
}

async function checkAdmin() {
  var token = localStorage.getItem("token");
  var url = "http://localhost:8080/api/admin/check-role-admin";
  const response = await fetch(url, {
    headers: new Headers({
      Authorization: "Bearer " + token,
    }),
  });
  if (response.status > 300) {
    window.location.replace("../login");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace("../login");
}

export default Header;

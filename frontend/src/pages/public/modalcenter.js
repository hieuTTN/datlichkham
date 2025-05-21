function ModalCenter({ center  }) {
  return (
    <div className="modal fade" id="modalCenter" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Giới Thiệu Cơ Sở Khám - {center?.centerName}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
                <div className="contentcenter" dangerouslySetInnerHTML={{__html:center?.description}}></div>
          </div>
          <div className="modal-footer">
            <strong>Địa chỉ: {center?.street}, {center?.ward}, {center?.district}, {center?.city}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCenter;

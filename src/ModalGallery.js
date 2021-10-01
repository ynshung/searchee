import React from 'react'
import { Modal, Carousel, CarouselItem } from 'react-bootstrap';

const shopeeFile = "https://cf.shopee.sg/file/" // _tn

function ModalGallery(props) {
  const { show, onHide, img, vid, defaultIndex } = props;

  let urlList = [];
  let imgList;

  if (img && img.length !== 0) urlList.push(...img.map(a => shopeeFile + a));
  if (vid && vid.length !== 0) {
    urlList.push(...vid.map(a => a["url"]));
  }

  if (urlList.length === 1) {
    imgList = addImgOrVid(urlList[0]);
  }

  imgList = urlList.map((i) =>
    <CarouselItem key={i}>
      {addImgOrVid(i)}
    </CarouselItem>
  )

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Buyer Gallery
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="mx-auto mw-100">
        <Carousel className="mw-100" slide={false} interval={null} defaultActiveIndex={defaultIndex}>
          {imgList}
        </Carousel>
      </Modal.Body>
    </Modal>
  )
}


function addImgOrVid(url) {
  if (url.includes("mp4")) {
    return (
      <video controls controlsList="nodownload" style={{ maxHeight: "75vh", width: "100%" }} >
        <source src={url} type="video/mp4"></source>
        Sorry, your browser doesn't support videos.
      </video>
    )
  } else {
    return (
      <img
        src={url}
        className="d-block w-100"
        alt=""
        style={{ maxHeight: "75vh" }}
      />
    )
  }
}

export default ModalGallery

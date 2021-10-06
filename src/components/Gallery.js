import React, { useState, useRef } from 'react';
import { Carousel, CarouselItem, Row } from 'react-bootstrap';
import ModalGallery from './ModalGallery';

const shopeeFile = "https://cf.shopee.sg/file/" // _tn

function Gallery(props) {
  const { img, vid } = props;

  const currPos = useRef(0);
  const [showingModalGallery, showModalGallery] = useState(false);

  let urlList = [];

  if (img && img.length !== 0) {
    if (img[0].includes('http')) {
      urlList = img;
    } else {
      urlList.push(...img.map(a => shopeeFile + a + "_tn"));
    }
  }
  if (vid && vid.length !== 0) {
    urlList.push(...vid.map(a => a["cover"]));
  }

  let imgList;

  if (urlList.length === 0) {
    return (<></>)
  } else if (urlList.length === 1) {
    imgList = <img
      src={urlList[0]}
      className="d-block w-100"
      alt=""
      onClick={() => showModalGallery(true)}
    />
  } else {
    imgList = urlList.map((r) =>
      <CarouselItem key={r}>
        <img
          src={r}
          className="d-block w-100"
          alt=""
          onClick={() => showModalGallery(true)}
        />
      </CarouselItem>
    );
  }

  return (
    <Row className="pb-3">
      {
        urlList.length === 1 ?
          imgList :
          <Carousel onSelect={(e) => currPos.current = e} interval={null}>
            {imgList}
          </Carousel>
      }
      <ModalGallery
        img={img}
        vid={vid}
        show={showingModalGallery}
        onHide={() => { showModalGallery(false) }}
        defaultIndex={currPos.current}
      />
    </Row>
  )
}

export default Gallery

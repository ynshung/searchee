import React from 'react'
import { Col, ListGroup, Row, Image } from 'react-bootstrap'
import Person from '../assets/person.svg';
import Gallery from './Gallery';

const shopeeProfile = "https://cf.shopee.sg/file/" // _tn

function ReviewCard({ r, showMedia }) {
  return (
    <Col md={6} lg={4} xxl={3} className="review-card mb-3">
      <ListGroup.Item style={{ borderRadius: '0.5em' }}>
        <Row className="align-items-center justify-content-center my-2">
          <Col xs={3} sm={2} md={3} className="pe-0 align-items-center justify-content-center text-center" >
            <ProfilePic id={r["author_portrait"]} />
          </Col>
          <Col xs={6} sm={10} md={9}>
            <Row>
              <small>{r["author_username"]} - {r["rating_star"]}★</small>
              <small className="text-muted">{timeConverter(r['ctime'])}</small>
            </Row>
          </Col>
        </Row>

        <hr />
        {
          r["comment"] &&
          <Row>
            <p>{r["comment"]}</p>
          </Row>
        }

        {showMedia ? <Gallery img={r["images"]} vid={r["videos"]} /> : null}

        <Row>
            <small className="text-muted">[{r["id"]}] Model: {r["product_items"].join(", ")}</small>
        </Row>
      </ListGroup.Item>
    </Col>
  )
}

const ProfilePic = (props) => {
  const { id } = props
  if (id !== "") {
    return (
      <Image src={shopeeProfile + id + "_tn"} roundedCircle fluid />
    )
  } else {
    return (
      <Image src={Person} fluid style={{ width: "80%" }} />
    )
  }
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
}

export default ReviewCard

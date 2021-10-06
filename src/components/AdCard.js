import React from 'react'
import { Badge, Col, Image, ListGroup, Row, Button } from 'react-bootstrap'
import Gallery from './Gallery'

function AdCard({ ad, showMedia }) {
  return (
    <Col md={6} lg={4} xxl={3} className="review-card mb-3">
      <ListGroup.Item style={{ borderRadius: '0.5em' }}>
        <Row className="align-items-center justify-content-center my-2">
          <Col xs={3} sm={2} md={3} className="pe-0 align-items-center justify-content-center text-center" >
            <Image src={ad["ad_portrait"]} roundedCircle fluid />
          </Col>
          <Col xs={6} sm={10} md={9}>
            <Row>
              <small>{ad["ad_username"]}</small>
              <Col>
                <Badge pill bg="info" xs={8}>Advertisement</Badge>
              </Col>
            </Row>
          </Col>
        </Row>

        <hr />
        <Row>
          <p>{ad["ad_comment"]}</p>
        </Row>
        {showMedia || ad["ad_always_show_media"] ? <Gallery img={ad["ad_media"]} /> : null}

        <Row xs="auto" className="justify-content-center">
          <Button variant="outline-primary">{ad["ad_button"]}</Button>
        </Row>
      </ListGroup.Item>
    </Col>
  )
}

export default AdCard

import React from 'react'
import { Modal, Image, Row, Button } from 'react-bootstrap'

import MobileShareButton from '../assets/mobile-share-button.png'
import MobileCopyLink from '../assets/mobile-copy-link.png'

function ModalTutorial(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>How to retrieve Product URL?</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>To copy the product URL in the mobile application, go to the product page, click the share button (on the same row with rating stars), and click "Copy Link". You can then paste the link here.</p>
        <Row className="justify-content-center">
          <Image src={MobileShareButton} rounded style={{ maxWidth: "512px" }} />
          <Image src={MobileCopyLink} rounded style={{ maxWidth: "512px" }} />
        </Row>
        <hr />
        <p>For browser user, simply copy the URL from the address bar while on the product page.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide} variant="primary">Got it!</Button>
      </Modal.Footer>

    </Modal>
  )
}

export default ModalTutorial

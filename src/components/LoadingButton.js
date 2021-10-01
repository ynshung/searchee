import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

function LoadingButton(props) {
  const { loading, name, onClick } = props;

  if (loading === true) {
    return (
      <Button variant="primary" type="submit" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
        Loading
      </Button>
    )
  }

  return (
    <Button variant="primary" type="submit" onClick={onClick}>
      {name}
    </Button>
  )
}

export default LoadingButton

import React, { useState, useRef } from 'react';
import { Container, Form, Nav, Navbar, Card, ListGroup, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewCard from './components/ReviewCard';
import LoadingButton from './components/LoadingButton';

const FETCH_RATINGS_URL = 'https://shopee-search.herokuapp.com/api/get_reviews?'
// const FETCH_RATINGS_URL = 'http://127.0.0.1:5000/api/get_reviews?'
const regex = /(?:i.(\d+)\.(\d+)|product\/(\d+)\/(\d+))/g;

function App() {
  const [listReview, setListReview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [score, setScore] = useState(0);

  const [searched, setSearched] = useState([0, 0]); // search and total
  const [found, setFound] = useState(0);
  const [showMedia, setShowMedia] = useState(false);

  const searchTerm = useRef("");
  const rating = useRef(0);
  const shopeeId = useRef([0, 0]); // shop, item

  const [error, setError] = useState(null);

  const handleRadio = event => {
    rating.current = event.target.value;
  }

  function search(e) {
    e.preventDefault();
    setError(null);

    const regexResult = [...e.target[0].value.matchAll(regex)][0];
    if (regexResult === undefined) {
      setError("Unable to retrieve shop ID and product ID. Make sure the product URL is correct.");
      return;
    }
    shopeeId.current = regexResult.splice(1, 4).filter(n => n);
    searchTerm.current = e.target[1].value;

    let offset = e.target[2].value;
    if (!offset) offset = 0;

    setLoading(true);

    fetch(
      FETCH_RATINGS_URL + new URLSearchParams({
        'shopid': shopeeId.current[0],
        'itemid': shopeeId.current[1],
        'searchterm': searchTerm.current,
        'ratings': rating.current,
        'offset': offset
      })
    )
      .then(response => response.json())
      .then(data => {
        if (data['message'] === "") {
          setListReview(data["list"]);
          setScore(data['score']);
          setSearched([data['offset_search'] - offset, data['total'] - offset]);
          setFound(data['found']);
        } else {
          setError(data['message']);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Internal server error occured. Please report the console log to the developer - " + error.name + ': ' + error.message);
        setLoading(false);
      });
  }

  function loadMore() {
    setLoadingMore(true);
    setError(null);

    fetch(
      FETCH_RATINGS_URL + new URLSearchParams({
        'shopid': shopeeId.current[0],
        'itemid': shopeeId.current[1],
        'searchterm': searchTerm.current,
        'ratings': rating.current,
        'offset': searched[0]
      })
    )
      .then(response => response.json())
      .then(data => {
        if (data['message'] === "") {
          setListReview(listReview.concat(data["list"]));
          setScore(data['score']);
          setSearched([data['offset_search'], data['total']]);
          setFound(found + data['found']);
        } else {
          setError(data['message']);
        }
        setLoadingMore(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Internal server error occured. Please report the console log to the developer - " + error.name + ': ' + error.message);
        setLoadingMore(false);
      });

  }

  return (
    <Container>
      <header>
        <Navbar className="mt-3" expand="sm">
          <Container>
            <Row>
            <Navbar.Brand>🛍️🔎 Searchee</Navbar.Brand>
            <small className="text-muted" style={{fontSize:"0.8rem"}}>Search Shopee Review! (Beta)</small>

            </Row>
          </Container>
          <Nav className="w-100 align-items-end justify-content-end">
            <Navbar.Text className="text-muted">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScrRoKy74FiSUiDwftyE6ZXGJ_GprAHtUQhtGc-oQ_2jG1SSA/viewform"
                target="_blank" rel="noreferrer"
                style={{ textDecoration: "none" }}>Feedback</a>
            </Navbar.Text>

          </Nav>
        </Navbar>

      </header>
      <hr />
      <main>
        <Container className="mt-4 mw-50">
          {error !== null &&
            <Alert variant="warning">
              {error}
            </Alert>
          }

          <Form onSubmit={(e) => search(e)}>
            <Form.Group className="mb-3" controlId="formProductUrl">
              <Form.Label>Product URL</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="https://shopee.com/product_url"
              />
            </Form.Group>

            <Row>
              <Col>
                <Col sm={6} lg={4}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Search term</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Search"
                    />
                  </Form.Group>
                </Col>
              </Col>

              <Col>
                <Col sm={5} md={3}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Start from</Form.Label>
                    <Form.Control
                      type="number"
                      defaultValue={0}
                    />
                  </Form.Group>
                </Col>
              </Col>

            </Row>

            <Row>
              <Col >
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <p style={{ display: "inline" }} className="me-2">★ :</p>
                  <Form.Check
                    inline
                    label="All"
                    name="group1"
                    type="radio"
                    id="inline-radio-all"
                    value={0}
                    defaultChecked={true}
                    onChange={handleRadio}
                  />
                  {
                    [1, 2, 3, 4, 5].map((val) => (
                      <Form.Check
                        inline
                        key={val}
                        label={val}
                        name="group1"
                        type="radio"
                        id="inline-radio-all"
                        value={val}
                        onChange={handleRadio}
                      />
                    ))
                  }
                </Form.Group>
              </Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  label="Show image/video"
                  onChange={(event) => {
                    setShowMedia(event.target.checked);
                  }}
                  defaultChecked={showMedia}
                />
              </Col>

            </Row>

            <LoadingButton name="Search" loading={loading} />
            <Button className="mx-3" variant="outline-warning" onClick={() => setListReview([])}>
              Clear
            </Button>
          </Form>

          <small className="mt-3 mb-0 text-muted" style={{ display: "block" }}>
            Search Shopee user reviews to research further into any product with this simple tool!<br />
            Works in all countries of Shopee platform. Click on the photos to expand them and play videos. Search asterisk (*) to show all reviews.
          </small>
        </Container>

        <hr className="mt-4" />

        <Container className="mt-4">
          <Card className="my-4">
            <Card.Header>{searched[1]} reviews • {score} ★</Card.Header>

            <ListGroup variant="flush">
              <Row className="align-items-center my-3 mx-1">
                <ReviewCard reviews={listReview} showMedia={showMedia} />
              </Row>
            </ListGroup>

            <Card.Footer>
              <Row className="mt-2">
                <Col xs={12} sm={6} className="py-2 text-center">
                  {
                    searched[0] !== searched[1] &&
                    <LoadingButton className="mx-3" loading={loadingMore} name="Load more" onClick={() => loadMore()} />
                  }
                  <Button className="mx-3" variant="outline-warning" onClick={() => setListReview([])}>
                    Clear
                  </Button>
                  {
                    error !== null &&
                    <Badge bg="danger">
                      Error occurred
                    </Badge>
                  }
                </Col>


                <Col xs={12} sm={6} className="px-4 text-end">
                  <p className="mt-1 mb-0 text-muted">
                    {searched[0]} searched from {searched[1]}&nbsp;
                    <small className="text-muted">(Found {found})</small>
                  </p>
                  <p className="text-muted" style={{ textDecoration: "underline" }}
                    onClick={() => { window.scrollTo(0, 0); }}>↑ To the top 🚀</p>
                </Col>

              </Row>
            </Card.Footer>
          </Card>
        </Container>
      </main>

      <footer className="text-center pb-2">
        <p className="mb-0">Made with ❤️ by <a href="https://ynshung.com/" target="_blank" rel="noreferrer">Young Shung</a></p>
        <p>If you find this site helpful, consider supporting it&nbsp;
          <a href="https://ynshung.com/support" target="_blank" rel="noreferrer">here</a>☕</p>
      </footer>
    </Container>
  );
}

export default App;

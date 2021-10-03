import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Nav, Navbar, Card, ListGroup, Row, Col, Button, Alert, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewCard from './components/ReviewCard';
import LoadingButton from './components/LoadingButton';
import ModalTutorial from './components/ModalTutorial';

const API_URL = "https://shopee-search.herokuapp.com"
// const API_URL = "http://127.0.0.1:5000"
const FETCH_RATINGS_URL = API_URL + '/api/get_reviews?'
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

  const [showHelp, setShowHelp] = useState(false)
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

    if (searchTerm.current.length > 128) {
      setError("Search term should not exceed 128 characters.");
    }

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

  const [status, setStatus] = useState("Waiting...");
  useEffect(() => {
    setStatus("Loading...");

    fetch(API_URL + "/api/status")
      .then(response => response.json())
      .then(data => setStatus(data["message"]))
      .catch(error => setStatus("Failed"));
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to show instruction
    </Tooltip>
  );

  return (
    <Container>
      <header>
        <Navbar className="mt-3" expand="sm">
          <Container>
            <Col>
              <Navbar.Brand>🛍️🔎 Searchee</Navbar.Brand><br />
              <small className="text-muted" style={{ fontSize: "0.8rem" }}>Search Shopee Review! (Beta)</small>
            </Col>
            <Col>
              <Nav className="w-100 justify-content-end">
                <Navbar.Text className="text-end">
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScrRoKy74FiSUiDwftyE6ZXGJ_GprAHtUQhtGc-oQ_2jG1SSA/viewform"
                    target="_blank" rel="noreferrer"
                    style={{ textDecoration: "none" }}>Feedback</a><br />
                  <Badge bg={(() => {
                    if (status === "Failed") return "danger"
                    else if (status === "Active") return "success"
                    else return "info"
                  })()
                  }>Status: {status}</Badge>
                </Navbar.Text>
              </Nav>
            </Col>
          </Container>
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

          <ModalTutorial show={showHelp} onHide={() => setShowHelp(false)} />

          <Form onSubmit={(e) => search(e)}>
            <Form.Group className="mb-3" controlId="formProductUrl">
              <Form.Label>
                Product URL&nbsp;
                <OverlayTrigger
                  placement="right"
                  overlay={renderTooltip}
                >
                  <svg onClick={() => setShowHelp(true)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style={{ verticalAlign: "-.125em" }}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                  </svg>
                </OverlayTrigger>
              </Form.Label>
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
        <Container>
          <p className="mb-0">Made with ❤️ by <a href="https://ynshung.com/" target="_blank" rel="noreferrer">Young Shung</a></p>
          <p>If you find this site helpful, consider supporting it&nbsp;
            <a href="https://ynshung.com/support" target="_blank" rel="noreferrer">here</a>☕</p>
        </Container>
      </footer>
    </Container>
  );
}

export default App;

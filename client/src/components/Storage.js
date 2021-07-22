import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, ListGroup, ListGroupItem, Card } from 'react-bootstrap';

function Storage({ storage, fromdate, todate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img alt={storage.title} src={storage.imageurl} className="smallimg" />
      </div>
      <div className="col-md-7">
        <h1>{storage.title}</h1>
        <b>
          <p>City: {storage.city}</p>
          <p>
            Size: {storage.sizem2} m<sup>2</sup>
          </p>
          <p>Available: {storage.available}</p>
          <p>Type: {storage.type}</p>
          <p>Rent: € {storage.rentperday} / Day</p>
        </b>

        <div style={{ float: 'right', padding: '5px' }}>
          {fromdate && todate && (
            <Link to={`/book/${storage._id}/${fromdate}/${todate}`}>
              <button className="btn btn-primary m-2">Book Now</button>
            </Link>
          )}

          <button className="btn btn-primary" onClick={handleShow}>
            View Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{storage.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: '100%' }}>
            <Card.Img variant="top" src={storage.imageurl} />
            <Card.Body>
              <Card.Title>{storage.title}</Card.Title>
              <Card.Text>{storage.description}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Address: {storage.address} </ListGroupItem>
              <ListGroupItem>Phone: {storage.phonenumber}</ListGroupItem>
            </ListGroup>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Storage;

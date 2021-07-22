import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';

import Loader from '../components/Loader';
import Error from '../components/Error';

function Bookingscreen({ match }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [storage, setStorage] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [imageId, setImageId] = useState();
  const [selectedFile, setSelectedFile] = useState();

  const storageid = match.params.storageid;
  const fromdate = moment(match.params.fromdate, 'DD-MM-YYYY');
  const todate = moment(match.params.todate, 'DD-MM-YYYY');
  const totalDays = moment.duration(todate.diff(fromdate)).asDays() + 1;

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      window.location.href = '/login';
    }
    async function fetchData() {
      try {
        setLoading(true);
        const data = (
          await axios.post('/api/storages/getstoragebyid', {
            storageid,
          })
        ).data;
        setStorage(data);
        setTotalAmount(data.rentperday * totalDays);
        // console.log(storage);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // async function bookRoom() {
  //   const bookingDetails = {
  //     storage,
  //     userid: JSON.parse(localStorage.getItem('currentUser'))._id,
  //     fromdate,
  //     todate,
  //     totalAmount,
  //     totalDays,
  //   };
  //   try {
  //     setLoading(true);
  //     const result = await axios.post(
  //       '/api/bookings/bookstorage',
  //       bookingDetails
  //     );
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }

  async function onToken(token) {
    // console.log(token);
    const bookingDetails = {
      storage,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalAmount,
      totalDays,
      token,
      imageId,
    };
    try {
      setLoading(true);
      const result = await axios.post(
        '/api/bookings/bookstorage',
        bookingDetails
      );
      setLoading(false);
      Swal.fire(
        'Congratulations',
        'Your storage booked successfully',
        'success'
      ).then((result) => (window.location.href = '/profile'));
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  }

  const handleFileInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    setSelectedFile(file);
    
    // console.log(selectedFile);
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('userid', JSON.parse(localStorage.getItem('currentUser'))._id)
    formData.append('image', file);
  
    try {
      const response = await axios.post(
        `/api/bookings/uploadimageid`,
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      );
      // console.log(response);
      setImageId(response.data.imageUrl)
      return response;
    } catch (err) {
      return err.response;
    }
  };

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : storage ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{storage.title}</h1>
              <img
                src={storage.imageurl}
                alt={storage.title}
                className="bigimg"
              />
            </div>
            <div className="col-md-6">
              <div style={{ textAlign: 'right' }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>
                    Name: {JSON.parse(localStorage.getItem('currentUser')).name}{' '}
                  </p>
                  <p>From date: {match.params.fromdate} </p>
                  <p>To date: {match.params.todate} </p>
                  <p>
                    Size: {storage.sizem2} m<sub>2</sub>
                  </p>
                  <p>Type: {storage.type}</p>
                </b>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <b>
                  <h1>Amount: </h1>
                  <hr />
                  <p>Total days: {totalDays} </p>
                  <p>Rent per day: € {storage.rentperday} </p>
                  <p>Total Amount: € {totalAmount}</p>
                </b>
              </div>
              <div
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  textAlign: 'right',
                }}
              >
                <h1>Please upload your ID</h1>
                <input type="file" onChange={handleFileInput} />
                {imageId && <img src={imageId} className="smallimg" alt="" />}
              </div>
              <div style={{ float: 'right' }}>
                <button
                  className="btn btn-primary me-3"
                  onClick={() => {
                    alert('Paypal is going to be implemented in the future!');
                  }}
                >
                  Pay with paypal
                </button>
                <StripeCheckout
                  name="Book your storage"
                  token={onToken}
                  amount={totalAmount * 100}
                  currency="EUR"
                  billingAddress
                  stripeKey="pk_test_j2WoQLKQfBBkI9EAhZJhjuQ5003Av3DEs1"
                >
                  <button className="btn btn-primary">Pay with card</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Tag, Divider } from 'antd';

import Error from '../components/Error';
import Loader from '../components/Loader';

const { TabPane } = Tabs;

const user = JSON.parse(localStorage.getItem('currentUser'));

function Profilescreen() {
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="mt-5 ms-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="My Profile" key="1">
          <div className="row">
            <div className="col-md-6 bs m-2 p-3">
              <h1>Name : {user.name}</h1>
              <h1>Email : {user.email}</h1>
              <h1>Admin Access : {user.isAdmin ? 'Yes' : 'No'}</h1>
              {user.isAdmin ? (
                <Link to="/admin">
                  <button className="btn btn-primary">Admin Panel</button>
                </Link>
              ) : null}
            </div>
          </div>
        </TabPane>
        <TabPane tab="My Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await (
          await axios.post('/api/bookings/getbookingsbyuserid', {
            userid: user._id,
          })
        ).data;
        // console.log(data);
        setBookings(data.bookings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, []);

  async function cancelBooking(bookingid, storageid) {
    try {
      setLoading(true);
      const result = await axios.post('/api/bookings/cancelbooking', {
        bookingid: bookingid,
        userid: user._id,
        storageid: storageid,
      });
      setLoading(false);
      Swal.fire(
        'Congrats',
        'Your booking has cancelled succeessfully',
        'success'
      ).then((result) => {
        window.location.href = '/profile';
      });
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error').then((result) => {
        window.location.href = '/profile';
      });
      setLoading(false);
    }
  }

  return (
    <div className="row">
      <div className="col-md-6"></div>
      {loading && <Loader />}
      {error && <Error />}
      {bookings &&
        bookings.map((booking, i) => (
          <div className="col-md-6 bs m-1 p-2" key={i}>
            <h1>{booking.storage}</h1>
            <p>
              <b>BookingId:</b> {booking._id}
            </p>
            <p>
              <b>Start Date:</b> {booking.fromdate}
            </p>
            <p>
              <b>End Date:</b> {booking.todate}
            </p>
            <p>
              <b>Total Days:</b> {booking.totaldays}
            </p>
            <p>
              <b>Total Amount:</b> € {booking.totalamount}
            </p>
            {booking.imageid && (
              <p>
                <a href={booking.imageid} target="_blank" rel="noreferrer">
                  <b>ID Image</b>
                </a>
              </p>
            )}
            <p>
              <b>Status:</b>{' '}
              {booking.status === 'booked' ? (
                <Tag color="green">CONFIRMED</Tag>
              ) : (
                <Tag color="red">CANCELLED</Tag>
              )}
            </p>
            {booking.status === 'booked' && (
              <div className="text-end">
                <button
                  className="btn btn-primary"
                  onClick={() => cancelBooking(booking._id, booking.storageid)}
                >
                  CANCEL BOOKING
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

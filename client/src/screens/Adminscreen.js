import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Tabs } from 'antd';

import Error from '../components/Error';
import Loader from '../components/Loader';

const { TabPane } = Tabs;

function Adminscreen() {
  return (
    <div className="mt-3 ms-3 me-3 bs">
      <h2 className="text-center m-2" style={{ fontSize: '35px' }}>
        Admin Panel
      </h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <div className="row">
            <Bookings />
          </div>
        </TabPane>
        <TabPane tab="Storages" key="2">
          <div className="row">
            <Storages />
          </div>
        </TabPane>
        <TabPane tab="Add Storage" key="3">
          <Addstorage />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);

  useEffect(() => {
    try {
      setloading(true);
      async function fetchData() {
        const data = await (
          await axios.get('/api/bookings/getallbookings')
        ).data;
        console.log(data);
        setbookings(data.bookings);
      }

      fetchData();
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  }, []);
  return (
    <div className="col-md-11">
      <h1>Bookings</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        <div>
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>Booking Id</th>
                <th>Userid</th>
                <th>Storage</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => {
                return (
                  <tr key={i}>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.storage}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Storages() {
  const [storages, setstorages] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);

  useEffect(() => {
    try {
      setloading(true);
      async function fetchData() {
        const data = await (
          await axios.get('/api/storages/getallstorages')
        ).data;
        setstorages(data.storages);
      }
      fetchData();
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  }, []);
  return (
    <div className="col-md-11">
      <h1>Storages</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        <div>
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>Storage Id</th>
                <th>Title</th>
                <th>Type</th>
                <th>Rent Per day</th>
                <th>Available</th>
                <th>Address</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {storages.map((storage, i) => {
                return (
                  <tr key={i}>
                    <td>{storage._id}</td>
                    <td>{storage.title}</td>
                    <td>{storage.type}</td>
                    <td>{storage.rentperday}</td>
                    <td>{storage.available}</td>
                    <td>{storage.address}</td>
                    <td>{storage.phonenumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Users() {
  const [users, setusers] = useState();
  const [loading, setloading] = useState(true);
  useEffect(() => {
    try {
      async function fetchData() {
        const data = await (await axios.get('/api/users/getallusers')).data;
        setusers(data.users);
      }
      fetchData();
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }, []);

  return (
    <div className="row">
      {loading && <Loader />}

      <div className="col-md-10">
        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>isAdmin</th>
            </tr>
          </thead>

          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Addstorage() {
  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const [address, setaddress] = useState('');
  const [city, setcity] = useState('');
  const [sizem2, setsizem2] = useState();
  const [available, setavailable] = useState();
  const [type, settype] = useState('');
  const [rentperday, setrentperday] = useState();
  const [phonenumber, setphonenumber] = useState('');
  const [imageurl, setimageurl] = useState('');

  async function addRoom() {
    const storageobj = {
      title,
      description,
      sizem2,
      available,
      address,
      city,
      phonenumber,
      rentperday,
      type,
      imageurl,
    };
    try {
      const result = await axios.post('/api/storages/addstorage', storageobj);
      Swal.fire(
        'Congrats',
        'A new storage has been added succeessfully',
        'success'
      ).then((result) => {
        window.location.href = '/admin';
      });
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  }
  return (
    <div className="row">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control mt-1"
          placeholder="title"
          value={title}
          onChange={(e) => {
            settitle(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control mt-1"
          placeholder="description"
          value={description}
          onChange={(e) => {
            setdescription(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control mt-1"
          placeholder="address"
          value={address}
          onChange={(e) => {
            setaddress(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control mt-1"
          placeholder="city"
          value={city}
          onChange={(e) => {
            setcity(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control mt-1"
          placeholder="size (square meter)"
          value={sizem2}
          onChange={(e) => {
            setsizem2(e.target.value);
          }}
        />
        <div className="col-md-6">
          <input
            type="text"
            className="form-control mt-1"
            placeholder="type"
            value={type}
            onChange={(e) => {
              settype(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="available"
            value={available}
            onChange={(e) => {
              setavailable(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="rentperday"
            value={rentperday}
            onChange={(e) => {
              setrentperday(e.target.value);
            }}
          />
          <input
            type="text"
            className="form-control mt-1"
            placeholder="phonenumber"
            value={phonenumber}
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
          />
        </div>

        <input
          type="text"
          className="form-control mt-1"
          placeholder="Image url"
          value={imageurl}
          onChange={(e) => {
            setimageurl(e.target.value);
          }}
        />

        <div className="mt-1 text-right">
          <button className="btn btn-primary" onClick={addRoom}>
            ADD ROOM
          </button>
        </div>
      </div>
    </div>
  );
}

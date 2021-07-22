import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';

import Storage from '../components/Storage';
import Loader from 'react-spinners/PacmanLoader';
import Error from '../components/Error';

const { RangePicker } = DatePicker;

function Homescreen() {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');

  const [searchkey, setSearchkey] = useState('');
  const [type, setType] = useState('all');

  const [duplicaterooms, setDuplicaterooms] = useState([]);
  const [hotels, sethotels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = (await axios.get('/api/storages/getallstorages')).data;
        setStorages(data.storages);
        setDuplicaterooms(data.storages);
        setLoading(false);
        // console.log(data);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function filterByDate(dates) {
    setFromdate(moment(dates[0]).format('DD-MM-YYYY'));
    setTodate(moment(dates[1]).format('DD-MM-YYYY'));

    var temp = [];
    for (var room of duplicaterooms) {
      var nobooked = 0;
      var availability = false;

      for (var booking of room.currentbookings) {
        if (room.currentbookings.length) {
          if (
            !moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(
              booking.fromdate,
              booking.todate
            ) &&
            !moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(
              booking.fromdate,
              booking.todate
            )
          ) {
            if (
              moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
            ) {
              availability = true;
              nobooked += 1;
            }
          }
        }
      }
      // console.log(nobooked);
      if (availability || room.currentbookings.length === 0) {
        temp.push(room);
      }
      //setStorages(temp);
      //console.log(storages);
      //sethotels(temp);
    }
  }

  function filterBySearch() {
    const tempstorages = duplicaterooms.filter((room) =>
      room.city.toLowerCase().includes(searchkey.toLowerCase())
    );
    setStorages(tempstorages);
  }

  function filterByType(e) {
    setType(e);
    if (e !== 'all') {
      const tempstorages = duplicaterooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setStorages(tempstorages);
    } else {
      setStorages(duplicaterooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search storages by city"
            value={searchkey}
            onChange={(e) => setSearchkey(e.target.value)}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => filterByType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xl">XL</option>
            <option value="xxl">XXL</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center">
        {loading ? (
          <Loader />
        ) : (
          storages.map((storage, i) => {
            if (storage.available > 0) {
              return (
                <div className="col-md-9 mt-2" key={i}>
                  <Storage
                    storage={storage}
                    fromdate={fromdate}
                    todate={todate}
                  />
                </div>
              );
            } else {
              return null;
            }
          })
        )}
      </div>
    </div>
  );
}

export default Homescreen;

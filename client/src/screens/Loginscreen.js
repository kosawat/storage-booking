import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  async function login() {
    if (email || password) {
      const user = {
        email,
        password,
      };
      // console.log(user);
      try {
        setLoading(true);
        const result = await (await axios.post('/api/users/login', user)).data;
        localStorage.setItem('currentUser', JSON.stringify(result));
        window.location.href = '/home';
        // window.location.href='/home';
        // if (!error) history.push('/home');
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    } else {
      alert('Email and Password cannot be empty!');
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error error="Invalid Credentials" />}
          <div className="bs">
            <h2>Login</h2>

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;

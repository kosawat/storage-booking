import { BrowserRouter, Route, Link } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import Adminscreen from './screens/Adminscreen';
import Bookingscreen from './screens/Bookingscreen';
import Homescreen from './screens/Homescreen';
import Loginscreen from './screens/Loginscreen';
import Profilescreen from './screens/Profilescreen';
import Registerscreen from './screens/Registerscreen';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Route exact path="/" component={Homescreen} />
        <Route exact path="/home" component={Homescreen} />
        <Route
          exact
          path="/book/:storageid/:fromdate/:todate"
          component={Bookingscreen}
        />
        <Route exact path="/register" component={Registerscreen} />
        <Route exact path="/login" component={Loginscreen} />
        <Route exact path="/profile" component={Profilescreen} />
        <Route exact path="/admin" component={Adminscreen} />
      </BrowserRouter>
    </div>
  );
};

export default App;

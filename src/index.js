import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import firebase from './firebase';

//check if firebase connected with this pj
// console.log(firebase);


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import StudentLogin from './pages/student/Login';
import StudentDashboard from './pages/student/Dashboard';
import FacultyMemberLogin from './pages/faculty_member/Login';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

// function userExists() {
//   if (localStorage.isLoggedIn) return true;
//   else return false;
// }

// function requireAuth(nextState, replace) {
//   if (!userExists()) {
//     console.log("replacing");
//     replace({
//       pathname: '/student/login',
//       state: { nextPathname: nextState.location.pathname }
//     });
//   }
// }

ReactDOM.render(
  <BrowserRouter>
      <Switch>
        <Route exact path="/"><App/></Route>
        <Route exact path="/student/login"><StudentLogin/></Route>
        <Route exact path="/faculty_member/login"><FacultyMemberLogin/></Route>
        <Route exact path="/student/dashboard"><StudentDashboard/></Route>
      </Switch>
  </BrowserRouter>, 
  document.getElementById('root')
);


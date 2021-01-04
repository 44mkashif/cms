import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import StudentLogin from './pages/student/Login';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentCourseRegistration from './pages/student/CourseRegistration';
import StudentResult from './pages/student/Result';

import FacultyMemberLogin from './pages/faculty_member/Login';
import FacultyMemberDashboard from './pages/faculty_member/Dashboard';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';



import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

var studentLoggedIn = false;
var facultyMemberLoggedIn = false;
var adminLoggedIn = false;

if (localStorage.isLoggedIn) {
  if(localStorage.user == 'student')
    studentLoggedIn = true;
  else if(localStorage.user == 'faculty_member')
    facultyMemberLoggedIn = true;
  else if(localStorage.user == 'admin')
    adminLoggedIn = true;
};

ReactDOM.render(
  <BrowserRouter>
      <Switch>
        <Route exact path="/"><App/></Route>

        {/* Student routes */}
        <Route exact path="/student/login">
          {studentLoggedIn ? <Redirect to="/student/dashboard" /> : <StudentLogin/>}
        </Route>
        <Route exact path="/student/dashboard">
          {studentLoggedIn ? <StudentDashboard/> : <Redirect to="/student/login" />}
        </Route>
        <Route exact path="/student/courses">
          {studentLoggedIn ? <StudentCourses/> : <Redirect to="/student/login" />}
        </Route>
        <Route exact path="/student/course_registration">
          {studentLoggedIn ? <StudentCourseRegistration/> : <Redirect to="/student/login" />}
        </Route>
        <Route exact path="/student/result">
          {studentLoggedIn ? <StudentResult/> : <Redirect to="/student/login" />}
        </Route>

        {/* Faculty Member routes */}
        <Route exact path="/faculty_member/login">
          {facultyMemberLoggedIn ? <Redirect to="/faculty_member/dashboard" /> : <FacultyMemberLogin/>}
        </Route>
        <Route exact path="/faculty_member/dashboard">
          {facultyMemberLoggedIn ? <FacultyMemberDashboard/> : <Redirect to="/faculty_member/login" />}
        </Route>

        {/* Admin Routes */}
        <Route exact path="/admin/login">
          {adminLoggedIn ? <Redirect to="/admin/dashboard" /> : <AdminLogin/>}
        </Route>
        <Route exact path="/admin/dashboard">
          {adminLoggedIn ? <AdminDashboard/> : <Redirect to="/admin/login" />}
        </Route>
        
      </Switch>
  </BrowserRouter>, 
  document.getElementById('root')
);


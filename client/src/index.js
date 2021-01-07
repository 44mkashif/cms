import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import 'fontsource-roboto';

import StudentLogin from './pages/student/Login';
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentCourseRegistration from './pages/student/CourseRegistration';
import StudentResult from './pages/student/Result';
import StudentAccount from './pages/student/Account';

import FacultyMemberLogin from './pages/faculty_member/Login';
import FacultyMemberDashboard from './pages/faculty_member/Dashboard';
import FacultyMemberAccount from './pages/faculty_member/Account';
import FacultyMemberCourses from './pages/faculty_member/Courses';
import FacultyMemberUploadAttendance from './pages/faculty_member/UploadAttendance';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFaculties from './pages/admin/Faculties';
import AdminAddFaculty from './pages/admin/AddFaculty';
import AdminFacultyMembers from './pages/admin/FacultyMembers';
import AdminAddFacultyMember from './pages/admin/AddFacultyMember';
import AdminStudents from './pages/admin/Students';
import AdminAddStudent from './pages/admin/AddStudent';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33ab9f',
      main: '#009688',
      dark: '#00695f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#4aedc4',
      main: '#1de9b6',
      dark: '#14a37f',
      contrastText: '#000',
    },
    error: {
      light: '#f6685e',
      main: '#f44336',
      dark: '#aa2e25',
      contrastText: '#fff',
    },
    type: 'light'
  },
  fontFamily: 'fontsource-roboto' // as an aside, highly recommend importing roboto font for Material UI projects! Looks really nice
});

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
  <ThemeProvider theme={theme}>
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
        <Route exact path="/student/account">
          {studentLoggedIn ? <StudentAccount/> : <Redirect to="/student/login" />}
        </Route>
        <Route exact path="/student/register_course">
          {studentLoggedIn ? <StudentCourseRegistration/> : <Redirect to="/student/login" />}
        </Route>

        {/* Faculty Member routes */}
        <Route exact path="/faculty_member/login">
          {facultyMemberLoggedIn ? <Redirect to="/faculty_member/dashboard" /> : <FacultyMemberLogin/>}
        </Route>
        <Route exact path="/faculty_member/dashboard">
          {facultyMemberLoggedIn ? <FacultyMemberDashboard/> : <Redirect to="/faculty_member/login" />}
        </Route>
        <Route exact path="/faculty_member/courses">
          {facultyMemberLoggedIn ? <FacultyMemberCourses/> : <Redirect to="/faculty_member/login" />}
        </Route>
        <Route exact path="/faculty_member/account">
          {facultyMemberLoggedIn ? <FacultyMemberAccount/> : <Redirect to="/faculty_member/login" />}
        </Route>
        <Route exact path="/faculty_member/upload_attendance">
          {facultyMemberLoggedIn ? <FacultyMemberUploadAttendance/> : <Redirect to="/faculty_member/login" />}
        </Route>

        {/* Admin Routes */}
        <Route exact path="/admin/login">
          {adminLoggedIn ? <Redirect to="/admin/dashboard" /> : <AdminLogin/>}
        </Route>
        <Route exact path="/admin/dashboard">
          {adminLoggedIn ? <AdminDashboard/> : <Redirect to="/admin/login" />}
        </Route>
        <Route exact path="/admin/faculties">
          {adminLoggedIn ? <AdminFaculties/> : <Redirect to="/admin/login" />}
        </Route>
        <Route exact path="/admin/add_faculty">
          {adminLoggedIn ? <AdminAddFaculty/> : <Redirect to="/admin/login" />}
        </Route>
        <Route exact path="/admin/faculty_members">
          {adminLoggedIn ? <AdminFacultyMembers/> : <Redirect to="/admin/login" />}
        </Route>
        <Route exact path="/admin/add_faculty_member">
          {adminLoggedIn ? <AdminAddFacultyMember/> : <Redirect to="/admin/login" />}
        </Route>
        <Route exact path="/admin/students">
          {adminLoggedIn ? <AdminStudents/> : <Redirect to="/admin/login" />}
        </Route>
        <Route exact path="/admin/add_student">
          {adminLoggedIn ? <AdminAddStudent/> : <Redirect to="/admin/login" />}
        </Route>
        
      </Switch>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);


import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const faculty_id = localStorage.getItem('id');
var sections = [];
var courses = [];
var faculty_member;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 40,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function CourseList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [courseSelected, setCourseSelected] = useState("");

  const retrieveCourses = () => {
    sections = [];
    courses = [];
    faculty_member = null;
  
    Axios.get(`http://localhost:4000/api/faculty-member/${faculty_id}/courses`, {})
    .then((response) => {
      if(response.status == 200) {
        faculty_member = response.data.data;
        console.log(faculty_member);
        
        sections = faculty_member.sections;
        console.log(sections);

        sections.forEach(section => {
          courses.push(section.course);
        });
        console.log(courses);
        setLoading(false);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveCourses();

  const getIndex = (course_code) => {
    console.log(course_code);
    var res;
    courses.forEach((course, index) => {
      if (course_code == course.course_code) {
        res = index;
      }
    });
    return res;
  }

  const handleClick = (event, course_code) => {
      setIsSelected(true);
      setCourseSelected(course_code);
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Courses</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S#</StyledTableCell>
              <StyledTableCell align="center">Course Code</StyledTableCell>
              <StyledTableCell align="center">Course Title</StyledTableCell>
              <StyledTableCell align="center">Section</StyledTableCell>
              <StyledTableCell align="center">Credit Hours</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? <div>Loading...</div>
            :
            <TableBody>
              {courses.map((course, index) => (
                <StyledTableRow  key={course.course_code} onClick={(event) => handleClick(event, course.course_code)}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{course.course_code}</StyledTableCell>
                  <StyledTableCell align="center">{course.name}</StyledTableCell>
                  <StyledTableCell align="center">{sections[index].name}</StyledTableCell>
                  <StyledTableCell align="center">{course.credit_hours}</StyledTableCell>
                </StyledTableRow >
              ))}
            </TableBody>
          }
        </Table>
        <br></br>
      </Paper>
      <Box className={classes.fixedHeight}></Box>
      {!isSelected ? <div>Please select a course to check the details</div>
        :
        <div>
          <Paper className={classes.paper}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>{courses[getIndex(courseSelected)].name}</Typography>
            <br></br>
            <Table size="small">
              <TableBody>
                  <StyledTableRow  key={1}>
                      <StyledTableCell align="left">Faculty: {courses[getIndex(courseSelected)].faculty_name}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={2}>
                      <StyledTableCell align="left">Course Code: {courses[getIndex(courseSelected)].course_code}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={3}>
                      <StyledTableCell align="left">Credit hours: {courses[getIndex(courseSelected)].credit_hours}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={4}>
                      <StyledTableCell align="left">Description: {courses[getIndex(courseSelected)].description}</StyledTableCell>
                  </StyledTableRow >
              </TableBody>
            </Table>
            <br></br>
          </Paper>
          <Box className={classes.fixedHeight}></Box>
        </div>
      }
    </React.Fragment>
  );
}
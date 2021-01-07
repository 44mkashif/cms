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
import differenceBy from 'lodash/differenceBy';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const reg_no = localStorage.getItem('reg-no');
const authToken = localStorage.getItem('x-auth-token');
var sections = [];
var courses = [];
var registered_courses = [];
var all_courses = [];
var faculty_members = [];
var courseSections = [];

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
  dialogTitle: {
    color: theme.palette.primary.main,
  }
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

export default function RegisterCourses() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [courseSelected, setCourseSelected] = useState("");
  const [open, setOpen] = useState(false);

  const currentDate = new Date();
  const [section_id, setSectionId] = useState();
  const [academic_year, setAcademicYear] = useState(currentDate.getFullYear());
  const [semester, setSemester] = useState("Fall");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // const retrieveFacultyMembers = (faculty_member_id) => {
  //   return new Promise((resolve, reject) => {
  //     Axios.get(`http://localhost:4000/api/faculty-member/${faculty_member_id}`, {})
  //     .then((response) => {
  //       if(response.status == 200){
  //         faculty_members.push(response.data.data);
  //       //   console.log(faculty_members);
  //       }
  //     })
  //     .then((data) => {
  //       resolve(data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     })
  //   });
  // }

  const retrieveAllCourses = () => {
    return new Promise((resolve, reject) => {
      Axios.get(`http://localhost:4000/api/course `, {})
      .then((response) => {
        if(response.status == 200) {
          all_courses = response.data.data;
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((e) => {
        console.log(e);
      });
    });
  }

  const retrieveRegisteredCourses = () => {
    return new Promise((resolve, reject) => {
      Axios.get(`http://localhost:4000/api/student/${reg_no}/courses`, {})
      .then((response) => {
        if(response.status == 200) {
          const student = response.data.data;
          
          const enrollments = student.enrollments;
    
          enrollments.forEach(enrollment => {
            sections.push(enrollment.section);
          });

          sections.forEach(section => {
              registered_courses.push(section.course);
          });
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((e) => {
        console.log(e);
      });
    });
  }

  const retrieve = () => {
    sections = [];
    registered_courses = [];
    courses = [];
    all_courses = [];
    faculty_members = [];

    let requests = [];

    requests.push(retrieveAllCourses());
    requests.push(retrieveRegisteredCourses());
    // var facultyMemberIds = [];
    // sections.forEach(section => {
    //     registered_courses.push(section.course);
    //     facultyMemberIds.push(section.faculty_member_id);
    // });

    // let requests = [];
    // facultyMemberIds.forEach(facultyMemberId => {
    //     requests.push(retrieveFacultyMembers(facultyMemberId));
    // });
    
    Promise.all(requests).then(() => {
      courses = differenceBy(all_courses, registered_courses, 'course_code');
      console.log(all_courses);
      console.log(registered_courses);
      console.log(courses);
      setLoading(false);
    })
  }

  if (loading) retrieve();

  const getIndex = (course_code) => {
    // console.log(course_code);
    var res;
    courses.forEach((course, index) => {
      if (course_code == course.course_code) {
        res = index;
      }
    });
    return res;
  }

  const retrieveSections = (course_code) => {
    courseSections = [];
    Axios.get(`http://localhost:4000/api/course/${course_code}/sections`, {})
    .then((response) => {
      if(response.status == 200) {
        courseSections = response.data.data.sections;
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }

  const handleClick = (event, course_code) => {
    setIsSelected(true);
    setCourseSelected(course_code);
    retrieveSections(course_code);
  }

  const registerCourse = (event) => {
    event.stopPropagation();
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const register = () => {
    setOpen(false);

    setErrorMessage(null);
    setSuccessMessage(null);
    Axios.post('http://localhost:4000/api/enrollment', {
      reg_no: reg_no,
      section_id: section_id,
      academic_year: academic_year,
      semester: semester
    }, {
      headers: {
        'x-auth-token': authToken
      },
    }).then((response) => {
      console.log(response);
      if(response.data.success) {
        setSuccessMessage("Student Registered Successfully");
        console.log(response.data);
        window.location.href="/student/courses";
      }
    }).catch((e) => {
      if (e.response && e.response.data) {
        const errorMessage = e.response.data.err || e.response.data.message;
        console.log(e.response);
        setErrorMessage(errorMessage);
      }
    })
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={6}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Courses</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S#</StyledTableCell>
              <StyledTableCell align="center">Course Code</StyledTableCell>
              <StyledTableCell align="center">Course Title</StyledTableCell>
              <StyledTableCell align="center">Credit Hours</StyledTableCell>
              {/* <StyledTableCell align="center">Faculty</StyledTableCell> */}
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
                  <StyledTableCell align="center">{course.credit_hours}</StyledTableCell>
                  {/* <StyledTableCell align="center">
                    {faculty_members[index].name}
                  </StyledTableCell> */}
                </StyledTableRow >
              ))}
            </TableBody>
          }
        </Table>
        <br></br>
      </Paper>
      <Box className={classes.fixedHeight}></Box>
      {!isSelected 
        ? 
        <div>
          <Typography component="h2" color="primary" gutterBottom>Please select a Course to check the details</Typography>
        </div>
        :
        <div>
          <Paper className={classes.paper} elevation={6}>
            <Box display="flex" p={1} bgcolor="background.paper">
              <Box p={1} flexGrow={1}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>{courses[getIndex(courseSelected)].name}</Typography>
              </Box>
              <Box p={1}>
                <Button variant="contained" color="primary" onClick={(event) => registerCourse(event)}>Register</Button>
              </Box>
            </Box>
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
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Select Section</DialogTitle>
            <DialogContent>
              <form className={classes.form} noValidate>
                <TextField
                  classes={{ root: classes.root }}
                  select
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="section"
                  id="section"
                  variant="outlined"
                  label="Section"
                  value={section_id}
                  onChange={(e) => {
                    setSectionId(e.target.value);
                  }}
                >
                  {courseSections.map((section, index) => (
                    <MenuItem value={section.id}>{section.name}</MenuItem>
                  ))}
                </TextField>
               
                <Box className={classes.fixedHeight}></Box>
                <Grid container direction="row" alignItems="center" justify="center">
                  <Grid item xs={5} sm={5} md={5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}></Grid>
                  <Grid item xs={5} sm={5} md={5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={register}
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </form> 
            </DialogContent>
            <Box className={classes.fixedHeight}></Box>
          </Dialog>
        </div>
      }
    </React.Fragment>
  );
}
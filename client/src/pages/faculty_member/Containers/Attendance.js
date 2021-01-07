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
import { Alert, AlertTitle } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const authToken = localStorage.getItem('x-auth-token');
const faculty_id = localStorage.getItem('id');
var sections = [];
var courses = [];
var students = [];
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
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [courseSelected, setCourseSelected] = useState("false");

  const currentDate = new Date();
  const [reg_no, setRegNo] = useState();
  const [section_id, setSectionId] = useState();
  const [lecture_no, setLectureNo] = useState();
  const [status, setStatus] = useState(false);
  const [sstatus, setSStatus] = useState("");
  const [date, setDate] = useState(currentDate);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const retrieveStudents = (course_code) => {
    students = [];
    setStudentsLoading(true);
  
    Axios.get(`http://localhost:4000/api/course/${course_code}/students`, {})
    .then((response) => {
      if(response.status == 200) {
        const course = response.data.data;
        const sections = course.sections;
        var my_section;
        sections.forEach(section => {
            if (section.faculty_member_id == faculty_id) {
                my_section = section;
            }
        });

        const enrollments = my_section.enrollments;
        enrollments.forEach(enrollment => {
            students.push(enrollment.student);
        });
        setStudentsLoading(false);
        console.log(students);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  const handleClick = (event, course_code) => {
      setIsSelected(true);
      setCourseSelected(course_code);
      retrieveStudents(course_code);
      setSectionId(sections[getIndex(course_code)].id);
  }

  const uploadAttendance = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    Axios.post('http://localhost:4000/api/attendance', {
        reg_no: reg_no,
        section_id: section_id,
        lecture_no: lecture_no,
        date: date,
        status: status
    }, {
        headers: {
        'x-auth-token': authToken
        },
    }).then((response) => {
        console.log(response);
        if(response.data.success) {
        setSuccessMessage("Student Added Successfuly");
        console.log(response.data);
        window.location.href="/faculty_member/upload_attendance";
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
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Upload Attendance</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S#</StyledTableCell>
              <StyledTableCell align="center">Course Code</StyledTableCell>
              <StyledTableCell align="center">Course Title</StyledTableCell>
              <StyledTableCell align="center">Section</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? <div>Loading...</div>
            :
            <TableBody>
              {courses.map((course, index) => (
                <StyledTableRow hover key={course.course_code} onClick={(event) => handleClick(event, course.course_code)}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{course.course_code}</StyledTableCell>
                  <StyledTableCell align="center">{course.name}</StyledTableCell>
                  <StyledTableCell align="center">{sections[index].name}</StyledTableCell>
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
          <Typography component="h2" color="primary" gutterBottom>Please select a Faculty to check the details</Typography>
        </div>
        :
        <div>
          <Paper className={classes.paper} elevation={6}>
            <Box display="flex" p={1} bgcolor="background.paper">
              <Box p={1} flexGrow={1}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>{courses[getIndex(courseSelected)].name}</Typography>
              </Box>
              <Box p={1}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>{courses[getIndex(courseSelected)].course_code} {sections[getIndex(courseSelected)].name}</Typography>
              </Box>
            </Box>
            <br></br>
            
            {studentsLoading ? <div>Loading</div>
            :
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Grid container>
                    <Grid item xs={2} sm={2} md={2}></Grid>
                        <Grid item xs={8} sm={8} md={8} container direction="column" alignItems="center" justify="center" square>
                        <form className={classes.form} noValidate>
                            <TextField
                                classes={{ root: classes.root }}
                                select
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="student"
                                id="student"
                                variant="outlined"
                                label="Student"
                                onChange={(e) => {
                                    setRegNo(e.target.value);
                                }}
                            >
                                {students.map((student, index) => (
                                <MenuItem value={student.reg_no}>{student.reg_no + ": " + student.name}</MenuItem>
                                ))}
                            </TextField>
                            <div>
                                <FormLabel>Attendance</FormLabel>
                                <RadioGroup 
                                    row
                                    aria-label="attendance" 
                                    name="attendance"
                                    value={sstatus}
                                    onChange={(e) => {
                                        setSStatus(e.target.value);
                                        if (e.target.value === "true") {
                                            setStatus(true);
                                        } else if (e.target.value === "false") {
                                            setStatus(false);
                                        }
                                    }}
                                    >
                                    <FormControlLabel value="true" control={<Radio color="primary"/>} label="Present" />
                                    <FormControlLabel value="false" control={<Radio color="primary"/>} label="Absent" />
                                </RadioGroup>
                            </div>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="lecture_no"
                                label="Lecture No"
                                name="lecture_no"
                                onChange={(e) => {
                                    setLectureNo(e.target.value);
                                }}
                            />
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Date"
                                format="MM-DD-yyyy"
                                inputVariant="outlined"
                                fullWidth
                                value={date}
                                onChange={(date) => {
                                    setDate(date)
                                }}
                                KeyboardButtonProps={{
                                'aria-label': 'change date',
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={uploadAttendance}
                            >
                                Submit
                            </Button>
                            {errorMessage &&
                                <Box mt={5}>
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>{errorMessage}</Alert>
                                </Box>
                            }
                            {successMessage &&
                                <Box mt={5}>
                                <Alert severity="success">
                                    <AlertTitle>Success</AlertTitle>{successMessage}</Alert>
                                </Box>
                            }
                        </form>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}></Grid>
                </Grid>
            </MuiPickersUtilsProvider>

            }
            <br></br>
          </Paper>
          <Box className={classes.fixedHeight}></Box>
        </div>
      }
    </React.Fragment>
  );
}
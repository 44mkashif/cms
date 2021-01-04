import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Axios from 'axios';

const reg_no = localStorage.getItem('reg-no');
var results = [];
var enrollments = [];
var courses = [];
var student;

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function ResultCards() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);

    const retrieveCourse = (eId) => {
        return new Promise((resolve, reject) => {
            Axios.get(`http://localhost:4000/api/enrollment/${eId}/course`, {})
            .then((response) => {
            if(response.status == 200) {
                courses.push(response.data.data.section.course);
            }
            })
            .then((data) => {
              resolve(data);
            })
            .catch((e) => {
              console.log(e);
            })
        });
    }

    const retrieveEnrollments = (semester) => {
        return new Promise((resolve, reject) => {
            Axios.get(`http://localhost:4000/api/student/${reg_no}/enrollments/${semester}`, {})
            .then((response) => {
            if(response.status == 200) {
                enrollments = response.data.data.enrollments;
                console.log(enrollments);

                let requests = [];
                enrollments.forEach(enrollment => {
                    requests.push(retrieveCourse(enrollment.id));
                });

                Promise.all(requests).then(() => {
                    setLoading(false);
                })
            }
            })
            .then((data) => {
              resolve(data);
            })
            .catch((e) => {
              console.log(e);
            })
        });
    }

    const retrieveResults = () => {
    results = [];
    enrollments = [];
    courses = [];
    student = null;

    Axios.get(`http://localhost:4000/api/student/${reg_no}/results`, {})
    .then((response) => {
      if(response.status == 200) {
        student = response.data.data;
        results = student.results;
        console.log(results);

        let requests = [];
        results.forEach(result => {
            requests.push(retrieveEnrollments(result.semester));
        });
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveResults();

  return (
    <React.Fragment>
    {loading ? <div>Loading...</div>
    :
    
    <div>
        {results.map((result, index) => (
            <div>
                <Paper className={classes.paper}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>{result.semester + " Semester, " + enrollments[0].academic_year}</Typography>
                    <Table size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Course Code</TableCell>
                            <TableCell align="center">Course Title</TableCell>
                            <TableCell align="center">Credit Hours</TableCell>
                            <TableCell align="center">Grade</TableCell>
                        </TableRow>
                        </TableHead>
                        {loading ? <div>Loading...</div>
                        :
                        <TableBody>
                            {enrollments.map((enrollment, index) => (
                                <TableRow key={1}>
                                    <TableCell align="center">{courses[index].course_code}</TableCell>
                                    <TableCell align="center">{courses[index].name}</TableCell>
                                    <TableCell align="center">{courses[index].credit_hours}</TableCell>
                                    <TableCell align="center">{enrollment.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        }
                    </Table>
                    <br></br>
                    <Box display="flex" p={1} bgcolor="background.paper">
                        <Box p={1} flexGrow={1}><Typography component="h2" color="primary" gutterBottom>GPA: {result.gpa}</Typography></Box>
                        <Box p={1} flexGrow={1}><Typography component="h2" color="primary" gutterBottom>CGPA: {student.cgpa}</Typography></Box>
                        <Box p={1}><Typography component="h2" color="primary" gutterBottom>Scholistic Status: {result.scholistic_status}</Typography></Box>
                    </Box>
                </Paper>
                <br></br>
            </div>
        ))}
    </div>
    }
    </React.Fragment>
  );
}
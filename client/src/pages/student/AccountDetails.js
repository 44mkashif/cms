import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Axios from 'axios';

const reg_no = localStorage.getItem('reg-no');
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

export default function AccountDetails() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);

    const retrieveStudent = () => {
    student = null;

    Axios.get(`http://localhost:4000/api/student/${reg_no}`, {})
    .then((response) => {
      if(response.status == 200) {
        student = response.data.data;
        console.log(student);
        setLoading(false);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveStudent();

  return (
    <React.Fragment>
    {loading ? <div>Loading...</div>
    :
    <div>
        <Paper className={classes.paper}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>{student.name}</Typography>
            <Table size="small">
                <TableBody>
                    <StyledTableRow  key={student.reg_no}>
                        <StyledTableCell align="left">Faculty Name: {student.faculty_name}</StyledTableCell>
                        <StyledTableCell align="left">Email: {student.email}</StyledTableCell>
                    </StyledTableRow >
                    <StyledTableRow  key={student.reg_no}>
                        <StyledTableCell align="left">Registration No: {student.reg_no}</StyledTableCell>
                        <StyledTableCell align="left">Phone: {student.phone}</StyledTableCell>
                    </StyledTableRow >
                    <StyledTableRow  key={student.reg_no}>
                        <StyledTableCell align="left">CGPA: {student.cgpa}</StyledTableCell>
                        <StyledTableCell align="left">Date of Birth: {student.dob.substring(0,10)}</StyledTableCell>
                    </StyledTableRow >
                    <StyledTableRow  key={student.reg_no}>
                        <StyledTableCell align="left">Batch: {student.batch}</StyledTableCell>
                        <StyledTableCell align="left">Address: {student.address}</StyledTableCell>
                    </StyledTableRow >
                    <StyledTableRow  key={student.reg_no}>
                        <StyledTableCell align="left">Gender: {student.gender == 'M' ? 'Male' : 'Female'}</StyledTableCell>
                        <StyledTableCell align="left"></StyledTableCell>
                    </StyledTableRow >
                </TableBody>
            </Table>
            <br></br>
        </Paper>
        <br></br>
    </div>
    }
    </React.Fragment>
  );
}
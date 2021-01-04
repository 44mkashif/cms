import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Axios from 'axios';

const faculty_id = localStorage.getItem('id');
var faculty_member;

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

    const retrieveFacultyMember = () => {
      faculty_member = null;

      Axios.get(`http://localhost:4000/api/faculty-member/${faculty_id}`, {})
      .then((response) => {
        if(response.status == 200) {
          faculty_member = response.data.data;
          console.log(faculty_member);
          setLoading(false);
        }
      }).catch((e) => {
        console.log(e);
      });
    }

  if (loading) retrieveFacultyMember();

  return (
    <React.Fragment>
    {loading ? <div>Loading...</div>
    :
    <div>
        <Paper className={classes.paper}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>{faculty_member.name}</Typography>
            <Table size="small">
                <TableBody>
                    <StyledTableRow  key={1}>
                      <StyledTableCell align="left">Faculty Name: {faculty_member.faculty_name}</StyledTableCell>
                      <StyledTableCell align="left">Designation: {faculty_member.designation}</StyledTableCell>
                    </StyledTableRow >
                    <StyledTableRow  key={2}>
                      <StyledTableCell align="left">Email: {faculty_member.email}</StyledTableCell>
                      <StyledTableCell align="left">Phone: {faculty_member.phone}</StyledTableCell>
                    </StyledTableRow >
                    <StyledTableRow  key={3}>
                      <StyledTableCell align="left">Address: {faculty_member.address}</StyledTableCell>
                      <StyledTableCell align="left">Date of Birth: {faculty_member.dob.substring(0,10)}</StyledTableCell>
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
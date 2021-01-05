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
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';

const faculty_id = localStorage.getItem('id');
const authToken = localStorage.getItem('x-auth-token');
var faculties = [];
var facultiesWithDean = [];

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
  deleteButton: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    "&:hover":{
      backgroundColor: theme.palette.error.dark
    },
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
    //   backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function FacultyList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [courseSelected, setCourseSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const retrieveFacultyDean = (faculty_name) => {
    return new Promise((resolve, reject) => {
        Axios.get(`http://localhost:4000/api/faculty/${faculty_name}/dean`, {})
        .then((response) => {
          if(response.status == 200){
            facultiesWithDean.push(response.data.data[0]);
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

  const retrieveFaculties = () => {
    facultiesWithDean = [];
    faculties = [];
  
    Axios.get(`http://localhost:4000/api/faculty`, {})
    .then((response) => {
      if(response.status == 200) {
        faculties = response.data.data;
        
        let requests = [];
        faculties.forEach(faculty => {
          requests.push(retrieveFacultyDean(faculty.name));
        });

        Promise.all(requests).then(() => {
            setLoading(false);
            console.log(faculties);
            console.log(facultiesWithDean);
        })
      }
    }).catch((e) => {
      console.log(e);
    });
  }

//   if (facultiesWithDean.length != 0 && faculties.length != 0) {
//     setLoading(false);
//   }

  if (loading) retrieveFaculties();

  const getIndex = (name) => {
    console.log(name);
    var res;
    faculties.forEach((faculty, index) => {
      if (name == faculty.name) {
        res = index;
      }
    });
    return res;
  }

  const handleClick = (event, name) => {
      setIsSelected(true);
      setCourseSelected(name);
  }

  const deleteFaculty = (event, faculty_name) => {
    event.stopPropagation()
    setErrorMessage(null);
    setSuccessMessage(null);
    Axios.delete(`http://localhost:4000/api/faculty/${faculty_name}`, {
      headers: {
        'x-auth-token': authToken
      },
    })
    .then((response) => {
      console.log(response);
      if(response.status == 200) {
        const successMessage = response.data.message;
        console.log(successMessage);
        setSuccessMessage(successMessage);
        window.location.reload();
      }
    }).catch((e) => {
      if (e.response && e.response.data) {
        const errorMessage = e.response.data.err || e.response.data.message;
        console.log(errorMessage);
        setErrorMessage(errorMessage);
      }
    });
  }

  const editFaculty = (event) => {
    event.stopPropagation();
    console.log('clicked');
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Faculties</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S#</StyledTableCell>
              <StyledTableCell align="center">Faculty</StyledTableCell>
              <StyledTableCell align="center">Dean</StyledTableCell>
              <StyledTableCell align="center">Location</StyledTableCell>
              <StyledTableCell align="center">Contact Email</StyledTableCell>
              <StyledTableCell align="center">Contact Phone #</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? <div>Loading...</div>
            :
            <TableBody>
              {facultiesWithDean.map((faculty, index) => (
                <StyledTableRow hover key={faculty.name} onClick={(event) => handleClick(event, faculty.name)}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{faculty.name}</StyledTableCell>
                  <StyledTableCell align="center">{faculty.dean_id ? faculty.dean.name : 'N/A'}</StyledTableCell>
                  <StyledTableCell align="center">{faculty.location ? faculty.location : 'N/A'}</StyledTableCell>
                  <StyledTableCell align="center">{faculty.contact_email}</StyledTableCell>
                  <StyledTableCell align="center">{faculty.contact_phone}</StyledTableCell>
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
          <Paper className={classes.paper}>
            <Box display="flex" p={1} bgcolor="background.paper">
                <Box p={1} flexGrow={1}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>{facultiesWithDean[getIndex(courseSelected)].name}</Typography>
                </Box>
                <Box p={1}>
                  <Button variant="contained" color="primary" onClick={(event) => editFaculty(event, facultiesWithDean[getIndex(courseSelected)].name)}>Edit</Button>
                </Box>
                <Box p={1}>
                  <Button variant="contained" className={classes.deleteButton} onClick={(event) => deleteFaculty(event, facultiesWithDean[getIndex(courseSelected)].name)}>Delete</Button>
                </Box>
            </Box>
            <br></br>
            <Table size="small">
              <TableBody>
                  <StyledTableRow  key={1}>
                    <StyledTableCell align="left">Dean: {facultiesWithDean[getIndex(courseSelected)].dean_id ? facultiesWithDean[getIndex(courseSelected)].dean.name : 'N/A'}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={2}>
                    <StyledTableCell align="left">Location: {facultiesWithDean[getIndex(courseSelected)].location ? facultiesWithDean[getIndex(courseSelected)].location : 'N/A'}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={3}>
                    <StyledTableCell align="left">Contact Email: {facultiesWithDean[getIndex(courseSelected)].contact_email}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={4}>
                    <StyledTableCell align="left">Contact Phone: {facultiesWithDean[getIndex(courseSelected)].contact_phone}</StyledTableCell>
                  </StyledTableRow >
              </TableBody>
            </Table>
            <br></br>
          </Paper>
          <Box className={classes.fixedHeight}></Box>
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
        </div>
      }
    </React.Fragment>
  );
}
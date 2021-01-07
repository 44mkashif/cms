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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';


const faculty_id = localStorage.getItem('id');
const authToken = localStorage.getItem('x-auth-token');
var students = [];
var faculties = [];

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
    //   backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function StudentList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [studentSelected, setStudentSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  const [name, setName] = useState("");
  const [faculty_name, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [batch, setBatch] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const retrieveStudents = () => {
    students = [];
  
    Axios.get(`http://localhost:4000/api/student`, {})
    .then((response) => {
      if(response.status == 200) {
        students = response.data.data;
        setLoading(false);
        console.log(students);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveStudents();

  const getIndex = (reg_no) => {
    console.log(reg_no);
    var res;
    students.forEach((student, index) => {
      if (reg_no == student.reg_no) {
        res = index;
      }
    });
    return res;
  }

  const retrieveFaculties = () => {
    faculties = [];
  
    Axios.get(`http://localhost:4000/api/faculty`, {})
    .then((response) => {
      if(response.status == 200) {
        faculties = response.data.data;
        console.log(faculties);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  const handleClick = (event, reg_no) => {
      setIsSelected(true);
      setStudentSelected(reg_no);
      retrieveFaculties();
  }

  const deleteFaculty = (event, reg_no) => {
    event.stopPropagation()
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log('delete clicked');
    Axios.delete(`http://localhost:4000/api/student/${reg_no}`, {
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const editFacultyDialog = (event, reg_no) => {
    event.stopPropagation();
    console.log('edit clicked');
    setName(students[getIndex(reg_no)].name);
    setFacultyName(students[getIndex(reg_no)].faculty_name);
    setPhone(students[getIndex(reg_no)].phone);
    setEmail(students[getIndex(reg_no)].email);
    setDob(students[getIndex(reg_no)].dob);
    setAddress(students[getIndex(reg_no)].address);
    setBatch(students[getIndex(reg_no)].batch);
    setGender(students[getIndex(reg_no)].gender);
    setOpen(true);
  }

  const editFaculty = () => {
    setOpen(false);
    console.log('Dialog closed');
    Axios.put(`http://localhost:4000/api/student/${studentSelected}`, {
      faculty_name: faculty_name,
      name: name,
      phone: phone,
      email: email,
      dob: dob,
      address: address,
      batch: batch,
      gender: gender
    }, {
      headers: {
        'x-auth-token': authToken
      },
    }).then((response) => {
      console.log(response);
      if(response.data.success) {
        setSuccessMessage("Faculty Member Info Updated Successfully");
        console.log(response.data);
        window.location.href="/admin/students";
      }
    }).catch((e) => {
      console.log(e.response);
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
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Students</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S#</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Faculty</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Batch</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? <div>Loading...</div>
            :
            <TableBody>
              {students.map((student, index) => (
                <StyledTableRow hover key={student.name} onClick={(event) => handleClick(event, student.reg_no)}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{student.name}</StyledTableCell>
                  <StyledTableCell align="center">{student.faculty_name}</StyledTableCell>
                  <StyledTableCell align="center">{student.email}</StyledTableCell>
                  <StyledTableCell align="center">{student.batch}</StyledTableCell>
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
          <Typography component="h2" color="primary" gutterBottom>Please select a Student to check the details</Typography>
        </div>
        :
        <div>
          <Paper className={classes.paper} elevation={6}>
            <Box display="flex" p={1} bgcolor="background.paper">
                <Box p={1} flexGrow={1}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>{students[getIndex(studentSelected)].name}</Typography>
                </Box>
                <Box p={1}>
                  <Button variant="contained" color="primary" onClick={(event) => editFacultyDialog(event, students[getIndex(studentSelected)].reg_no)}>Edit</Button>
                </Box>
                <Box p={1}>
                  <Button variant="contained" className={classes.deleteButton} onClick={(event) => deleteFaculty(event, students[getIndex(studentSelected)].reg_no)}>Delete</Button>
                </Box>
            </Box>
            <br></br>
            <Table size="small">
              <TableBody>
                <StyledTableRow  key={1}>
                    <StyledTableCell align="left">Faculty Name: {students[getIndex(studentSelected)].faculty_name}</StyledTableCell>
                    <StyledTableCell align="left">Email: {students[getIndex(studentSelected)].email}</StyledTableCell>
                </StyledTableRow >
                <StyledTableRow  key={2}>
                    <StyledTableCell align="left">Registration No: {students[getIndex(studentSelected)].reg_no}</StyledTableCell>
                    <StyledTableCell align="left">Phone: {students[getIndex(studentSelected)].phone}</StyledTableCell>
                </StyledTableRow >
                <StyledTableRow  key={3}>
                    <StyledTableCell align="left">CGPA: {students[getIndex(studentSelected)].cgpa}</StyledTableCell>
                    <StyledTableCell align="left">Date of Birth: {students[getIndex(studentSelected)].dob.substring(0,10)}</StyledTableCell>
                </StyledTableRow >
                <StyledTableRow  key={4}>
                    <StyledTableCell align="left">Batch: {students[getIndex(studentSelected)].batch}</StyledTableCell>
                    <StyledTableCell align="left">Address: {students[getIndex(studentSelected)].address}</StyledTableCell>
                </StyledTableRow >
                <StyledTableRow  key={5}>
                    <StyledTableCell align="left">Gender: {students[getIndex(studentSelected)].gender == 'M' ? 'Male' : 'Female'}</StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>
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
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Edit Faculty Member</DialogTitle>
              <DialogContent>
                <form className={classes.form} noValidate>
                  <TextField
                    classes={{ root: classes.root }}
                    select
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="faculty_name"
                    id="faculty_name"
                    variant="outlined"
                    label="Faculty"
                    value={faculty_name}
                    onChange={(e) => {
                      setFacultyName(e.target.value);
                    }}
                  >
                    {faculties.map((faculty, index) => (
                      <MenuItem value={faculty.name}>{faculty.name}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="batch"
                    label="Batch"
                    name="batch"
                    autoComplete="batch"
                    value={batch}
                    onChange={(e) => {
                      setBatch(e.target.value);
                    }}
                  />
                  <div>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup 
                        row
                        aria-label="gender" 
                        name="gender1"
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                        >
                        <FormControlLabel value="F" control={<Radio color="primary"/>} label="Female" />
                        <FormControlLabel value="M" control={<Radio color="primary"/>} label="Male" />
                        <FormControlLabel value="O" control={<Radio color="primary"/>} label="Other" />
                    </RadioGroup>
                  </div>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Date of Birth"
                    format="MM-DD-yyyy"
                    value={dob}
                    inputVariant="outlined"
                    fullWidth
                    onChange={(date) => {
                      setDob(date)
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
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
                        onClick={editFaculty}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
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
              </DialogContent>
              <Box className={classes.fixedHeight}></Box>
            </Dialog>
          </MuiPickersUtilsProvider>
        </div>
      }
    </React.Fragment>
  );
}
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

const faculty_id = localStorage.getItem('id');
const authToken = localStorage.getItem('x-auth-token');
var faculty_members = [];
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

export default function FacultyMemberList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [facultyMemberSelected, setFacultyMemberSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  const [name, setName] = useState("");
  const [faculty_name, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [designation, setDesignation] = useState("");

  const retrieveFacultyMembers = () => {
    faculty_members = [];
  
    Axios.get(`http://localhost:4000/api/faculty-member`, {})
    .then((response) => {
      if(response.status == 200) {
        faculty_members = response.data.data;
        setLoading(false);
        console.log(faculty_members);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveFacultyMembers();

  const getIndex = (id) => {
    console.log(id);
    var res;
    faculty_members.forEach((faculty_member, index) => {
      if (id == faculty_member.id) {
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

  const handleClick = (event, faculty_member_id) => {
      setIsSelected(true);
      setFacultyMemberSelected(faculty_member_id);
      retrieveFaculties();
  }

  const deleteFaculty = (event, faculty_member_id) => {
    event.stopPropagation()
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log('delete clicked');
    Axios.delete(`http://localhost:4000/api/faculty-member/${faculty_member_id}`, {
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
  
  const editFacultyDialog = (event, faculty_member_id) => {
    event.stopPropagation();
    console.log('edit clicked');
    setName(faculty_members[getIndex(faculty_member_id)].name);
    setFacultyName(faculty_members[getIndex(faculty_member_id)].faculty_name);
    setPhone(faculty_members[getIndex(faculty_member_id)].phone);
    setEmail(faculty_members[getIndex(faculty_member_id)].email);
    setDob(faculty_members[getIndex(faculty_member_id)].dob);
    setAddress(faculty_members[getIndex(faculty_member_id)].address);
    setDesignation(faculty_members[getIndex(faculty_member_id)].designation);
    setOpen(true);
  }

  const editFaculty = () => {
    setOpen(false);
    console.log('Dialog closed');
    Axios.put(`http://localhost:4000/api/faculty-member/${facultyMemberSelected}`, {
      faculty_name: faculty_name,
      name: name,
      phone: phone,
      email: email,
      dob: dob,
      address: address,
      designation: designation
    }, {
      headers: {
        'x-auth-token': authToken
      },
    }).then((response) => {
      console.log(response);
      if(response.data.success) {
        setSuccessMessage("Faculty Member Info Updated Successfully");
        console.log(response.data);
        window.location.href="/admin/faculty_members";
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
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Faculty Members</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S#</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Designation</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Phone #</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? <div>Loading...</div>
            :
            <TableBody>
              {faculty_members.map((faculty_member, index) => (
                <StyledTableRow hover key={faculty_member.name} onClick={(event) => handleClick(event, faculty_member.id)}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{faculty_member.name}</StyledTableCell>
                  <StyledTableCell align="center">{faculty_member.designation}</StyledTableCell>
                  <StyledTableCell align="center">{faculty_member.email}</StyledTableCell>
                  <StyledTableCell align="center">{faculty_member.phone}</StyledTableCell>
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
          <Typography component="h2" color="primary" gutterBottom>Please select a Faculty Member to check the details</Typography>
        </div>
        :
        <div>
          <Paper className={classes.paper} elevation={6}>
            <Box display="flex" p={1} bgcolor="background.paper">
                <Box p={1} flexGrow={1}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>{faculty_members[getIndex(facultyMemberSelected)].name}</Typography>
                </Box>
                <Box p={1}>
                  <Button variant="contained" color="primary" onClick={(event) => editFacultyDialog(event, faculty_members[getIndex(facultyMemberSelected)].id)}>Edit</Button>
                </Box>
                <Box p={1}>
                  <Button variant="contained" className={classes.deleteButton} onClick={(event) => deleteFaculty(event, faculty_members[getIndex(facultyMemberSelected)].id)}>Delete</Button>
                </Box>
            </Box>
            <br></br>
            <Table size="small">
              <TableBody>
                  <StyledTableRow  key={1}>
                    <StyledTableCell align="left">Faculty Name: {faculty_members[getIndex(facultyMemberSelected)].faculty_name}</StyledTableCell>
                    <StyledTableCell align="left">Designation: {faculty_members[getIndex(facultyMemberSelected)].designation}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={2}>
                    <StyledTableCell align="left">Email: {faculty_members[getIndex(facultyMemberSelected)].email}</StyledTableCell>
                    <StyledTableCell align="left">Phone: {faculty_members[getIndex(facultyMemberSelected)].phone}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={3}>
                    <StyledTableCell align="left">Address: {faculty_members[getIndex(facultyMemberSelected)].address}</StyledTableCell>
                    <StyledTableCell align="left">Date of Birth: {faculty_members[getIndex(facultyMemberSelected)].dob.substring(0,10)}</StyledTableCell>
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
                    id="designation"
                    label="Designation"
                    name="designation"
                    autoComplete="designation"
                    value={designation}
                    onChange={(e) => {
                      setDesignation(e.target.value);
                    }}
                  />
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
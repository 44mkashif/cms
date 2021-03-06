import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const authToken = localStorage.getItem('x-auth-token');
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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function FacultyMemberForm() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const [name, setName] = useState("");
  const [faculty_name, setFacultyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(currentDate);
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addFacultyMember = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    Axios.post('http://localhost:4000/api/faculty-member', {
      name: name,
      faculty_name: faculty_name,
      phone: phone,
      email: email,
      password: password,
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
        setSuccessMessage("Faculty Member Added Successfuly");
        console.log(response.data);
        window.location.href="/admin/faculty_members";
      }
    }).catch((e) => {
      if (e.response && e.response.data) {
        const errorMessage = e.response.data.err || e.response.data.message;
        console.log(e.response);
        setErrorMessage(errorMessage);
      }
    })
  }

  const retrieveFaculties = () => {
    faculties = [];
  
    Axios.get(`http://localhost:4000/api/faculty`, {})
    .then((response) => {
      if(response.status == 200) {
        faculties = response.data.data;
            
        setLoading(false);
        console.log(faculties);
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveFaculties();

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={6}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Add Faculty Member</Typography>
        {loading ? <div>Loading...</div>
          :
          <Grid container>
            <Grid item xs={2} sm={2} md={2}></Grid>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item xs={8} sm={8} md={8} container direction="column" alignItems="center" justify="center" square>
                <div>
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      autoComplete="contact-email"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="address"
                      label="address"
                      name="Address"
                      autoComplete="address"
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
                      label="designation"
                      name="Designation"
                      autoComplete="designation"
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
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={addFacultyMember}
                    >
                      Add Faculty
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
                </div>
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={2} sm={2} md={2}></Grid>
          </Grid>

        }
        <br></br>
      </Paper>
      <Box className={classes.fixedHeight}></Box>
    </React.Fragment>
  );
}
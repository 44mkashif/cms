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
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

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
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function FacultyForm() {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [location, setLocation] = useState(" ");
  const [contact_phone, setContactPhone] = useState("");
  const [contact_email, setContactEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addFaculty = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    Axios.post('http://localhost:4000/api/faculty', {
      name: name,
      location: location,
      contact_phone: contact_phone,
      contact_email: contact_email,
    }, {
      headers: {
        'x-auth-token': authToken
      },
    }).then((response) => {
      console.log(response);
      if(response.data.success) {
        setSuccessMessage("Faculty Added Successful");
        console.log(response.data);
        window.location.href="/admin/faculties";
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
        <Typography component="h2" variant="h6" color="primary" gutterBottom>Add Faculty</Typography>
        <Grid container>
          <Grid item xs={2} sm={2} md={2}></Grid>
          <Grid item xs={8} sm={8} md={8} container direction="column" alignItems="center" justify="center" square>
            <div>
              <form className={classes.form} noValidate>
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
                  id="location"
                  label="Location"
                  name="location"
                  autoComplete="location"
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
                {/* <TextField
                  classes={{ root: classes.root }}
                  select
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="userRoles"
                  id="userRoles"
                  variant="outlined"
                  label="Faculty Dean"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </TextField> */}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="contact_phone"
                  label="Contact No."
                  name="contact_phone"
                  autoComplete="contact-phone"
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="contact_email"
                  label="Contact Email Address"
                  name="contact_email"
                  autoComplete="contact-email"
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={addFaculty}
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
                {/* <Box mt={5}>
                  <Copyright />
                </Box> */}
              </form>
            </div>
          </Grid>
          <Grid item xs={2} sm={2} md={2}></Grid>
        </Grid>
        <br></br>
      </Paper>
      <Box className={classes.fixedHeight}></Box>
    </React.Fragment>
  );
}
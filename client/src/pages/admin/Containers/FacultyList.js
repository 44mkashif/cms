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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

const faculty_id = localStorage.getItem('id');
const authToken = localStorage.getItem('x-auth-token');
var faculties = [];
var facultiesWithDean = [];
var facultyMembers = [];

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

export default function FacultyList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [facultySelected, setFacultySelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState(" ");
  const [dean_id, setDeanId] = useState();
  const [contact_phone, setContactPhone] = useState("");
  const [contact_email, setContactEmail] = useState("");

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
    facultiesWithDean.forEach((faculty, index) => {
      if (name == faculty.name) {
        res = index;
      }
    });
    return res;
  }

  const handleClick = (event, faculty_name) => {
      setIsSelected(true);
      setFacultySelected(faculty_name);
      retrieveFacultyMembers(faculty_name);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const retrieveFacultyMembers= (faculty_name) => {
    facultyMembers = [];
    Axios.get(`http://localhost:4000/api/faculty/${faculty_name}/members`, {})
    .then((response) => {
      if(response.status == 200){
        const faculty = response.data.data;
        console.log(faculty);
        facultyMembers = faculty.faculty_members;
        setName(faculty.name);
        setLocation(faculty.location);
        setDeanId(faculty.dean_id);
        setContactPhone(faculty.contact_phone);
        setContactEmail(faculty.contact_email);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }
  
  const editFacultyDialog = (event, faculty_name) => {
    event.stopPropagation();
    console.log('clicked');
    setOpen(true);
  }

  const editFaculty = () => {
    setOpen(false);
    console.log('Dialog closed');
    Axios.put(`http://localhost:4000/api/faculty/${name}`, {
      name: name,
      location: location,
      dean_id: dean_id,
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
        window.location.href="/admin/Faculties";
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
          <Paper className={classes.paper} elevation={6}>
            <Box display="flex" p={1} bgcolor="background.paper">
                <Box p={1} flexGrow={1}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>{facultiesWithDean[getIndex(facultySelected)].name}</Typography>
                </Box>
                <Box p={1}>
                  <Button variant="contained" color="primary" onClick={(event) => editFacultyDialog(event, facultiesWithDean[getIndex(facultySelected)].name)}>Edit</Button>
                </Box>
                <Box p={1}>
                  <Button variant="contained" className={classes.deleteButton} onClick={(event) => deleteFaculty(event, facultiesWithDean[getIndex(facultySelected)].name)}>Delete</Button>
                </Box>
            </Box>
            <br></br>
            <Table size="small">
              <TableBody>
                  <StyledTableRow  key={1}>
                    <StyledTableCell align="left">Dean: {facultiesWithDean[getIndex(facultySelected)].dean_id ? facultiesWithDean[getIndex(facultySelected)].dean.name : 'N/A'}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={2}>
                    <StyledTableCell align="left">Location: {facultiesWithDean[getIndex(facultySelected)].location ? facultiesWithDean[getIndex(facultySelected)].location : 'N/A'}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={3}>
                    <StyledTableCell align="left">Contact Email: {facultiesWithDean[getIndex(facultySelected)].contact_email}</StyledTableCell>
                  </StyledTableRow >
                  <StyledTableRow  key={4}>
                    <StyledTableCell align="left">Contact Phone: {facultiesWithDean[getIndex(facultySelected)].contact_phone}</StyledTableCell>
                  </StyledTableRow >
              </TableBody>
            </Table>
            <br></br>
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
              <TableBody>
                {facultyMembers.map((faculty_member, index) => (
                  <StyledTableRow hover key={faculty_member.name} >
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{faculty_member.name}</StyledTableCell>
                    <StyledTableCell align="center">{faculty_member.designation}</StyledTableCell>
                    <StyledTableCell align="center">{faculty_member.email}</StyledTableCell>
                    <StyledTableCell align="center">{faculty_member.phone}</StyledTableCell>
                  </StyledTableRow >
                ))}
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
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Edit Faculty</DialogTitle>
            <DialogContent>
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
                  value={name}
                  autoFocus
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
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                />
                <TextField
                  classes={{ root: classes.root }}
                  select
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="userRoles"
                  id="userRoles"
                  variant="outlined"
                  label="Faculty Dean"
                  value={dean_id}
                  onChange={(e) => {
                    setDeanId(e.target.value);
                  }}
                >
                  <MenuItem value={null}>
                    <em>None</em>
                  </MenuItem>
                  {facultyMembers.map((facultyMember, index) => (
                    <MenuItem value={facultyMember.id}>{facultyMember.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="contact_phone"
                  label="Contact No."
                  name="contact_phone"
                  autoComplete="contact-phone"
                  value={contact_phone}
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
                  value={contact_email}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
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
        </div>
      }
    </React.Fragment>
  );
}
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundImage: 'url(https://www.bird-wittenbergdental.com/wp-content/uploads/2017/01/top-line-management-login-background-1.jpg)',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '30vh'
  },
  button: {
    margin: theme.spacing(5, 3, 5),
    height: '20vh',
    width: '20vh'
  },
  text: {
    margin: theme.spacing(0, 0, 5),
  }
}));

function App() {

  const classes = useStyles();

  return (
    <div className="App">
      <Grid container alignItems="center" justify="center" component="main" className={classes.root}>
        <CssBaseline />
        <Grid item elevation={6}>
          <div className={classes.paper}>
          <Grid container justify="center" className={classes.text}>
              <Typography component="h1" variant="h2">
                Campus Management System
              </Typography>
            </Grid>
            <Grid container justify="center">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                component={Link} to="/student/login"
              >
                Student Portal
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                component={Link} to="/faculty_member/login"
              >
                Instructor Portal
              </Button>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>

  );
}

export default App;

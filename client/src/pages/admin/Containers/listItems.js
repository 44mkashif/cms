import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SchoolIcon from '@material-ui/icons/School';
import PersonIcon from '@material-ui/icons/Person';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/admin/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to="/admin/faculties">
      <ListItemIcon>
        <SchoolIcon />
      </ListItemIcon>
      <ListItemText primary="Faculties" />
    </ListItem>
    <ListItem button component={Link} to="/admin/faculty_members">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Faculty Members" />
    </ListItem>
    <ListItem button component={Link} to="/admin/students">
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Students" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    {/* <ListSubheader inset>Saved reports</ListSubheader> */}
    <ListItem button component={Link} to="/admin/add_faculty">
      <ListItemIcon>
        <AddCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Add Faculty" />
    </ListItem>
    <ListItem button component={Link} to="/admin/add_faculty_member">
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Add Faculty Member" />
    </ListItem>
    <ListItem button component={Link} to="/admin/add_student">
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Add Student" />
    </ListItem>
  </div>
);
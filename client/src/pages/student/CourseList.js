import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Axios from 'axios';

const reg_no = localStorage.getItem('reg-no');
var sections = [];
var courses = [];
var faculty_members = [];

export default function CourseList() {
  const [loading, setLoading] = useState(true);

  const retrieveFacultyMembers = (faculty_member_id) => {
    return new Promise((resolve, reject) => {
      Axios.get(`http://localhost:4000/api/faculty-member/${faculty_member_id}`, {})
      .then((response) => {
        if(response.status == 200){
          faculty_members.push(response.data.data);
          console.log(faculty_members);
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

  const retrieveCourses = () => {
    sections = [];
    courses = [];
    faculty_members = [];
  
    Axios.get(`http://localhost:4000/api/student/${reg_no}/courses`, {})
    .then((response) => {
      if(response.status == 200) {
        const student = response.data.data;
        
        const enrollments = student.enrollments;
  
        enrollments.forEach(enrollment => {
          sections.push(enrollment.section);
        });

        var facultyMemberIds = [];
        sections.forEach(section => {
          courses.push(section.course);
          facultyMemberIds.push(section.faculty_member_id);
        });

        let requests = [];
        facultyMemberIds.forEach(facultyMemberId => {
          requests.push(retrieveFacultyMembers(facultyMemberId));
        });
        console.log(sections);
        console.log(courses);
        
        Promise.all(requests).then(() => {
          setLoading(false);
        })
      }
    }).catch((e) => {
      console.log(e);
    });
  }

  if (loading) retrieveCourses();

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>Courses</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">S#</TableCell>
            <TableCell align="center">Course Code</TableCell>
            <TableCell align="center">Course Title</TableCell>
            <TableCell align="center">Section</TableCell>
            <TableCell align="center">Credit Hours</TableCell>
            <TableCell align="center">Faculty</TableCell>
          </TableRow>
        </TableHead>
        {loading ? <div>Loading...</div>
          :
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{course.course_code}</TableCell>
                <TableCell align="center">{course.name}</TableCell>
                <TableCell align="center">{sections[index].name}</TableCell>
                <TableCell align="center">{course.credit_hours}</TableCell>
                <TableCell align="center">
                  {faculty_members[index].name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        }
      </Table>
      <br></br>
    </React.Fragment>
  );
}
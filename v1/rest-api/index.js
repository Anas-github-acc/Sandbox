const express = require('express');

const app = express();
const port = 3000;

app.get('/api/student', (req, res) => {
  const studentDetails = {
    id: 1,
    name: 'John Doe',
    age: 21,
    course: 'Computer Science'
  };
  res.json(studentDetails);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname, 'client/build')));


app.get('/api', (req, res) => {
  res.json({ message: "Hello from the server!" });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

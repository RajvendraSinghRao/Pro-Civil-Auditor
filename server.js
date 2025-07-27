const express = require("express");
const multer = require("multer");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
const upload = multer();
app.use(cors());

const EXCEL_FILE = "data.xlsx";

if (!fs.existsSync(EXCEL_FILE)) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, EXCEL_FILE);
}

app.post("/submit", upload.none(), (req, res) => {
  const formData = req.body;

  const workbook = XLSX.readFile(EXCEL_FILE);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  data.push({
    Name: formData.Name,
    Email: formData.Email,
    Password: formData.Password,
    Mobile: formData.Mobile,
    Course: formData.Course,
  });

  const newSheet = XLSX.utils.json_to_sheet(data);
  workbook.Sheets[sheetName] = newSheet;
  XLSX.writeFile(workbook, EXCEL_FILE);

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

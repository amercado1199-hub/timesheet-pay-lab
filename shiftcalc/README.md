# ShiftCalc

## Description

ShiftCalc is a React application that helps users track work shifts, calculate regular and overtime pay, save shift data using localStorage, export shift records as a CSV file, and view upcoming U.S. public holidays using an external API.

This application was built as a single-page React application using React Router, React Hooks, and asynchronous API requests.

---

## Features

* Add and track work shifts
* Calculate regular hours and overtime hours
* Calculate total pay based on hourly rate
* Save shift history using localStorage
* Delete individual shifts
* Clear all saved shifts
* Export shift records to CSV
* View upcoming U.S. public holidays
* Responsive design for desktop and mobile devices
* Loading, error, and empty states

---

## Technologies Used

* React
* React Router
* JavaScript
* HTML
* CSS
* Vite

---

## API Used

Nager.Date Public Holiday API

Endpoint:

https://date.nager.at/api/v3/NextPublicHolidays/US

The API is used to retrieve upcoming U.S. public holidays and display them dynamically on the Holidays page.

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate into the project folder:

```bash
cd shiftcalc
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

---

## Project Structure

```text
src/
├── App.jsx
├── main.jsx
├── index.css
```

---

## Future Improvements

* OCR time card scanning with Tesseract.js
* Weekly and monthly reports
* Tax estimation calculator
* Multiple employee support
* User authentication
* Cloud data storage

---

## Author

Alyssa Mercado

Software Engineer

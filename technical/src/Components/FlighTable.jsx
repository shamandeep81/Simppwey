
import React, { useState } from "react";
import { TextField, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button } from "@mui/material";
import flights from "../data";
import TablePagination from '@mui/material/TablePagination';
import Papa from 'papaparse';
import { TableSortLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FilterListIcon from "@mui/icons-material/FilterList";
import '../App.css';

const ITEMS_PER_PAGE = 30;

const FlightTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE); // Add this state
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterFlightNumber, setFilterFlightNumber] = useState(""); // Flight Number filter
    const [filterDepartureAirport, setFilterDepartureAirport] = useState(""); // Departure Airport filter

    const filteredFlights = flights.filter((flight) =>
    (flight.flight_number.toString().includes(searchQuery) ||
      flight.departure_airport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival_airport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.departure_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.departure_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.passenger_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.seat_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flight.flight_duration + "").toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    flight.flight_number.toString().includes(filterFlightNumber) &&
    flight.departure_airport.toLowerCase().includes(filterDepartureAirport.toLowerCase())
  );
  
    const totalFilteredFlights = filteredFlights.length;
    const totalPages = Math.ceil(totalFilteredFlights / ITEMS_PER_PAGE);

    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentFlights = filteredFlights.slice(startIndex, endIndex);


    // const filteredCurrentFlights = currentFlights.filter((flight) =>
    //   flight.flight_number.toString().includes(searchQuery) ||
    //   flight.departure_airport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   flight.arrival_airport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   flight.departure_date.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //   flight.departure_time.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //   flight.arrival_date.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //   flight.arrival_time.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //   flight.passenger_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //   flight.seat_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    //   (flight.flight_duration + "").toLowerCase().includes(searchQuery.toLowerCase())

    // );

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0); // Reset page when rows per page changes
    };

    const handleExportCSV = () => {
        const csvData = Papa.unparse(filteredFlights); // Convert filteredFlights to CSV format
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "flight_data.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const handleSortRequest = (property) => {
        const isAsc = sortBy === property && sortOrder === "asc";
        setSortBy(property);
        setSortOrder(isAsc ? "desc" : "asc");
    };

    const sortedFlights = [...currentFlights].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      });

    return (


        <div>
            {/* Search input */}
            <TextField
               
                label="Search Flights, Time, Airport,..."
                variant="outlined"
                value={searchQuery}
                onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(0); // Reset page when search query changes
                }}
                fullWidth
                style={{ marginLeft: "10%", marginBottom: "1rem", width: "30%", marginLeft: "auto", borderRadius: "50%" }}
            />

            <button

                variant="contained"
                style={{ width: "10%", marginLeft: "10%", backgroundColor: "#85E6C5", color: "white" }} // Set background color and text color
                onClick={handleExportCSV}
            >Export to CSV</button>


            <TableContainer component={Paper}>

            <div style={{ display: "flex", marginBottom: "1rem" }}>
    {/* Flight Number Filter */}
    <div style={{ width: "15%", marginRight: "1rem" }}>
        <TextField
          
            variant="outlined"
            value={filterFlightNumber}
            onChange={(event) => {
                setFilterFlightNumber(event.target.value);
                setCurrentPage(0); // Reset page when filter changes
            }}
            fullWidth

            placeholder="Flight No."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <FilterListIcon />
                    </InputAdornment>
                ),
            }}
        />
    </div>

    {/* Departure Airport Filter */}
    <div style={{ width: "15%", marginRight: "1rem" }}>
        <TextField
           
            variant="outlined"
            value={filterDepartureAirport}
            onChange={(event) => {
                setFilterDepartureAirport(event.target.value);
                setCurrentPage(0); // Reset page when filter changes
            }}
            fullWidth
            placeholder="Departure Airport"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <FilterListIcon />
                    </InputAdornment>
                ),
            }}
        />
    </div>
</div>

                <Table>
                    <TableHead>

                        <TableRow>
                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "flight_number"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("flight_number")}
                            >
                                Flight Number
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "departure_airport"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("departure_airport")}
                            >
                                Departure Airport
                            </TableSortLabel></TableCell>




                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "arrival_airport"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("arrival_airport")}
                            >
                                Flight Number
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "departure_date"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("departure_date")}
                            >
                                Departure Date
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "departure_time"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("departure_time")}
                            >
                                Departure Time
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "arrival_date"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("arrival_date")}
                            >
                                Arrival Date
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "arrival_time"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("arrival_time")}
                            >
                                Arrival Time
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "passenger_name"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("passenger_name")}
                            >
                                Passenger Name
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "seat_number"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("seat_number")}
                            >
                                Seat Number
                            </TableSortLabel></TableCell>


                            <TableCell className="table-heading"><TableSortLabel
                                active={sortBy === "flight_duration"}
                                direction={sortOrder}
                                onClick={() => handleSortRequest("flight_duration")}
                            >
                                Flight Duration
                            </TableSortLabel></TableCell>


                        </TableRow>

                    </TableHead>
                    <TableBody> 

                            {sortedFlights.map((flight, index) => (
                            <TableRow key={index}>
                                <TableCell>{flight.flight_number}</TableCell>
                                <TableCell>{flight.departure_airport}</TableCell>
                                <TableCell>{flight.arrival_airport}</TableCell>
                                <TableCell>{flight.departure_date}</TableCell>
                                <TableCell>{flight.departure_time}</TableCell>
                                <TableCell>{flight.arrival_date}</TableCell>
                                <TableCell>{flight.arrival_time}</TableCell>
                                <TableCell>{flight.passenger_name}</TableCell>
                                <TableCell>{flight.seat_number}</TableCell>
                                <TableCell>{flight.flight_duration}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 30, 50, 100]}
                component="div"

                count={totalFilteredFlights}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange} // Add this
            />

        </div>
    );
};

export default FlightTable;

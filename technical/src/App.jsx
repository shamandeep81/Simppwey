import React from "react";
import { Container } from "@mui/material";
import FlightTable from "./Components/FlighTable";

function App() {
  return (
    <Container>
      <h1>Flight Data</h1>
      <FlightTable />
    </Container>
  );
}

export default App;

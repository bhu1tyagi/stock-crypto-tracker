import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Table,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [data, setData] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const intervalId = useRef(null);

  const fetchData = useCallback(
    async (symbol) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/getData/${symbol}`,
          {
            params: { limit: 10, page },
          }
        );
        setData(response.data.data);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    },
    [page]
  ); // Include 'page' as dependency

  const fetchSymbols = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/symbols");
      setSymbols(response.data);
    } catch (error) {
      console.error("Error fetching symbols", error);
    }
  };

  const handleSymbolChange = (symbol, event) => {
    event.preventDefault();
    setCurrentSymbol(symbol);
    setShow(false);
  };

  useEffect(() => {
    fetchSymbols();
    fetchData(currentSymbol);

    clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      fetchData(currentSymbol);
    }, 5000);

    return () => clearInterval(intervalId.current);
  }, [currentSymbol, page, fetchData]);

  return (
    <div className="container mt-5">
      <h1>{currentSymbol} Data Tracker</h1>
      <Button variant="primary" onClick={() => setShow(true)}>
        Change Symbol
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Symbol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Symbol</Form.Label>
              <DropdownButton
                id="dropdown-item-button"
                title={currentSymbol || "Select Symbol"}
              >
                {symbols.map((sym) => (
                  <Dropdown.Item
                    as="button"
                    key={sym}
                    onClick={(e) => handleSymbolChange(sym, e)}
                  >
                    {sym}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Price (USD)</th>
            <th>All-Time High (USD)</th>
            <th>Volume</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry._id}>
              <td>${entry.price ? entry.price.toFixed(2) : "N/A"}</td>
              <td>
                ${entry.allTimeHigh ? entry.allTimeHigh.toFixed(2) : "N/A"}
              </td>
              <td>{entry.volume ? entry.volume.toLocaleString() : "N/A"}</td>
              <td>
                {entry.timestamp
                  ? new Date(entry.timestamp).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <Button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : totalPages))
          }
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default App;

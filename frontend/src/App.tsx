import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  fetchData,
  selectData,
  selectSymbols,
  selectCurrentSymbol,
  selectShow,
  selectPage,
  selectTotalPages,
  setCurrentSymbol,
  setShow,
  setPage,
  setSymbols,
} from "./redux/dataSlice";
import { AppDispatch } from "./redux/store";

function App() {
  const data = useSelector(selectData);
  const symbols = useSelector(selectSymbols);
  const currentSymbol = useSelector(selectCurrentSymbol);
  const show = useSelector(selectShow);
  const page = useSelector(selectPage);
  const totalPages = useSelector(selectTotalPages);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchDataForSymbol = () => {
      dispatch(fetchData({ symbol: currentSymbol, page }));
    };

    fetchDataForSymbol();

    const interval = setInterval(fetchDataForSymbol, 2000);

    return () => clearInterval(interval);
  }, [dispatch, currentSymbol, page]);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get<string[]>(
          "http://localhost:3001/api/symbols"
        );
        dispatch(setSymbols(response.data));
      } catch (error) {
        console.error("Error fetching symbols", error);
      }
    };
    fetchSymbols();
  }, [dispatch]); // Fetch symbols once on mount

  const handleSymbolChange = (
    symbol: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    dispatch(setCurrentSymbol(symbol));
    dispatch(setShow(false));
  };

  return (
    <div className="container mt-5">
      <h1>{currentSymbol || "Select a Symbol"} Data Tracker</h1>
      <Button variant="primary" onClick={() => dispatch(setShow(true))}>
        Change Symbol
      </Button>

      <Modal show={show} onHide={() => dispatch(setShow(false))}>
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
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleSymbolChange(sym, e)
                    }
                  >
                    {sym}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(setShow(false))}>
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
          onClick={() => dispatch(setPage(Math.max(page - 1, 1)))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <Button
          onClick={() => dispatch(setPage(Math.min(page + 1, totalPages)))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default App;

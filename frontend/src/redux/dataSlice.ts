import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { DataEntry, APIResponse } from '../types/types';
import { RootState } from './store';

interface DataState {
  data: DataEntry[];
  symbols: string[];
  currentSymbol: string;
  show: boolean;
  page: number;
  totalPages: number;
}

const initialState: DataState = {
  data: [],
  symbols: [],
  currentSymbol: '',
  show: false,
  page: 1,
  totalPages: 0
};

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async ({ symbol, page }: { symbol: string; page: number }, { dispatch }) => {
    try {
      const response = await axios.get<APIResponse>(`http://localhost:3001/api/getData/${symbol}`, {
        params: { limit: 10, page },
      });
      dispatch(setData(response.data.data));
      dispatch(setTotalPages(response.data.pages));
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  }
);

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataEntry[]>) => {
      state.data = action.payload;
    },
    setSymbols: (state, action: PayloadAction<string[]>) => {
      state.symbols = action.payload;
    },
    setCurrentSymbol: (state, action: PayloadAction<string>) => {
      state.currentSymbol = action.payload;
    },
    setShow: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
  }
});

export const { setData, setSymbols, setCurrentSymbol, setShow, setPage, setTotalPages } = dataSlice.actions;
export const selectData = (state: RootState) => state.data.data;
export const selectSymbols = (state: RootState) => state.data.symbols;
export const selectCurrentSymbol = (state: RootState) => state.data.currentSymbol;
export const selectShow = (state: RootState) => state.data.show;
export const selectPage = (state: RootState) => state.data.page;
export const selectTotalPages = (state: RootState) => state.data.totalPages;

export default dataSlice.reducer;

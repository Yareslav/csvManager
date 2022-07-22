import { createSlice } from "@reduxjs/toolkit";

export const statuses = {
  default: "Status",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const types = {
  withdrawal: "Withdrawal",
  refill: "Refill",
  default: "Type",
};

export const modalWindowMods = {
  none: "none",
  edit: "edit",
  delete: "delete",
  insertFile: "insertFile",
};

function activateOrDisableFilters(state) {
  if (state.status === statuses.default && state.type === types.default)
    state.filterIsOn = false;
  else state.filterIsOn = true;
}

const transitionSlice = createSlice({
  name: "transitionSlice",
  initialState: {
    transactions: [],
    filteredTransactions: [],
    filterIsOn: false,

    totalPages: null,
    currentPage: 1,

    status: statuses.default,
    type: types.default,

    loadingError: false,
    loading: false,
    readingFileError: false,
    modalWindowMode: modalWindowMods.none,

    selectedFileId: null,
  },
  reducers: {
    loadTransactions: (state, { payload }) => {
      state.transactions = payload;
      state.loadingError = false;
      state.loading = false;
    },

    importTransitions: (state, { payload }) => {
      state.transactions = payload;
      state.readingFileError = false;
    },

    changePage: (state, { payload }) => {
      state.currentPage = payload;
    },

    changeStatus: (state, { payload }) => {
      state.status = payload;
      activateOrDisableFilters(state);
    },

    changeType: (state, { payload }) => {
      state.type = payload;
      activateOrDisableFilters(state);
    },

    startLoading: (state) => {
      state.loading = true;
    },

    loadingErrorOccurred: (state) => {
      state.loading = false;
      state.loadingError = true;
    },

    readingFileErrorOccurred: () => {
      state.readingFileError = true;
    },

    disableReadingFileError: () => {
      state.readingFileError = false;
    },

    filterTransitions: (state) => {
      if (!state.filterIsOn) return;
    },

    changeModalWindowType: (state, { payload }) => {
      state.modalWindowMode = payload;
    },

    deleteTransition: (state) => {},

    editTransitionStatus: (state, { payload }) => {},
  },
});

export const {
  changeStatus,
  changeType,
  loadTransactions,
  startLoading,
  loadingErrorOccurred,
  filterTransitions,
  changeModalWindowType,
  deleteTransition,
  editTransitionStatus,
  readingFileErrorOccurred
} = transitionSlice.actions;

export default transitionSlice.reducer;

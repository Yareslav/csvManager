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
  export: "export",
};

export const maxTransactionOnOnePage = 10;

function addingTransitions(state, payload) {
  state.transactionHashTable = {};
  payload.forEach((value) => {
    state.transactionHashTable[value.transactionId] = value;
  });

  state.filteredTransactionHashTable = {};
  state.status = statuses.default;
  state.type = types.default;
  state.areFiltersOn = false;

  state.currentPage = 0;
  state.totalPages = calculatePagesLength(payload);
}

function reduceIfPossibleTotalPagesLength(state) {
  //! corrects bug when all elements disappear from certain page, but the page doesn`t disappear
  state.totalPages = calculatePagesLength(
    Object.keys(
      state.areFiltersOn
        ? state.filteredTransactionHashTable
        : state.transactionHashTable
    )
  );

  if (state.currentPage !== 0 && state.currentPage === state.totalPages) {
    state.currentPage--;
  }
}

function calculatePagesLength(array) {
  return Math.ceil(array.length) / maxTransactionOnOnePage;
}

const transitionSlice = createSlice({
  name: "transitionSlice",
  initialState: {
    //! main data , hash table was used here
    transactionHashTable: {},
    filteredTransactionHashTable: {},
    //! page info
    totalPages: 1,
    currentPage: 0,
    //! filters
    status: statuses.default,
    type: types.default,
    areFiltersOn: false,
    //! modal window (popup) data
    modalWindowMode: modalWindowMods.none,
    selectedTransitionId: "",

    //! loading main data indicators
    loadingError: false,
    loading: false,
    readingFileError: false,
    //! these are columns that will be placed in file and exported to user
    exportColumns: {
      transitionId: {
        checked: false,
        displayName: "Id",
      },
      status: {
        checked: false,
        displayName: "Status",
      },
      type: {
        checked: true,
        displayName: "Type",
      },
      clientName: {
        checked: true,
        displayName: "Client name",
      },
      amount: {
        checked: true,
        displayName: "Amount",
      },
    },
  },
  reducers: {
    loadTransactions: (state, { payload }) => {
      state.loadingError = false;
      state.loading = false;

      addingTransitions(state, payload);
    },

    importTransitions: (state, { payload }) => {
      state.readingFileError = false;

      addingTransitions(state, payload);
    },

    changePage: (state, { payload }) => {
      state.currentPage = payload;
    },

    changeStatus: (state, { payload }) => {
      state.status = payload;
    },

    changeType: (state, { payload }) => {
      state.type = payload;
    },

    startLoading: (state) => {
      state.loading = true;
    },

    loadingErrorOccurred: (state) => {
      state.loading = false;
      state.loadingError = true;
    },

    readingFileErrorOccurred: (state) => {
      state.readingFileError = true;
    },

    disableReadingFileError: (state) => {
      state.readingFileError = false;
    },

    changeModalWindowType: (state, { payload }) => {
      state.modalWindowMode = payload;
    },

    deleteTransition: (state) => {
      const id = state.selectedTransitionId;
      delete state.transactionHashTable[id];
      delete state.filteredTransactionHashTable[id];
      state.selectedTransitionId = "";

      reduceIfPossibleTotalPagesLength(state);
    },

    editTransitionStatus: (state, { payload }) => {
      const id = state.selectedTransitionId;
      state.transactionHashTable[id].status = payload;

      if (state.areFiltersOn) {
        //! if filtering by status is enabled after editing , we delete this item from filteredTransactionHashTable
        if (payload !== state.status && state.status !== statuses.default) {
          delete state.filteredTransactionHashTable[id];

          reduceIfPossibleTotalPagesLength(state);
        } else {
          state.filteredTransactionHashTable[id].status = payload;
        }

        state.selectedTransitionId = "";
      }
    },

    filterTransactions: (state) => {
      //! settings filters
      const filterData = getFilters();

      function performFiltering() {
        const transactionValues = Object.values(state.transactionHashTable);

        state.filteredTransactionHashTable = {};

        //! we go across  transactionHashTable array and find if an element is suitable for filters
        //! , we add it to filteredTransactionHashTable

        transactionValues.forEach((transaction) => {
          const isAppropriate = filterData.every(([key, data]) => {
            return transaction[key] === data;
          });

          if (isAppropriate)
            state.filteredTransactionHashTable[transaction.transactionId] =
              transaction;
        });

        state.totalPages = calculatePagesLength(
          Object.keys(state.filteredTransactionHashTable)
        );
        state.areFiltersOn = true;
      }

      function getFilters() {
        const filters = {};
        if (state.type !== types.default) filters.type = state.type;
        if (state.status !== statuses.default) filters.status = state.status;
        return Object.entries(filters);
      }

      state.currentPage = 0;

      //! if there are no filters
      if (filterData.length === 0) {
        state.areFiltersOn = false;

        state.totalPages = calculatePagesLength(
          Object.keys(state.transactionHashTable)
        );

        return;
      }

      performFiltering();
    },

    setSelectedTransitionId: (state, { payload }) => {
      state.selectedTransitionId = payload;
    },

    changeExportColumns: (state, { payload }) => {
      state.exportColumns[payload].checked =
        !state.exportColumns[payload].checked;
    },
  },
});

export const {
  changeStatus,
  changeType,
  loadTransactions,
  startLoading,
  loadingErrorOccurred,
  changeModalWindowType,
  deleteTransition,
  editTransitionStatus,
  readingFileErrorOccurred,
  disableReadingFileError,
  importTransitions,
  changePage,
  filterTransactions,
  setSelectedTransitionId,
  changeExportColumns,
} = transitionSlice.actions;

export default transitionSlice.reducer;

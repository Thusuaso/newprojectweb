const state = {
  mekmarLoadMonths: [],
  mekmarBdLoadMonths: [],
  mekmarTotalLoadMonths: [],
  byCustomersProduct: [],
  byMarketingLoadMonth: [],
  byMarketingProduct: [],
  byMarketingWarehouseLoad: [],
  byMarketingLoadMonthDetail: [],
};

const actions = {
  mekmarLoadMonthsAct({ commit }, data) {
    commit("mekmarLoadMonthsMut", data);
  },
  mekmarTotalLoadMonthsAct({ commit }, data) {
    commit("mekmarTotalLoadMonthsMut", data);
  },
  byCustomersProductAct({ commit }, data) {
    commit("byCustomersProductMut", data);
  },
  byMarketingLoadMonthAct({ commit }, data) {
    commit("byMarketingLoadMonthMut", data);
  },
};

const mutations = {
  mekmarLoadMonthsMut(state, data) {
    state.mekmarBdLoadMonths = data.data.marketingBd;
    state.mekmarLoadMonths = data.data.marketingYuklemeAylik;
  },
  mekmarTotalLoadMonthsMut(state, data) {
    state.mekmarTotalLoadMonths = data;
  },
  byCustomersProductMut(state, data) {
    state.byCustomersProduct = data;
  },
  byMarketingLoadMonthMut(state, data) {
    state.byMarketingLoadMonth = data.data.marketingYukleme;
    state.byMarketingProduct = data.data.marketingUretim;
    state.byMarketingWarehouseLoad = data.data.marketingDepo;
    state.byMarketingLoadMonthDetail = data.data.marketingYuklemeDetail;
  },
};

const getters = {
  mekmarLoadMonths(state) {
    return state.mekmarLoadMonths;
  },
  mekmarBdLoadMonths(state) {
    return state.mekmarBdLoadMonths;
  },
  mekmarTotalLoadMonths(state) {
    return state.mekmarTotalLoadMonths;
  },
  byCustomersProduct(state) {
    return state.byCustomersProduct;
  },
  byMarketingLoadMonth(state) {
    return state.byMarketingLoadMonth;
  },
  byMarketingProduct(state) {
    return state.byMarketingProduct;
  },
  byMarketingWarehouseLoad(state) {
    return state.byMarketingWarehouseLoad;
  },
  byMarketingLoadMonthDetail(state) {
    return state.byMarketingLoadMonthDetail;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

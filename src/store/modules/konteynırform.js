const state = {
  data: null,
  nakliyeAyrinti: null,
  nakliye_data_list: null,
};

const actions = {
  konteyner_yukle_act({ commit }, data) {
    commit("konteyner_yukle_mut", data);
  },
  nakliye_yukle_act({ commit }, data) {
    commit("nakliye_yukle_mut", data);
  },
  nakliye_data_list_yukle_act({ commit }, data) {
    commit("nakliye_data_list_yukle_mut", data);
  },
};

const mutations = {
  konteyner_yukle_mut(state, data) {
    state.data = data[0];
  },
  nakliye_yukle_mut(state, data) {
    state.nakliyeAyrinti = data;
  },
  nakliye_data_list_yukle_mut(state, data) {
    state.nakliye_data_list = data;
  },
};

const getters = {
  data(state) {
    return state.data;
  },
  nakliyeAyrinti(state) {
    return state.nakliyeAyrinti;
  },
  nakliye_data_list(state) {
    return state.nakliye_data_list;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

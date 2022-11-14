const state = {
  tedarikciList: null,
  siparisler: null,
  isNewClicked: false,
  yuklemeList:[]
};

const actions = {
  tedarikci_list_yukle_act({ commit }, data) {
    commit("tedarikci_list_yukle_mut", data);
  },
  siparisler_list_yukle_act({ commit }, data) {
    commit("siparisler_list_yukle_mut", data);
  },
  is_new_form_click_load({ commit }, data) {
    commit("is_new_form_click_mut", data);
  },
  siparis_evrak_list_load({ commit }, data) {
    commit("siparis_evrak_list_mut", data)
  }
};

const mutations = {
  tedarikci_list_yukle_mut(state, data) {
    state.tedarikciList = data;
  },
  siparisler_list_yukle_mut(state, data) {
    state.siparisler = data;
  },
  is_new_form_click_mut(state, data) {
    state.isNewClicked = data;
  },
  is_new_form_click_reset_mut(state, data) {
    state.isNewClicked = data
  },
  siparis_evrak_list_mut(state, data) {
    state.yuklemeList = data
  }
};

const getters = {
  tedarikciList(state) {
    return state.tedarikciList;
  },
  siparisler(state) {
    return state.siparisler;
  },
  isNewClicked(state) {
    return state.isNewClicked;
  },
  yuklemeList(state) {
    return state.yuklemeList
  }
};

export default {
  state,
  actions,
  mutations,
  getters,
};

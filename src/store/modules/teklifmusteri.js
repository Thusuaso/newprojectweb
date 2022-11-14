const state = {
  musteriTeklifList: null,
  musteriTeklif: null,
  ulkeList: null,
  takvimList: null,
  enBoyList: null,
};

const actions = {
  loadTeklifMusteriList({ commit }, data) {
    commit("loadTeklifMusteriListMut", data);
  },
  loadTeklifMusteri({ commit }, data) {
    commit("loadTeklifMusteriMut", data);
  },
  guncelleMusteriList({ commit }, data) {
    commit("guncelleMusteriListMut", data);
  },
  loadTeklifYeniMusteriAct({ commit }, data) {
    commit("loadTeklifYeniMusteriMut", data);
  },

  loadTakvimListesi({ commit }, data) {
    commit("loadTakvimListesiMut", data);
  },
  loadTekliflerEnBoy({ commit }, data) {
    commit("loadTekliflerEnBoyAct", data);
  },
};

const mutations = {
  loadTeklifMusteriListMut(state, data) {
    state.musteriTeklifList = data.musteriList;
    state.ulkeList = data.ulkeList;
  },
  loadTeklifMusteriMut(state, data) {
    state.musteriTeklif = data;
  },
  loadTeklifYeniMusteriMut(state, data) {
    state.musteriTeklif = data;
  },

  loadTakvimListesiMut(state, data) {
    state.takvimList = data;
  },

  guncelleMusteriListMut(state, data) {

    for (let key in state.musteriTeklifList) {
      const item = state.musteriTeklifList[key];

      if (item.id == data.id) {

        state.musteriTeklifList[key] = data;
      }
    }
  },
  loadTekliflerEnBoyAct(state, data) {
    state.enBoyList = data;
  },
};
const getters = {
  musteriTeklifList(state) {
    return state.musteriTeklifList;
  },
  musteriTeklif(state) {
    return state.musteriTeklif;
  },
  ulkeList(state) {
    return state.ulkeList;
  },
  takvimList(state) {
    return state.takvimList;
  },
  enBoyList(state) {
    return state.enBoyList;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};

import axios from "../helpers/custom_axios";

const MusteriIslemService = {
  getMusteriListesi() {
    return axios
      .get("musteriler/listeler/musteriListesi")
      .then((res) => res.data);
  },

  getMusteriSiparisListesi() {
    return axios
      .get("musteriler/listeler/musteriSiparisListesi")
      .then((res) => res.data);
  },
  getYeniMusteriModel() {
    return axios
      .get("musteriler/listeler/yeniMusteriModel")
      .then((res) => res.data);
  },
  getMusteriDetay(id) {
    return axios
      .get("musteriler/listeler/musteriDetay/" + id)
      .then((res) => res.data);
  },
  getMusteriSiparisDetay(yil, id) {
    return axios
      .get(`/musteriler/listeler/musteri/siparisDetay/${yil}/${id}`)
      .then((res) => res.data);
  },
  musteriKaydet(item) {
    return axios
      .post("musteriler/islemler/musteriKayitIslem", item)
      .then((res) => res.data);
  },
  musteriGuncelle(item) {
    return axios
      .put("musteriler/islemler/musteriKayitIslem", item)
      .then((res) => res.data);
  },
  musteriSilme(id) {
    return axios
      .delete("musteriler/islemler/musteriKayitSilme/" + id)
      .then((res) => res.data);
  },

  getMusteriExcelListesi(data_list) {
    return axios
      .post("musteriler/dosya_islemleri/excelMusterilerDetayListesi", data_list)
      .then((res) => res.data);
  },
  setCustomerChangeFollow(customer, follow) {
    return axios
      .get("customers/follow/" + customer + "/" + follow)
      .then((res) => res.data);
  },
  getProductDetailList(sipNo) {
    return axios
      .get("customers/products/detailList/" + sipNo)
      .then((res) => res.data);
  },
};

export default MusteriIslemService;

<template>
  <section>
    <div class="card is-centered" style="weight: 25px; height: 850px">
      <div class="column is-12">
        <b-field label="Adım 1" label-position="on-border">
          <div class="card">
            <div class="columns is-multiline">
              <div class="column is-3">
                <b-field label="Firma Seçiniz" label-position="on-border">
                  <b-autocomplete
                    rounded
                    v-model="firma"
                    :data="filterFaturaList"
                    field="firma_adi"
                    placeholder="Firma Seçiniz"
                    @blur="faturaDegisim"
                    @select="(option) => (selected = option)"
                    :disabled="kaydetVisible1"
                  >
                  </b-autocomplete>
                </b-field>
              </div>

              <div class="column is-3" size="is-small">
                <b-field label="PO" label-position="on-border">
                  <b-input
                    v-model="SiparisEvrakList.siparisno"
                    :disabled="true"
                    size="is-small"
                  ></b-input>
                </b-field>
              </div>

              <div class="column is-3" size="is-small">
                <Button
                  label="+ Yeni Firma"
                  style="
                    width: 250px;
                    background-color: green;
                    font-weight: bold;
                  "
                  @click="yeniFirmaGiris"
                />
              </div>
            </div>
            <div class="columns is-multiline" style="margin-top: 75px">
              <div class="column is-1">
                <b-field label="Tarih" label-position="on-border">
                  <b-datepicker
                    v-model="tarih"
                    :disabled="kaydetVisible1"
                    size="is-small"
                  />
                </b-field>
              </div>
              <div class="column is-1" style="width: 350px">
                <b-field label="FaturaNo" label-position="on-border">
                  <b-input
                    v-model="faturaNo"
                    :disabled="kaydetVisible1"
                    size="is-small"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-2">
                <Checkbox v-model="birlesik" :binary="true" />
                <label
                  for="takip"
                  style="background-color: yellow; font-size: 10px"
                  class="p-checkbox-label"
                >
                  Navlun ve Local tek Faturada</label
                >
              </div>
              <div class="column is-2">
                <b-field label="Tutar (TL)" label-position="on-border">
                  <b-input
                    v-model="Tutar_tl"
                    :disabled="kaydetVisible1"
                    @input="miktar_input_event($event)"
                    size="is-small"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-1">
                <b-field label="Kur" label-position="on-border">
                  <b-input
                    v-model="kur"
                    @input="toplam_adet_hesapla($event)"
                    @focus="$event.target.select()"
                    @click="$event.target.select()"
                    :disabled="kaydetVisible1"
                    size="is-small"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-2">
                <b-field label="Tutar ($)" label-position="on-border">
                  <b-input
                    v-model="Tutar_dolar"
                    @input="dolar_input_event($event)"
                    :disabled="kaydetVisible1"
                    size="is-small"
                  >
                  </b-input>
                </b-field>
              </div>
            </div>

            <div class="columns is-12" style="margin-left: 235px">
              <div class="column is-12">
                <Button
                  class="p-button-rounded p-button-warning"
                  label="Bilgileri Kaydet"
                  :disabled="kaydetVisible1"
                  @click="kaydetIslemi"
                  icon="fas fa-check"
                  iconPos="left"
                />
              </div>
            </div>
          </div>
        </b-field>
        <br />
        <div class="columns is-multiline">
          <b-field label="Adım 2" label-position="on-border">
            <div class="card">
              <div class="p-col-12 p-md-6">
                <div class="p-col-12 p-lg-12">
                  <Button
                    :disabled="dis_numuneDosyayukle"
                    style="background-color: #green; color: black"
                    label="Evrak Yukle"
                    conPos="left"
                    icon="fas fa-file-invoice-dollar"
                    @click="proformaVisible = true"
                  />
                  <Dialog
                    v-model:visible="proformaVisible"
                    maximizable
                    :modal="true"
                    header="Evrak Girişi"
                    position="top"
                  >
                    <div
                      class="p-cardialog-content"
                      style="height: 300px; background-color: #f4f4f4"
                    >
                      <div class="p-grid">
                        <div class="p-col-12 p-lg-12">
                          <div class="p-col-12 p-lg-12">
                            <div class="p-grid">
                              <div class="p-col-8" style="margin-left: -60px">
                                <custom-file-input
                                  :disabled="dis_DosyaAc"
                                  @sunucuDosyaYolla="
                                    konteynerDosyaGonder($event)
                                  "
                                  style="margin-left: 155px"
                                  baslik="Evrak Yükle"
                                />
                              </div>
                              <div class="p-col-4">
                                <a :href="denizcilikLink" target="_blank">
                                  <Button
                                    label="Dosya Aç"
                                    :disabled="dis_DosyaAc"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </div>

              <span style="color: red; font-size: 14px; font-weight: bold"
                >Pdf formatında ve dosya isminin '.' içermediğine dikkat ediniz
                .</span
              >
              <br />
            </div>
          </b-field>
          <br />
        </div>

        <div class="column is-12">
          <div class="column is-4" style="margin-top: -30px">
            <Button
              label="KAYDET"
              class="p-button-success"
              :disabled="yenikaydetVisible"
              @click="kaydetolustur()"
            />
          </div>
          <div
            class="column is-4"
            style="margin-top: -60px; margin-left: 150px"
          >
            <Button
              label="Yeni Kayıt"
              :disabled="yenikayitVisible"
              @click="kayitolustur()"
            />
          </div>
          <div
            class="column is-4"
            style="margin-top: -60px; margin-left: 300px"
          >
            <Button
              label="Vazgec"
              class="p-button-danger"
              :disabled="vazgecVisible"
              @click="vazgec()"
            />
          </div>
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="is_firma_alani"
      header="Firma Listesi"
      maximizable
      :modal="true"
      position="top"
    >
      <section>
        <div class="container" style="height: 900px; background-color: white">
          <div class="columns" style="height: 900px; background-color: white">
            <div
              class="column is-12"
              style="height: 900px; background-color: white"
            >
              <FirmaAlani />
            </div>
          </div>
        </div>
      </section>
    </Dialog>
  </section>
</template>
<script>
import service from "@/service/OperasyonService";
import LocalService from "@/service/LocalService";
import CustomInputFile from "@/components/shared/CustomInputFile";
import fileService from "@/service/FileService";
import FirmaAlani from "./FirmaAlani";
import { mapGetters } from "vuex";

export default {
  components: {
    customFileInput: CustomInputFile,
    FirmaAlani,
  },

  data() {
    return {
      firma: "",
      firma_list: [],
      birlesik: false,
      siparis: "",
      is_firma_alani: false,
      siparis_list: [],
      firma_adi: "",
      siparisno: "",
      faturaNo: "",
      Tutar_tl: 0,
      kur: 0,
      firma_id: 0,
      Tutar_dolar: 0,
      tarih: new Date(),
      dis_DosyaAc: true,
      denizcilikLink: "",
      urunid: 0,
      urunID: 0,
      dis_numuneDosyayukle: true,
      denizcilik_data2: [],
      proformaVisible: false,
      yenikayitVisible: false,
      kaydetVisible1: true,
      yenikaydetVisible: true,
      vazgecVisible: true,
      selectFaturaTur: "Liman",
    };
  },
  localService: null,
  beforeRouteEnter(to, from, next) {
    service.getKonteynerFormListesi().then((data) => {
      next((vm) => {
        vm.firma_list = data.konteyner_liste;
        vm.siparis_list = data.siparis_list;
      });
    });
  },
  computed: {
    ...mapGetters(["SiparisEvrakList"]),

    filterFaturaList() {
      if (this.firma_list) {
        return this.firma_list.filter((option) => {
          return (
            option.firma_adi
              .toString()
              .toLowerCase()
              .indexOf(this.firma.toLowerCase()) >= 0
          );
        });
      }

      return null;
    },
    filterSiparisList() {
      if (this.siparis_list) {
        return this.siparis_list.filter((option) => {
          return (
            option.siparisno
              .toString()
              .toLowerCase()
              .indexOf(this.siparis.toLowerCase()) >= 0
          );
        });
      }

      return null;
    },
  },
  methods: {
    yeniFirmaGiris() {
      this.is_firma_alani = true;

      service.getKonteynerFormListesi().then((data) => {
        this.firma_list = data.konteyner_liste;
        this.siparis_list = data.siparis_list;
      });
    },
    dolar_input_event(event) {
      if (event) this.Tutar_dolar = event.replace(",", ".");

      if (this.kur != 0) {
        this.Tutar_tl = this.Tutar_dolar * this.kur;

        this.Tutar_tl = (this.Tutar_tl / 1).toFixed(2).replace(",", ".");
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    kayitolustur() {
      this.kaydetVisible1 = false;
      this.yenikayitVisible = true;
      this.denizcilik_data2 = [];
      this.selectFaturaTur = null;
      this.vazgecVisible = false;
      this.dis_numuneDosyayukle = true;
      service.getKonteynerFormListesi().then((data) => {
        this.firma_list = data.konteyner_liste;
        this.siparis_list = data.siparis_list;
      });
    },
    vazgec() {
      this.kaydetVisible1 = true;
      this.yenikayitVisible = false;
      this.vazgecVisible = true;
      this.dis_numuneDosyayukle = true;
    },
    kaydetolustur() {
      this.kaydetVisible1 = true;
      this.yenikayitVisible = false;
      this.dis_numuneDosyayukle = true;
      this.yenikaydetVisible = true;
    },
    miktar_input_event(event) {
      if (event) this.Tutar_tl = event.replace(",", ".");
      if (this.Tutar_tl > 0 && this.kur > 0) {
        this.Tutar_dolar = this.Tutar_tl / this.kur;
        this.Tutar_dolar = (this.Tutar_dolar / 1).toFixed(2).replace(",", ".");
      }
    },
    toplam_adet_hesapla(event) {
      if (event) this.kur = event.replace(",", ".");
      if (this.Tutar_tl > 0 && this.kur > 0) {
        this.Tutar_dolar = this.Tutar_tl / this.kur;
        this.Tutar_tl = (this.Tutar_tl / 1).toFixed(2).replace(",", ".");
        this.Tutar_dolar = (this.Tutar_dolar / 1).toFixed(2).replace(",", ".");
      }
    },

    konteynerDosyaGonder(event) {
      fileService
        .nakliyeDosyaGonder(
          event,
          this.denizcilik_data2.Firma_id,
          this.denizcilik_data2.faturaNo + ".pdf"
        )
        .then((data) => {
          console.log("nakliyeDosyaGonder", data);
          
          service
            .setDenizcilikFaturaKayit(this.denizcilik_data2)
            .then((veri) => {
              if (veri.Status) {
                alert("Kayıt İşlemi Yapıldı.");
                this.dis_DosyaAc = false;
                this.denizcilikLink = `https://file-service.mekmar.com/file/download/customer/${
                  this.denizcilik_data2.Firma_id
                }/${this.denizcilik_data2.faturaNo + ".pdf"}`;
                this.yenikaydetVisible = false;
              }
            });
        });
    },

    formatPriceTL(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "₺" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    faturaDegisim() {
      if (this.firma_list) {
        setTimeout(() => {
          const siparis_item = this.firma_list.find(
            (x) => x.firma_adi == this.firma
          );

          this.firma_id = siparis_item.Firma_id;
        }, 1000);
      }
    },
    nakliye_tablo_yukle() {
      this.tedarikci_loading = true;
    },
    kaydetIslemi() {
      if (!this.firma) {
        alert("Firma Adını Seçiniz.");
        return;
      }
      if (this.faturaNo == "") {
        alert("Fatura Numarasını Seçiniz.");
        return;
      }
      if (this.Tutar_tl == 0) {
        alert("Fatura Tutarı 0 dan büyük olmalı.");
        return;
      }
      if (this.kur == 0) {
        alert("Kur  0 dan büyük olmalı.");
        return;
      }
      if (this.tarih == 0) {
        alert("Tarih Seçiniz..");
        return;
      }

      const denizcilik_data = {
        siparisno: this.siparis,
        firma_adi: this.firma,
        faturaNo: this.faturaNo,
        Tutar_tl: this.Tutar_tl,
        kur: this.kur,
        Firma_id: this.firma_id,
        Tutar_dolar: this.Tutar_dolar,
        fatura_tur_list: this.selectFaturaTur,
        tarih: this.localService.getDateString(this.tarih),
        kullaniciAdi: this.$store.getters.getUser,
        birlesik: this.birlesik,
      };
      this.denizcilik_data2 = denizcilik_data;

      service.setDenizcilikEvrakFaturaKayit(denizcilik_data).then((status) => {
        if (status.Status) {
          this.dis_numuneDosyayukle = false;
          this.kaydetVisible = true;

          this.siparis = "";
          this.firma = "";
          this.faturaNo = "";
          this.Tutar_tl = 0;
          this.kur = 0;
          this.Tutar_dolar = 0;
          this.tarih = new Date();

        } else {
          alert("Ops! Kayıt İşlemi Yapılamadı, Lütfen Tekrar Deneyiniz.");
        }
      });
    },
  },
  created() {
    this.localService = new LocalService();
    this.siparis = this.SiparisEvrakList.siparisno;
    this.nakliye_tablo_yukle();
    this.kayitolustur();
  },
};
</script>
<style scoped>
.card {
  font-size: 20px;
}
</style>

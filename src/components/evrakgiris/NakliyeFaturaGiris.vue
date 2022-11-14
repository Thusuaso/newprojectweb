<template>
  <section>
    <div
      class="is-centered"
      style="weight: 55px; height: 900px"
      v-if="isMobile > 576"
    >
      <div class="column is-12">
        <Button
          label="+ Yeni Firma"
          style="
            width: 150px;
            margin-left: 1000px;
            background-color: green;
            font-weight: bold;
          "
          @click="yeniFirmaGiris"
        />
      </div>
      <div class="column is-12">
        <b-field label="Adım 1" label-position="on-border">
          <div class="card">
            <div class="columns is-multiline">
              <div class="column is-4">
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

              <div class="column is-2">
                <b-field label="Tarih" label-position="on-border">
                  <b-datepicker
                    v-model="tarih"
                    @input="kurSecim"
                    :disabled="kaydetVisible1"
                    size="is-small"
                  />
                </b-field>
              </div>
              <div class="column is-2">
                <b-field label="FaturaNo" label-position="on-border">
                  <b-input
                    v-model="faturaNo"
                    :disabled="kaydetVisible1"
                    size="is-small"
                    style="width: 220px"
                  ></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns is-multiline">
              <div class="column is-4" size="is-small">
                <b-field label="Sipariş Seçiniz" label-position="on-border">
                  <b-autocomplete
                    rounded
                    v-model="siparis"
                    :data="filterSiparisList"
                    field="siparisno"
                    placeholder="Siparis Seçiniz"
                    @select="(option) => (selected = option)"
                    :disabled="kaydetVisible2"
                  >
                  </b-autocomplete>
                </b-field>
              </div>

              <div class="column is-2">
                <b-field label="Tutar (TL)" label-position="on-border">
                  <b-input
                    v-model="Tutar_tl"
                    :disabled="kaydetVisible2"
                    @input="miktar_input_event($event)"
                    size="is-small"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-2">
                <b-field label="Kur" label-position="on-border">
                  <b-input
                    v-model="kur"
                    @input="toplam_adet_hesapla($event)"
                    @focus.native="$event.target.select()"
                    @click.native="$event.target.select()"
                    :disabled="kaydetVisible2"
                    size="is-small"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-2">
                <b-field label="Tutar ($)" label-position="on-border">
                  <b-input
                    v-model="Tutar_dolar"
                    @input="dolar_input_event($event)"
                    :disabled="kaydetVisible2"
                    size="is-small"
                  >
                  </b-input>
                </b-field>
              </div>
              <div class="column is-5">
                <div class="columns">
                  <div class="column is-3">
                    <Button
                      class="p-button-rounded p-button-secondary"
                      @click="btn_yeni_click"
                      label="Yeni"
                      icon="pi pi-file-o"
                      iconPos="left"
                    />
                  </div>
                  <div class="column is-3">
                    <Button
                      label="İptal"
                      class="p-button-rounded p-button-danger"
                      icon="pi pi-times"
                      iconPos="left"
                    />
                  </div>
                  <div class="column is-3">
                    <Button
                      label="Ekle"
                      class="p-button-rounded p-button-success"
                      @click="btn_ekle_click"
                      icon="pi pi-plus"
                      iconPos="left"
                    />
                  </div>
                  <div class="column is-3">
                    <Button
                      class="p-button-rounded p-button-warning"
                      label="Değiştir"
                      @click="btn_degistir_click"
                      icon="pi pi-refresh"
                      iconPos="left"
                    />
                  </div>
                  <div class="column is-3">
                    <Button
                      label="Sil"
                      class="p-button-rounded"
                      @click="btn_sil_click"
                      style="background-color: yellow; color: black"
                      icon="pi pi-times-circle"
                      iconPos="left"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <DataTable
                  class="p-datatable-responsive p-datatable-cars"
                  :value="siparisToplu"
                  :selection.sync="selectUrun"
                  selectionMode="single"
                  @row-select="siparisUrunSec"
                  dataKey="id"
                >
                  <Column
                    field="siparisno"
                    header="PO"
                    headerStyle="width:90%;"
                  >
                    <template #body="slotProps">
                      {{ slotProps.data.siparisno }}
                    </template>
                  </Column>
                  <Column
                    field="Tutar_tl"
                    header="Tutar TRY"
                    headerStyle="width:90%;"
                  >
                    <template #body="slotProps">
                      {{ slotProps.data.Tutar_tl }}
                    </template>
                  </Column>
                  <Column
                    field="Tutar_dolar"
                    header="Tutar USD"
                    headerStyle="width:90%;"
                  >
                    <template #body="slotProps">
                      {{ slotProps.data.Tutar_dolar }}
                    </template>
                  </Column>
                  <Column field="kur" header="Kur" headerStyle="width:90%;">
                    <template #body="slotProps">
                      {{ slotProps.data.kur }}
                    </template>
                  </Column>
                </DataTable>
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
                                  :disabled="dis_numuneDosyaAc"
                                  @sunucuDosyaYolla="nakliyeDosyaGonder($event)"
                                  style="margin-left: 155px"
                                  baslik="Evrak Yükle"
                                />
                              </div>
                              <div class="p-col-4">
                                <a :href="numuneLink" target="_blank">
                                  <Button
                                    label="Dosya Aç"
                                    :disabled="dis_numuneDosyaAc"
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
              label="Kaydet"
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

      <Dialog
        v-model:visible="is_firma_alani"
        header="Firma Listesi"
        maximizable
        :modal="true"
        position="top"
      >
        <section>
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <FirmaAlani />
              </div>
            </div>
          </div>
        </section>
      </Dialog>
    </div>
    <div style="margin-left: -15px" v-else>
      <Button
        label="+ Yeni Firma"
        style="width: 150px; background-color: green; font-weight: bold"
        @click="yeniFirmaGiris"
      />

      <div class="card">
        <div class="columns">
          <div class="column">
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

          <div class="column">
            <b-field label="Tarih" label-position="on-border">
              <b-datepicker
                v-model="tarih"
                @input="kurSecim"
                :disabled="kaydetVisible1"
                size="is-small"
              />
            </b-field>
          </div>
          <div class="column">
            <b-field label="FaturaNo" label-position="on-border">
              <b-input
                v-model="faturaNo"
                :disabled="kaydetVisible1"
                size="is-small"
                style="width: 220px"
              >
              </b-input>
            </b-field>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4" size="is-small">
            <b-field label="Sipariş Seçiniz" label-position="on-border">
              <b-autocomplete
                rounded
                v-model="siparis"
                :data="filterSiparisList"
                field="siparisno"
                placeholder="Siparis Seçiniz"
                @select="(option) => (selected = option)"
                :disabled="kaydetVisible2"
              >
              </b-autocomplete>
            </b-field>
          </div>

          <div class="column is-2">
            <b-field label="Tutar (TL)" label-position="on-border">
              <b-input
                v-model="Tutar_tl"
                :disabled="kaydetVisible2"
                @input="miktar_input_event($event)"
                size="is-small"
              ></b-input>
            </b-field>
          </div>
          <div class="column is-2">
            <b-field label="Kur" label-position="on-border">
              <b-input
                v-model="kur"
                @input="toplam_adet_hesapla($event)"
                @focus.native="$event.target.select()"
                @click.native="$event.target.select()"
                :disabled="kaydetVisible2"
                size="is-small"
              ></b-input>
            </b-field>
          </div>
          <div class="column is-2">
            <b-field label="Tutar ($)" label-position="on-border">
              <b-input
                v-model="Tutar_dolar"
                @input="dolar_input_event($event)"
                :disabled="kaydetVisible2"
                size="is-small"
              >
              </b-input>
            </b-field>
          </div>
          <div class="column is-5">
            <div class="columns">
              <div class="column is-3">
                <Button
                  class="p-button-rounded p-button-secondary"
                  @click="btn_yeni_click"
                  label="Yeni"
                  icon="pi pi-file-o"
                  iconPos="left"
                />
              </div>
              <div class="column is-3">
                <Button
                  label="İptal"
                  class="p-button-rounded p-button-danger"
                  icon="pi pi-times"
                  iconPos="left"
                />
              </div>
              <div class="column is-3">
                <Button
                  label="Ekle"
                  class="p-button-rounded p-button-success"
                  @click="btn_ekle_click"
                  icon="pi pi-plus"
                  iconPos="left"
                />
              </div>
              <div class="column is-3">
                <Button
                  class="p-button-rounded p-button-warning"
                  label="Değiştir"
                  @click="btn_degistir_click"
                  icon="pi pi-refresh"
                  iconPos="left"
                />
              </div>
              <div class="column is-3">
                <Button
                  label="Sil"
                  class="p-button-rounded"
                  @click="btn_sil_click"
                  style="background-color: yellow; color: black"
                  icon="pi pi-times-circle"
                  iconPos="left"
                />
              </div>
            </div>
          </div>
          <div class="column is-12">
            <DataTable
              class="p-datatable-responsive p-datatable-cars"
              :value="siparisToplu"
              :selection.sync="selectUrun"
              selectionMode="single"
              @row-select="siparisUrunSec"
              dataKey="id"
            >
              <Column field="siparisno" header="PO" headerStyle="width:90%;">
                <template #body="slotProps">
                  {{ slotProps.data.siparisno }}
                </template>
              </Column>
              <Column
                field="Tutar_tl"
                header="Tutar TRY"
                headerStyle="width:90%;"
              >
                <template #body="slotProps">
                  {{ slotProps.data.Tutar_tl }}
                </template>
              </Column>
              <Column
                field="Tutar_dolar"
                header="Tutar USD"
                headerStyle="width:90%;"
              >
                <template #body="slotProps">
                  {{ slotProps.data.Tutar_dolar }}
                </template>
              </Column>
              <Column field="kur" header="Kur" headerStyle="width:90%;">
                <template #body="slotProps">
                  {{ slotProps.data.kur }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="columns">
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

      <br />
      <div class="columns">
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
                            <div class="p-col-8">
                              <custom-file-input
                                :disabled="dis_numuneDosyaAc"
                                @sunucuDosyaYolla="nakliyeDosyaGonder($event)"
                                baslik="Evrak Yükle"
                              />
                            </div>
                            <div class="p-col-4">
                              <a :href="numuneLink" target="_blank">
                                <Button
                                  label="Dosya Aç"
                                  :disabled="dis_numuneDosyaAc"
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

      <div class="columns">
        <div class="column">
          <Button
            label="Kaydet"
            class="p-button-success"
            :disabled="yenikaydetVisible"
            @click="kaydetolustur()"
          />
        </div>
        <div class="column">
          <Button
            label="Yeni Kayıt"
            :disabled="yenikayitVisible"
            @click="kayitolustur()"
          />
        </div>
        <div class="column">
          <Button
            label="Vazgec"
            class="p-button-danger"
            :disabled="vazgecVisible"
            @click="vazgec()"
          />
        </div>
      </div>

      <Dialog
        v-model:visible="is_firma_alani"
        header="Firma Listesi"
        :modal="true"
        maximizable
        position="top"
      >
        <section>
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <FirmaAlani />
              </div>
            </div>
          </div>
        </section>
      </Dialog>
    </div>
  </section>
</template>
<script>
import service2 from "@/service/FinansService";
import service from "@/service/OperasyonService";
import LocalService from "@/service/LocalService";
import CustomInputFile from "@/components/shared/CustomInputFile";
import fileService from "@/service/FileService";
import FirmaAlani from "./FirmaAlani";
import store from "@/store";

export default {
  components: {
    customFileInput: CustomInputFile,
    FirmaAlani,
  },

  data() {
    return {
      isMobile: null,
      firma: "",
      is_firma_alani: false,
      firma_list: [],
      siparis: "",
      siparis_list: [],
      firma_adi: "",
      siparisno: "",
      faturaNo: "",
      Tutar_tl: 0,
      selectUrun: null,
      kur: 0,
      firma_id: 0,
      Tutar_dolar: 0,
      tarih: new Date(),
      dis_numuneDosyaAc: true,
      numuneLink: "",
      urunid: 0,
      urunID: 0,
      dis_numuneDosyayukle: true,
      nakliye_data2: [],
      proformaVisible: false,
      yenikayitVisible: false,
      kaydetVisible1: true,
      kaydetVisible2: true,
      yenikaydetVisible: true,
      vazgecVisible: true,
      siparisToplu: [],

      urunler: null,
    };
  },

  localService: null,

  computed: {
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
    siparisUrunSec(event) {
      if (this.selectUrun) {
        this.urunler = { ...event.data };

        this.firma_id = this.urunler.Firma_id;
        this.Tutar_dolar = this.urunler.Tutar_dolar;
        this.siparis = this.urunler.siparisno;
        this.faturaNo = this.urunler.faturaNo;
        this.firma_adi = this.urunler.firma_adi;
        this.Tutar_tl = this.urunler.Tutar_tl;
        this.kur = this.urunler.kur;
      }
    },
    kurSecim() {
      const d = this.tarih;

      const year = d.getFullYear(); // 2021
      const mount = d.getMonth();
      const day = d.getDate();

      service2.getGuncelKur(year, mount + 1, day).then((data) => {
        this.kur = data.result;
      });
    },
    indexBul(id, liste) {
      let index = -1;
      if (!liste != null) {
        for (let i = 0; i < liste.length; i++) {
          if (liste[i].id === id) {
            index = i;
            break;
          }
        }
      }

      return index;
    },
    btn_sil_click() {
      let index = this.indexBul(this.urunler.id, this.siparisToplu);

      this.siparisToplu.splice(index, 1);
      this.form_btn_reset();
    },
    btn_degistir_click() {
      this.urunIslemleri();
      let index = this.indexBul(this.urunler.id, this.siparisToplu);
      console.log("değiştrie index", index);
      this.siparisToplu[index] = this.urunler;
      console.log("this.urunler değiştr ", this.siparisToplu);
      this.form_btn_reset();
      this.selectUrun = null;
    },

    idOlustur() {
      let result = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (var i = 0; i < 8; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    urunIslemleri() {
      this.urunler.Firma_id = this.firma_id;
      this.urunler.Tutar_dolar = this.Tutar_dolar;
      this.urunler.siparisno = this.siparis;
      this.urunler.faturaNo = this.faturaNo;
      this.urunler.firma_adi = this.firma_adi;
      this.urunler.Tutar_tl = this.Tutar_tl;
      this.urunler.kur = this.kur;
      (this.urunler.kullaniciAdi = this.$store.getters.getUser),
        (this.urunler.tarih = this.localService.getDateString(this.tarih));
      if (!this.urunler.id) {
        this.urunler.id = this.idOlustur();
      }

      console.log("urunIslemleri", this.urunler);
    },
    btn_ekle_click() {
      this.urunIslemleri();
      this.siparisToplu.push({ ...this.urunler });
      this.form_btn_reset();
    },
    form_btn_reset() {
      this.Tutar_dolar = 0;
      this.siparis = "";
      this.Tutar_tl = 0;
      this.kur = 0;
      this.btn_yeni_click();
    },
    btn_yeni_click() {
      this.kaydetVisible2 = false;
      service.getNakliyeYeniUrunModel().then((data) => {
        this.urunler = { ...data.nakliye_model };
      });
    },
    yeniFirmaGiris() {
      this.is_firma_alani = true;

      this.kayitolustur();
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    kayitolustur() {
      this.kaydetVisible1 = false;

      this.yenikayitVisible = true;
      this.nakliye_data2 = [];
      this.vazgecVisible = false;
      this.dis_numuneDosyayukle = true;

      service.getNakliyeIslemListesi().then((data) => {
        this.firma_list = data.nakliye_liste;
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
    dolar_input_event(event) {
      if (event) this.Tutar_dolar = event.replace(",", ".");

      if (this.kur != 0) {
        this.Tutar_tl = this.Tutar_dolar * this.kur;
        this.Tutar_tl = (this.Tutar_tl / 1).toFixed(2).replace(",", ".");
      }
    },
    miktar_input_event(event) {
      if (event) this.Tutar_tl = event.replace(",", ".");

      if (this.kur != 0) {
        if (this.Tutar_tl > 0 && this.kur > 0) {
          this.Tutar_dolar = this.Tutar_tl / this.kur;
          this.Tutar_dolar = (this.Tutar_dolar / 1)
            .toFixed(2)
            .replace(",", ".");
        }
      }
    },
    toplam_adet_hesapla(event) {
      if (event) this.kur = event.replace(",", ".");
      if (this.Tutar_tl > 0 && this.kur > 0) {
        this.Tutar_dolar = this.Tutar_tl / this.kur;
        this.Tutar_dolar = (this.Tutar_dolar / 1).toFixed(2).replace(",", ".");
        this.Tutar_tl = (this.Tutar_tl / 1).toFixed(2).replace(",", ".");
      }
    },

    nakliyeDosyaGonder(event) {
      fileService
        .nakliyeDosyaGonder(
          event,
          this.nakliye_data2.Firma_id,
          this.nakliye_data2.faturaNo + ".pdf"
        )
        .then((data) => {
          console.log("nakliyeDosyaGonder 3", data);

          service.setNakliyeFaturaKayit(this.siparisToplu).then((veri) => {
            if (veri.Status) {
              alert("Kayıt İşlemi Yapıldı.");
              this.dis_numuneDosyaAc = false;
              this.numuneLink = `https://file-service.mekmar.com/file/download/customer/${
                this.nakliye_data2.Firma_id
              }/${this.nakliye_data2.faturaNo + ".pdf"}`;

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
        alert("Fatura Numarasını Seçiniz..");
        return;
      }

      const nakliye_data = {
        siparisno: this.siparis,
        firma_adi: this.firma,
        faturaNo: this.faturaNo,
        Tutar_tl: this.Tutar_tl,
        kur: this.kur,
        Firma_id: this.firma_id,
        Tutar_dolar: this.Tutar_dolar,

        tarih: this.localService.getDateString(this.tarih),
      };

      service.nakliyeKaydet(this.siparisToplu).then((status) => {
        service.getNakliyeUrunModel(this.faturaNo).then((data) => {
          const nakliye_data2 = {
            siparisno: nakliye_data.siparisno,
            firma_adi: nakliye_data.firma_adi,
            faturaNo: nakliye_data.faturaNo,
            Tutar_tl: nakliye_data.Tutar_tl,
            kur: nakliye_data.kur,
            Firma_id: nakliye_data.Firma_id,
            Tutar_dolar: nakliye_data.Tutar_dolar,
            urunID: data.nakliye_liste[0].id,
            tarih: nakliye_data.tarih,
            kullaniciAdi: this.$store.getters.getUser,
          };
          this.nakliye_data2 = nakliye_data2;
        });

        if (status.status) {
          alert("Başarılı! Şimdi Evrağı Yükleyiniz.");
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
    this.isMobile = window.innerWidth;
    this.localService = new LocalService();
    service.getNakliyeIslemListesi().then((data) => {
      this.firma_list = data.nakliye_liste;
      this.siparis_list = data.siparis_list;
    });
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

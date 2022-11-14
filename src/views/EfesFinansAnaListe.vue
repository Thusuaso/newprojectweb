<template>
  <section>
    <div
      class="columns is-multiline is-centered"
      style="margin-top: 19px; margin-left: 80px"
    >
      <div class="columns is-multiline" style="margin-left: -120px">
        <div class="column is-6">
          <Button
            @click="tahsilat_click"
            class="p-button-primary"
            label="Tahsilat Listesi Aç"
          />
          <Checkbox
            @input="konteynerHepsiEvent"
            style="margin-top: 15px"
            v-model="ekonteyner_list_hepsi"
          />Hepsini Göster
          <Dialog
            v-model:visible="is_tahsilat"
            header="TAHSİLAT LİSTESİ"
            :modal="true"
            maximizable
          >
            <EfesMusteriOdemeler />
          </Dialog>
        </div>
      </div>

      <div
        class="column is-3 is-centered"
        style="position: relative; top: -20px; margin-left: -120px"
      >
        <div class="column is-12">
          <Button
            @click="excel_cikti_click"
            icon="fa-solid fa-file-excel fa-2xl"
          />
        </div>
      </div>

      <div class="tableTop">
        <table class="table table-striped table-dark">
          <thead>
            <tr>
              <th style="text-align: center">Yıl</th>
              <th>Tüm Satışlar (FOB)</th>
              <th>Tüm Satışlar (DDP)</th>
              <th>Yıllık Tahmini Satış</th>
              <th>Yüklenmemiş Satışlar</th>
              <th>Yüklenmiş Satışlar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in yuklenenvsipars" :key="i">
              <td style="text-align: center">{{ i.yil }}</td>
              <td style="text-align: center">
                {{ formatPrice(i.tumSatislarFob) }}
              </td>
              <td style="text-align: center">
                {{ formatPrice(i.tumSatislar) }}
              </td>
              <td style="text-align: center">
                {{ formatPrice(i.tahminiTumSatislar) }}
              </td>

              <td style="text-align: center">
                {{ formatPrice(i.yuklenmemisSatislar) }}
              </td>
              <td style="text-align: center">
                {{ formatPrice(i.yuklenmisSatislar) }}
              </td>
            </tr>
          </tbody>
          <tfoot style="font-weight: bold; background-color: yellow">
            <td>TOPLAM</td>
            <td style="text-align: center">
              {{ formatPrice(tumSatislarTop) }}
            </td>
            <td style="text-align: center">
              {{ formatPrice(tumSatislarDdpTop) }}
            </td>
            <td style="text-align: center">
              {{ formatPrice(yillikTahminiSatisTop) }}
            </td>
            <td style="text-align: center">
              {{ formatPrice(yuklenmemisSatislarTop) }}
            </td>
            <td style="text-align: center">
              {{ formatPrice(yuklenmisSatislarTop) }}
            </td>
          </tfoot>
        </table>
      </div>
      <div style="position: relative; top: -20px; left: 10px">
        <table class="table table-striped table-dark">
          <thead>
            <tr>
              <th>Gelen Ödeme Toplamı</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in gelenOdeme" :key="i">
              <td style="text-align: center">
                {{ formatPrice(i.gelen_odeme) }}
              </td>
            </tr>
          </tbody>
          <tfoot style="font-weight: bold; background-color: yellow">
            <td style="text-align: center">{{ formatPrice(gelenOdemeTop) }}</td>
          </tfoot>
        </table>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-10 is-centered">
        <div class="columns is-multiline">
          <div class="column is-12 is-centered">
            <DataTable
              :value="
                !ekonteyner_list_hepsi
                  ? ekonteyner_ana_list_filter
                  : ekonteyner_ana_list_all
              "
              sortField="ciro"
              dataKey="id"
              :sortOrder="-1"
              :scrollable="true"
              v-model:filters="filters"
              filterDisplay="row"
              scrollHeight="390px"
              v-model:selection="select_konteyner"
              :loading="finans_loading"
              selectionMode="single"
              @row-select="konteyner_item_select($event)"
            >
              <template #header>
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <span style="font-size: 15px">
                      Efes Konteynır Alacak Tablosu
                    </span>
                  </div>
                </div>
              </template>
              <Column field="musteriadi" :showFilterMenu="false">
                <template #body="slotProps">
                  {{ slotProps.data.musteriadi }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    @input="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by"
                    v-tooltip.top.focus="'Filter as you type'"
                  />
                </template>
              </Column>

              <Column
                header="Açık Po Fatura Toplamı"
                field="ciro"
                bodyStyle="text-align:center;color:black"
              >
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.kapanmayan_siparis) }}
                </template>
                <template #footer>
                  {{ formatPrice(yeni_yukleme) }}
                </template>
              </Column>
              <Column
                header="Açık Po için Ödemeler"
                field="odenen"
                bodyStyle="text-align:center;color:black"
              >
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.kapanmayan_odenen) }}
                </template>
                <template #footer>
                  {{ formatPrice(yeni_odenen) }}
                </template>
              </Column>
              <Column
                header="Açık Po için Kalan Alacak"
                field="bakiye"
                :sortable="true"
                bodyStyle="text-align:center;color:black"
              >
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.kapanmayan_kalan) }}
                </template>
                <template #footer>
                  {{ formatPrice(yuklemeden_alacak) }}
                </template>
              </Column>
              <Column
                header="Yüklenmemiş Order Peşinatı"
                field="pesinat"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  <div
                    :class="
                      slotProps.data.pesinat > 10 ||
                      slotProps.data.eski_pesinat > 10 ||
                      (slotProps.data.pesinat < -8 &&
                        slotProps.data.genel_bakiye < -8)
                        ? 'genel_bakiye_style'
                        : ''
                    "
                  >
                    {{
                      formatPrice(
                        slotProps.data.pesinat + slotProps.data.eski_pesinat
                      )
                    }}
                  </div>
                </template>
                <template #footer>
                  {{ formatPrice(yeni_pesinat) }}
                </template>
              </Column>
              <Column
                header="RİSK BAKİYE"
                field="genel_bakiye"
                :sortable="true"
                bodyStyle="text-align:center; font-weight:bold; "
              >
                <template #body="slotProps">
                  <div
                    :class="
                      slotProps.data.genel_bakiye < -8
                        ? 'genel_bakiye_style'
                        : 'genel_bakiye_style2'
                    "
                  >
                    {{ formatPrice(slotProps.data.genel_bakiye) }}
                  </div>
                </template>
                <template #footer>
                  {{ formatPrice(genel_bakiye) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-12 is-centered">
            <DataTable
              :value="efinans_gelen_sip_bilgileri"
              sortField="siparisTarihi"
              dataKey="id"
              :sortOrder="-1"
              :scrollable="true"
              v-model:filters="filterssip"
              filterDisplay="row"
              scrollHeight="390px"
              v-model:selection="select_sip"
              :loading="finans_loading"
              selectionMode="single"
              @row-select="efes_sip_detay($event)"
            >
              <template #header>
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <span style="font-size: 15px">
                      Efes Siparişler ve Detayları
                    </span>
                  </div>
                </div>
              </template>
              <Column field="siparisNo">
                <template #body="slotProps">
                  {{ slotProps.data.siparisNo }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    @input="filterCallback()"
                    class="p-column-filter"
                    placeholder="Search by"
                    v-tooltip.top.focus="'Filter as you type'"
                  />
                </template>
              </Column>

              <Column field="siparisTarihi">
                <template #body="slotProps">
                  {{ slotProps.data.siparisTarihi }}
                </template>
              </Column>
              <Column field="siparisYuklemeTarihi">
                <template #body="slotProps">
                  {{ slotProps.data.siparisYuklemeTarihi }}
                </template>
              </Column>

              <Column field="musteri">
                <template #body="slotProps">
                  {{ slotProps.data.musteri }}
                </template>
              </Column>
              <Column field="siparisSahibi">
                <template #body="slotProps">
                  {{ slotProps.data.siparisSahibi }}
                </template>
              </Column>
              <Column field="operasyon">
                <template #body="slotProps">
                  {{ slotProps.data.operasyon }}
                </template>
              </Column>
              <Column field="siparisDurum">
                <template #body="slotProps">
                  {{ slotProps.data.siparisDurum }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog
        v-model:visible="isKonteyner"
        v-model:header="konteynerBaslik"
        :modal="true"
        maximizable
      >
        <EfesFinansAyrintiList />
      </Dialog>
      <Dialog
        v-model:visible="siparisNoForm"
        v-model:header="siparisNoBaslik"
        :modal="true"
        maximizable
      >
        <EfesSipAyrintiList />
      </Dialog>
    </div>

    <br /><br />
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import service from "@/service/EfesFinansService";
import service_ from "@/service/FinansService";
import store from "@/store";
import socket from "@/service/SocketService";
import EfesFinansAyrintiList from "@/components/efes/EfesFinansAyrintiList";
import EfesMusteriOdemeler from "@/components/efes/EfesMusteriOdemeler";
import EfesSipAyrintiList from "@/components/efes/EfesSipAyrintiList.vue";
import { FilterMatchMode } from "primevue/api";
export default {
  components: {
    EfesFinansAyrintiList,
    EfesMusteriOdemeler,
    EfesSipAyrintiList,
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("loadingBeginAct");
    const d = new Date();
    const year = d.getFullYear();
    service.getEfesKonteynerAnaListe(year).then((data) => {
      store.dispatch("efesfinansAnaListeYukleAct", data); //ana liste
      store.dispatch("loadingEndAct");
      next();
    });
  },
  created() {
    this.toplam_islem(this.ekonteyner_ana_list_all);
    socket.siparis.on("tahsilat_kayitdegisim_emit", () => {
      const d = new Date();
      const year = d.getFullYear();
      service.getEfesKonteynerAnaListe(year).then((data) => {
        store.dispatch("efesfinansAnaListeYukleAct", data);
      });
    }),
      this.gelenOdemeler();
    this.efesGelenYuklenenList();
    this.efesGelenSiparisBilgileri();
  },
  data() {
    return {
      select_sip: "",
      siparisNoBaslik: "",
      siparisNoForm: false,
      filterssip: {
        siparisNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

      },
      isMobile: null,
      gelenOdemeTop: null,
      tumSatislarDdpTop: null,
      tumSatislarTop: null,
      yuklenmemisSatislarTop: null,
      yuklenmisSatislarTop: null,
      yillikTahminiSatisTop: null,
      yuklenenvsipars: null,
      filters: {
        musteriadi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      yeni_yukleme: 0,
      yeni_odenen: 0,
      yuklemeden_alacak: 0,
      yeni_pesinat: 0,
      genel_bakiye: 0,
      eski_pesinat_top: 0,
      devir_top: 0,
      select_konteyner: null,
      ekonteyner_list_hepsi: false,
      isKonteyner: false,
      konteynerBaslik: "",
      finans_loading: false,
      excel_cikti: "konteyner",
      is_tahsilat: false,
      ciro: 0,
      is_pesinat: false,
      gelenOdeme: null,
    };
  },
  computed: {
    ...mapGetters([
      "ekonteyner_ana_list_all",
      "ekonteyner_ana_list_filter",
      "efinans_toplam_devir",
      "efinans_toplam_ciro",
      "efinans_toplam_odenen",
      "efinans_toplam_bakiye",
      "efinans_toplam_pesinat",
      "efinans_toplam_genel_bakiye",

      "servis_adres",
      "efinans_toplam_eski_pesinat",
      "efinans_gelen_sip_bilgileri",
      "efinans_gelen_sip_bilgileri_ayrinti",
    ]),
  },
  methods: {
    efes_sip_detay(event) {
      this.siparisNoBaslik = event.data.siparisNo;
      service
        .getEfesGelenSiparisBilgileriAyrintiList(event.data.siparisNo)
        .then((data) => {
          this.$store.dispatch(
            "efinans_gelen_sip_bilgileri_ayrinti_load",
            data
          );
          this.siparisNoForm = true;
        });
    },
    efesGelenSiparisBilgileri() {
      service.getEfesGelenSiparisBilgileriList().then((data) => {
        this.$store.dispatch("efinans_gelen_sip_bilgileri_load", data);
      });
    },
    efesGelenSiparisBilgileriAll() {
      service.getEfesGelenSiparisBilgileriListAll().then((data) => {
        console.log("getEfesGelenSiparisBilgileriListAll", data);
        this.$store.dispatch("efinans_gelen_sip_bilgileri_load", data);
      });
    },
    efesGelenYuklenenList() {
      service.getEfesGelenYuklenenList().then((data) => {
        this.yuklenenvsipars = data;
        this.efesYuklemeListTopla(data);
      });
    },
    efesYuklemeListTopla(event) {
      this.tumSatislarDdpTop = 0;
      this.tumSatislarTop = 0;
      this.yuklenmemisSatislarTop = 0;
      this.yuklenmisSatislarTop = 0;
      this.yillikTahminiSatisTop = 0;
      for (let i of event) {
        this.tumSatislarDdpTop += i.tumSatislar;
        this.tumSatislarTop += i.tumSatislarFob;
        this.yuklenmemisSatislarTop += i.yuklenmemisSatislar;
        this.yuklenmisSatislarTop += i.yuklenmisSatislar;
        this.yillikTahminiSatisTop += i.tahminiTumSatislar;
      }
    },
    konteynerHepsiEvent() {
      if (this.ekonteyner_list_hepsi) {
        this.efesGelenSiparisBilgileriAll();
        const data = [...this.ekonteyner_ana_list_all];

        store.dispatch("efesfinansAnaListe_hepsiAct", data);
        this.tableToplamGuncelle(this.ekonteyner_list_all);
        //this.$refs.finans_ana_liste.value = this.konteyner_ana_list_all
      } else {
        this.efesGelenSiparisBilgileri();

        const data = [...this.ekonteyner_ana_list_filter];
        store.dispatch("efesfinansAnaListe_filterAct", data);
        this.tableToplamGuncelle(data);

        //this.$refs.finans_ana_liste.value = this.konteyner_ana_list_filter
      }
    },
    gelenOdemeler() {
      service.getEfesKonteynerGelenOdemelerYillik().then((data) => {
        this.gelenOdemeTop = 0;
        this.gelenOdeme = data.gelenOdemelerList;
        for (var i of data.gelenOdemelerList) {
          this.gelenOdemeTop += i.gelen_odeme;
        }
        this.finans_loading = false;
      });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    toplam_islem(liste) {
      this.yeni_yukleme = 0;
      this.yeni_odenen = 0;
      this.yuklemeden_alacak = 0;
      this.yeni_pesinat = 0;
      this.genel_bakiye = 0;

      for (let key in liste) {
        const item = liste[key];

        this.yeni_yukleme += item.kapanmayan_siparis;
        this.yeni_odenen += item.kapanmayan_odenen;
        this.yuklemeden_alacak += item.kapanmayan_kalan; //yüklenenbakiye
        this.yeni_pesinat += item.pesinat + item.eski_pesinat;
        this.genel_bakiye += item.genel_bakiye;
      }
    },
    excel_cikti_click() {
      const data = !this.ekonteyner_list_hepsi
        ? this.ekonteyner_ana_list_filter
        : this.ekonteyner_ana_list_all;
      service_.getKonteynerExcelListe(data).then((response) => {
        if (response.status) {
          const link = document.createElement("a");

          link.href = this.servis_adres + "finans/dosyalar/konteynerExcelCikti";
          link.setAttribute("download", "Konteyner.xlsx");
          document.body.appendChild(link);
          link.click();
          this.is_excel = false;
          this.musteri_loading = false;
        }
      });
    },
    tahsilat_click() {
      this.is_tahsilat = true;
    },
    pesinat_event_click() {
      this.$store.dispatch("enew_pesinat_model_act"); // bos model
      service.getEfesPesinatIslemListesi().then((data) => {
        this.$store.dispatch("epesinat_listesi_yukle_act", data);

        this.is_pesinat = true;
      });
    },
    konteyner_item_select(event) {
      this.select_konteyner = event.data;
      service.getEfesFinansAyrintiListYukle(event.data.id).then((data) => {
        store.dispatch("efesfinansAyrintiListYukleAct", data);
        this.konteynerBaslik = event.data.musteriadi;
        this.isKonteyner = true;
      });
    },
  },
};
</script>
<style scoped>
.p-datatable {
  font-size: 12px;
}
.depo-radio {
  margin-top: -15px;
  margin-bottom: -35px;
}
#excel_button {
  margin-top: 15px;
}
.genel_bakiye_style {
  background-color: #d54f61;
  color: white;
  font-weight: bold;
}
.block {
  margin-top: 15px;
  margin-right: -25px;
}
.tableTop {
  position: relative;
  top: -20px;
  margin-left: -250px;
}
@media screen and (max-width: 576px) {
  .tableTop {
    position: relative;
    top: -20px;
    left: -40px;
    margin-left: -52px;
    font-size: 9px;
  }
}
.isMobile {
  font-size: 9px;
}
</style>

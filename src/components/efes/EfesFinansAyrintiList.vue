<template>
  <section>
    <div class="columns is-multiline is-centered">
      <div class="column is-12">
        <div class="columns">
          <div class="column is-4">
            <Button
              class="p-button-primary"
              :disabled="is_tahsilat"
              @click="tahsilat_form_ac"
              label="Tahsilat"
            />
          </div>
          <div class="column is-1 box" style="margin-left: 800px">
            <RadioButton v-model="excel_cikti" value="ayrinti_listesi">
              Ayrıntı
            </RadioButton>

            <RadioButton v-model="excel_cikti" value="odeme_listesi">
              Ödeme
            </RadioButton>

            <Button
              @click="excel_cikti_click"
              icon="fa-solid fa-file-excel fa-xl"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column is-7">
        <div class="columns is-multiline">
          <div class="column is-12">
            <h2 class="has-text-centered has-text-weight-semibold">
              Sipariş Ayrıntı Tablosu
            </h2>
          </div>
          <div class="column is-12">
            <DataTable
              :value="efinans_ayrinti_list"
              :scrollable="true"
              scrollHeight="360px"
              dataKey="id"
              selectionMode="single"
              v-model:selection="select_ayrinti"
              :loading="ayrinti_loading"
              @row-select="select_ayrinti_sec($event)"
              v-model:filters="filters"
            >
              <Column field="siparisno" bodyStyle="text-align:center;">
                <template #body="slotProps">
                  <div class="isMobile">
                    {{ slotProps.data.siparisno }}
                  </div>
                </template>
              </Column>
              <Column
                field="yuklemetarihi"
                header="Yükleme Tarihi"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  <div class="isMobile">
                    {{ slotProps.data.yuklemetarihi }}
                  </div>
                </template>
              </Column>
              <Column
                field="tip"
                header="Status"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  <div
                    :class="
                      slotProps.data.tip == 'Üretim' ? 'genel_status' : ''
                    "
                  >
                    <div class="isMobile">
                      {{ slotProps.data.tip }}
                    </div>
                  </div>
                </template>
              </Column>
              <Column
                field="toplam"
                header="Total"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  <div class="isMobile">
                    {{ formatPrice(slotProps.data.toplam) }}
                  </div>
                </template>
              </Column>

              <Column
                field="kalan"
                header="Kalan"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  <div class="isMobile">
                    {{ formatPrice(slotProps.data.kalan) }}
                  </div>
                </template>

                <template #footer>
                  <div class="isMobile">
                    {{ formatPrice(efinans_ayrinti_kalan_toplam) }}
                  </div>
                </template>
              </Column>
              <Column
                field="vade"
                header="Vade"
                bodyStyle="text-align:center;"
                v-if="isMobile > 576"
              >
                <template #body="slotProps">
                  <div class="isMobile">
                    {{ slotProps.data.vade }}
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="columns is-multiline">
          <div class="column is-12">
            <h2 class="has-text-centered has-text-weight-semibold">
              Gelen Ödemeler
            </h2>
          </div>
          <div class="column is-12">
            <DataTable
              :value="efinans_ayrinti_odeme_list"
              :scrollable="true"
              scrollHeight="420px"
              dataKey="id"
              selectionMode="single"
              v-model:selection="select_odeme"
              :loading="odeme_loading"
              @row-select="odemeSecim($event)"
            >
              <Column
                field="tarih"
                header="Ödeme Tarihi"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  {{ slotProps.data.tarih }}
                </template>
              </Column>
              <Column
                field="tutar"
                header="Tutar"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.tutar) }}
                </template>
                <template #footer>
                  {{ formatPrice(efinans_ayrinti_odeme_toplam) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="is_ödeme_ayrinti_form" :modal="true" maximizable>

        <EfesFinansAyrintiMusteriOdeme />

      </Dialog>
      <Dialog
        v-model:visible="is_tahsilat_form"
        v-model:header="tahsilat_form_baslik"
        :modal="true"
        maximizable
      >
        <EfesTahsilat />
      </Dialog>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import service from "@/service/EfesFinansService";
import EfesTahsilat from "./EfesTahsilat";
import EfesFinansAyrintiMusteriOdeme from "./EfesFinansAyrintiMusteriOdeme";
import socket from "@/service/SocketService";
export default {
  components: {
    EfesTahsilat,
    EfesFinansAyrintiMusteriOdeme,
  },
  created() {
    this.isMobile = window.innerWidth;

    socket.siparis.on("tahsilat_kayitdegisim_emit", () => {
      this.secim_loading = true;
      this.ayrinti_loading = true;
      this.odeme_loading = true;

      let musteri_id = this.efinans_ayrinti_list[0].musteri_id;
      service.getEfesFinansAyrintiListYukle(musteri_id).then((data) => {
        this.$store.dispatch("efinansAyrintiListYukleAct", data);

        this.secim_loading = false;
        this.ayrinti_loading = false;
        this.odeme_loading = false;
      });
    });
  },
  data() {
    return {
      isMobile: null,
      filters: {},
      select_ayrinti: null,
      select_odeme: null,
      secim_loading: false,
      is_tahsilat: true,
      ayrinti_loading: false,
      is_tahsilat_form: false,
      tahsilat_form_baslik: "",
      siparisno: "",
      odeme_loading: false,
      is_ödeme_ayrinti_form: false,
      excel_cikti: "ayrinti_listesi",
    };
  },
  computed: {
    ...mapGetters([
      "efinans_ayrinti_list",
      "efinans_ayrinti_kalan_toplam",
      "efinans_ayrinti_odeme_list",
      "efinans_ayrinti_siparis_pesinat",
      "efinans_ayrinti_siparis_odenen_tutar",

      "efinans_ayrinti_odeme_toplam",
      "efinans_odeme_secim_toplam",
      "efinans_odeme_secim_list",
      "servis_adres",
    ]),
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    odemeSecim(event) {
      this.select_odeme = event.data;
      let tarih = event.data.tarih;
      let musteri_id = this.efinans_ayrinti_list[0].musteri_id;
      this.secim_loading = true;
      service.getEfesFinansOdemeSecimList(musteri_id, tarih).then((data) => {
        this.$store.dispatch("efesfinansOdemeSecimListYukleAct", data);
        this.is_ödeme_ayrinti_form = true;
        this.secim_loading = false;
      });
    },
    select_ayrinti_sec(event) {
      this.select_ayrinti = event.data;
      this.is_tahsilat = false;
      this.siparisno = event.data.siparisno;
    },
    tahsilat_form_ac() {
      this.ayrinti_loading = true;
      const item = this.efinans_ayrinti_list[0];
      this.is_tahsilat = true;
      this.tahsilat_form_baslik = item.musteriadi;
      service
        .getEfesMusteriTahsilatListe(item.musteri_id, this.siparisno)
        .then((data) => {
          const result_data = data;
          result_data.musteri_data.bakiye = this.select_ayrinti.kalan;
          this.$store.dispatch("efestahsilatLoadAct", result_data);
          this.ayrinti_loading = false;
          this.is_tahsilat_form = true;
        });
    },
    excel_cikti_click() {},
  },
};
</script>
<style scoped>
.p-datatable {
  font-size: 11px;
}
.genel_status {
  background-color: #98f5ff;
}
.kalan_borc {
  background-color: #cd9b1d;
  color: white;
  font-weight: bold;
}
.odeme_kalan {
  background-color: #cc6666;
  color: white;
  font-weight: bold;
}
.odeme_yok {
  background-color: #7aa998;
  color: white;
  font-weight: bold;
}
.isMobile {
  word-break: break-all;
}
</style>

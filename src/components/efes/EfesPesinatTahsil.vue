<template>
  <section>
    <div class="columns is-multiline">
      <div class="column is-3">
        <span class="p-float-label">
          <Calendar
            id="tarih"
            type="text"
            v-model="tarih"
            :disabled="is_form"
          />
          <label for="tarih">Ödeme Tarihi</label>
        </span>
      </div>
      <div class="column is-3">
        <span class="p-float-label">
          <InputText
            id="order"
            v-model="pesinat_model.siparis_no"
            :disabled="true"
          />
          <label for="order">Sipariş No</label>
        </span>
      </div>
      <div class="column is-3">
        <span class="p-float-label">
          <currency-input
            id="tutar"
            type="text"
            v-model="pesinat_model.tutar"
            :disabled="is_form"
          />
          <label for="tutar">Tutar</label>
        </span>
      </div>
      <div class="column is-3">
        <span class="p-float-label">
          <currency-input
            id="masraf"
            type="text"
            v-model="pesinat_model.masraf"
            :disabled="is_form"
          />
          <label for="masraf">Masraf</label>
        </span>
      </div>
      <div class="column is-12">
        <span class="p-float-label">
          <Textarea
            id="aciklama"
            type="text"
            v-model="pesinat_model.aciklama"
            :disabled="is_form"
          />
          <label for="aciklama">Not</label>
        </span>
      </div>
    </div>
    <div class="columns is-multiline is-centered">
      <div class="column is-2">
        <Button
          class="p-button-success"
          :disabled="is_kaydet"
          @click="kaydet_click_event"
          label="Kaydet"
        />
      </div>
      <div class="column is-2">
        <Button
          class="p-button-info"
          :disabled="is_vazgec"
          @click="vazgec_click_event"
          label="Vazgeç"
        />
      </div>
    </div>
    <div class="columns">
      <div class="column is-10">
        <DataTable
          :value="epesinat_islem_listesi"
          v-model:selection="select_pesinat"
          selectionMode="single"
          responsiveLayout="scroll"
          @row-select="tahsilat_select_event($event)"
        >
          <Column field="musteri_adi" header="Müşteri"></Column>
          <Column field="siparis_no" header="Sipariş No"></Column>
          <Column field="tutar" header="Tutar">
            <template #body="slotProps">
              {{ formatPrice(slotProps.data.tutar) }}
            </template>
            <template #footer>
              {{ formatPrice(pesinat_islem_liste_toplam) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import service from "@/service/EfesFinansService";
import LocalService from "@/service/LocalService";
import socket from "@/service/SocketService";

export default {
  computed: {
    ...mapGetters([
      "epesinat_islem_listesi",
      "epesinat_islem_liste_toplam",
      "epesinat_model",
    ]),
  },
  data() {
    return {
      select_pesinat: null,
      loading_pesinat: false,
      is_form: true,
      tarih: new Date(),
      is_kaydet: true,
      is_vazgec: true,
    };
  },
  localService: null,
  created() {
    this.localService = new LocalService();
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    tahsilat_select_event(event) {
      this.select_pesinat = event;

      this.loading_pesinat = true;

      this.$store.dispatch("eselect_pesinat_model_act", {
        ...this.select_pesinat,
      });
      this.is_vazgec = false;
      this.is_kaydet = false;
      this.is_form = false;
      this.loading_pesinat = false;
    },
    vazgec_click_event() {
      this.$store.dispatch("enew_pesinat_model_act");

      this.is_kaydet = true;
      this.is_vazgec = true;
    },

    kaydet_click_event() {
      this.is_kaydet = true;
      this.is_vazgec = true;

      this.loading_pesinat = true;

      const store_data = {
        pesinat_model: this.pesinat_model,
        tarih: this.localService.getDateString(this.tarih),
      };

      service
        .finansPesinatKaydet(store_data)
        .then((res) => {
          if (res.status) {
            service.getEfesPesinatIslemListesi().then((data) => {
              socket.siparis.emit(
                "tahsilat_kayitdegisim_event",
                this.pesinat_model.siparis_no
              );
              this.$store.dispatch("enew_pesinat_model_act");
              this.$store.dispatch("epesinat_listesi_yukle_act", data);
              this.loading_pesinat = false;
            });
          } else {
            this.is_kaydet = false;
            this.is_vazgec = false;
          }
        })
        .catch(() => {
          alert("Beklenmeyen Bir Hata Oluştu.");
          this.loading_pesinat = false;
          this.is_kaydet = false;
          this.is_vazgec = false;
        });
    },
  },
};
</script>

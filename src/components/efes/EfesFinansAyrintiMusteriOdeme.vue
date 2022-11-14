<template>
  <section>
    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="columns is-multiline">
          <div class="column is-12">
            <h2 class="has-text-centered has-text-weight-semibold">
              Ödeme Ayrıntı
            </h2>
          </div>
          <div class="column is-12">
            <DataTable
              :value="efinans_odeme_secim_list"
              :scrollable="true"
              scrollHeight="350%"
              selectionMode="single"
            >
              <Column
                field="siparisno"
                header="Sipariş No"
                headerStyle="width:8px;"
              >
                <template #body="slotProps">
                  {{ slotProps.data.siparisno }}
                </template>
              </Column>
              <Column field="aciklama" header="Not" headerStyle="width:13px;">
                <template #body="slotProps">
                  {{ slotProps.data.aciklama }}
                </template>
              </Column>

              <Column
                field="tutar"
                header="Tutar"
                headerStyle="background-color:#7aa998;width:8px;"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.tutar) }}
                </template>
                <template #footer>
                  {{ formatPrice(efinans_odeme_secim_toplam) }}
                </template>
              </Column>
              <Column field="masraf" header="Masraf" headerStyle="width:5px;">
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.masraf) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import service from "@/service/EfesFinansService";
import socket from "@/service/SocketService";
export default {
  created() {
    socket.siparis.on("tahsilat_kayitdegisim_emit", () => {

      let musteri_id = this.finans_ayrinti_list[0].musteri_id;
      service.getEfesFinansAyrintiListYukle(musteri_id).then((data) => {
        this.$store.dispatch("efesfinansAyrintiListYukleAct", data);
      });
    });
  },
  data() {
    return {
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
      excel_cikti: "ayrinti_listesi",
    };
  },
  computed: {
    ...mapGetters([
      "efinans_ayrinti_list",
      "efinans_ayrinti_kalan_toplam",
      "efinans_ayrinti_odeme_list",
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
  },
};
</script>
<style scoped>
.p-datatable {
  font-size: 10px;
}
</style>

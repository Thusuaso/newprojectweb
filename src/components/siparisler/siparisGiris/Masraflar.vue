<template>
  <div class="p-fluid">
    <div class="p-grid">
      <div class="p-col-12">
        <Card>
          <template #content>
            <DataTable
              v-model:value="masrafListesi"
              v-model:selection="selectMasraf"
              dataKey="id"
            >
              <template #header>
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <span style="font-size: 15px">Masraf Listesi</span>
                  </div>
                </div>
              </template>
              <Column field="tur" header="Fatura Adı">
                <template #body="slotProps">
                  {{ slotProps.data.tur }}
                </template>
              </Column>
              <Column field="aciklama" header="Fatura Açıklama">
                <template #body="slotProps">
                  {{ slotProps.data.aciklama }}
                </template>
              </Column>
              <Column
                field="tutar"
                header="Tutar"
                headerStyle="width:150px;"
                bodyStyle="text-align:center;"
              >
                <template #body="slotProps">
                  {{ formatPrice(slotProps.data.tutar) }}
                </template>
                <template #footer>
                  {{ formatPrice(masrafToplam) }}
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import SiparisService from "@/service/SiparisService";
export default {
  data() {
    return {
      selectMasraf: null,
      masrafListesi: null,
      masrafToplam: 0,
    };
  },
  props: ["siparisNo", "yeniSiparis"],
  siparisService: null,
  created() {
    this.siparisService = new SiparisService();
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  mounted() {
    if (!this.yeniSiparis) {
      this.siparisService.getMasrafListesi(this.siparisNo).then((data) => {
        this.masrafListesi = data;

        for (let key in this.masrafListesi) {
          this.masrafToplam += this.masrafListesi[key].tutar;
        }
      });
    }
  },
};
</script>
<style scoped>
.p-card {
  min-height: 300px;
}
</style>

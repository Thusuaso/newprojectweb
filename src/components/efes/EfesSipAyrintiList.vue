<template>
  <div>
    <DataTable
      :value="efinans_gelen_sip_bilgileri_ayrinti"
      responsiveLayout="scroll"
    >
      <Column field="kategori" header="Kategori">
        <template #body="slotProps">
          {{ slotProps.data.kategori }}
        </template>
      </Column>

      <Column field="urunAdi" header="Ürün Adı">
        <template #body="slotProps">
          {{ slotProps.data.urunAdi }}
        </template>
      </Column>
      <Column field="yuzey" header="Yüzey" headerStyle="width:250px;">
        <template #body="slotProps">
          {{ slotProps.data.yuzey }}
        </template>
      </Column>
      <Column field="en" header="En">
        <template #body="slotProps">
          {{ slotProps.data.en }}
        </template>
      </Column>
      <Column field="boy" header="Boy">
        <template #body="slotProps">
          {{ slotProps.data.boy }}
        </template>
      </Column>
      <Column field="kenar" header="Kenar">
        <template #body="slotProps">
          {{ slotProps.data.kenar }}
        </template>
      </Column>
      <Column field="miktar" header="Miktar">
        <template #body="slotProps">
          {{ slotProps.data.miktar }}
        </template>
        <template #footer>
          {{ formatDecimal(efinans_gelen_sip_bilgileri_ayrinti_miktar_top) }}
        </template>
      </Column>
      <Column field="urunBirim" header="Ürün Birim">
        <template #body="slotProps">
          {{ slotProps.data.urunBirim }}
        </template>
      </Column>
      <Column field="satisFiyati" header="Satış Fiyatı">
        <template #body="slotProps">
          {{ formatPrice(slotProps.data.satisFiyati) }}
        </template>
      </Column>
      <Column field="satisToplami" header="Satış Toplamı">
        <template #body="slotProps">
          {{ formatPrice(slotProps.data.satisToplami) }}
        </template>
        <template #footer>
          {{ formatPrice(efinans_gelen_sip_bilgileri_ayrinti_sip_mik_top) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "efinans_gelen_sip_bilgileri_ayrinti",
      "efinans_gelen_sip_bilgileri_ayrinti_sip_mik_top",
      "efinans_gelen_sip_bilgileri_ayrinti_miktar_top",
    ]),
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    formatDecimal(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>

<style scoped></style>

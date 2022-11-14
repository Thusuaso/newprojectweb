<template>
  <div>
    <DataTable
      :value="odemeler"
      responsiveLayout="scroll"
      @row-select="isSelectedRow"
      selectionMode="single"
      v-model:filters="filters"
      filterDisplay="menu"
    >
      <Column field="musteri_adi" header="Müşteri Adı">
        <template #body="slotProps">
          {{ slotProps.data.musteri_adi }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Search by Customer"
          />
        </template>
      </Column>
      <Column
        field="tutar"
        header="Ödenen Toplam"
        bodyStyle="text-align:center;"
      >
        <template #body="slotProps">
          {{ formatPrice(slotProps.data.tutar) }}
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="isSelected"
      :modal="true"
      v-model:header="musteriAdi"
      maximizable
      position="top"
    >
      <section>
        <OdemelerFinans
          :musteriAdi="musteriAdi"
          :musteriId="musteriId"
        ></OdemelerFinans>
      </section>
    </Dialog>
  </div>
</template>

<script>
import service from "@/service/FinansService";
import OdemelerFinans from "@/components/odemeler/OdemelerFinansAyrintiListesi.vue";
import { FilterMatchMode } from "primevue/api";
export default {
  components: {
    OdemelerFinans,
  },
  data() {
    return {
      odemeler: null,
      isSelected: false,
      musteriId: "",
      musteriAdi: "",
      filters: {
        musteri_adi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
    };
  },
  created() {
    this.$store.dispatch("loadingBeginAct");

    service.getOdemelerTablosu().then((data) => {
      this.odemeler = data;
      this.$store.dispatch("loadingEndAct");
    });
  },
  methods: {
    isSelectedRow(event) {
      this.isSelected = true;
      this.musteriId = event.data.Id;
      this.musteriAdi = event.data.musteri_adi;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>
<style scoped></style>

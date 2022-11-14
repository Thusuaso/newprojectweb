<template>
  <div>
    <AutoComplete
      v-model="selectedPo"
      :dropdown="true"
      :suggestions="filteredOrders"
      @complete="poChangeEvent($event)"
      placeholder="Select a Order"
      field="siparisNo"
      @item-select="isSelectedPo($event)"
    />

    <div class="columns is-gapless" v-show="is_select_year">
      <div class="column">
        <DataTable :value="products" showGridlines responsiveLayout="scroll">
          <template #header> Sipariş Kalan Bilgisi Tablosu </template>
          <Column
            field="kategori"
            header="Kategori"
            headerStyle="width:10%;"
            bodyStyle="text-align:left"
          >
          </Column>
          <Column
            field="urunAdi"
            header="Ürün Adı"
            headerStyle="width:10%;"
            bodyStyle="text-align:left"
          >
          </Column>
          <Column
            field="yuzey"
            header="Yüzey"
            headerStyle="width:15%;"
            bodyStyle="text-align:left"
          ></Column>
          <Column
            field="boyut"
            header="EnxBoyxKenar"
            headerStyle="width:12%;"
            bodyStyle="text-align:left"
          >
          </Column>
          <Column
            field="miktar"
            header="Miktar"
            headerStyle="width:9%;"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ formatDecimal(slotProps.data.miktar) }}
            </template>
          </Column>
          <Column
            field="birim"
            header="Birim"
            headerStyle="width:5%;"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              <div :style="{ backgroundColor: slotProps.data.birimBackground }">
                {{ slotProps.data.birim }}
              </div>
            </template>
          </Column>
          <Column
            field="uretimMiktari"
            header="Üretim Miktarı"
            headerStyle="width:8%;"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ formatDecimal(slotProps.data.uretimMiktari) }}
            </template>
          </Column>
          <Column
            field="uretimAdet"
            header="Üretim Adet"
            headerStyle="width:8%;"
            bodyStyle="text-align:center"
          ></Column>
          <Column
            field="kalanBilgisi"
            header="Kalan Bilgisi"
            headerStyle="width:12%;"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              <div
                :style="{
                  backgroundColor: slotProps.data.kalanRenk,
                  color: slotProps.data.fontColor,
                }"
              >
                {{ slotProps.data.kalanBilgisi }}
              </div>
            </template>
          </Column>
          <Column
            field="kalanMiktar"
            header="Kalan Miktar"
            headerStyle="width:8%;"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ formatDecimal(slotProps.data.kalanMiktar) }}
            </template>
          </Column>

          <Column
            field="kalanAdet"
            header="Kalan Adet"
            headerStyle="width:8%;"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ slotProps.data.kalanAdet }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

  </div>
</template>
<script>
import service from "@/service/RaporService";
export default {
  data() {
    return {
      is_select_year: false,
      selectedPo: null,
      orders: [],
      products: null,
      filteredOrders: [],
    };
  },
  created() {
    service.getAllOrders().then((data) => {
      this.orders = data;
    });
  },
  methods: {
    isSelectedPo(event) {
      service.getOrder(event.value.siparisNo).then((data) => {
        this.products = data;
        this.is_select_year = true;
      });
    },
    formatDecimal(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    poChangeEvent(event) {
      setTimeout(() => {
        let result;

        if (event.query.length == 0) result = [...this.orders];
        else {
          result = this.orders.filter((x) => {
            return x.siparisNo
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }

        this.filteredOrders = result;
      }, 250);
    },
  },
};
</script>
<style scoped>
.isMobile {
  word-break: break-all;
  font-size: 8px;
}
</style>

<template>
  <section>
    <div class="column is-12" style="margin-left: -11px">
      <Dropdown
        v-model="select_yil"
        :options="yil_listesi"
        @change="YilSecim(select_yil.yil)"
        optionLabel="yil"
        placeholder="Select a Year"
      >
        <template #value="slotProps">
          <div class="p-dropdown-car-value">
            <span>{{ slotProps.value.yil }}</span>
          </div>
        </template>
      </Dropdown>
    </div>
    <div class="columns is-multiline is-centered">
      <div class="column is-9 is-centered">
        <DataTable
          :value="liste"
          selectionMode="single"
          :sortOrder="-1"
          :scrollable="true"
          scrollHeight="490px"
          v-model:selection="select"
          v-model:filters="filters"
          filterDisplay="menu"
          dataKey="id"
          @row-select="depo_item_sec($event)"
          @filter="isNumuneFinans"
        >
          <template #header>
            <div class="columns is-multiline">
              <div class="column is-12">
                <span style="font-size: 14px"> Numune Alacak Listesi</span>
              </div>
            </div>
          </template>

          <Column
            field="musteriadi"
            header="Müşteri"
            headerStyle="font-size:10px;"
            bodyStyle="text-align:left;"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ slotProps.data.musteriadi }}
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
                placeholder="Search by Customer"
                v-tooltip.top.focus="'Filter as you type'"
              />
            </template>
          </Column>

          <Column
            field="kuryeAlis"
            header="USD-Alış"
            bodyStyle="text-align:center;"
            headerStyle="background-color:#EC7063 ;color:white"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ formatPriceDolar(slotProps.data.kuryeAlis) }}
              </div>
            </template>

            <template #footer>
              <div class="isMobile">
                {{ formatPriceDolar(kuryeAlis_toplam) }}
              </div>
            </template>
          </Column>
          <Column
            field="kuryeSatis"
            header="USD-Satış"
            bodyStyle="text-align:center;"
            headerStyle="background-color:#45B39D ;color:white"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ formatPriceDolar(slotProps.data.kuryeSatis) }}
              </div>
            </template>

            <template #footer>
              <div class="isMobile">
                {{ formatPriceDolar(kuryeSatis_toplam) }}
              </div>
            </template>
          </Column>
          <Column
            field="TL_Alis"
            header="TL-Alış"
            bodyStyle="text-align:center;"
            headerStyle="background-color:#EC7063 ;color:white"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ formatPriceTL(slotProps.data.TL_Alis) }}
              </div>
            </template>
            <template #footer>
              <div class="isMobile">
                {{ formatPriceTL(TLAlis_Toplam) }}
              </div>
            </template>
          </Column>
          <Column
            field="TL_Satis"
            header="TL-Satış"
            bodyStyle="text-align:center;"
            headerStyle="background-color:#45B39D ;color:white"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ formatPriceTL(slotProps.data.TL_Satis) }}
              </div>
            </template>

            <template #footer>
              <div class="isMobile">
                {{ formatPriceTL(TLSatis_Toplam) }}
              </div>
            </template>
          </Column>
          <Column
            field="Euro_Alis"
            header="EUR-Alış"
            bodyStyle="text-align:center;"
            headerStyle="background-color:#EC7063 ;color:white"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ formatPriceEuro(slotProps.data.Euro_Alis) }}
              </div>
            </template>

            <template #footer>
              <div class="isMobile">
                {{ formatPriceEuro(EuroAlis_Toplam) }}
              </div>
            </template>
          </Column>
          <Column
            field="Euro_Satis"
            header="EUR-Satış"
            bodyStyle="text-align:center;"
            headerStyle="background-color:#45B39D ;color:white"
          >
            <template #body="slotProps">
              <div class="isMobile">
                {{ formatPriceEuro(slotProps.data.Euro_Satis) }}
              </div>
            </template>
            <template #footer>
              <div class="isMobile">
                {{ formatPriceEuro(EuroSatis_Toplam) }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="column is-3 is-centered">
        <DataTable
          :value="banka_list"
          :sortOrder="-1"
          :scrollable="true"
          scrollHeight="490px"
        >
          <template #header>
            <div class="columns is-multiline">
              <div class="column is-12">
                <span style="font-size: 14px"> Bankaya Gelen Ödeme Tutarı</span>
              </div>
            </div>
          </template>
          <Column field="banka" header="Banka" bodyStyle="text-align:center;">
            <template #body="slotProps">
              {{ slotProps.data.banka }}
            </template>
          </Column>
          <Column field="bedel" header="Total" bodyStyle="text-align:center;">
            <template #body="slotProps">
              {{ formatPriceDolar(slotProps.data.bedel) }}
            </template>
            <template #footer>
              {{ formatPriceDolar(banka_toplami) }}
            </template>
          </Column>
        </DataTable>
      </div>
      <Dialog
        v-model:visible="is_form"
        v-model:header="form_baslik"
        :modal="true"
        position="top"
        maximizable
      >
        <numuneMasraflar :select_depo="select_depo" />
      </Dialog>
    </div>
  </section>
</template>
<script>
import service from "@/service/NumuneService";
import numuneMasraflar from "@/components/numuneler/numuneMasraflar";
import { FilterMatchMode } from "primevue/api";
export default {
  components: {
    numuneMasraflar,
  },
  data() {
    return {
      select_depo: 0,
      banka_toplami: 0,
      select: null,
      is_form: false,
      form_baslik: "",
      liste: {},
      banka_list: null,
      filters: {
        musteriadi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      kuryeSatis_toplam: 0,
      kuryeAlis_toplam: 0,
      TLAlis_Toplam: 0,
      TLSatis_Toplam: 0,
      EuroAlis_Toplam: 0,
      EuroSatis_Toplam: 0,
      yil_listesi: null,
      select_yil: null,
      yil_baslik: "",
    };
  },

  created() {
    this.$store.dispatch("loadingBeginAct");

    service.getNumuneYilListesi().then((data) => {
      this.yil_listesi = data.yil_listesi;
      this.select_yil = this.yil_listesi[0];

      service.getNumuneFinansListesi(this.select_yil.yil).then((data) => {
        this.liste = data.numune_list;
        this.banka_list = data.banka_list;
        this.genel_toplam(this.liste);
        this.banka_toplam(this.banka_list);
        this.$store.dispatch("loadingEndAct");
      });
    });
  },
  mounted() {},
  methods: {
    isNumuneFinans(event) {
      this.genel_toplam(event.filteredValue);
    },
    banka_toplam(liste) {
      this.banka_toplami = 0;

      for (let key in liste) {
        const item = liste[key];

        this.banka_toplami += item.bedel;
      }
    },
    YilSecim(select_yil) {
      this.$store.dispatch("loadingBeginAct");

      service.getNumuneFinansListesi(select_yil).then((data) => {
        this.liste = data.numune_list;
        this.banka_list = data.banka_list;
        this.genel_toplam(this.liste);
        this.banka_toplam(this.banka_list);
        this.$store.dispatch("loadingEndAct");
      });
    },
    genel_toplam(liste) {
      this.kuryeSatis_toplam = 0;
      this.kuryeAlis_toplam = 0;
      this.TLAlis_Toplam = 0;
      this.TLSatis_Toplam = 0;
      this.EuroAlis_Toplam = 0;
      this.EuroSatis_Toplam = 0;

      for (let key in liste) {
        const item = liste[key];

        this.kuryeSatis_toplam += item.kuryeSatis;
        this.kuryeAlis_toplam += item.kuryeAlis;
        this.TLAlis_Toplam += item.TL_Alis;
        this.TLSatis_Toplam += item.TL_Satis;
        this.EuroAlis_Toplam += item.Euro_Alis;
        this.EuroSatis_Toplam += item.Euro_Satis;
      }
    },
    formatPriceDolar(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");

      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    formatPriceTL(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");

      return "₺" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    formatPriceEuro(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");

      return "€" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    depo_item_sec(event) {
      this.select_depo = event.data.id;
      this.form_baslik = event.data.musteriadi;

      this.$store.dispatch("seleksiyonSelectItemActions");
      this.is_form = true;
    },
  },
};
</script>

<style scoped>
.p-datatable {
  font-size: 12px;
}
@media screen and (max-width: 576px) {
  .isMobile {
    font-size: 10px;
    word-break: break-all;
  }
}
</style>

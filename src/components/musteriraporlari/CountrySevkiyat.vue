<template>
  <div>
    <div id="statuSecim" class="column is-5">
      <Button
        @click="get_ulke_bazinda_excell_cikti"
        icon="fa-solid fa-file-excel fa-2xl"
        />

      <RadioButton
        class="yilradiobutton"
        name="year"
        :value="onceki_yil"
        v-model="year"
        @change="isSelected"
      /><span>{{ onceki_yil }}</span>
      <RadioButton
        class="yilradiobutton"
        name="year"
        :value="gecen_yil"
        v-model="year"
        @change="isSelected"
      /><span>{{ gecen_yil }}</span>
      <RadioButton
        class="yilradiobutton"
        name="year"
        :value="bu_yil"
        v-model="year"
        @change="isSelected"
      />
      <span>{{ bu_yil }}</span>
      <RadioButton
        class="yilradiobutton"
        name="year"
        value="Hepsi"
        v-model="year"
        @change="isSelected"
      /><span>Hepsi</span>
    </div>
    <div class="card">
      <DataTable
        :value="isSelectedYear ? countrySevkiyatYear : countrySevkiyat"
        responsiveLayout="scroll"
        v-model:filters="filters"
        filterDisplay="menu"
      >
        <Column
          field="ulkeid"
          header="Ülke Id"
          :sortable="true"
          bodyStyle="textAlign:center"
          headerStyle="width:150px;"
        >
          <template #body="slotProps">
            {{ slotProps.data.ulkeid }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              placeholder="Search by Id"
            />
          </template>
        </Column>
        <Column
          field="ulkeadi"
          header="Ülke Adı"
          :sortable="true"
          bodyStyle="textAlign:center"
        >
          <template #body="slotProps">
            {{ slotProps.data.ulkeadi }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              placeholder="Search by Country"
            />
          </template>
        </Column>
        <Column
          field="toplamsevkiyat"
          header="Toplam Sevkiyat"
          :sortable="true"
          bodyStyle="textAlign:center"
        >
          <template #body="slotProps">
            {{ formatPrice(slotProps.data.toplamsevkiyat) }}
          </template>
          <template #footer>
            {{ formatPrice(sevkiyatGenelToplam) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<script>
import service from "@/service/RaporService";
import { mapGetters } from "vuex";
import { FilterMatchMode } from "primevue/api";
export default {
  data() {
    return {
      data: null,
      onceki_yil: 0,
      gecen_yil: 0,
      bu_yil: 0,
      year: "Hepsi",
      countrySevkiyat: null,
      countrySevkiyatYear: null,
      sevkiyatGenelToplam: 0,
      isSelectedYear: false,
      filters: {
        ulkeid: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        ulkeadi: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
    };
  },
  created() {
    service.getUlkeBazindaSevkiyat().then((data) => {
      this.countrySevkiyat = data;
      this.sevkiyatToplam(data);
    });
    var tarih = new Date();
    this.onceki_yil = tarih.getFullYear() - 2;
    this.gecen_yil = tarih.getFullYear() - 1;
    this.bu_yil = tarih.getFullYear();
  },
  computed: {
    ...mapGetters(["servis_adres"]),
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    sevkiyatToplam(datas) {
      for (let i in datas) {
        this.sevkiyatGenelToplam += datas[i].toplamsevkiyat;
      }
    },
    get_ulke_bazinda_excell_cikti() {
      if (this.isSelectedYear == true) {
        this.data = this.countrySevkiyatYear;
      } else {
        this.data = this.countrySevkiyat;
      }

      service.get_ulk_sevk_top_excell_cikti(this.data).then((response) => {
        if (response.status) {
          const link = document.createElement("a");
          link.href = this.servis_adres + "raporlar/musteri/ulkebzindaSevkiyat";
          //link.href = "http://localhost:5000/raporlar/musteri/musteriexcellCikti"
          link.setAttribute("download", "ulke_bazinda_sevkiyat.xlsx");
          document.body.appendChild(link);
          link.click();
          this.is_excel = false;
        }
      });
    },
    isSelected() {
      if (this.year == "Hepsi") {
        this.isSelectedYear = false;
        service.getUlkeBazindaSevkiyat().then((data) => {
          this.countrySevkiyat = data;
          this.sevkiyatToplam(data);
        });
      } else {
        this.isSelectedYear = true;
        service.getUlkeBazindaSevkiyatYear(this.year).then((data) => {
          this.countrySevkiyatYear = data;
        });
      }
    },
  },
};
</script>
<style scoped>
.yilradiobutton {
  margin-left: 5px;
  margin-right: 5px;
}
</style>

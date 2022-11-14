<template>
  <section>
    <div class="columns is-multiline is-centered">
      <div class="column is-4">
        <Dropdown
          v-model="select_yil"
          :options="yil_listesi"
          optionLabel="yil"
          @change="yil_degisim_event"
          placeholder="Select a Year"
          :disabled="is_form"
        />
      </div>
      <div class="column is-4">
        <Dropdown
          v-model="select_aystr"
          :options="ay_listesi"
          optionLabel="ay_str"
          @change="ay_degisim_event"
          placeholder="Select a Month"
          :disabled="is_form"
        />
      </div>
      <div class="column is-4">
        <Button
          class="p-button-primary"
          @click="excel_cikti_click"
          label="Excel"
        />
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-11">
        <DataTable
          :value="odeme_listesi"
          :scrollable="true"
          scrollHeight="365px"
          :loading="loading"
        >
          <Column header="Ödeme Tarihi" field="tarih" headerStyle="width:10%">
            <template #body="slotProps">
              {{ slotProps.data.tarih }}
            </template>
          </Column>
          <Column
            header="Müşteri Adı"
            headerStyle="width:25%"
            field="musteriadi"
          >
            <template #body="slotProps">
              {{ slotProps.data.musteriadi }}
            </template>
          </Column>
          <Column header="Sipariş Numarası" headerStyle="width:25%" field="po">
            <template #body="slotProps">
              <div
                :class="slotProps.data.status == 'Numune' ? 'genel_status' : ''"
              >
                {{ slotProps.data.po }}
              </div>
            </template>
          </Column>
          <Column
            header="Tutar"
            field="tutar"
            headerStyle="background-color:#7aa998;width:15%"
            sortable="true"
          >
            <template #body="slotProps">
              {{ formatPrice(slotProps.data.tutar) }}
            </template>
            <template #footer>
              {{ formatPrice(odeme_toplam) }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>
<script>
import service from "@/service/FinansService";
export default {
  data() {
    return {
      yil_listesi: null,
      ay_listesi: null,
      odeme_listesi: null,
      loading: false,
      select_yil: "",
      select_aystr: "",
      select_ay: "",
      is_form: true,
      odeme_toplam: 0,
    };
  },
  created() {
    service.getMusteriOdemeYilListesi().then((yil_list) => {
      this.yil_listesi = yil_list;
      this.select_yil = yil_list[0].yil;
      this.loading = true;

      service.getMusteriOdemeAyListesi(this.select_yil).then((ay_list) => {
        this.ay_listesi = ay_list;
        this.select_aystr = ay_list[0].ay_str;
        this.select_ay = ay_list[0].ay;

        service
          .getMusteriOdemeListesi(this.select_yil, this.select_ay)
          .then((odeme_list) => {
            for (let key in odeme_list) {
              this.odeme_toplam += odeme_list[key].tutar;
            }
            this.odeme_listesi = odeme_list;
            this.loading = false;
            this.is_form = false;
          });
      });
    });
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    yil_degisim_event() {
      this.loading = true;
      this.ay_listesi_yukle();
    },
    ay_degisim_event() {
      this.select_ay = this.ay_listesi.find(
        (x) => x.ay_str == this.select_aystr.ay_str
      ).ay;
      this.loading = true;
      this.odeme_listesi_yukle();
    },
    ay_listesi_yukle() {
      service.getMusteriOdemeAyListesi(this.select_yil.yil).then((data) => {
        this.ay_listesi = data;
        this.select_aystr = data[0].ay_str;
        this.select_ay = data[0].ay;
        this.odeme_listesi_yukle();
      });
    },
    odeme_listesi_yukle() {
      this.odeme_toplam = 0;
      service
        .getMusteriOdemeListesi(this.select_yil.yil, this.select_ay)
        .then((data) => {
          for (let key in data) {
            this.odeme_toplam += data[key].tutar;
          }

          this.odeme_listesi = data;
          this.loading = false;
        });
    },
    excel_cikti_click() {
      alert("excel listesi yapılacak");
    },
  },
};
</script>
<style scoped>
.genel_status {
  background-color: #98f5ff;
}
</style>

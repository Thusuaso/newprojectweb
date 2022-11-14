<template>
  <section>
    <div class="columns is-multiline is-centered">
      <div
        class="columns is-multiline is-centered box"
        style="margin-top: 20px"
      >
        <div class="column is-4">
          <Dropdown
            v-model="select_yil"
            :options="yil_listesi"
            @change="yil_degisim_event"
            optionLabel="yil"
            placeholder="Select a Year"
            :disabled="is_form"
          />
        </div>
        <div class="column is-5">
          <Dropdown
            v-model="select_ay"
            :options="ay_listesi"
            @change="ay_degisim_event"
            optionLabel="ay_str"
            placeholder="Select a Month"
            :disabled="is_form"
          />
        </div>

        <div class="column is-3">
          <Button
            icon="fa-solid fa-file-excel fa-2xl"
            @click="excel_cikti_click"
          />
        </div>
      </div>
    </div>
    <div class="columns is-centered" style="margin-top: 25px">
      <div class="column is-12">
        <DataTable
          :value="odeme_listesi"
          :scrollable="true"
          scrollHeight="365px"
        >
          <Column
            header="ID"
            field="id"
            headerStyle="width:35px"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column
            header="Ödeme Tarihi"
            field="tarih"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ slotProps.data.tarih }}
            </template>
          </Column>
          <Column
            header="Müşteri Adı"
            field="musteriadi"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ slotProps.data.musteriadi }}
            </template>
          </Column>
          <Column
            header="Sipariş Numarası"
            field="siparisno"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ slotProps.data.siparisno }}
            </template>
          </Column>
          <Column
            header="Tutar"
            field="tutar"
            sortable="true"
            bodyStyle="text-align:center"
          >
            <template #body="slotProps">
              {{ slotProps.data.tutar | toCurrency }}
            </template>
            <template #footer>
              {{ odeme_toplam | toCurrency }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>
<script>
import service from "@/service/EfesFinansService";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["servis_adres"]),
  },
  data() {
    return {
      yil_listesi: null,
      ay_listesi: null,
      odeme_listesi: null,
      loading: false,
      select_yil: "",
      select_ay: "",
      is_form: true,
      odeme_toplam: 0,
    };
  },
  created() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    service.getEfesMusteriOdemeYilListesi().then((yil_list) => {
      this.yil_listesi = yil_list;

        this.select_yil = yil_list.filter((x) => x.yil == year)[0];
      
      service
        .getEfesMusteriOdemeAyListesi(this.select_yil.yil)
        .then((ay_list) => {
          this.ay_listesi = ay_list;

            this.select_ay = ay_list.filter((x) => x.ay == month)[0];
          service
            .getEfesMusteriOdemeListesi(this.select_yil.yil, this.select_ay.ay)
            .then((odeme_list) => {
              for (let key in odeme_list) {
                this.odeme_toplam += odeme_list[key].tutar;
              }
              this.odeme_listesi = odeme_list;
              this.is_form = false;
            });
        });
    });
  },
  methods: {
    yil_degisim_event() {
      this.ay_listesi_yukle();
    },
    ay_degisim_event() {
      this.odeme_listesi_yukle();
    },
    ay_listesi_yukle() {
      service.getEfesMusteriOdemeAyListesi(this.select_yil.yil).then((data) => {
        this.ay_listesi = data;
        this.odeme_listesi_yukle();
      });
    },
    odeme_listesi_yukle() {
      this.odeme_toplam = 0;
      service
        .getEfesMusteriOdemeListesi(this.select_yil.yil, this.select_ay.ay)
        .then((data) => {
          for (let key in data) {
            this.odeme_toplam += data[key].tutar;
          }

          this.odeme_listesi = data;
          this.loading = false;
        });
    },
    excel_cikti_click() {
      service.getEfesTahsilatExcelListe(this.odeme_listesi).then((response) => {
        if (response.status) {
          const link = document.createElement("a");
          link.href =
            this.servis_adres + "efesfinans/dosyalar/EfestahsilatExcelCikti";

          link.setAttribute("download", "Tahsilat.xlsx");
          document.body.appendChild(link);
          link.click();
          this.is_excel = false;
          this.musteri_loading = false;
        }
      });
    },
  },
};
</script>

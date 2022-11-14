<template>
  <div class="fluid">
    <div class="p-grid">
      <div class="topHeader">MÜŞTERİ BAZINDA SUNUM RAPORLARI</div>
      <div class="p-col-16">
        <TabView scrollable>
          <TabPanel header="SURA - 1 Müşteri Bazında Yükleme Raporu">
            <MusteriBazinda></MusteriBazinda>
          </TabPanel>

          <TabPanel header="SURA - 2 Müşteri Bazında Gelen Sipariş">
            <musteriBazindaAylik></musteriBazindaAylik>
          </TabPanel>

          <TabPanel header="SURA - 3 Ülkeler Bazında Yükleme">
            <CountrySevkiyat></CountrySevkiyat>
          </TabPanel>

          <TabPanel header="SURA - 4 Üretici Dağılımı">
            <UreticiDagilimi></UreticiDagilimi>
          </TabPanel>
          <TabPanel header="SURA - 5 Nakliye Masrafları">
            <NakliyeMasrafları></NakliyeMasrafları>
          </TabPanel>
          <TabPanel header="SURA - 6 Fob Masrafları">
            <FobMasraflar></FobMasraflar>
          </TabPanel>
          <TabPanel header="SURA - 7 Navlun Masrafları">
            <NavlunMasraflar></NavlunMasraflar>
          </TabPanel>

          <TabPanel header="SURA - 8 Satış & Diğer Masraflar">
            <DigerMasraflar> </DigerMasraflar>
          </TabPanel>

          <TabPanel header="SURA - 9 Mekus Masrafları">
            <MekusMasrafları> </MekusMasrafları>
          </TabPanel>
          <TabPanel header="SURA - 10 Komisyon Masrafları">
            <KomisyonMasrafları> </KomisyonMasrafları>
          </TabPanel>
          <TabPanel header="SURA - 11 Banka ve Evrak Masrafları">
            <BankaVeEvrakMasrafları> </BankaVeEvrakMasrafları>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service/RaporService";
import musteriBazindaAylik from "@/components/musteriraporlari/musteriBazindaAylik.vue";
import { mapGetters } from "vuex";
import MusteriBazinda from "@/components/musteriraporlari/musteriBazinda.vue";
import CountrySevkiyat from "@/components/musteriraporlari/CountrySevkiyat.vue";
import UreticiDagilimi from "@/components/musteriraporlari/ureticiDagilimi";
import NakliyeMasrafları from "@/components/musteriraporlari/NakliyeMasrafları.vue";
import FobMasraflar from "@/components/musteriraporlari/fobMasraflar.vue";
import NavlunMasraflar from "@/components/musteriraporlari/navlunMasraflar.vue";
import DigerMasraflar from "@/components/musteriraporlari/digerMasraflar.vue";
import MekusMasrafları from "@/components/musteriraporlari/mekusMasraflar.vue";
import KomisyonMasrafları from "@/components/musteriraporlari/komisyonMasraflari.vue";
import BankaVeEvrakMasrafları from "@/components/musteriraporlari/bankaVeEvrakMasrafarı.vue";
import MusteriBazindaUretim from "@/components/musteriraporlari/musteriBazindaUretim.vue";

export default {
  components: {
    MusteriBazinda,
    musteriBazindaAylik,
    CountrySevkiyat,
    UreticiDagilimi,
    NakliyeMasrafları,
    FobMasraflar,
    NavlunMasraflar,
    DigerMasraflar,
    MekusMasrafları,
    KomisyonMasrafları,
    BankaVeEvrakMasrafları,
    MusteriBazindaUretim
  },
  data() {
    return {
      musteri_list: null,
      ozel_musteri: null,
      liste: null,
      filters: {},
      rapor: "Hepsi",
    };
  },
  computed: {
    ...mapGetters(["servis_adres"]),
  },
  created() {
    this.$store.dispatch("loadingBeginAct");
    service.getMusteriList().then((data) => {
      this.ozel_musteri = data;
    });

    service.getGenelMusteriList().then((data) => {
      this.musteri_list = data;
      this.liste = data;
      this.$store.dispatch("loadingEndAct");

    });
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    get_musteri_list_excell_cikti_btn() {
      const data = this.musteri_list;
      service.get_musteri_list_excell_cikti(data).then((response) => {
        if (response.status) {
          const link = document.createElement("a");
          link.href =
            this.servis_adres + "raporlar/listeler/musteriBazindaToplamExcell";
          //link.href = "http://localhost:5000/raporlar/musteri/musteriexcellCikti"
          link.setAttribute("download", "musteri_listesi.xlsx");
          document.body.appendChild(link);
          link.click();
          this.is_excel = false;
        }
      });
    },
    statuSecim() {
      //statü değişiminde

      if (this.rapor) {
        let result;

        if (this.rapor == "Hepsi") {
          result = this.liste;
        }
        if (this.rapor == "Mekmar") {
          result = [...this.liste.filter((x) => x.marketing === this.rapor)];
        }

        if (this.rapor == "Ozel") {
          result = this.ozel_musteri;
        }

        this.musteri_list = result;
      }
    },
  },
};
</script>

<style scoped>
.p-datatable {
  font-size: 10px;
}

.topHeader {
  width: 100%;
  height: 100%;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  vertical-align: top;
  text-decoration: none;
  padding: 10px;
}
</style>

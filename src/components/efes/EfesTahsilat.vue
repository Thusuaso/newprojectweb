<template>
  <section>
    <div class="columns">
      <div class="column is-6">
        <div class="columns is-multiline">
          <div class="column is-6">
            <span class="p-float-label">
              <InputText
                id="musteriadi"
                type="text"
                v-model="ethmusteri.musteriadi"
                :disabled="true"
              />
              <label for="musteriadi">Müşteri Adı</label>
            </span>
          </div>
          <div class="column is-6">
            <span class="p-float-label">
              <InputText
                id="siparisno"
                type="text"
                v-model="ethmusteri.siparisno"
                :disabled="true"
              />
              <label for="siparisno">Siparis No</label>
            </span>
          </div>
          <div class="column is-6">
            <span class="p-float-label">
              <Calendar
                id="date"
                type="text"
                v-model="date"
                :disabled="is_form"
              />
              <label for="date">Tarih</label>
            </span>
          </div>
          <div class="column is-6">
            <span class="p-float-label">
              <InputText
                id="bakiye"
                type="text"
                v-model="ethmusteri.bakiye"
                :disabled="true"
              />
              <label for="bakiye">Bakiye</label>
            </span>
          </div>

          <div class="column is-6">
            <span class="p-float-label">
              <InputText
                id="tutar"
                type="text"
                v-model="ethmusteri.tutar"
                :disabled="is_form"
              />
              <label for="tutar">Tutar</label>
            </span>
          </div>
          <div class="column is-6">
            <span class="p-float-label">
              <InputText
                id="masraf"
                type="text"
                v-model="ethmusteri.masraf"
                :disabled="is_form"
              />
              <label for="masraf">Masraf</label>
            </span>
          </div>
          <div class="column is-12">
            <span class="p-float-label">
              <Textarea
                id="aciklama"
                type="text"
                v-model="ethmusteri.aciklama"
              />
              <label for="aciklama">Açıklama</label>
            </span>
          </div>

          <div class="column is-4">
            <Button
              :disabled="is_kaydet"
              label="Kaydet"
              class="p-button-success"
              @click="kaydet_click"
            />
          </div>
          <div class="column is-4">
            <Button
              :disabled="is_degistir"
              class="p-button-info"
              @click="degistir_click"
              label="Değiştir"
            />
          </div>
          <div class="column is-4">
            <Button :disabled="is_sil" label="Sil" @click="sil_click" />
          </div>
        </div>
      </div>
      <div class="column is-6">
        <DataTable
          :value="ethmusteri_list"
          dataKey="id"
          selectionMode="single"
          :selection="select_list"
          :loading="is_loading"
          @row-select="tahsilat_secim($event)"
        >
          <Column field="tarih" header="Tarih" bodyStyle="text-align:center;">
            <template #body="slotProps">
              {{ slotProps.data.tarih }}
            </template>
          </Column>
          <Column
            field="siparisno"
            header="Sipariş No"
            bodyStyle="text-align:center;"
          >
            <template #body="slotProps">
              {{ slotProps.data.siparisno }}
            </template>
          </Column>
          <Column field="tutar" header="Tutar" bodyStyle="text-align:center;">
            <template #body="slotProps">
              {{ slotProps.data.tutar | toCurrency }}
            </template>
            <template #footer>
              {{ ethmusteri_list_toplam_tutar | toCurrency }}
            </template>
          </Column>
          <Column field="masraf" header="Masraf" bodyStyle="text-align:center;">
            <template #body="slotProps">
              {{ slotProps.data.masraf | toCurrency }}
            </template>
            <template #footer>
              {{ ethmusteri_list_toplam_masraf | toCurrency }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import LocalService from "../../service/LocalService";
import socket from "../../service/SocketService";
import service from "../../service/EfesFinansService";
export default {
  data() {
    return {
      is_form: false,
      date: new Date(),
      is_kaydet: false,
      is_sil: true,
      is_degistir: true,
      select_list: null,
      is_loading: false,
    };
  },
  localService: null,

  created() {
    this.localService = new LocalService();
  },
  computed: {
    ...mapGetters([
      "ethmusteri_list_toplam_masraf",
      "ethmusteri_list_toplam_tutar",
      "ethmusteri_list",
      "ethmusteri",
    ]),
  },
  methods: {
    tahsilat_secim(event) {
      this.select_list = event.data;

      this.date = this.localService.getStringDate(event.data.tarih);

      this.$store.dispatch("efestahsilatSecimAct", event.data);
      this.is_kaydet = true;
      this.is_degistir = false;
      this.is_sil = false;
    },
    default_data() {
      service
        .getEfesMusteriTahsilatListe(
          this.ethmusteri.musteri_id,
          this.ethmusteri.siparisno
        )
        .then((data) => {
          this.$store.dispatch("efestahsilatLoadAct", data);
          this.is_loading = false;
          this.is_form = false;
          this.date = new Date();
          this.is_kaydet = false;
          this.is_sil = true;
          this.is_degistir = true;
        });
    },
    kaydet_click() {
      if (!this.date) {
        alert("Tarih Seçiniz..");
        return;
      }

      this.is_loading = true;
      const data = this.ethmusteri;

      data.tarih = this.localService.getDateString(this.date);

      const users = JSON.parse(localStorage.getItem("user"));
      data.kullaniciadi = users.kullaniciAdi;
      console.log(data);

      service.tahsilatKaydetme(data).then((res) => {
        if (res) {
          socket.siparis.emit("tahsilat_kayitdegisim_event", data.siparisno);
          this.default_data();
        }
      });
    },
    degistir_click() {
      if (!this.date) {
        alert("Tarih Seçiniz..");
        return;
      }
      const data = this.ethmusteri;

      data.tarih = this.localService.getDateString(this.date);

      const users = JSON.parse(localStorage.getItem("user"));
      data.kullaniciadi = users.kullaniciAdi;

      service.tahsilatGuncelleme(data).then((res) => {
        if (res) {
          socket.siparis.emit("tahsilat_kayitdegisim_event", data.siparisno);
          this.default_data();
        }
      });
    },
    sil_click() {
      if (!this.date) {
        alert("Tarih Seçiniz..");
        return;
      }
      const id = this.ethmusteri.id;

      service.tahsilatSilme(id).then((res) => {
        if (res) {
          socket.siparis.emit(
            "tahsilat_kayitdegisim_event",
            this.ethmusteri.siparisno
          );
          this.default_data();
        }
      });
    },
  },
};
</script>
<style scoped>
.input-style {
  text-align: center;
}
</style>

<template>
  <div>
    <div class="" style="height: 500px">
      <div class="columns">
        <div class="column is-2">
          <Button
            class="p-button-secondary"
            @click="newProjectDetail('', 'Yeni')"
            :disabled="username_kontrol"
            label="Yeni"
          ></Button>
        </div>
        <div class="column">
          <Button
            class="p-button-danger"
            :disabled="username_kontrol"
            @click="deleteProject"
            >Delete Project</Button
          >
        </div>
      </div>

      <br />
      <div>
        <DataTable
          :value="bgpProjectAyrinti"
          :selected="isSelectedDetail"
          responsiveLayout="scroll"
          selectionMode="single"
          @row-select="newProjectDetail($event, '')"
        >
          <template #header> Proje Ayrıntı Tablosu </template>
          <Column
            field="firmaAdi"
            header="Firma Adı"
            headerStyle="width:10%;"
            bodyStyle="text-align:center;"
          >
          </Column>
          <Column
            field="kayitTarihi"
            header="Kayıt Tarihi"
            headerStyle="width:6%;"
            bodyStyle="text-align:center;"
          ></Column>
          <Column
            field="baslik"
            header="Başlık"
            headerStyle="width:10%;"
            bodyStyle="text-align:center;"
          ></Column>
          <Column
            field="aciklama"
            header="Açıklama"
            headerStyle="width:10%;"
            bodyStyle="text-align:center;"
          >
            <template #body="slotProps">
              {{ slotProps.data.aciklama }}
            </template>
          </Column>
          <Column
            field="hatirlatmaTarihi"
            header="Hatırlatma Tarihi"
            headerStyle="width:6%;"
            bodyStyle="text-align:center;"
          ></Column>
          <Column
            field="hatirlatmaAciklama"
            header="Hatırlatma Açıklama"
            headerStyle="width:10%;"
            bodyStyle="text-align:center;"
          ></Column>
          <Column
            field="email"
            header="Email"
            headerStyle="width:13%;"
            bodyStyle="word-break:break-all;text-align:center;"
          ></Column>
          <Column
            field="phoneNumber"
            header="Telefon No"
            headerStyle="width:5%;"
            bodyStyle="text-align:center;"
          ></Column>
          <Column
            field="unvan"
            header="Ünvan"
            headerStyle="width:7%;"
            bodyStyle="text-align:center;"
          >
            <template #body="slotProps">
              {{ slotProps.data.unvan }}
            </template>
          </Column>
        </DataTable>
      </div>
      <div>
        <Dialog
          v-model:visible="is_form_new"
          header="Yeni Giriş"
          :modal="true"
          maximizable
          position="top"
        >
          <bgpNetworkDetailFormYeni
            :projectName="projectName"
          ></bgpNetworkDetailFormYeni>
        </Dialog>
      </div>
      <div>
        <Dialog
          v-model:visible="is_form_datas"
          :header="projectName + ' Ayrıntı'"
          :modal="true"
          maximizable
          position="top"
        >
          <bgpNetworkDetailForm> </bgpNetworkDetailForm>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import bgpNetworkDetailFormYeni from "./bgpNetworkDetailFormYeni.vue";
import bgpNetworkDetailForm from "./bgpNetworkDetailForm.vue";
import bgpService from "@/service/BgpProjectService";
export default {
  components: {
    bgpNetworkDetailFormYeni,
    bgpNetworkDetailForm,
  },
  data() {
    return {
      is_form_new: false,
      is_form_datas: false,
      isSelectedDetail: null,
      username: null,
    };
  },
  created() {
    this.username = this.$store.getters.__getUserId;
  },
  computed: {
    ...mapGetters(["bgpProjectAyrinti", "projectName", "username_kontrol"]),
  },
  methods: {
    newProjectDetail(event, durum) {
      if (durum == "Yeni") {
        this.is_form_new = true;
        this.bgpProjectAyrinti.firmaAdi = "";
        this.bgpProjectAyrinti.kayitTarihi = "";
        this.bgpProjectAyrinti.baslik = "";
        this.bgpProjectAyrinti.aciklama = "";
        this.bgpProjectAyrinti.hatirlatmaAciklama = "";
        this.bgpProjectAyrinti.hatirlatmaTarihi = "";
      } else {
        bgpService.getBgpProjectDetailForm(event.data.id).then((data) => {
          this.$store.dispatch("bgp_project_ayrinti_form_load", data[0]);
          this.is_form_datas = true;

        });
      }
    },
    deleteProject() {
      if (confirm("Silmek istiyor musunuz?")) {
        bgpService
          .setBgpProjecDelete(this.username, this.projectName)
          .then((data) => {
            if (data.status) {
              this.$toast.add({
                severity: "success",
                summary: "Project Delete",
                detail: "Proje Başarıyla Silindi",
                life: 3500,
              });
              this.$store.dispatch("bgp_projects_list_load", data.result);
              this.emitter.emit("project_delete_form", false);
              this.emitter.emit("notificationUpdate", true);
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Project Delete",
                detail: "Proje Silme Başarısız",
                life: 3500,
              });
              this.$store.dispatch("bgp_projects_list_load", data.result);
            }
          });
      }
    },
  },
  mounted() {
    this.emitter.on("ayrinti_form_closed", (data) => {
      this.is_form_datas = data;
    });
  },
};
</script>

<style scoped></style>

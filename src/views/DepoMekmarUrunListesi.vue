<template>
  <section>
    <div class="columns is-multiline is-centered">
      <div class="column is-12">
        <h2>Mekmar Product List</h2>
      </div>
      <div class="column is-12">
        <DataTable
          class="p-datatable-responsive"
          :value="urunlist"
          dataKey="urunid"
          v-model:filters="filters"
        >
          <Column
            field="urunid"
            header="Id"
            headerStyle="width:100px;"
            bodyStyle="text-align:center;vertical-align:middle;"
          >
            <template #body="slotProps">
              {{ slotProps.data.urunid }}
            </template>
          </Column>
          <Column
            field="renk_en"
            header="Renk"
            headerStyle="width:130px;"
            bodyStyle="text-align:center;vertical-align:middle;"
          >
            <template #body="slotProps">
              {{ slotProps.data.renk_en }}
            </template>
          </Column>
          <Column
            field="urunkod"
            header="Kod"
            headerStyle="width:150px;"
            bodyStyle="text-align:center;vertical-align:middle;"
          >
            <template #body="slotProps">
              {{ slotProps.data.urunkod }}
            </template>

          </Column>
          <Column
            field="urunadi_en"
            header="Ürün Adı"
            headerStyle="width:300px;"
            bodyStyle="text-align:center;vertical-align:middle;"
          >
            <template #body="slotProps">
              {{ slotProps.data.urunadi_en }}
            </template>

          </Column>
          <Column
            field="fotolar"
            header="Fotolar"
            bodyStyle="text-align:center;vertical-align:middle;"
          >
            <template #body="slotProps">
              <div style="overflow: scroll" class="columns">
                <div
                  v-for="item in slotProps.data.fotolar"
                  :key="item._id"
                  class="column is-4"
                >
                  <img :src="item.nocdn" width="100" height="100" />
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </section>
</template>
<script>
import depoService from "@/service/DepoService";

export default {
  data() {
    return {
      urunlist: null,
      filters: {},
    };
  },
  created() {
    depoService.mekmarUrunListesi().then((data) => {
      this.urunlist = data;
    });
  },
};
</script>

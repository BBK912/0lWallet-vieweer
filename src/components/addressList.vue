<script setup>
import { computed } from "vue";
import { useProvideState } from "../state";
const emit = defineEmits(["delete"]);

let state = useProvideState();
let dataSource = computed(() => {
  return (state.accounts || []).map((account) => {
    const data = {
      tag: account.address.slice(0, 4).toUpperCase(),
      address: account.address,
      addressfull: account.address,
      balance: Math.floor(
        (account.coin.value || 0) /
        (1000000)
      ),
      proofs: account.count_proofs_in_epoch || 0,
      height: account.verified_tower_height || 0,
      latest_epoch_mining: account.latest_epoch_mining || 0,
    };
    data.proofsAndheight = `${data.proofs}`;
    return data;
  }).sort((a, b) => a.proofs - b.proofs);
});
let total = computed(() => {
  let balance = 0;
  let proofs = 0;
  let height = 0;
  let epoch = 0;
  dataSource.value.forEach((t) => {
    balance += +t.balance;
    proofs += +t.proofs;
    height += +t.height;
    epoch = Math.max(epoch, t.latest_epoch_mining);
  });
  return {
    balance,
    proofs,
    height,
    epoch,
  };
});
let columns = [
  {
    title: "标签",
    dataIndex: "tag",
    fixed: true,
  },
  {
    title: "地址",
    dataIndex: "address",
  },
  {
    title: "余额",
    dataIndex: "balance",
  },
  {
    title: "本轮证明",
    dataIndex: "proofsAndheight",
  },
];
let y = window.innerHeight - 196;
</script>
<template>
  <a-table
    class="ant-table-striped"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    size="small"
    :row-class-name="
      (_record, index) => (index % 2 === 1 ? 'table-striped' : null)
    "
    :scroll="{ x: '100%', y: y }"
    bordered
  >
  <template #bodyCell="{ column, record }">
    <template v-if="column.dataIndex === 'address'">
        <a :href="`https://0l.fyi/accounts/0x${record.address}/resources`" target="_blank" style="color:currentColor">
          {{ record.address }}
        </a>
      </template>
  </template>
    <template #summary>
      <a-table-summary fixed>
        <a-table-summary-row>
          <a-table-summary-cell :index="0">总计 ({{ dataSource.length }})</a-table-summary-cell>
          <a-table-summary-cell :index="1"
            >纪元: {{ total.epoch }}</a-table-summary-cell
          >
          <a-table-summary-cell :index="2">
            {{ total.balance }}</a-table-summary-cell
          >
          <a-table-summary-cell :index="3">{{
            total.proofs
          }} ({{ dataSource.filter(t => t.proofsAndheight > 7).length }})</a-table-summary-cell>
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>
<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>

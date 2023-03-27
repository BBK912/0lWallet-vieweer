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
      balance: (
        (account.balances[0].amount || 0) /
        (state.currencyMap.GAS.scaling_factor || 1)
      ).toFixed(2),
      proofs: account.actual_count_proofs_in_epoch || 0,
      height: account.verified_tower_height || 0,
      latest_epoch_mining: account.latest_epoch_mining || 0,
    };
    data.proofsAndheight = `${data.proofs}`;
    return data;
  });
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
    balance: balance.toFixed(2),
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
let y = window.innerHeight - 112;
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
          }}</a-table-summary-cell>
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

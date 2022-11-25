<script setup>
import { computed } from "vue";
import { useProvideState } from "../state";
const emit = defineEmits(["delete"]);

let state = useProvideState();
let dataSource = computed(() => {
  return (state.accounts || []).map((account) => {
    const data = {
      tag: account.address.slice(0, 4).toUpperCase(),
      address: account.address.slice(0, 10),
      addressfull: account.address,
      balance: (
        (account.balances[0].amount || 0) / (state.currencyMap.GAS.scaling_factor || 1)
      ).toFixed(2),
      proofs: account.actual_count_proofs_in_epoch || 0,
      height: account.verified_tower_height || 0,
      latest_epoch_mining: account.latest_epoch_mining || 0,
    };
    let localHeight = data.height - data.proofs + 72;
    data.proofsAndheight = `${data.proofs} (${data.height}) [${localHeight}]`;
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
    title: "证明(塔高)[本地]",
    dataIndex: "proofsAndheight",
  },
];
const customRow = (record) => {
  let percent = record.proofs / 0.72 + "%";
  return {
    style: {
      "background-image": `linear-gradient(to right, rgb(255 89 89 / 43%), rgb(255 89 89 / 43%) ${percent}, transparent ${percent}, transparent)!important`,
      "background-position": "bottom",
      "background-size": "100% 6px",
      "background-repeat-y": "no-repeat",
    },
    onDblclick: () => {
      let index = state.addressList.indexOf(record.addressfull);
      if (index !== -1) {
        state.addressList.splice(index, 1);
        emit("delete");
      }
    },
  };
};
</script>
<template>
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    :custom-row="customRow"
  >
    <template #summary>
      <a-table-summary fixed>
        <a-table-summary-row>
          <a-table-summary-cell :index="0">总计</a-table-summary-cell>
          <a-table-summary-cell :index="1">纪元: {{ total.epoch }}</a-table-summary-cell>
          <a-table-summary-cell :index="2"> {{ total.balance }}</a-table-summary-cell>
          <a-table-summary-cell :index="3"
            >{{ total.proofs }} ({{ total.height }})</a-table-summary-cell
          >
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>
<style></style>

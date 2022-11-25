<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { reactive, onBeforeMount, createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

import * as API from "./api/common";
import { useProvideState } from "./state";
import addAccountVue from "./components/addAccount.vue";
import addressList from "./components/addressList.vue";
let state = useProvideState();

onBeforeMount(async () => {
  state.loading = true;
  let currencys = await API.GetCurrencyScale();
  currencys.map((currency) => {
    state.currencyMap[currency.code] = currency;
  });
  getData();
  setInterval(() => {
    if (!state.tempAccount.address) {
      getData(false);
    }
  }, 60 * 1000)
});
async function getData(loading = true) {
  state.loading = loading;
  state.accounts = await API.GetBlanceAndProofs(state.addressList);
  state.loading = false;
}
function onAdd({ address }) {
  if (address) {
    state.addressList.push(address);
    localStorage.setItem("addressList", JSON.stringify(state.addressList));
    getData();
  }
}
function onDelete() {
  localStorage.setItem("addressList", JSON.stringify(state.addressList));
  getData();
}
function onClearAll() {
  state.addressList = [];
  localStorage.setItem("addressList", JSON.stringify(state.addressList));
  state.accounts = [];
}

const showDeleteConfirm = () => {
  Modal.confirm({
    title: "确定删除全部吗?",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后, 需要重新添加",
    okText: "删除",
    okType: "danger",
    cancelText: "取消",
    onOk() {
      onClearAll();
    },
    onCancel() {},
  });
};
</script>

<template>
  <h2 class="header">
    <img src="./assets/0l-logo.png" alt="0l Network" />
  </h2>
  <a-spin :spinning="state.loading">
    <addAccountVue @add="onAdd" @clearAll="showDeleteConfirm" />
    <addressList @delete="onDelete" />
  </a-spin>

  <!-- <div v-for="account in state.accounts">
    <h4>地址: {{ account.address }}</h4>
    <p v-for="b in account.balances">
      <span>{{ b.currency }}</span> : 
      <span v-if="state.currencyMap[b.currency]">{{ (b.amount / state.currencyMap[b.currency].scaling_factor).toFixed(2) }}</span>
    </p>
  </div> -->
</template>

<style scoped>
  .header {
    background-color: #ff5959;
    padding: 16px 8px;
    margin: 0;
  }
  img {
    height: 35px;
  }
</style>

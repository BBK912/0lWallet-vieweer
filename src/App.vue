<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { reactive, onBeforeMount, createVNode, computed } from "vue";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

import * as API from "./api/common";
import { useProvideState } from "./state";
import addAccountVue from "./components/addAccount.vue";
import addressList from "./components/addressList.vue";
let state = useProvideState();
let aboveThresholdList =  computed(() => {
  return state.addressList.filter((address) => {
    let addr = address.replace(/^0+/g, '');
    addr = '0x' + addr;
    return state.provideList.includes(addr.toLowerCase());
  })
})
onBeforeMount(async () => {
  getData();
  setInterval(() => {
    if (!state.tempAccount.address) {
      getData(false);
    }
  }, 60 * 1000)
});
async function getData(loading = true) {
  if (state.loading) return;
  state.loading = loading;
  // state.accounts = await API.GetBlanceAndProofs(state.addressList);
  state.provideList = await API.getProvideList();
  state.totalReward = await API.getEpochReward();
  state.loading = false;
}
function onAdd({ address }) {
  if (address) {
    address = address.split(',').map(t => t.trim()).filter(t => t.length === 32);
    state.addressList = Array.from(new Set( state.addressList.concat(address)));
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
    <!-- <addAccountVue @add="onAdd" @clearAll="showDeleteConfirm" /> -->
    <!-- <addressList @delete="onDelete" /> -->
    <h3 style="font-size: 48px;
    margin: 0px auto;
    width: 50%;
    text-align: center;">{{ aboveThresholdList.length }} / {{ state.provideList.length }}</h3>
    <h3 style="font-size: 48px;
    margin: 0px auto;
    width: 50%;
    text-align: center;">{{ (state.totalReward / 1000000) .toFixed(2)}}</h3>
  </a-spin>

</template>

<style scoped>
  .header {
    background-color: #ff5959;
    padding: 0px 8px;
    margin: 0;
  }
  img {
    height: 20px;
  }
</style>

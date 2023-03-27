import { post } from './index';
import chunk from 'lodash.chunk';
export async function GetCurrencyScale() {
    let res = await post({
        jsonrpc: '2.0',
        method: 'get_currencies',
        params: [],
        id: 1,
    });
    return res.result || [];
}
async function GetAccount(address) {
    let data = Array.isArray(address)
      ? address.map((ad) => {
          return {
            jsonrpc: "2.0",
            method: "get_account",
            params: [ad],
            id: 1,
          };
        })
      : [
          {
            jsonrpc: "2.0",
            method: "get_account",
            params: [address],
            id: 1,
          },
        ];
    let postDatas = chunk(data, 20);
    let res = await Promise.all(
      postDatas.map(async (data) => {
        return await post(data);
      })
    );
    res = res.flat();
    if (res) {
      return res.map((account) => {
        return account.result;
      });
    }
  }
async function GetTowerStateView(address) {
    let data = Array.isArray(address)
      ? address.map((ad) => {
          return {
            jsonrpc: "2.0",
            method: "get_tower_state_view",
            params: [ad],
            id: 1,
          };
        })
      : [
          {
            jsonrpc: "2.0",
            method: "get_tower_state_view",
            params: [address],
            id: 1,
          },
        ];
    let postDatas = chunk(data, 20);
    let res = await Promise.all(
      postDatas.map(async (data) => {
        return await post(data);
      })
    );
    res = res.flat();
    // console.log('proof', res)
    if (res) {
      return res.map((account) => {
        return account.result;
      });
    }
  }
export async function GetBlanceAndProofs(address) {
    let balances = await GetAccount(address);
    let proofs = await GetTowerStateView(address);
    let bMap = {};
    balances.forEach((account, i) => {
        if (account) {
            bMap[account.address] = { ...account, ...proofs[i] };
          } else {
            console.log(address[i], "error");
          }
    });
    return Object.values(bMap);
}

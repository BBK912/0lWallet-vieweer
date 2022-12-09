import { post } from './index';

export async function GetCurrencyScale() {
    let res = await post({
        jsonrpc: '2.0',
        method: 'get_currencies',
        params: [],
        id: 1,
    });
    return res.result || [];
}
export async function GetAccount(address) {
    let data = Array.isArray(address)
        ? address.slice(0,20).map((ad) => {
              return {
                  jsonrpc: '2.0',
                  method: 'get_account',
                  params: [ad],
                  id: 1,
              };
          })
        : {
              jsonrpc: '2.0',
              method: 'get_account',
              params: [address],
              id: 1,
          };
    let res = await post(data);
    if (res) {
        return res.map((account) => {
            return account.result;
        });
    }
}
export async function GetTowerStateView(address) {
    let data = Array.isArray(address)
        ? address.slice(0,20).map((ad) => {
              return {
                  jsonrpc: '2.0',
                  method: 'get_tower_state_view',
                  params: [ad],
                  id: 1,
              };
          })
        : {
              jsonrpc: '2.0',
              method: 'get_account',
              params: [address],
              id: 1,
          };
    let res = await post(data);
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
        bMap[account.address] = { ...account, ...proofs[i] };
    });
    return Object.values(bMap);
}

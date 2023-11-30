import { post, get } from './index';
import chunk from 'lodash.chunk';
const WalletResourceType = {
    proofs: '0x1::tower_state::TowerProofHistory',
    balance: '0x1::coin::CoinStore<0x1::libra_coin::LibraCoin>',
};
const rpcUrl = (v5Address, type = '') =>
    `https://rpc.0l.fyi/v1/accounts/0x${v5Address}/resource/${encodeURIComponent(
        type
    )}`;
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
    let data = Array.isArray(address) ? address : [address];
    return await Promise.all(
        data.map(async (addr) => {
            const balance =  await get(rpcUrl(addr, WalletResourceType.balance));
            return {
              address: addr,
              ...balance.data
            }
        })
    );
}
async function GetTowerStateView(address) {
    let data = Array.isArray(address) ? address : [address];

    return await Promise.all(
      data.map(async (addr) => {
            const proofData =  await get(rpcUrl(addr, WalletResourceType.proofs));
            return {
              address: addr,
              ...proofData.data
            }
        })
    );
}
export async function GetBlanceAndProofs(address) {
    let balances = await GetAccount(address);
    let proofs = await GetTowerStateView(address);
    let bMap = {};
    balances.forEach((account, i) => {
        if (account) {
            bMap[account.address] = { address, ...account, ...proofs[i] };
        } else {
            console.log(address[i], 'error');
        }
    });
    return Object.values(bMap);
}

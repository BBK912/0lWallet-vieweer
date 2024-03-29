import { post, get } from './index';
import chunk from 'lodash.chunk';
const WalletResourceType = {
    proofs: '0x1::oracle::Tower', // 0x1::oracle::Tower
    balance: '0x1::coin::CoinStore<0x1::libra_coin::LibraCoin>',
};
const provideListUrl = 'https://rpc.0l.fyi/v1/accounts/0x01/resource/0x1::oracle::ProviderList';
const epochRewarsUrl = 'https://rpc.0l.fyi/v1/accounts/0x01/resource/0x1::proof_of_fee::ConsensusReward';
const rpcUrl = (v5Address, type = '') =>
    `https://rpc.0l.fyi/v1/accounts/0x${v5Address}/resource/${encodeURIComponent(
        type
    )}`;

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
            let  proofData = {};
            try {
                proofData =  await get(rpcUrl(addr, WalletResourceType.proofs));
            } catch (e) {
                
            }
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
export async function getProvideList() {
    try {
        let ret = await get(provideListUrl);
        return ret.data.current_above_threshold;
    } catch (e) {
        console.log(e)
    }
}
export async function getEpochReward() {
    try {
        let ret = await get(epochRewarsUrl);
        let diff = ret.data.nominal_reward - ret.data.entry_fee;
        return diff > 0 ? diff : 0;
    } catch (e) {
        console.log(e)
    }
}

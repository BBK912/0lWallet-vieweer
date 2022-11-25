import { provide, inject, reactive } from 'vue';
export const walletStateContext = Symbol('wallet-state');
let addressList = JSON.parse(localStorage.getItem('addressList') || '[]');
const state = reactive({
    addressList: addressList,
    accounts: [
        {
            tag: '',
            address: '',
            balances: [
                {
                    amount:'',
                    currency: '',
                }
            ],
            currentEpochProofs:0,
            previewEpochProofs: 0
        }
    ],
    tempAccount: {
        tag: '',
        address: ''
    },
    currencyMap: {
        'GAS': {
            sacle: 1,
        }
    },
    loading: true,
})
export function useProvideState() {
    provide(walletStateContext, state);
    return state;
}

export function useInjectState() {
    return inject(walletStateContext);
}
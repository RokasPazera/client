import { writable } from 'svelte/store';

export const tokenStore = writable(null);

export const setToken = (token) => {
    tokenStore.set(token);
};


export const clearToken = () => {
    tokenStore.set(null);
};
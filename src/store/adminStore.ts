import { atom } from 'nanostores';

export type AdminTab = 'overview' | 'users' | 'invitations' | 'templates' | 'payments';

export const activeAdminTabStore = atom<AdminTab>('overview');

export function setActiveAdminTab(tab: AdminTab) {
    activeAdminTabStore.set(tab);

    // Update URL without reload (optional, for deeplinking)
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('view', tab);
        window.history.pushState({}, '', url.toString());
    }
}

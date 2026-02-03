import { atom } from 'nanostores';

export type DashboardTab = 'overview' | 'rsvp' | 'wishes' | 'qr' | 'pdf' | 'settings' | 'profile';

export const activeTabStore = atom<DashboardTab>('overview');

export function setActiveTab(tab: DashboardTab) {
    activeTabStore.set(tab);

    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
}

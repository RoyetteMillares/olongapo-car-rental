import { create } from 'zustand';

interface ModalStoreState {
    isModalOpen: boolean;
    toggleModal: () => void;
}

const useModalStore = create<ModalStoreState>((set) => ({
    isModalOpen: false,
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
}));

export default useModalStore;

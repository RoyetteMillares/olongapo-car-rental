import { create } from 'zustand';

interface ModalStoreState {
    isModalOpen: boolean;
    toggleModal: () => void;
    lastBookedCarId: string | null;
    setLastBookedCarId: (id: string | null) => void;
}

const useModalStore = create<ModalStoreState>((set) => ({
    isModalOpen: false,
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
    lastBookedCarId: null,
    setLastBookedCarId: (id) => set({ lastBookedCarId: id }),
}));

export default useModalStore;

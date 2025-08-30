import { create } from 'zustand';

interface ModalStoreState {
    isModalOpen: boolean;
    toggleModal: () => void;
    lastBookedCarId: string | null;
    setLastBookedCarId: (id: string | null) => void;
    lastBookedId: string | null;
    setLastBookedId: (id: string | null) => void;
}

const useModalStore = create<ModalStoreState>((set) => ({
    isModalOpen: false,
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
    lastBookedCarId: null,
    setLastBookedCarId: (id) => set({ lastBookedCarId: id }),
    lastBookedId: null,
    setLastBookedId: (id) => set({ lastBookedId: id }),
}));

export default useModalStore;

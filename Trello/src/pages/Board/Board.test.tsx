import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Board from './Board.tsx';
import { useBoard } from '@/hooks/useBoard/useBoard.tsx';
import { useList } from '@/hooks/useList/useList.tsx';
import { useCard } from '@/hooks/useCard/useCard.tsx';

vi.mock('@/hooks/useBoard/useBoard.tsx', () => ({
    useBoard: vi.fn()
}));
vi.mock('@/hooks/useList/useList.tsx', () => ({
    useList: vi.fn()
}));
vi.mock('@/hooks/useCard/useCard.tsx', () => ({
    useCard: vi.fn()
}));

vi.mock("./components/List/List.tsx", () => ({
    default: ({ onListEdit, onCardEdit, onCardDelete, onListDelete, onCardMove }: any) => (
        <div data-testid="list-item">
            <button onClick={() => onListEdit()}>EditList</button>
            <button onClick={() => onCardEdit(101)}>EditCard</button>
            <button onClick={() => onCardDelete(101)}>DeleteCard</button>
            <button onClick={() => onListDelete(1)}>DeleteList</button>
            <button onClick={() => onCardMove(1, 2, 0)}>MoveCard</button>
        </div>
    )
}));

vi.mock("@/components/CreateModal/CreateModal.tsx", () => ({
    default: ({ modalStatus, onSubmit, onClose, modalTitle }: any) => 
        modalStatus ? (
            <div data-testid="create-modal">
                <h1>{modalTitle}</h1>
                <button onClick={() => onSubmit({ text: "New Item", listId: 1 })}>SubmitCreate</button>
                <button onClick={onClose}>CancelCreate</button>
            </div>
        ) : null
}));

vi.mock("@/components/EditModal/EditModal.tsx", () => ({
    default: ({ modalStatus, onSubmit, onClose, modalTitle }: any) => 
        modalStatus ? (
            <div data-testid="edit-modal">
                <h1>{modalTitle}</h1>
                <button onClick={() => onSubmit({ text: "Updated Content" })}>SubmitEdit</button>
                <button onClick={onClose}>CancelEdit</button>
            </div>
        ) : null
}));

const mockBoard = { id: "123", title: "Project Board" };
const mockLists = [
    { id: 1, title: "Todo", cards: [{ id: 101, title: "Task 1" }] }
];

describe('Board Comprehensive Tests', () => {
    const mocks = {
        handleBoardDelete: vi.fn(),
        handleEditBoard: vi.fn(),
        handleCreateList: vi.fn(),
        handleListDelete: vi.fn(),
        handleEditList: vi.fn(),
        handleCreateCard: vi.fn(),
        handleCardDelete: vi.fn(),
        handleEditCard: vi.fn(),
        handleCardMove: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useBoard as any).mockReturnValue({ board: mockBoard, lists: mockLists, isLoading: false, isError: false, ...mocks });
        (useList as any).mockReturnValue({ ...mocks });
        (useCard as any).mockReturnValue({ ...mocks });
        cleanup();
    });

    const renderComp = () => render(<MemoryRouter><Board /></MemoryRouter>);

    it('renders loader when isLoading is true', () => {
        (useBoard as any).mockReturnValue({ isLoading: true, lists: [] });
        renderComp();
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders error state when isError is true', () => {
        (useBoard as any).mockReturnValue({ isError: true, lists: [] });
        renderComp();
        expect(screen.getByText(/Error loading board/i)).toBeInTheDocument();
    });

    it('renders board header and title', () => {
        renderComp();
        expect(screen.getByText("Project Board")).toBeInTheDocument();
    });

    it('calls handleBoardDelete when delete button clicked', () => {
        renderComp();
        fireEvent.click(screen.getByText('Видалити'));
        expect(mocks.handleBoardDelete).toHaveBeenCalled();
    });

    it('opens and closes Board Edit modal', async () => {
        renderComp();
        fireEvent.click(screen.getByText('Редагувати'));
        expect(screen.getByText('Редагувати дошку')).toBeInTheDocument();
        fireEvent.click(screen.getByText('CancelEdit'));
        await waitFor(() => {
            expect(screen.queryByText('Редагувати дошку')).not.toBeInTheDocument();
        });
    });

    it('submits Board Edit and calls handleEditBoard', async () => {
        renderComp();
        fireEvent.click(screen.getByText('Редагувати'));
        fireEvent.click(screen.getByText('SubmitEdit'));
        expect(mocks.handleEditBoard).toHaveBeenCalledWith("Updated Content");
        await waitFor(() => {
            expect(screen.queryByText('Редагувати дошку')).not.toBeInTheDocument();
        });
    });

    it('opens and submits Create List modal', () => {
        renderComp();
        fireEvent.click(screen.getByText('+ Список'));
        fireEvent.click(screen.getByText('SubmitCreate'));
        expect(mocks.handleCreateList).toHaveBeenCalledWith("New Item", expect.any(Function));
    });

    it('triggers list editing and submits change', async () => {
        renderComp();
        fireEvent.click(screen.getByText('EditList'));
        expect(screen.getByText('Редагувати список')).toBeInTheDocument();
        fireEvent.click(screen.getByText('SubmitEdit'));
        expect(mocks.handleEditList).toHaveBeenCalledWith(1, "Updated Content");
        await waitFor(() => {
            expect(screen.queryByText('Редагувати список')).not.toBeInTheDocument();
        });
    });

    it('triggers card editing and submits change', async () => {
        renderComp();
        fireEvent.click(screen.getByText('EditCard'));
        expect(screen.getByText('Редагувати картку')).toBeInTheDocument();
        fireEvent.click(screen.getByText('SubmitEdit'));
        expect(mocks.handleEditCard).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.queryByText('Редагувати картку')).not.toBeInTheDocument();
        });
    });

    it('calls handleListDelete from List component', () => {
        renderComp();
        fireEvent.click(screen.getByText('DeleteList'));
        expect(mocks.handleListDelete).toHaveBeenCalledWith(1);
    });

    it('calls handleCardDelete from List component', () => {
        renderComp();
        fireEvent.click(screen.getByText('DeleteCard'));
        expect(mocks.handleCardDelete).toHaveBeenCalledWith(1, 101);
    });

    it('loads custom theme from localStorage', () => {
        const spy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('Темна');
        renderComp();
        expect(spy).toHaveBeenCalledWith('trello_theme');
        spy.mockRestore();
    });

    it('closes Create List modal using the callback passed to hook', async () => {
        let capturedCallback: any;
        mocks.handleCreateList.mockImplementation((text, cb) => { capturedCallback = cb; });
        renderComp();
        fireEvent.click(screen.getByText('+ Список'));
        fireEvent.click(screen.getByText('SubmitCreate'));
        
        await act(async () => {
            capturedCallback();
        });

        await waitFor(() => {
            expect(screen.queryByText('Новий список')).not.toBeInTheDocument();
        });
    });

    it('closes Create Card modal using the callback passed to hook', async () => {
        let capturedCallback: any;
        mocks.handleCreateCard.mockImplementation((t, id, cb) => { capturedCallback = cb; });
        renderComp();
        fireEvent.click(screen.getByText('+ Картка'));
        fireEvent.click(screen.getByText('SubmitCreate'));
        
        await act(async () => {
            capturedCallback();
        });

        await waitFor(() => {
            expect(screen.queryByText('Нова картка')).not.toBeInTheDocument();
        });
    });

    it('should handle card move calls', () => {
        renderComp();
        fireEvent.click(screen.getByText('MoveCard'));
        expect(mocks.handleCardMove).toHaveBeenCalled();
    });

    it('handles absence of lists correctly', () => {
        (useBoard as any).mockReturnValue({ board: mockBoard, lists: [], isLoading: false, isError: false, ...mocks });
        renderComp();
        expect(screen.queryByTestId('list-item')).not.toBeInTheDocument();
    });
});
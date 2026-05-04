import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import List from './List';

vi.mock('lucide-react', () => ({
    Pencil: () => <div data-testid="pencil-icon" />,
    Trash2: () => <div data-testid="trash-icon" />,
}));

vi.mock('../Card/Card.tsx', () => ({
    default: ({ title, onDelete, onEdit, cardId }: any) => (
        <div data-testid="card">
            <span>{title}</span>
            <button aria-label="Edit card" onClick={() => onEdit(cardId)}>Edit Card</button>
            <button aria-label="Delete card" onClick={() => onDelete(cardId)}>Delete Card</button>
        </div>
    ),
}));

const mockCards = [
    { id: 101, title: "Card 1", description: "Desc 1" },
    { id: 102, title: "Card 2", description: "Desc 2" },
];

const mockProps = {
    id: 1,
    boardId: "board-123",
    title: "To Do List",
    cards: mockCards,
    onListDelete: vi.fn(),
    onListEdit: vi.fn(),
    onCardDelete: vi.fn(),
    onCardEdit: vi.fn(),
    onCardMove: vi.fn(),
};

describe('List Component', () => {
    it("should render title and cards", () => {
        render(<List {...mockProps} />);
        expect(screen.getByText("To Do List")).toBeInTheDocument();
        expect(screen.getByText("Card 1")).toBeInTheDocument();
        expect(screen.getByText("Card 2")).toBeInTheDocument();
    });

    it("the correct number of cards should be displayed", () => {
        render(<List {...mockProps} />);
        const allCards = screen.getAllByTestId('card');
        expect(allCards.length).toBe(mockCards.length);
    });

    it("'Перетягніть картки сюди' should be displayed if the sheet is empty", () => {
        render(<List {...mockProps} cards={[]} />);
        expect(screen.getByText("Перетягніть картки сюди")).toBeInTheDocument();
    });

    it('should call the onListEdit function when the edit button is clicked', async () => {
        render(<List {...mockProps} />);
        const btn = screen.getByRole('button', { name: /Edit list/i });
        fireEvent.click(btn);
        expect(mockProps.onListEdit).toHaveBeenCalledWith(mockProps.id);
    });

    it('should call the onListDelete function when the delete button is clicked', async () => {
        render(<List {...mockProps} />);
        const btn = screen.getByRole('button', { name: /Delete list/i });
        fireEvent.click(btn);
        expect(mockProps.onListDelete).toHaveBeenCalledWith(mockProps.id);
    });

    it('should call the onCardEdit function when the card edit button is clicked', async () => {
        render(<List {...mockProps} />);
        const editBtns = screen.getAllByRole('button', { name: /Edit card/i });
        fireEvent.click(editBtns[0]);
        expect(mockProps.onCardEdit).toHaveBeenCalledWith(101);
    });

    it('should call the onCardDelete function when the card delete button is clicked', async () => {
        render(<List {...mockProps} />);
        const deleteBtns = screen.getAllByRole('button', { name: /Delete card/i });
        fireEvent.click(deleteBtns[0]);
        expect(mockProps.onCardDelete).toHaveBeenCalledWith(101);
    });

    it("Check if data is being recorded in dataTransfer on dragStart", () => {
        render(<List {...mockProps} />);
        const cardContainer = screen.getByText("Card 1").closest('div[draggable="true"]');
        const dataTransfer = {
            setData: vi.fn(),
        };

        fireEvent.dragStart(cardContainer!, { dataTransfer });
        expect(dataTransfer.setData).toHaveBeenCalledWith("cardId", "101");
        expect(dataTransfer.setData).toHaveBeenCalledWith("currentListId", "1");
    });

    it("Check if the card move function is called with correct arguments on drop", () => {
        render(<List {...mockProps} />);
        const listContainer = screen.getByText("To Do List").closest('div');
        
        const dataTransfer = {
            getData: vi.fn((key) => {
                if (key === "cardId") return "101";
                if (key === "currentListId") return "2";
                return "";
            }),
        };

        fireEvent.drop(listContainer!, { dataTransfer });
        expect(mockProps.onCardMove).toHaveBeenCalledWith(101, 2, mockProps.id);
    });
});
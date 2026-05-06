import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CreateModal from "./CreateModal";

vi.mock("@/ThemeSettings.ts", () => ({
    themeSettings: {
        "Світло-Синя": { btn: "btn-light-blue" },
        "Небесна": { btn: "btn-sky" },
        "М’ятна": { btn: "btn-mint" }
    }
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; })
    };
})();

const mockLists = [
    { id: 101, title: "Backlog", cards: [] },
    { id: 102, title: "In Progress", cards: [] }
];

describe("CreateModal Component - Deep Testing", () => {
    const defaultProps = {
        modalStatus: true,
        onClose: vi.fn(),
        onSubmit: vi.fn(),
        modalTitle: "Створити нову картку",
        placeholder: "Назва задачі",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    it("should not render the modal when modalStatus is false", () => {
        const { container } = render(<CreateModal {...defaultProps} modalStatus={false} />);
        expect(container.firstChild).toBeNull();
    });

    it("should render with correct title and placeholder", () => {
        render(<CreateModal {...defaultProps} />);
        expect(screen.getByText("Створити нову картку")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Назва задачі")).toBeInTheDocument();
    });

    it("should set focus on input when opened", () => {
        render(<CreateModal {...defaultProps} />);
        const input = screen.getByPlaceholderText("Назва задачі");
        expect(input).toHaveFocus();
    });

    it("should show error if submitting empty field", async () => {
        render(<CreateModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Підтвердити"));
        
        await waitFor(() => {
            expect(screen.getByText("Це поле є обов'язковим")).toBeInTheDocument();
        });
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it("should submit form successfully with valid data (no lists)", async () => {
        render(<CreateModal {...defaultProps} />);
        const input = screen.getByPlaceholderText("Назва задачі");
        
        fireEvent.change(input, { target: { value: "Learn Vitest" } });
        fireEvent.click(screen.getByText("Підтвердити"));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith({
                text: "Learn Vitest",
                listId: undefined,
                color: "#737373"
            });
        });
    });

    it("should correctly convert listId to number on submit", async () => {
        render(<CreateModal {...defaultProps} lists={mockLists} />);
        
        fireEvent.change(screen.getByPlaceholderText("Назва задачі"), { target: { value: "Task" } });
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "102" } });
        
        fireEvent.click(screen.getByText("Підтвердити"));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                listId: 102
            }));
        });
    });

    it("should handle color picker when withColorPicker is true", async () => {
        const { container } = render(<CreateModal {...defaultProps} withColorPicker={true} />);
        
        const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
        fireEvent.change(colorInput, { target: { value: "#ff0000" } });
        
        fireEvent.change(screen.getByPlaceholderText("Назва задачі"), { target: { value: "Red Task" } });
        fireEvent.click(screen.getByText("Підтвердити"));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                color: "#ff0000"
            }));
        });
    });

    it("should load default 'Світло-Синя' theme when localStorage is empty", () => {
        render(<CreateModal {...defaultProps} />);
        const button = screen.getByText("Підтвердити");
        expect(button).toHaveClass("btn-light-blue");
    });

    it("should apply theme from localStorage", () => {
        localStorageMock.setItem("trello_theme", "Небесна");
        render(<CreateModal {...defaultProps} />);
        const button = screen.getByText("Підтвердити");
        expect(button).toHaveClass("btn-sky");
    });

    it("should close modal when 'Відміна' is clicked", () => {
        render(<CreateModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Відміна"));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("should close modal when overlay is clicked", () => {
        const { container } = render(<CreateModal {...defaultProps} />);
        const overlay = container.querySelector('.fixed.inset-0');
        if (overlay) fireEvent.click(overlay);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("should not close modal when content inside is clicked", () => {
        render(<CreateModal {...defaultProps} />);
        const title = screen.getByText("Створити нову картку");
        const modalBody = title.closest('.bg-white');
        
        if (modalBody) fireEvent.click(modalBody);
        
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it("should reset input value when modal is reopened", async () => {
        const { rerender } = render(<CreateModal {...defaultProps} modalStatus={true} />);
        const input = screen.getByPlaceholderText("Назва задачі");
        
        fireEvent.change(input, { target: { value: "Temporary text" } });
        
        rerender(<CreateModal {...defaultProps} modalStatus={false} />);
        rerender(<CreateModal {...defaultProps} modalStatus={true} />);
        
        expect(screen.getByPlaceholderText("Назва задачі")).toHaveValue("");
    });

    it("should update selected listId if lists prop changes while open", () => {
        const { rerender } = render(<CreateModal {...defaultProps} lists={mockLists} />);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("101");

        const updatedLists = [{ id: 555, title: "New List", cards: [] }];
        rerender(<CreateModal {...defaultProps} lists={updatedLists} />);
        
        expect(select.value).toBe("555");
    });

    it("should call reset and onClose after successful submission", async () => {
        render(<CreateModal {...defaultProps} />);
        
        fireEvent.change(screen.getByPlaceholderText("Назва задачі"), { target: { value: "Done" } });
        fireEvent.click(screen.getByText("Підтвердити"));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });
});
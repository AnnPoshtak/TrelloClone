import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import EditModal from "./EditModal";

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

describe("EditModal Component - Deep Testing", () => {
    const defaultProps = {
        modalStatus: true,
        onClose: vi.fn(),
        onSubmit: vi.fn(),
        modalTitle: "Редагувати картку",
        placeholder: "Назва задачі",
        initialText: "Стара назва",
        initialColor: "#112233"
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    it("should not render the modal when modalStatus is false", () => {
        const { container } = render(<EditModal {...defaultProps} modalStatus={false} />);
        expect(container.firstChild).toBeNull();
    });

    it("should render with correct title and initial values", () => {
        render(<EditModal {...defaultProps} withColorPicker={true} />);
        
        expect(screen.getByText("Редагувати картку")).toBeInTheDocument();
        
        const input = screen.getByPlaceholderText("Назва задачі");
        expect(input).toHaveValue("Стара назва");

        const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
        expect(colorInput).toHaveValue("#112233");
    });

    it("should set focus on input when opened", () => {
        render(<EditModal {...defaultProps} />);
        const input = screen.getByPlaceholderText("Назва задачі");
        expect(input).toHaveFocus();
    });

    it("should show error if input is cleared and submitted", async () => {
        render(<EditModal {...defaultProps} />);
        const input = screen.getByPlaceholderText("Назва задачі");
        
        fireEvent.change(input, { target: { value: "" } });
        fireEvent.click(screen.getByText("Зберегти"));
        
        await waitFor(() => {
            expect(screen.getByText("Це поле є обов'язковим")).toBeInTheDocument();
        });
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it("should submit form successfully with updated data", async () => {
        render(<EditModal {...defaultProps} />);
        const input = screen.getByPlaceholderText("Назва задачі");

        fireEvent.change(input, { target: { value: "Оновлена назва" } });
        fireEvent.click(screen.getByText("Зберегти"));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith({
                text: "Оновлена назва",
                color: "#112233" // Колір залишився початковим, бо ми його не міняли
            });
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    it("should handle color changes when withColorPicker is true", async () => {
        const { container } = render(<EditModal {...defaultProps} withColorPicker={true} />);
        
        const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
        fireEvent.change(colorInput, { target: { value: "#ff0000" } });
        
        fireEvent.click(screen.getByText("Зберегти"));

        await waitFor(() => {
            expect(defaultProps.onSubmit).toHaveBeenCalledWith({
                text: "Стара назва",
                color: "#ff0000"
            });
        });
    });

    it("should update input values if initial props change (reset form)", () => {
        const { rerender } = render(<EditModal {...defaultProps} />);
        
        expect(screen.getByPlaceholderText("Назва задачі")).toHaveValue("Стара назва");

        rerender(
            <EditModal 
                {...defaultProps} 
                initialText="Зовсім інша задача" 
                initialColor="#999999" 
            />
        );

        expect(screen.getByPlaceholderText("Назва задачі")).toHaveValue("Зовсім інша задача");
    });

    it("should load default 'Світло-Синя' theme when localStorage is empty", () => {
        render(<EditModal {...defaultProps} />);
        const button = screen.getByText("Зберегти");
        expect(button).toHaveClass("btn-light-blue");
    });

    it("should apply theme from localStorage", () => {
        localStorageMock.setItem("trello_theme", "М’ятна");
        render(<EditModal {...defaultProps} />);
        const button = screen.getByText("Зберегти");
        expect(button).toHaveClass("btn-mint");
    });

    it("should close modal when 'Відмінити' is clicked", () => {
        render(<EditModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Відмінити"));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("should close modal when overlay is clicked", () => {
        const { container } = render(<EditModal {...defaultProps} />);
        const overlay = container.querySelector('.fixed.inset-0');
        if (overlay) fireEvent.click(overlay);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("should not close modal when content inside is clicked", () => {
        render(<EditModal {...defaultProps} />);
        const title = screen.getByText("Редагувати картку");
        const modalBody = title.closest('.bg-white');
        
        if (modalBody) fireEvent.click(modalBody);
        
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
});
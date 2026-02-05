import { useState } from "react";

interface IProps {
    modalStatus: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
}

function CreateListModal({ modalStatus, onClose, onSubmit }: IProps) {
    const [title, setTitle] = useState("");

    if (!modalStatus) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSubmit(title);
        setTitle("");
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Create new list</h3>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        style={{ padding: "10px", width: "300px", marginBottom: '10px' }}
                    />
                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateListModal;
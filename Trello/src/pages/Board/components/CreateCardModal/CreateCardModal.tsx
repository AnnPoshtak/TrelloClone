import { useState, useEffect } from "react";
import type { IList } from "../../../../common/interfaces/IList.ts";

interface IProps {
    modalStatus: boolean;
    onClose: () => void;
    onSubmit: (text: string, listId: number) => void;
    lists: IList[];
}

function CreateCardModal({ modalStatus, onClose, onSubmit, lists }: IProps) {
    const [text, setText] = useState("");
    const [selectedListId, setSelectedListId] = useState(0);

    useEffect(() => {
        if (lists.length > 0 && !selectedListId) {
            setSelectedListId(lists[0].id);
        }
    }, [lists, selectedListId]);

    if (!modalStatus) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        if (!selectedListId) return;
        onSubmit(text, Number(selectedListId));
        setText("");
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Create new card</h3>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
                    <input
                        type="text"
                        placeholder="Text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        style={{ padding: "10px", width: "300px", marginBottom: '10px' }}
                    />


                    <select
                        value={selectedListId}
                        onChange={(e) => setSelectedListId(Number(e.target.value))}
                        style={{ padding: "10px", width: "300px", marginBottom: '10px' }}
                    >
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                {list.title}
                            </option>
                        ))}
                    </select>

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCardModal;
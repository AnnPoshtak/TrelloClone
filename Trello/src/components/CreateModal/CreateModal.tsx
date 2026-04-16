import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { IList } from "../../common/interfaces/IList.ts";

interface IModalProps {
    modalStatus: boolean;
    onClose: () => void;
    onSubmit: (data: { text: string; listId?: number; color?: string }) => void;
    modalTitle: string;
    placeholder?: string;
    lists?: IList[];
    withColorPicker?: boolean;
}
type FormValues = {
    text: string;
    listId?: number;
    color?: string;
};

function CreateModal({ 
    modalStatus, 
    onClose, 
    onSubmit, 
    modalTitle, 
    placeholder = "Title", 
    lists, 
    withColorPicker 
}: IModalProps) {
    
    const { 
        register, 
        handleSubmit,
        reset,   
        setValue,
        formState: { errors } 
    } = useForm<FormValues>({
        defaultValues: {
            text: "",
            color: "#737373"
        }
    });
    useEffect(() => {
        if (lists && lists.length > 0) {
            setValue("listId", lists[0].id);
        }
    }, [lists, setValue]);

    useEffect(() => {
        if (modalStatus) {
            reset({
                text: "",
                color: "#737373",
                listId: lists && lists.length > 0 ? lists[0].id : undefined
            });
        }
    }, [modalStatus, lists, reset]);

    if (!modalStatus) return null;

    const onSubmitForm: SubmitHandler<FormValues> = (data) => {
        onSubmit({ 
            text: data.text, 
            listId: data.listId ? Number(data.listId) : undefined, 
            color: data.color 
        });
        
        reset(); 
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{modalTitle}</h3>
                <form onSubmit={handleSubmit(onSubmitForm)} style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
                    
                    <input
                        type="text"
                        placeholder={placeholder}
                        autoFocus
                        style={{ padding: "10px", width: "300px", marginBottom: errors.text ? '0px' : '10px' }}
                        {...register("text", { required: "Це поле є обов'язковим" })}
                    />
                    {errors.text && <span style={{ color: "red", fontSize: "12px", alignSelf: "flex-start", marginLeft: "10%" }}>{errors.text.message}</span>}

                    {lists && (
                        <select
                            style={{ padding: "10px", width: "300px", marginBottom: '10px' }}
                            {...register("listId", { required: "Оберіть список" })}
                        >
                            {lists.map((list) => (
                                <option key={list.id} value={list.id}>
                                    {list.title}
                                </option>
                            ))}
                        </select>
                    )}

                    {withColorPicker && (
                        <input
                            type="color"
                            style={{ height: "40px", width: "300px", marginBottom: '10px' }}
                            {...register("color")}
                        />
                    )}

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateModal;
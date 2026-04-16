import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface IEditModalProps {
    modalStatus: boolean;
    onClose: () => void;
    onSubmit: (data: { text: string; color?: string }) => void;
    modalTitle: string;
    placeholder?: string;
    initialText?: string; 
    initialColor?: string;
    withColorPicker?: boolean; 
}

type FormValues = {
    text: string;
    color?: string;
};

function EditModal({ 
    modalStatus, 
    onClose, 
    onSubmit, 
    modalTitle, 
    placeholder = "Title", 
    initialText = "",
    initialColor = "#737373", 
    withColorPicker 
}: IEditModalProps) {
    
    const { 
        register, 
        handleSubmit,
        reset,   
        formState: { errors } 
    } = useForm<FormValues>({
        defaultValues: {
            text: initialText,
            color: initialColor
        }
    });

    useEffect(() => {
        if (modalStatus) {
            reset({
                text: initialText,
                color: initialColor
            });
        }
    }, [modalStatus, initialText, initialColor, reset]);

    if (!modalStatus) return null;

    const onSubmitForm: SubmitHandler<FormValues> = (data) => {
        onSubmit({ 
            text: data.text, 
            color: data.color
        });
        
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
                    {withColorPicker && (
                        <input
                            type="color"
                            style={{ height: "40px", width: "300px", marginBottom: '10px' }}
                            {...register("color")}
                        />
                    )}

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button> 
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
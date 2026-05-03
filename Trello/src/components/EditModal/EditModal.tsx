import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {themeSettings} from "../../ThemeSettings.ts"

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
    
    const [themeStatus] = useState(() => {
                return localStorage.getItem("trello_theme") || "Світло-Синя";
            });

    useEffect(() => {
        if (modalStatus) {
            reset({
                text: initialText,
                color: initialColor
            });
        }
    }, [modalStatus, initialText, initialColor, reset]);

    const currentTheme = themeSettings[themeStatus as keyof typeof themeSettings] || themeSettings["Небесна"];

    if (!modalStatus) return null;

    const onSubmitForm: SubmitHandler<FormValues> = (data) => {
        onSubmit({ 
            text: data.text, 
            color: data.color
        });
        
        onClose(); 
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"  onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-[400px] animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6 text-[#172b4d] text-center">{modalTitle}</h3>
                <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
                    
                    <input
                        type="text"
                        placeholder={placeholder}
                        autoFocus
                        className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all ${
                                errors.text ? 'border-red-500' : 'border-[#ddd]'
                        }`}
                        {...register("text", { required: "Це поле є обов'язковим" })}
                    />
                    {errors.text && <span style={{ color: "red", fontSize: "12px", alignSelf: "flex-start", marginLeft: "10%" }}>{errors.text.message}</span>}
                    {withColorPicker && (
                        <input
                            type="color"
                            className="h-12 w-full cursor-pointer rounded-lg border border-[#ddd] p-1 bg-white"
                            {...register("color")}
                        />
                    )}

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                            Відмінити
                        </button>
                        <button type="submit" className={`px-5 py-2  text-white rounded-lg ${currentTheme.btn} shadow-md active:scale-95 transition-all font-semibold`}>
                            Зберегти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
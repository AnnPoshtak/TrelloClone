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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-[400px] animate-in fade-in zoom-in duration-300"onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6 text-[#172b4d] text-center">
                    {modalTitle}
                </h3>
                
                <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4">
                    
                    <div className="flex flex-col gap-1">
                        <input
                            type="text"
                            placeholder={placeholder}
                            autoFocus
                            className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] transition-all ${
                                errors.text ? 'border-red-500' : 'border-[#ddd]'
                            }`}
                            {...register("text", { required: "Це поле є обов'язковим" })}
                        />
                        {errors.text && (
                            <span className="text-red-500 text-xs px-1">{errors.text.message}</span>
                        )}
                    </div>

                    {lists && (
                        <select
                            className="p-3 border border-[#ddd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc] bg-white cursor-pointer"
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
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">Pick board color:</label>
                            <input
                                type="color"
                                className="h-12 w-full cursor-pointer rounded-lg border border-[#ddd] p-1 bg-white"
                                {...register("color")}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-5 py-2 bg-[#0052cc] text-white rounded-lg hover:bg-[#0043a6] shadow-md active:scale-95 transition-all font-semibold"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateModal;
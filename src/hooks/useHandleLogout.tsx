import { baseApi } from "@/redux/api/baseApi";
import { useLogoutMutation } from "@/redux/api/userApi";
import { logout } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import { errorMessageGenerator } from "@/utils/errorMessageGenerator";
import { toast } from "sonner";

export const useHandleLogout = () => {
    const dispatch = useAppDispatch();
    const [clearCookie] = useLogoutMutation();
    const handleLogout = async () => {
        const toastId = toast.loading('Logging out...')
        try {
            await clearCookie(undefined).unwrap();
            toast.info('Logged Out!!', { id: toastId });
            dispatch(baseApi.util.resetApiState());
            dispatch(logout())
        } catch (error) {
            toast.error(errorMessageGenerator(error), { id: toastId })
        }
    }
    return handleLogout
};
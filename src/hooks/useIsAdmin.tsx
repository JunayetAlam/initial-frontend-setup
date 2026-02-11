import { useGetMeQuery } from "@/redux/api/userApi";
import { useCurrentToken, useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";


export default function useIsAdmin() {
    const token = useAppSelector(useCurrentToken);
    const user = useAppSelector(useCurrentUser)
    const { data, isLoading: isAdminLoading } = useGetMeQuery(undefined, {
        skip: !token
    });
    const isAdmin = user && data?.data?.role === 'SUPERADMIN'
    const isSuperAdmin = user && data?.data?.role === 'SUPERADMIN'
    return [isAdmin, isAdminLoading, isSuperAdmin] as const
}
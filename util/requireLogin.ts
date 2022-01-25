import {useUser} from "@auth0/nextjs-auth0";
import {useEffect} from "react";
import {useRouter} from "next/router";

export function useRequireLogin(){
    const {user, isLoading} = useUser();
    const router = useRouter();
    useEffect(() => {
        if(!isLoading && !user) router.push("/");
    }, [user, isLoading]);
}
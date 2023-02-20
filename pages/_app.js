import '../styles/globals.css'
import {useEffect, useState} from "react";
import {magic} from "@/lib/magic-client";
import {useRouter} from 'next/router';
import {handleRouterLoading} from "@/utils/routerLoading";
import Loading from "@/components/loading/loading";

export default function App({Component, pageProps}) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const handleLoggedIn = async () => {
            const isLoggedIn = await magic.user.isLoggedIn();
            if (isLoggedIn) {
                router.push('/');
            } else {
                router.push('/login');
            }
        }
        handleLoggedIn();
    });

    useEffect(() => {
        handleRouterLoading(setIsLoading, router);
    }, [router]);

    return isLoading ? <Loading/> : <Component {...pageProps} />
}

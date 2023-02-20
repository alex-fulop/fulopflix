import Head from 'next/head';
import Link from "next/link";
import Image from 'next/image';

import styles from '../styles/Login.module.css';
import {useEffect, useState} from "react";
import {useRouter} from 'next/router';
import {magic} from '@/lib/magic-client'
import {handleRouterLoading} from "@/utils/routerLoading";

const Login = () => {
    const [email, setEmail] = useState('');
    const [userMsg, setUserMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        return handleRouterLoading(setIsLoading, router);
    }, [router]);

    const handleLogInWithEmail = async (e) => {
        e.preventDefault();

        if (email) {
            try {
                setIsLoading(true);
                const didToken = await magic.auth.loginWithMagicLink({email});
                if (didToken) {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${didToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const loggedInResponse = await response.json();
                    if (loggedInResponse.done) {
                        router.push('/');
                    } else {
                        setIsLoading(false);
                        setUserMsg('Something went wrong logging in')
                    }
                }
            } catch (err) {
                console.error('Something went wrong logging in ', err);
            }
        } else {
            setUserMsg('Enter a valid email address');
        }
    }

    const handleOnChangeEmail = (e) => {
        setUserMsg('');
        setEmail(e.target.value);
        e.preventDefault();
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Fulopflix SignIn</title>
                <meta name='viewport' content='initial-scale=1.0, width=devide-width'/>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <Link className={styles.logoLink} href='/' src='logo'>
                        <div className={styles.logoWrapper}>
                            <Image src={'/static/fulopflix.png'} width='128' height='34' alt='fulopflix logo'/>
                        </div>
                    </Link>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>
                    <input className={styles.emailInput} type='text' placeholder='Email address'
                           onChange={handleOnChangeEmail}/>
                    <p className={styles.userMsg}>{userMsg}</p>
                    <button className={styles.loginBtn}
                            onClick={handleLogInWithEmail}>{isLoading ? 'Loading...' : 'Sign In'}</button>
                </div>
            </main>
        </div>
    );
}

export default Login;
import styles from "@/components/navbar/navbar.module.css";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import Link from "next/link";
import {magic} from "@/lib/magic-client";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState('');
    const [didToken, setDidToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const applyUsernameInNav = async () => {
            try {
                const {email} = await magic.user.getMetadata();
                const didToken = await magic.user.getIdToken();

                if (email) {
                    setUsername(email);
                    setDidToken(didToken);
                }
            } catch (err) {
                console.error('Error retrieving email', err);
            }
        };
        applyUsernameInNav();
    }, [])
    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push('/')
    }
    const handleOnClickMyList = (e) => {
        e.preventDefault();
        router.push('/browse/my-list')
    }
    const handleOnClickShowDropdown = (e) => {
        e.preventDefault()
        setShowDropdown(!showDropdown);
    }
    const handleSignout = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${didToken}`,
                    "Content-Type": "application/json"
                }
            });

            await response.json();
        } catch (err) {
            console.error('Error retrieving email', err);
            router.push('/login');
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Link className={styles.logoLink} href='/' src='logo'>
                    <div className={styles.logoWrapper}>
                        <Image src={'/static/fulopflix.png'} width='128' height='34' alt='fulopflix logo'/>
                    </div>
                </Link>
                <ul className={styles.navItems}>
                    <li className={styles.navItem1} onClick={handleOnClickHome}>Home</li>
                    <li className={styles.navItem2} onClick={handleOnClickMyList}>My List</li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn} onClick={handleOnClickShowDropdown}>
                            <p className={styles.username}>{username}</p>
                            <Image src={'/static/expand_more.svg'} width='24' height='24' alt='expand more icon'/>
                        </button>
                        {showDropdown &&
                            <div className={styles.navDropdown}>
                                <div>
                                    <a className={styles.linkName} onClick={handleSignout}>Sign out</a>
                                    <div className={styles.lineWrapper}></div>
                                </div>
                            </div>
                        }
                    </div>
                </nav>
            </div>
        </div>
    )
};

export default Navbar;
import Head from "next/head";
import Navbar from "@/components/navbar/navbar";
import CardCarousel from "@/components/card-carousel/card-carousel";

import styles from '../../styles/MyList.module.css';
import {getMyList} from "@/lib/videos";
import getRedirectUser from "@/utils/redirectUser";

export async function getServerSideProps(context) {
    const {userId, token} = await getRedirectUser(context);

    const videos = await getMyList(userId, token);
    return {
        props: {
            myListVideos: videos
        }
    }
}

const MyList = ({myListVideos}) => {
    return (
        <div>
            <Head>
                <title>My list</title>
            </Head>
            <main className={styles.main}>
                <Navbar/>
                <div className={styles.sectionWrapper}>
                    <CardCarousel title='My List'
                                  videos={myListVideos}
                                  size='small'
                                  shouldWrap
                                  shouldScale={false}/>
                </div>
            </main>
        </div>);
}

export default MyList;
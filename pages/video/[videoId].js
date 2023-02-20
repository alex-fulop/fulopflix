import {useRouter} from 'next/router';
import Modal from 'react-modal';
import styles from '../../styles/Video.module.css';
import cls from 'classnames';
import {getVideosById} from "@/lib/videos";
import Navbar from "@/components/navbar/navbar";
import Like from "@/components/icons/like-button";
import DisLike from "@/components/icons/dislike-button";
import {useEffect, useState} from "react";

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
    const videoId = context.params.videoId;

    const videoArray = await getVideosById(videoId);
    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {}
        },
        revalidate: 10
    }
}

export async function getStaticPaths() {
    const listOfVideos = ['tcrNsIaQkb4', 'AJKEXDKBVdk', 'L2lDxyAy8gs'];
    const paths = listOfVideos.map((videoId) => ({
        params: {videoId}
    }));
    return {paths, fallback: 'blocking'};
}

const Video = ({video}) => {
    const router = useRouter();
    const videoId = router.query.videoId;

    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDislike, setToggleDislike] = useState(false);

    const {
        title,
        publishedTime,
        description,
        channelTitle,
        statistics: {viewCount} = {viewCount: 0}
    } = video;

    useEffect(() => {
        async function getFavoritedData() {
            const response = await fetch(`/api/stats?videoId=${videoId}`, {method: 'GET'});
            const data = await response.json();

            if (data.length > 0) {
                const favoritedVal = data[0].favorited;
                if (favoritedVal === 1) setToggleLike(true);
                else if (favoritedVal === 0) setToggleDislike(true);
            }
        }
        getFavoritedData();
    });

    const handleToggleDislike = async () => {
        const disliked = !toggleDislike;
        setToggleDislike(disliked);
        setToggleLike(!disliked);

        const favorited = disliked ? 0 : 1;
        await runRatingService(favorited);
    }

    const handleToggleLike = async () => {
        const liked = !toggleLike;
        setToggleLike(liked);
        setToggleDislike(!liked);

        const favorited = liked ? 1 : 0;
        await runRatingService(favorited);
    }

    const runRatingService = async (favorited) => {
        return await fetch('/api/stats', {
            method: 'POST',
            body: JSON.stringify({videoId: videoId, favorited}),
            headers: {'Content-Type': 'application/json'}
        });
    }

    return (
        <div className={styles.container}>
            <Navbar/>
            <Modal className={styles.modal}
                   isOpen={true}
                   contentLabel='Watch the video'
                   onRequestClose={() => router.back()}
                   overlayClassName={styles.overlay}>
                <iframe className={styles.videoPlayer}
                        id='ytplayer'
                        width='100%'
                        height='360'
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=http://example.com&controls=0&rel=1`}
                        frameBorder='0'>
                </iframe>
                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleLike}>
                            <div className={styles.btnWrapper}>
                                <Like selected={toggleLike}/>
                            </div>
                        </button>
                    </div>
                    <button onClick={handleToggleDislike}>
                        <div className={styles.btnWrapper}>
                            <DisLike selected={toggleDislike}/>
                        </div>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>{publishedTime}</p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.col2}>
                            <p className={cls(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>Cast: </span>
                                <span className={styles.channelTitle}>{channelTitle}</span>
                            </p>
                            <p className={cls(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>View Count: </span>
                                <span className={styles.channelTitle}>{viewCount}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Video;
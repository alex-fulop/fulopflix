import styles from './card-carousel.module.css';
import Card from "@/components/card/card";
import Link from 'next/link';
import cls from 'classnames';

const CardCarousel = (props) => {
    const {title, videos = [], size, shouldWrap = false, shouldScale} = props;
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
                {videos.map((video, index) => {
                    return (
                        <Link key={video.id} href={`/video/${video.id}`}>
                            <Card key={index}
                                  id={index}
                                  imgUrl={video.imgUrl}
                                  size={size}
                                  shouldScale={shouldScale}/>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default CardCarousel
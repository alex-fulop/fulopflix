import styles from './card.module.css';
import Image from 'next/image'
import {useState} from "react";

import {motion} from "framer-motion";
import cls from 'classnames';

const Card = (props) => {
    const {imgUrl, size = 'medium', id, shouldScale = true} = props;
    const [imageSource, setImageSource] = useState(imgUrl);
    const scale = id === 0 ? {scaleY: 1.1} : {scale: 1.1};
    const shouldHover = shouldScale && {whileHover: {...scale}};

    const classMap = {
        'large': styles.lgItem,
        'medium': styles.mdItem,
        'small': styles.smItem
    }
    const handleOnError = () => {
        setImageSource('/static/no-thumbnail.jpg');
    }
    return (
        <div className={styles.container}>
            <motion.div className={cls(styles.imgMotionWrapper, classMap[size])} {...shouldHover}>
                <Image className={styles.cardImg}
                       src={imageSource}
                       alt='image'
                       layout='fill'
                       onError={handleOnError}/>
            </motion.div>
        </div>
    );
};
export default Card;
import videoMocks from '/data/videos.json';
import {getMyListVideos, getWatchedVideos} from "@/lib/db/hasura";

const fetchVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = 'youtube.googleapis.com/youtube/v3';

    const response = await fetch(`https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`);

    return await response.json();
};

export const getVideos = (searchQuery) => {
    const SEARCH_URL = `search?part=snippet&type=video&q=${searchQuery}`;
    return getCommonVideos(SEARCH_URL);
};

export const getPopularVideos = () => {
    const SEARCH_URL = 'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US';
    return getCommonVideos(SEARCH_URL);
};

export const getVideosById = (videoId) => {
    const SEARCH_URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
    return getCommonVideos(SEARCH_URL);
};

export const getCommonVideos = async (url) => {
    try {
        const isDev = process.env.DEV;
        const data = isDev ? videoMocks : await fetchVideos(url);

        if (data?.error) {
            console.error('Youtube API error', data?.error);
            return [];
        }

        return data.items.map(item => {
            const id = item.id?.videoId || item.id;
            const snippet = item.snippet;
            return {
                id,
                title: snippet.title,
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                description: snippet.description,
                publishTime: snippet.publishedAt,
                channelTitle: snippet.channelTitle,
                statistics: item.statistics ? item.statistics : {viewCount: 0}
            };
        });
    } catch (err) {
        console.error('Something went wrong with video library', err);
        return [];
    }
};

export const getWatchItAgainVideos = async (userId, token) => {
    const videos = await getWatchedVideos(userId, token);
    return(
        videos?.map((video) => {
            return {
                id: video.videoId,
                imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
            }
        }) || []
    );
};

export const getMyList = async (userId, token) => {
    const videos = await getMyListVideos(userId, token)
    return(
        videos?.map((video) => {
            return {
                id: video.videoId,
                imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
            }
        }) || []
    );
};
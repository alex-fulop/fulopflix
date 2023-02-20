import {findVideoIdByUser, insertStats, updateStats} from "@/lib/db/hasura";
import {verifyToken} from "@/lib/utils";

export default async function stats(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(403).send({});
        } else {
            const inputParams = req.method === 'POST' ? req.body : req.query;
            const {videoId} = inputParams;
            if (videoId) {
                const userId = await verifyToken(token);
                const findVideo = await findVideoIdByUser(token, userId, videoId);
                const doesStatsExist = findVideo?.length > 0;

                if (req.method === 'POST') {
                    const {favorited, watched = true} = req.body;
                    const requestBody = {favorited, watched, videoId, userId};

                    if (doesStatsExist) {
                        const response = await updateStats(token, requestBody);
                        res.send({data: response});
                    } else {
                        const response = await insertStats(token, requestBody);
                        res.send({data: response});
                    }
                } else {
                    if (doesStatsExist) res.send(findVideo);
                    else res.status(404).send({user: null, msg: "Video not found"});
                }
            }
        }
    } catch (err) {
        console.error('Error occurred /stats', err);
        res.status(500).send({done: false, error: err?.message})
    }
}
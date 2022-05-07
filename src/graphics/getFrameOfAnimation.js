const getFramebyTime = (elapsedTime, animationRunTime, frames) => {
    const index = Math.floor(elapsedTime / animationRunTime) % frames.length;
    return frames[index];
}

export default getFrameByTime;

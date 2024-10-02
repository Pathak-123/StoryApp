export const isVideoUrl = (url) => {
    const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|m4v|3gp)$/i;
    return videoExtensions.test(url);
  };


export const checkVideoDuration = (url) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = url;
        video.onloadedmetadata = () => {
            if (Math.floor(video.duration) > 15) {
                
                resolve(false);
            } else {
                resolve(true);
            }
        };
        video.onerror = () => {
            
            resolve(false);  
          };
    });
};

export const truncateDescription = (description,length) => {
    if (description.length > length) {
        return description.slice(0, length) + '...';
      }
    return description;
  };
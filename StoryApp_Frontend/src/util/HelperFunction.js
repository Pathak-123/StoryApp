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
    const words = description.split(' ');
    if (words.length > length) {
      return words.slice(0, length).join(' ') + '...';
    }
    return description;
  };
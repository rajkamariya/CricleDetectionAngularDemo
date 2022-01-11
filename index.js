window.onload = function () {
    // get video stream from user's webcam
    navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then(function (stream) {
  
      // We need to create a video element and pipe the stream into it so we
      // can know when we have data in the stream, and its width/height.
      // Note that this video doesn't need to be attached to the DOM for this
      // to work.
      var video = document.getElementById('videoInput');
      var binaryData = [];  
      binaryData.push(stream);
      video.srcObject = stream;

      video.addEventListener('loadedmetadata', function () {
        initCanvas(video);
      });
      // we need to play the video to trigger the loadedmetadata event
      video.play();
    });
  };
  
  function initCanvas(video) {
    var width = video.videoWidth;
    var height = video.videoHeight;
  
    var canvas = document.getElementById('video');
    canvas.width = width;
    canvas.height = height;
    // // use requestAnimationFrame to render the video as often as possible
    var context = canvas.getContext('2d');
    
    
    var draw = function () {
        // schedule next call to this function
        requestAnimationFrame(draw);
        
        context.drawImage(video, 0, 0, width, height);

        let src = cv.imread(canvas);
        let dst = cv.imread(canvas);;
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
        
        let ksize = new cv.Size(3, 3);
        let anchor = new cv.Point(-1, -1);
        cv.blur(src,src,ksize,anchor) 

        let circles = new cv.Mat();

        let color = new cv.Scalar(255, 0, 0, 255);

        // You can try more different parameters

        minDist = 100
        param1 = 50
        param2 = 50 
        minRadius = 1
        maxRadius = 100
        cv.HoughCircles(src, circles, cv.HOUGH_GRADIENT,
                        1, minDist, param1=param1, param2=param2, minRadius=minRadius, maxRadius=maxRadius);
        // draw circles
        document.getElementById('detect').innerHTML = '';
        for (let i = 0; i < circles.cols; ++i) {
            let x = circles.data32F[i * 3];
            let y = circles.data32F[i * 3 + 1];
            let radius = circles.data32F[i * 3 + 2];
            let center = new cv.Point(x, y);
            cv.circle(dst, center, radius, color,2);
            document.getElementById('detect').innerHTML = 'Circle Detected';
        }
        cv.imshow('canvasOutput', dst);
        src.delete();
        dst.delete();
    };
  
    // Start the animation loop
    requestAnimationFrame(draw);
  }
  function onOpenCvReady() {
    document.getElementById('status').innerHTML = '';
  }
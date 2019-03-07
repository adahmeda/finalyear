function sobel (can){
     // console.log(can)
    ctx = can.getContext('2d');
    imgIn = ctx.getImageData(0, 0, can.width, can.height);
    imgOut = ctx.createImageData(can.width, can.height);

      // convolution kernels
      var kernelX = [
        [-1,0,1],
        [-2,0,2],
        [-1,0,1]
      ];
  
      var kernelY = [
        [-1,-2,-1],
        [0,0,0],
        [1,2,1]];
  

    
    var datIn = imgIn.data;
    var width=imgIn.width;
    var height=imgIn.height;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width=width
    canvas.height=height
    var imageData = context.createImageData(width, height);
    context.fillStyle = '#000';

    var grayscaleData=[];
    var sobelData = [];


    function getPixelIntensity(data,x,y,i=0)
    {
        
        return data[((width*y)+x)*4+i];
    }


    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          var r =getPixelIntensity(datIn,x, y, 0);
          var g = getPixelIntensity(datIn,x, y, 1);
          var b = getPixelIntensity(datIn,x, y, 2);
  
          var avg = (r + g + b) / 3;
          grayscaleData.push(avg, avg, avg, 255);
        }
      }
      datOut=grayscaleData;

      
      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          var pixelX = (
              (kernelX[0][0] * getPixelIntensity(grayscaleData,x - 1, y - 1)) +
              (kernelX[0][1] * getPixelIntensity(grayscaleData,x, y - 1)) +
              (kernelX[0][2] * getPixelIntensity(grayscaleData,x + 1, y - 1)) +
              (kernelX[1][0] * getPixelIntensity(grayscaleData,x - 1, y)) +
              (kernelX[1][1] * getPixelIntensity(grayscaleData,x, y)) +
              (kernelX[1][2] * getPixelIntensity(grayscaleData,x + 1, y)) +
              (kernelX[2][0] * getPixelIntensity(grayscaleData,x - 1, y + 1)) +
              (kernelX[2][1] * getPixelIntensity(grayscaleData,x, y + 1)) +
              (kernelX[2][2] * getPixelIntensity(grayscaleData,x + 1, y + 1))
          );
  
          var pixelY = (
            (kernelY[0][0] * getPixelIntensity(grayscaleData,x - 1, y - 1)) +
            (kernelY[0][1] * getPixelIntensity(grayscaleData,x, y - 1)) +
            (kernelY[0][2] * getPixelIntensity(grayscaleData,x + 1, y - 1)) +
            (kernelY[1][0] * getPixelIntensity(grayscaleData,x - 1, y)) +
            (kernelY[1][1] * getPixelIntensity(grayscaleData,x, y)) +
            (kernelY[1][2] * getPixelIntensity(grayscaleData,x + 1, y)) +
            (kernelY[2][0] * getPixelIntensity(grayscaleData,x - 1, y + 1)) +
            (kernelY[2][1] * getPixelIntensity(grayscaleData,x, y + 1)) +
            (kernelY[2][2] * getPixelIntensity(grayscaleData,x + 1, y + 1))
          );
  
          var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;
  
          sobelData.push(magnitude, magnitude, magnitude, 255);
        }
      }
      var clampedArray = sobelData;

    if (typeof Uint8ClampedArray === 'function') {
        clampedArray = new Uint8ClampedArray(sobelData);
      }
  
    

      //alert(clampedArray.length)
      imageData.data.set(clampedArray);
      document.body.appendChild(canvas);
     // var sobelImageData = Sobel.toImageData(sobelData, width, height);
    context.putImageData(imageData, 0, 0);
  // console.log(imageData.data);

   return canvas;
}


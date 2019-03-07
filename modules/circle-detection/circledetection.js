function  HoughCircleTransform (canvas) {

    width=canvas.width;
    height=canvas.height;
   
    var sinus= [];
    var cosine=[]
    var radiiSin=[]
    var radiiCos=[]
    var houghArray=[]
    var houghArrayFiltered =[]
    var houghImageData=[]
    var minRadius,maxRadius,calculateRadiusIndex,calculateStepSize, asynchronousCallsCounter,overallMax,filteredMax,maxCircumference,threshold;
    
    var  aMin = 10;
    var relativeVoteMin = 0.25;

    var numEdgePixels = 0;
    var edgePixels = [];
    ctx = canvas.getContext('2d');
    imgIn = ctx.getImageData(0, 0, width, height);
    console.log(imgIn.data)
    
    var factor =  Math.floor(4 * width);
    var edgePixel = [];
    for(var i = 0; i < height; i+=4){
        console.log(i)
        console.log(imgIn.data[i]);
        if(imgIn.data[i] > 0){
           

            edgePixel.x = Math.round(i % factor) * 0.25;
            edgePixel.y = Math.round(i / factor);
            edgePixel.i = i;

            edgePixels.push(edgePixel);
        }
    }
    alert(imgIn.data.length)
    numEdgePixels =edgePixels.length;
    //alert(numEdgePixels)

 function init(){   
    minRadius = 5;
    threshold=0.3;
    maxRadius = (width < height) ? width : height;

    calculateStepSize = 1;
    asynchronousCallsCounter = 0;
    calculateRadiusIndex = 0;

    stepSizeAngles = (2 * Math.PI) / 360;

    cosine = [];
    sinus = [];

    for (var i = 0, index = 0; i < (2 * Math.PI); i += stepSizeAngles, index++)
     {
            cosine[index] = Math.cos(i);
            sinus[index] = Math.sin(i);
    }

    radiiSin = [];
    radiiCos = [];

    for (var i = 0; i < maxRadius - minRadius; i++) {
        radiiSin[i] = [];
        radiiCos[i] = [];
        for (var j = 0; j < cosine.length; j++) {
                radiiSin[i][j] = (i + minRadius) * sinus[j];
                radiiCos[i][j] = (i + minRadius) * cosine[j];
            }
        }
        houghArray = [];
        overallMax = Number.MIN_VALUE;

        
    }

    function start () {
        houghArray = [];
        asynchronousCallsCounter += 1;
        generateHoughArray(asynchronousCallsCounter);
    }
    function startFiltering () {
        threshold=0.3
        houghArrayFiltered = [];
        filteredMax = Number.MIN_VALUE;

        //calculateRadiusIndex = 0;

        asynchronousCallsCounter += 1;
        generateFilteredHoughArray(asynchronousCallsCounter);
    }
    function finish(){
        var canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        var context  = canvas.getContext('2d');
        filteredHoughImageData = context.getImageData(0,0, canvas.width, canvas.height);
        createFilteredHoughImageData();
       
       resultImage = createResultImage();

        //houghImageFinished();
       //  parent.filteredHoughImageFinished();
        // parent.resultImageFinished();

    }
 function generateHoughArray(calculateRequestNumber) {

    if (calculateRequestNumber != asynchronousCallsCounter) {
        houghArray = [];
        calculateRadiusIndex = 0;
        overallMax = Number.MIN_VALUE;
        return;
    }

    var percentageDone;
    if (calculateRadiusIndex == 0) {
        percentageDone = 0;
    } else {
        percentageDone = Math.round((calculateRadiusIndex / (maxRadius - minRadius)) * 100);
    }

    console.log("Accumulating data, " + percentageDone + "% done.");

    calculateHoughArray(calculateRadiusIndex);

    if (calculateRadiusIndex < maxRadius - minRadius) {
        setTimeout(function () {
            generateHoughArray(calculateRequestNumber);
        }, 0);
    } else {
        // parent.console.log("");
        houghImageData = [];
        calculateRadiusIndex = 0;

     asynchronousCallsCounter += 1;
        generateHoughImageData(asynchronousCallsCounter);
    }
}
    function  generateHoughImageData(calculateRequestNumber){
      
        if (calculateRequestNumber != asynchronousCallsCounter) {
           houghImageData = [];
            return;
        }
        var percentageDone;
        if (calculateRadiusIndex == 0) {
            percentageDone = 0;
        } else {
            percentageDone = Math.round((calculateRadiusIndex / (maxRadius - minRadius)) * 100);
        }

        console.log("Generating accumulator-images: " + percentageDone + "% done.");

        calculateHoughImageData(houghArray,overallMax,calculateRadiusIndex);

        if (calculateRadiusIndex <maxRadius -minRadius) {
            setTimeout(function () {
                generateHoughImageData(calculateRequestNumber);
            }, 0);
        } else {
       

            houghImageData = [];
           

        

            startFiltering();
        }
    }
    function generateFilteredHoughArray(calculateRequestNumber) {
     
        if (calculateRequestNumber != asynchronousCallsCounter) {
            houghArrayFiltered = [];
            filteredMax = Number.MIN_VALUE;
            return;
        }
        var percentageDone;
        if (calculateRadiusIndex == 0) {
            percentageDone = 0;
        } else {
            percentageDone = Math.round((calculateRadiusIndex / (maxRadius - minRadius)) * 100);
        }

        console.log("Filtering accumulated data, " + percentageDone + "% done.");

        calculateFilteredArray();

        if (calculateRadiusIndex < maxRadius - minRadius) {
            setTimeout(function () {
               generateFilteredHoughArray(calculateRequestNumber);
            }, 0);
        } else {
            //console.log("");
            finish();
        }
    }
     function calculateFilteredArray() {
        var startIndex =  calculateRadiusIndex;
        var endIndex =  calculateRadiusIndex +  calculateStepSize;

        if (endIndex >  maxRadius -  minRadius) {
            endIndex =  maxRadius -  minRadius;
        }
         calculateRadiusIndex = endIndex;

        var maxIndexRadius =  houghArray.length;
        var maxIndexX =  width;
        var maxIndexY =  height;

        for (var radiusIndex = startIndex; radiusIndex < endIndex; radiusIndex++) {
            if(! houghArray[radiusIndex]){
                continue;
            }
            for (var x = 0; x < maxIndexX; x++) {
                if(! houghArray[radiusIndex][x]){
                    continue;
                }
                for (var y = 0; y < maxIndexY; y++) {
                    if(! houghArray[radiusIndex][x][y]){
                        continue;
                    }

                    if( houghArray[radiusIndex][x][y] >=  threshold){
                        var localMax = true;
                        for(var i = (radiusIndex - 3); i < (radiusIndex + 4) && localMax; i++){
                            if(i > 0 && i < maxIndexRadius){
                                if(!  houghArray[i]){
                                    continue;
                                }
                                for(var j = (x - 3); j < (x + 4); j++){
                                    if(!  houghArray[i][j]){
                                        continue;
                                    }
                                    if(j > 0 && j < maxIndexX){
                                        for(var k = (y - 3); k < (y + 4); k++){
                                            if(!  houghArray[i][j][k]){
                                                continue;
                                            }
                                            if(k > 0 && k < maxIndexY){
                                                if( houghArray[radiusIndex][x][y] <  houghArray[i][j][k]){
                                                    localMax = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if(localMax){
                            if( filteredMax <   houghArray[radiusIndex][x][y]){
                                 filteredMax =  houghArray[radiusIndex][x][y]
                            }

                            var filteredItem = [];

                            filteredItem.x = x;
                            filteredItem.y = y;
                            filteredItem.radiusIndex = radiusIndex;
                            filteredItem.accumulated =  houghArray[radiusIndex][x][y]

                             houghArrayFiltered.push(filteredItem);

                        }
                    }
                }
            }
        }
    }

    function calculateHoughArray(startIndex) {
        var endIndex = startIndex + calculateStepSize;

        if (endIndex > maxRadius - minRadius) {
            endIndex = maxRadius - minRadius;
        }

        var maxAngle =  cosine.length;
       // console.log("MAX ANGLE:", maxAngle)

for(var radiusIndex = startIndex; radiusIndex < endIndex; radiusIndex++){
    if(!houghArray[radiusIndex]){
        houghArray[radiusIndex] = [];
    }
    for(var edgePixelIndex = 0; edgePixelIndex < numEdgePixels; edgePixelIndex++){
        var edgePixel = edgePixels[edgePixelIndex];

        for(var angleIndex = 0; angleIndex < maxAngle; angleIndex++){
            var x = Math.floor(edgePixel.x + radiiCos[radiusIndex][angleIndex]);
            var y = Math.floor(edgePixel.y + radiiSin[radiusIndex][angleIndex]);

            if(x < 0 || y < 0 || x > width || y > height){
                continue;
            }

            if(!houghArray[radiusIndex][x]){
                houghArray[radiusIndex][x] = [];
            }
            if(!houghArray[radiusIndex][x][y]) {
                houghArray[radiusIndex][x][y] = 0;
            }

            houghArray[radiusIndex][x][y] += 1;

            if(overallMax < houghArray[radiusIndex][x][y]){
                overallMax = houghArray[radiusIndex][x][y];
            }
        }
    }
}
        calculateRadiusIndex = endIndex;
        //console.log(houghArray.length)
    }




function calculateHoughImageData(array, maxValue, startIndex) 
{
        var endIndex = startIndex + calculateStepSize;

        if (endIndex > maxRadius - minRadius) {
            endIndex = maxRadius - minRadius;
        }

        var canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext('2d');
        //context.drawImage(imgIn, 0, 0);

        var factor = 255 / maxValue;

        for (var i = startIndex; i < endIndex; i++) {
            var imageData = context.createImageData(canvas.width, canvas.height);
            for (var resultY = 0, index = 0; resultY < canvas.height; resultY++) {

                for (var resultX = 0; resultX < canvas.width; resultX++, index += 4) {
                    if (!array[i] || !array[i][resultX] || !array[i][resultX][resultY]) {
                        imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = 0;
                    } else {
                        imageData.data[index] = imageData.data[index + 1] = imageData.data[index + 2] = array[i][resultX][resultY] * factor;
                    }
                    imageData.data[index + 3] = 255;
                }
            }
            houghImageData[i] = imageData;
        }
        calculateRadiusIndex = endIndex;

        context.putImageData(imageData, 0, 0);
     //   document.body.appendChild(canvas);
    }




    function calculateFilteredArray () {
        var startIndex = calculateRadiusIndex;
        var endIndex = calculateRadiusIndex + calculateStepSize;

        if (endIndex > maxRadius - minRadius) {
            endIndex = maxRadius - minRadius;
        }
        calculateRadiusIndex = endIndex;

         maxIndexRadius = houghArray.length;
        maxIndexX = width;
         maxIndexY =height;

        for (var radiusIndex = startIndex; radiusIndex < endIndex; radiusIndex++) {
            if(!houghArray[radiusIndex]){
                continue;
            }
            for (var x = 0; x < maxIndexX; x++) {
                if(!houghArray[radiusIndex][x]){
                    continue;
                }
                for (var y = 0; y < maxIndexY; y++) {
                    if(!houghArray[radiusIndex][x][y]){
                        continue;
                    }

                    if(houghArray[radiusIndex][x][y] >= threshold){
                        alert("threshold!!")
                        localMax = true;
                        for(var i = (radiusIndex - 3); i < (radiusIndex + 4) && localMax; i++){
                            if(i > 0 && i < maxIndexRadius){
                                if(! houghArray[i]){
                                    continue;
                                }
                                for(var j = (x - 3); j < (x + 4); j++){
                                    if(! houghArray[i][j]){
                                        continue;
                                    }
                                    if(j > 0 && j < maxIndexX){
                                        for(var k = (y - 3); k < (y + 4); k++){
                                            if(!houghArray[i][j][k]){
                                                continue;
                                            }
                                            if(k > 0 && k < maxIndexY){
                                                if(houghArray[radiusIndex][x][y] < houghArray[i][j][k]){
                                                    localMax = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if(localMax){
                            if(filteredMax <  houghArray[radiusIndex][x][y]){
                                filteredMax = houghArray[radiusIndex][x][y]
                            }

                            var filteredItem = [];

                            filteredItem.x = x;
                            filteredItem.y = y;
                            filteredItem.radiusIndex = radiusIndex;
                            filteredItem.accumulated = houghArray[radiusIndex][x][y]

                            houghArrayFiltered.push(filteredItem);

                        }
                    }
                }
            }
        }
    }



    function  createFilteredHoughImageData(){

        var canvas = document.createElement("canvas");

        var factor = 255 / filteredMax;
        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext('2d');
        

        var maxIndexX = canvas.width;
        var maxIndexY = canvas.height;

        for(var index = 0; index <filteredHoughImageData.data.length; index +=4){
         filteredHoughImageData.data[index] = filteredHoughImageData.data[index + 1] = filteredHoughImageData[index + 2] = 0;
          filteredHoughImageData.data[index + 3] = 255;
       

        }


        for(var filteredItemsIndex = 0; filteredItemsIndex < houghArrayFiltered.length; filteredItemsIndex++){
            var current =houghArrayFiltered[filteredItemsIndex];
            var index = ((current.y * canvas.width) + current.x) * 4;
           filteredHoughImageData.data[index] =filteredHoughImageData.data[index + 1] = filteredHoughImageData.data[index + 2] = current.accumulated * factor;
        }
        console.log(filteredHoughImageData.data)

        context.putImageData(filteredHoughImageData, 0, 0);
        document.body.appendChild(canvas);
    }


    function createResultImage(){
        var canvas = document.createElement("canvas");

        canvas.width =width;
        canvas.height = height;

        var context = canvas.getContext('2d');
      

        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var factor = 255 / overallMax;


        for(var filteredItemIndex = 0; filteredItemIndex < houghArrayFiltered.length; filteredItemIndex++){
            var filteredItem =houghArrayFiltered[filteredItemIndex];

            for(var angleIndex = 0; angleIndex < cosine.length; angleIndex++){

                var xOriginal = Math.floor(filteredItem.x + radiiCos[filteredItem.radiusIndex][angleIndex]);
                var yOriginal = Math.floor(filteredItem.y + radiiSin[filteredItem.radiusIndex][angleIndex]);

                if(xOriginal < 0 || yOriginal < 0 || xOriginal > canvas.width || yOriginal > canvas.height){
                    continue;
                }

                var index = ((yOriginal * canvas.width) + xOriginal) * 4;

                if(imageData.data[index] < filteredItem.accumulated * factor){
                    imageData.data[index] = filteredItem.accumulated * factor;
                }

                imageData.data[index + 1] = imageData.data[index + 2] = 0;
            }
        }

        context.putImageData(imageData, 0, 0);
       // document.body.appendChild(canvas);
        return canvas;
    }
    function selectHoughImage () {
        var index = document.querySelector('#hough-image-select').value;

      
        //houghImageFinished();
    }

    init()
    start()
    //finish()
}


//GET EUCLIDEAN DISTANCE OF COLOR
function colorDistance(r1,g1,b1,r2,g2,b2){
    var dr = r1 - r2;
    var dg = g1 - g2;
    var db = b1 - b2;
    return Math.sqrt( dr*dr + dg*dg + db*db );
}


function sumDistance(imageData,x,y,n){
    var pixels = imageData.data,
        imageSizeX = imageData.width,
        imageSizeY = imageData.height;

    // position information
    var px, py, i, j, pos;
    
    // distance accumulator
    var dSum = 0;
    
    // colors
    var r1 = pixels[4*(imageSizeX*y+x) + 0];
    var g1 = pixels[4*(imageSizeX*y+x) + 1];
    var b1 = pixels[4*(imageSizeX*y+x) + 2];
    var r2, g2, b2;
    
    for( i=-n; i<=n; i+=1 ){
        for( j=-n; j<=n; j+=1 ){

            // Tile the image if we are at an end
            px = (x+i) % imageSizeX;
            px = (px>0)?px:-px;
            py = (y+j) % imageSizeY;
            py = (py>0)?py:-py;

            // Get the colors of this pixel
            pos = 4*(imageSizeX*py + px);
            r2 = pixels[pos+0];
            g2 = pixels[pos+1];
            b2 = pixels[pos+2];

            // Work with the pixel
            dSum += colorDistance(r1,g1,b1,r2,g2,b2);
        }
    }

    return dSum;
}


function computeDistanceData(imageData,n){
    var pixels = imageData.data,
        imageSizeX = imageData.width,
        imageSizeY = imageData.height;

    var x,y;
    var data = [];
    for( x=0; x<imageSizeX; x+=1 ){
        for( y=0; y<imageSizeY; y+=1 ){
            data.push( {
                x: x,
                y: y,
                d: sumDistance(imageData,x,y,n)
            } );
        }
    }

    return data;
}


function byDecreasingD(a,b){
    return b.d - a.d;
}

function findCorners(canvas,apertureSize,numPoints){
    // Get the raw pixel data from the canvas
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0,0,canvas.width,canvas.height);

    // Compute and return the results
    var results = computeDistanceData(imageData,apertureSize);  
    return results.sort(byDecreasingD).slice(0,numPoints); 
}


function drawIntensity(canvas,apertureSize,results){
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0,0,canvas.width,canvas.height);

    // Draw the intensity values at each pixel
    var scale = Math.pow(apertureSize*2+1,3);
    var x,y,pos,val,i,l=results.length;
    for( i=0; i<l; i+=1 ){
        x = results[i].x;
        y = results[i].y;
        pos = 4*(canvas.width*y+x);
        val = results[i].d / (10);
        imageData.data[pos+0] = val;
        imageData.data[pos+1] = val;
        imageData.data[pos+2] = val;
    }
    context.putImageData(imageData,0,0);
}

function circleResults(canvas,results){
    var context = canvas.getContext('2d');
    alert("here");
    var i,x,y,l=results.length;
    context.strokeStyle = "1px solid red";
    for( i=0; i<l; i+=1 ){
        x = results[i].x;
        y = results[i].y;
        context.strokeRect(x-2,y-2,4,4);
        context.strokeRect(x-2,y-2,4,4);
        // console.info( results[i].d );
    }
}


function splatterCanvas(canvas){
/// Adds noise to `canvas`.
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0,0,canvas.width,canvas.height);
    var pixels = imageData.data,
        imageSizeX = imageData.width,
        imageSizeY = imageData.height,
        nPixels = imageSizeX * imageSizeY;

    for( var i=0; i<nPixels*4; i+=4 ){
        pixels[i+0] += Math.random()*64;
        pixels[i+1] += Math.random()*64;
        pixels[i+2] += Math.random()*64;
        pixels[i+3] = 255;
    }

    context.putImageData(imageData,0,0);
}

function  HoughCircleTransform (canvas) {

    width=canvas.width;
    height=canvas.height;
   
    var sinus= [];
    var cosine=[]
    var radiiSin=[]
    var radiiCos=[]
    var minRadius,maxRadius;
    var houghArray=[];
    

    ctx = canvas.getContext('2d');
    imgIn = ctx.getImageData(0, 0, width, height);
    console.log(imgIn.data)

    //alert(height)
    
    var edgePixelData=[];
    for( xpoint=0; xpoint<width; xpoint++)
    {
        for( ypoint=0; ypoint<height; ypoint++)
        {
            var i = ypoint * (width * 4) + xpoint* 4;
           // console.log(i)
            if(imgIn.data[i] > 0){
           
                //console.log(i)
                //console.log(imgIn.data[i]);
                var edgePixel = [];
                edgePixel.x = xpoint;
                edgePixel.y = ypoint;
                edgePixel.i = i;
                //console.log(edgePixel)
                edgePixelData.push(edgePixel);
              
            }
        }

    }
    

    
    numEdgePixels =edgePixelData.length;
    //alert(numEdgePixels)

 function init(){   
    minRadius = 0.5;
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

  

    for (var i = 0; i < maxRadius - minRadius; i++) {
        radiiSin[i] = [];
        radiiCos[i] = [];
        for (var j = 0; j < cosine.length; j++) {
                radiiSin[i][j] = (i + minRadius) * sinus[j];
                radiiCos[i][j] = (i + minRadius) * cosine[j];
            }
        }
      

        overallMax = Number.MIN_VALUE;

    


        
    }

    function getHoughIndex(a,b,r)
    {
        if(houghArray.length <=0)
        {
            return 0;
        }else
        {
            for(i=0; i<houghArray.length; i++)
            {
                if(houghArray[i].a=a && houghArray[i].b=== b && houghArray[i].r==r)
                {
                    return i;
                }
            }
        }

        return 0
    }

    function generateHoughArray()
    {
      
        console.log(" Generating Hough Array")
     
        var x;
        for(x=0; x<edgePixelData.length; x++)
        {
            var i;
            for(i=0; i<maxRadius-minRadius; i++)
            {
                var j;
                for(j=0; j<cosine.length; j++)
                {
                    var ha=[];
                   // console.log(radiiCos[i][j])
                    ha.a=edgePixelData.x -radiiCos[i][j];
                    ha.b=edgePixelData.y-radiiSin[i][j];
                    ha.r=minRadius+i;
                    houghArrayIndex=getHoughIndex(ha.a,ha.b,ha.r);

                    if(houghArrayIndex == 0)
                    {
                        ha.v=1;
                        houghArray.push(ha);
                    }else
                    {
                        houghArray[houghArrayIndex].v++
                    }
                    console.log(houghArray);
                }

                var p= i/maxRadius-minRadius*100;
               // console.log("Generating Votes For Points Percentage Done : " , p)
              
            }

            var p= x/edgePixelData.length
           // console.log("Generating Votes Percentage Done : " , p)
        }


    }

    init()
    generateHoughArray()
    start()
    //finish()
}

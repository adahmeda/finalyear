function gaussianFilter(sigma=1.6) 
{ 
    // intialising standard deviation to 1.0 
    
    var r;
    var s = 2.0 * sigma * sigma; 
    r=s;
  
    // sum is for normalization 
    var sum=0.0 
    kernel=[[],[],[],[],[]];
    // generating 5x5 kernel 
    for (var x = -2; x <= 2; x++) { 
        for (var y = -2; y <= 2; y++) { 
            r = Math.sqrt(x * x + y * y); 
            kernel[x + 2][y + 2] = (Math.exp(-(r * r) / s)) / (Math.PI * s); 
            sum =sum+ kernel[x + 2][y + 2]; 
        } 
    } 
  
    // normalising the Kernel 
    for (var i = 0; i < 5; ++i) 
      {  for (var j = 0; j < 5; ++j) 
        {
            kernel[i][j] =kernel[i][j] / sum; 
        }
      }

      return kernel;
} 

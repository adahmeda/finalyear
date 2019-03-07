function convolute(out, inp,  kernel)
{
   var kernel= kernel = [[1 / 256, 4  / 256,  6 / 256,  4 / 256, 1 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256],
    [4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256],
    [1 / 256, 4  / 256,  6 / 256,  4 / 256, 1 / 256]]
     var conv = 0; // This holds the convolution results for an index.
     var x
     var y; // Used for input matrix index

     input=inp.data;
     output=out.data;
     red=[];
    
     
    kLength=kernel.length;
   // console.log(kLength)
	// Fill output matrix: rows and columns are i and j respectively
	for (var i = 0; i < inp.width; i++)
	{
       // console.log(i);
		for (j = 0; j < inp.height; j++)
		{
			x = i;
            y = j;
          

			// Kernel rows and columns are k and l respectively
			for (k = 0; k < kLength; k++)
			{
				for (l = 0; l < kLength; l++)
				{
					// Convolute here.
                    cq = parseFloat(kernel[k][l]) * parseFloat(input[x*inp.height+y]);
                    conv += cq;
                    y++; // Move right.
                    
                   
				}
				x++; // Move down.
				y = j; // Restart column position
            }
           //console.log(conv)
            out.data[i*inp.height+j] = conv; 
            red[i*inp.height+j] = conv; 
            // Add result to output matrix.
			conv = 0; // Needed before we move on to the next index.
		}
    }
    
   // o.data=output;
  console.log(red.length);
  console.log(out.data.length);
    return out;
}



function gaussianFilter (imageIn) {
    var kernel=[1 / 256, 4  / 256,  6 / 256,  4 / 256, 1 / 256,
        4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256,
        6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256,
        4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256,
        1 / 256, 4  / 256,  6 / 256,  4 / 256, 1 / 256];
    var dim = Math.sqrt(kernel.length),
        pad = Math.floor(dim / 2);
 
    if (dim % 2 !== 1) {
        console.log("Invalid kernel dimension");
        return
    }
 
    var w = imageIn.width,
        h = imageIn.height,
        can = document.createElement('canvas'),
        cw,
        ch,
        ctx,
        imgIn, imgOut,
        datIn, datOut;
 
    can.width = cw = w + pad * 2; // add padding
    can.height = ch = h + pad * 2; // add padding
 
    ctx = can.getContext('2d');
    ctx.fillStyle = '#000'; // fill with opaque black
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(imageIn, pad, pad);
 
    imgIn = ctx.getImageData(0, 0, cw, ch);
    datIn = imgIn.data;
 
    imgOut = ctx.createImageData(w, h);
    datOut = imgOut.data;
 
    var row, col, pix, i, dx, dy, r, g, b;
 
    for (row = pad; row <= h; row++) {
        for (col = pad; col <= w; col++) {
            r = g = b = 0;
 
            for (dx = -pad; dx <= pad; dx++) {
                for (dy = -pad; dy <= pad; dy++) {
                    i = (dy + pad) * dim + (dx + pad); // kernel index
                    pix = 4 * ((row + dy) * cw + (col + dx)); // image index
                    r += datIn[pix++] * kernel[i];
                    g += datIn[pix++] * kernel[i];
                    b += datIn[pix  ] * kernel[i];
                }
            }
 
            pix = 4 * ((row - pad) * w + (col - pad)); // destination index
            datOut[pix++] = (r + .5) ^ 0;
            datOut[pix++] = (g + .5) ^ 0;
            datOut[pix++] = (b + .5) ^ 0;
            datOut[pix  ] = 255; // we want opaque image
        }
    }
 
    // reuse canvas
    can.width = w;
    can.height = h;
 
    ctx.putImageData(imgOut, 0, 0);
    document.body.appendChild(can);
    var imageOut = new Image();
 
    imageOut.addEventListener('load', function () {
    //   console.log(" loaded")

    });
 
    imageOut.addEventListener('error', function (error) {
        
        console.log(error);
    });
 
    imageOut.src = can.toDataURL('image/png');


    return can;
}
// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

var center = {x: 0, y: 0}; // Sets the center point of the radial filter

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);

}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);

    image(imgIn, 0, 0); 
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    stroke(255, 0,255)
    textSize(35)      // Sets the stroke color to magenta and text size to 35
    fill(255,255,255);  // Sets the text color to white

    // Display's the text on the bottom of the screen
    text('"a" - Grading Filter; "b" - Negative ; "c" Gray Scale; ', 25, height - 60);
    text('"d" - Color Saturation; "e" - Red to Blue ', 75, height - 25);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}

function keyPressed() {
  if (key === 'a') {
    // Applies the earlyBirdFilter to the a image
    var filteredImg = earlyBirdFilter(imgIn);
    image(filteredImg, imgIn.width, 0);
  }
  if (key === 'b') {
    // Applies the negativeFilter to the b image
    var filteredImg = negativeFilter(imgIn);
    image(filteredImg, imgIn.width, 0);
  }
  if (key === 'c') {
    // Applies the grayScaleFilter to the c image
    var filteredImg = grayScaleFilter(imgIn);
    image(filteredImg, imgIn.width, 0);
  }
  if (key === 'd') {
    // Applies the colorSaturationFilter to the d image
    var filteredImg = colorSaturationFilter(imgIn);
    image(filteredImg, imgIn.width, 0);
  }
  if (key === 'e') {
        // Applies the swapRedBlueFilter to the e image
    var filteredImg = swapRedBlueFilter(imgIn);
    image(filteredImg, imgIn.width, 0);
  }
  

}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

/*
This function applies the sepia filter to an input image
*/
function sepiaFilter(img){

  // Creates a new image with the same dimensions as the input image
  var resultImg = createImage(img.width, img.height);
   // Loads the pixels of both the input and result images
  img.loadPixels();
  resultImg.loadPixels();
  
  // Loops through every pixel in the input image
  for (var i = 0; i < img.pixels.length; i += 4) {
    // Extracts the old red, green, and blue color values of the pixel
    var oldRed = img.pixels[i];
    var oldGreen = img.pixels[i + 1];
    var oldBlue = img.pixels[i + 2];

    // Calculates the new red, green, and blue color values using the sepia filter formula
    var newRed = (oldRed * 0.393) + (oldGreen * 0.769) + (oldBlue * 0.189);
    var newGreen = (oldRed * 0.349) + (oldGreen * 0.686) + (oldBlue * 0.168);
    var newBlue = (oldRed * 0.272) + (oldGreen * 0.534) + (oldBlue * 0.131);

    // Assigns the new red, green, and blue color values to the corresponding pixels in the result image
    resultImg.pixels[i] = newRed;
    resultImg.pixels[i + 1] = newGreen;
    resultImg.pixels[i + 2] = newBlue;
    resultImg.pixels[i + 3] = img.pixels[i + 3]; // Keeps alpha channel the same
  }
  
  resultImg.updatePixels();     // Updates the pixels of the result image
  return resultImg;             // Returns the result image
}


/* 
This function takes an image as input and creates a new image with darkened corners
*/
function darkCorners(img) {
  // Creates a new image with the same width and height as the input image
  var resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();   // Loads the pixels of the new image
  
  // Finds the center of the input image
  var centerX = img.width / 2;
  var centerY = img.height / 2;
  
  // Loops through each pixel in the input image
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var index = (x + y * img.width) * 4;

      // Calculate the distance from the current pixel to the center of the input image
      var distance = dist(x, y, centerX, centerY);
      var dynLum = 1.0; // Sets the dynamic luminance to 1.0 by default
      
      // If the distance is greater than 300, darkens the pixel based on its distance
      if (distance > 300) {
        dynLum = map(distance, 300, 450, 1.0, 0.4);
        dynLum = constrain(dynLum, 0.4, 1.0);
        
        // If the distance is greater than or equal to 450, darkens the pixel even more
        if (distance >= 450) {
          dynLum = map(distance, 450, sqrt(sq(centerX) + sq(centerY)), 0.4, 0.0);
          dynLum = constrain(dynLum, 0.0, 0.4);
        }
      }
      
      // Sets the pixel values of the new image based on the input image and dynamic luminance
      resultImg.pixels[index] = img.pixels[index] * dynLum;
      resultImg.pixels[index + 1] = img.pixels[index + 1] * dynLum;
      resultImg.pixels[index + 2] = img.pixels[index + 2] * dynLum;
      resultImg.pixels[index + 3] = img.pixels[index + 3];
    }
  }
  
  // Updates the pixels of the new image and return it
  resultImg.updatePixels();
  return resultImg;
}

/* 
This function applies a radial blur filter to an input image based on a dynamic 
blur amount. The function takes two arguments: the input image and the dynamic blur amount.
It returns the output image with the applied filter.
*/
function radialBlurFilter(img, dynBlur){

  // Creates a new output image with the same dimensions as the input image
  var imgOut = createImage(img.width, img.height);

  // Gets the length of the matrix used for convolution
  var matrixSize = matrix.length;

  // Loads the pixel arrays for both the input and output images
  imgOut.loadPixels();
  img.loadPixels();

  // Reads every pixel
  for (var x = 0; x < imgOut.width; x++) {
      for (var y = 0; y < imgOut.height; y++) {

          // Calculates the index of the current pixel in the pixel array
          var index = (x + y * imgOut.width) * 4;
          
          // Applies convolution to the current pixel using the given matrix
          var c = convolution(x, y, matrix, matrixSize, img);

          // Calculates the distance of the current pixel from the center
          var distFromCenter = dist(x, y, center.x, center.y); // Calculates distance from center
          
          // Remaps and constrain the distance to get the blur amount
          var blurAmount = constrain(map(distFromCenter, 100, 300, 0, 1), 0, 1); // Remaps and constrain the distance
          
          // Applies different amount of blur based on the distance from the center
          imgOut.pixels[index + 0] = c[0] * blurAmount + img.pixels[index + 0] * (1 - blurAmount); // Red channel
          imgOut.pixels[index + 1] = c[1] * blurAmount + img.pixels[index + 1] * (1 - blurAmount); // Green channel
          imgOut.pixels[index + 2] = c[2] * blurAmount + img.pixels[index + 2] * (1 - blurAmount); // Blue channel
          imgOut.pixels[index + 3] = 255;
      }
  }

  imgOut.updatePixels();  // Updates the pixel array of the output image
  return imgOut;          // Returns the output image with the applied filter
}

/* 
This function performs convolution on an image with a given matrix and returns 
the result.
- x, y - the position of the current pixel in the image
- matrix - the convolution matrix to apply
- matrixSize - the size of the matrix (must be odd)
- img - the input image
*/
function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0.0;
  var totalGreen = 0.0;
  var totalBlue = 0.0;
  var offset = floor(matrixSize / 2); //

  // Convolution matrix loop
  for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
          // Gets pixel loc within convolution matrix
          var xloc = x + i - offset;
          var yloc = y + j - offset;
          var index = (xloc + img.width * yloc) * 4;
          // Ensures we don't address a pixel that doesn't exist
          index = constrain(index, 0, img.pixels.length - 1);

          // Multiplies all values with the mask and sum up
          totalRed += img.pixels[index + 0] * matrix[i][j];
          totalGreen += img.pixels[index + 1] * matrix[i][j];
          totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
  }
  
  // Returns the new color array with the new blur amount
  var dist = sqrt(pow(mouseX - x, 2) + pow(mouseY - y, 2));
  var dynBlur = map(dist, 100, 300, 0, 1);
  dynBlur = constrain(dynBlur, 0, 1);
  var r = img.pixels[(x + y * img.width) * 4 + 0];
  var g = img.pixels[(x + y * img.width) * 4 + 1];
  var b = img.pixels[(x + y * img.width) * 4 + 2];
  return [totalRed * dynBlur + r * (1 - dynBlur), totalGreen * dynBlur + g * (1 - dynBlur), totalBlue * dynBlur + b * (1 - dynBlur)];
}

/* 
This function applies a border to an input image using createGraphics() 
and rect() functions. The resulting image has a white rectangular border 
with rounded corners and a black rectangular outline.
*/
function borderFilter(img) {

  // Creates a new graphics buffer with the same dimensions as the input image
  var buffer = createGraphics(img.width, img.height);

  // Copies the input image to the buffer
  buffer.image(img, 0, 0);
  
  // Sets the stroke weight to 20 and stroke color to white
  buffer.strokeWeight(20);
  buffer.stroke(255);
  
  // sets the fill color to white with 0 alpha and draw a rectangle with rounded corners
  buffer.fill(255, 0);
  buffer.rect(0, 0, img.width, img.height, 50);

  // Draws a black rectangle with no fill to create the outline
  buffer.rect(0, 0, img.width, img.height);
  return buffer;  // return the resulting image
}

/* 
Creates a new image that will hold the negative of the original image
*/
function negativeFilter(img) {
  var resultImg = createImage(img.width, img.height);

  // Loads the pixels of both the original and result images
  img.loadPixels();
  resultImg.loadPixels();

  // Loops through all the pixels in the image
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Gets the index of the current pixel
      var index = (x + y * img.width) * 4;

      // Calculates the negative values for each color channel
      var r = 255 - img.pixels[index];
      var g = 255 - img.pixels[index + 1];
      var b = 255 - img.pixels[index + 2];

      // Sets the values of the current pixel in the result image
      resultImg.pixels[index] = r;
      resultImg.pixels[index + 1] = g;
      resultImg.pixels[index + 2] = b;
      resultImg.pixels[index + 3] = img.pixels[index + 3];
    }
  }

  // Updates the pixels of the result image and return it
  resultImg.updatePixels();
  return resultImg;
}

/*
The function grayScaleFilter() takes an image as input 
and returns a new image with a gray-scale filter applied to it. 
*/
function grayScaleFilter(img) {
  // Creates a new image with the same dimensions as the original
  var resultImg = createImage(img.width, img.height);
  img.loadPixels();       // Load the pixels of the original image
  resultImg.loadPixels(); // Load the pixels of the new image

  // Loops through every pixel in the original image
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Calculates the index of the current pixel in the pixel array
      var index = (x + y * img.width) * 4;

      // Gets the red, green, and blue values of the pixel
      var r = img.pixels[index];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];

      // Calculates the grayscale value of the pixel
      var gray = (r + g + b) / 3;

      // Sets the red, green, and blue values of the new image to the grayscale value
      resultImg.pixels[index] = gray;
      resultImg.pixels[index + 1] = gray;
      resultImg.pixels[index + 2] = gray;

      // Sets the alpha value of the new image to 255 (fully opaque)
      resultImg.pixels[index + 3] = 255;
    }
  }
  resultImg.updatePixels(); // Updates the pixels of the new image
  return resultImg;         // Returns the new image
}

/*
This function takes an input image and returns a new image 
with increased color saturation.
*/
function colorSaturationFilter(img) {
  var resultImg = createImage(img.width, img.height);
  
  // Loops through every pixel in the image
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Gets the color of the pixel
      var c = img.get(x, y);
      
      // Extracts the red, green, and blue components of the color
      var r = red(c);
      var g = green(c);
      var b = blue(c);
      
      // Calculates the average value of the color components
      var avg = (r + g + b) / 3;
      
      // Increases the saturation of the color
      var s = 2;
      r = min(255, r + (r - avg) * s);
      g = min(255, g + (g - avg) * s);
      b = min(255, b + (b - avg) * s);
      
      // Sets the color of the pixel in the result image
      resultImg.set(x, y, color(r, g, b));
    }
  }
  
  // Updates the pixels in the result image
  resultImg.updatePixels();
  return resultImg;
}

/*
This function swaps the red and blue channels of an image, creating a new image 
with the same dimensions and pixels as the original image. The alpha channel 
remains the same.
*/
function swapRedBlueFilter(img) {
  // Creates a new image with the same dimensions as the original image
  var resultImg = createImage(img.width, img.height);

  // Loads the pixels of both images
  resultImg.loadPixels();
  img.loadPixels();

  // Loops through every pixel in the image
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Gets the color of the pixel
      var index = (x + y * img.width) * 4;
      var r = img.pixels[index];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];
      var a = img.pixels[index + 3];

      // Swaps red and blue channels
      resultImg.pixels[index] = b;
      resultImg.pixels[index + 1] = g;
      resultImg.pixels[index + 2] = r;
      resultImg.pixels[index + 3] = a;
    }
  }

  resultImg.updatePixels(); // Updates the pixels in the result image
  return resultImg;         // Returns the result image
}


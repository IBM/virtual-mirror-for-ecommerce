function resizeCanvasAndResults(dimensions, canvas, results) {
  const { width, height } = dimensions instanceof HTMLVideoElement
    ? faceapi.getMediaDimensions(dimensions)
    : dimensions
  canvas.width = width
  canvas.height = height

  // resize detections (and landmarks) in case displayed image is smaller than
  // original size
  return faceapi.resizeResults(results, { width, height })
}

function drawDetections(dimensions, canvas, detections) {
  const resizedDetections = resizeCanvasAndResults(dimensions, canvas, detections)
  faceapi.drawDetection(canvas, resizedDetections)
}

function drawLandmarks(dimensions, canvas, results, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'green'
  }
  //console.log(faceLandmarks[0].positions) //Return all the positions
  //console.log(faceLandmarks[0].getJawOutline)
  
  faceapi.drawLandmarks(canvas, faceLandmarks, drawLandmarksOptions)
}

function drawJewellery(dimensions, canvas, results, withBoxes = true, img, height_jewellery, width_jewellery) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'green'
  }
  //console.log(faceLandmarks[0].positions) //Return all the positions
  //console.log(faceLandmarks[0].getJawOutline)
  
  faceapi.drawJewellery(canvas, faceLandmarks, drawLandmarksOptions, img, height_jewellery, width_jewellery)
}

function drawJewelleryEars(dimensions, canvas, results, withBoxes = true, img, height_jewellery, width_jewellery) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'green'
  }
  //console.log(faceLandmarks[0].positions) //Return all the positions
  //console.log(faceLandmarks[0].getJawOutline)
  
  faceapi.drawJewelleryEars(canvas, faceLandmarks, drawLandmarksOptions, img, height_jewellery, width_jewellery)
}


function drawJewelleryWebcam(dimensions, canvas, results, withBoxes = true, nimg, eimg) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection))
  }

  const faceLandmarks = resizedResults.map(det => det.landmarks)
  const drawLandmarksOptions = {
    lineWidth: 2,
    drawLines: true,
    color: 'green'
  }
  //console.log(faceLandmarks[0].positions) //Return all the positions
  //console.log(faceLandmarks[0].getJawOutline)
  
  faceapi.drawJewelleryWebcam(canvas, faceLandmarks, drawLandmarksOptions, nimg, eimg)
}



function drawExpressions(dimensions, canvas, results, thresh, withBoxes = true) {
  const resizedResults = resizeCanvasAndResults(dimensions, canvas, results)

  if (withBoxes) {
    faceapi.drawDetection(canvas, resizedResults.map(det => det.detection), { withScore: false })
  }

  faceapi.drawFaceExpressions(canvas, resizedResults.map(({ detection, expressions }) => ({ position: detection.box, expressions })))
}
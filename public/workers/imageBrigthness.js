
self.onmessage = ({ data }) => {
    let colorSum = 0;
    let r, g, b, avg;


    for (var x = 0, len = data.imageData.data.length; x < len; x += 4) {
        r = data.imageData.data[x];
        g = data.imageData.data[x + 1];
        b = data.imageData.data[x + 2];

        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
    }

    self.postMessage(Math.floor(colorSum / (data.canvas.width * data.canvas.height)));
};
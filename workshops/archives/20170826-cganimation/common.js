function getJSON(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = () => {
      if (request.status !== 200) {
        reject(request.responseText);
        return;
      }
      if (request.readyState === 4) {
        resolve(JSON.parse(request.responseText));
      }
    };
    request.send(null);
  });
}

function getRecords() {
  return new Promise((resolve, reject) => {
    Promise.all([getJSON('uploads.json'), getJSON('ignores.json')])
           .then(values => {
             const allRecords = values[0];
             const ignores = values[1];
             const validRecords = allRecords.filter((record, index) => {
               return ignores.indexOf(index) < 0;
             });
             resolve(validRecords);
           }, error => {
             reject(error);
           });
  });
}

function animate(record, iterations, width, element) {
  element.style.backgroundImage = `url(.${record.image})`;

  const keyframes = [
    {
      backgroundPositionX: `0px`,
      easing: `steps(${record.frame_count}, end)`
    },
    {
      backgroundPositionX: `-${(record.frame_count) * width}px`,
    },
  ];
  return element.animate(keyframes, {
    duration: record.animation_duration * record.frame_count,
    easing: record.animation_easing,
    iterations: iterations,
    fill: 'forwards'
  });
}

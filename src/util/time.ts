const times: { [key: string]: number } = {
  yy: 31536 * Math.pow(10, 6),
  mm: 2592 * Math.pow(10, 6),
  dd: 864 * Math.pow(10, 5),
  h: 36 * Math.pow(10, 5),
  m: 6 * Math.pow(10, 4),
  s: 1000,
};

function parseTime(time: string | number): number {
  if (typeof time === 'number') return time;
  if (!time || !time.match(/^(\d+yy)?(\s+)?(\d+mm)?(\s+)?(\d+dd)?(\s+)?(\d+h)?(\s+)?(\d+m)?(\s+)?(\d+s)?$/)) {
    throw Error(
      'Time Syntax Error: Use "-yy -mm -dd -h -m -s" or "-yy-mm-dd-h-m-s" format. You can skip some period like "-dd-m". But you have to keep the order bigger to lower.',
    );
  }

  let result = 0;
  Object.keys(times).map((key) => {
    if (typeof time === 'string' && time.includes(key)) {
      result += Number(time.split(key)[0]) * times[key];
      time = time.split(key)[1];
    }
  });
  return result;
}

export { parseTime };

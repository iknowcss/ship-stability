export default function (ms) {
  let t;
  if (ms < 1000) t = { unit: 'ms', value: ms };
  else if (ms < 60*1000) t = { unit: 's', value: ms/(1000) };
  else t = { unit: 'min', value: ms/(1000*60) };

  return `${t.value.toFixed(2)}${t.unit}`;
}
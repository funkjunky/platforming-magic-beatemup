export const printLogs = logs => 
  document.getElementById('logger').innerHTML = JSON.stringify(logs, null, 2);

export const printTypeAndDiff = logs => {
  let innerHTML = '';
  logs.forEach(({ action: { type }, diff }) => {
    innerHTML += type + '\n';
    innerHTML += JSON.stringify(diff, null, 2) + '\n';
  });
  document.getElementById('logger').innerHTML = innerHTML;
}

export const printType = logs => {
  const boldedCount = 3;
  let innerHTML = '';
  for(let i = 0; i < boldedCount; ++i) {
    if(logs.length > i) {
      innerHTML += `<p style="font-size: ${12 + (boldedCount - i) * 3}px">${ logs[i].action.type }</p>`; 
    }
  }
  innerHTML += JSON.stringify(logs.slice(3).map(({ action: { type } }) => type), null, 2);
  document.getElementById('logger').innerHTML = innerHTML;
}


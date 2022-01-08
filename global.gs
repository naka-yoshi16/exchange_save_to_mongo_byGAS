// options
function g_options(payload){
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { "api-key": getAPIKey() }
  } 
  return options
}
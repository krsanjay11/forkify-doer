import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


export const AJAX = async function(url, uploadData = undefined){
  // console.log(url); // https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bca10, https://forkify-api.herokuapp.com/api/v2/recipes/?search=pizza
  try{
    const fetchPro = uploadData ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
      }) : fetch(url);

      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await res.json();
      
      if(!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
    } catch(err){
        throw err; // propagate the error
    }
};

export const numberToFraction = function(amount){
  if(parseFloat(amount)===parseInt(amount)){
    return amount;
  }

  const gcd = function(a, b){
    if(b < 0.0000001){
      return a;
    }
    return gcd(b, Math.floor(a%b));
  };
  const len = amount.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = amount * denominator;
  var divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  let base = 0;

  if(numerator > denominator){
    base = Math.floor(numerator / denominator);
    numerator -= base * denominator;
  }
  amount = Math.floor(numerator) + '/' + Math.floor(denominator);
  if(base){
    amount = base + ' ' + amount;
  }
  return amount;
}

/*
export const getJSON = async function(url){
  // console.log(url); // https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bca10, https://forkify-api.herokuapp.com/api/v2/recipes/?search=pizza
    try{
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }
    catch(err){
        throw err; // propagate the error
    }
};

export const sendJSON = async function(url, uploadData){
  // console.log(url); // https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bca10, https://forkify-api.herokuapp.com/api/v2/recipes/?search=pizza
    try{
        const fetchPro = fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(uploadData),
        });
        //payload = data= body
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }
    catch(err){
        throw err; // propagate the error
    }
};
*/
export function sendVerifyMessage(phone: string, verifyCode: string) {
  return fetch(
    `https://telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com/sms-verification-code?phoneNumber=${encodeURI(
      phone
    )}&verifyCode=${encodeURI(verifyCode)}`,
    {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host":
          "telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com",
      },
    }
  )
    .then(x => console.log(x))
    .catch(x => console.log("ERR", x));
}

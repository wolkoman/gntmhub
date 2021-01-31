export function sendVerifyMessage(phone: string, verifyCode: string) {
  return fetch(`	https://smsgateway.me/api/v4/message/send`, {
    method: "POST",
    headers: { Authorization: process.env.SMS_GATEWAY_TOKEN },
    body: JSON.stringify([
      {
        phone_number: phone,
        message: `Dein Verifizierungscode für GNTMHUB lautet ${verifyCode}.`,
        device_id: process.env.SMS_GATEWAY_DEVICE,
      },
    ]),
  })
    .then(x => x.json())
    .then(x => console.log(x))
    .catch(x => console.log("ERR", x));
}
